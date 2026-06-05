import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { createClient } from '@supabase/supabase-js';
import { vision } from '@google-cloud/vision';

const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_VISION_KEY_FILE,
});

interface DocumentUploadRequest extends AuthenticatedRequest {
  body: {
    bookingId: string;
    documentType: 'driving_licence' | 'insurance' | 'photo_id';
    fileBase64: string;
  };
}

export default async function handler(req: DocumentUploadRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await verifyAuth(req, res, true);
  if (!userId) return;

  const { bookingId, documentType, fileBase64 } = req.body;

  if (!bookingId || !documentType || !fileBase64) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', userId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Upload to Supabase Storage
    const fileName = `${bookingId}/${documentType}_${Date.now()}.jpg`;
    const buffer = Buffer.from(fileBase64, 'base64');

    const { error: uploadError } = await supabase.storage
      .from('booking-documents')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Run Google Vision API to extract text (OCR)
    // This helps verify document authenticity
    const [result] = await visionClient.textDetection({
      image: { content: fileBase64 },
    });

    const detections = result.textAnnotations || [];
    const fullText = detections.map((d) => d.description || '').join('\n');

    // Store document record
    const { data, error: recordError } = await supabase
      .from('booking_documents')
      .insert([
        {
          booking_id: bookingId,
          user_id: userId,
          document_type: documentType,
          storage_path: fileName,
          extracted_text: fullText,
          verified: false,
          created_at: new Date(),
        },
      ])
      .select()
      .single();

    if (recordError) throw recordError;

    // TODO: Automated verification rules based on document type
    // For now, mark as pending review by admin

    return res.status(200).json({
      success: true,
      documentId: data.id,
      message: 'Document uploaded. Admin will verify within 2 hours.',
      extractedText: fullText.substring(0, 200), // First 200 chars for preview
    });
  } catch (error: any) {
    console.error('Document upload error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to upload document',
    });
  }
}
