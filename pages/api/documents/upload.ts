import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
);

const MAX_BASE64_BYTES = 10 * 1024 * 1024; // 10 MB

interface DocumentUploadRequest extends AuthenticatedRequest {
  body: {
    bookingId: string;
    documentType: 'driving_licence' | 'insurance' | 'photo_id';
    fileBase64: string;
    mimeType?: string;
  };
}

export default async function handler(req: DocumentUploadRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await verifyAuth(req, res, true);
  if (!userId) return;

  const { bookingId, documentType, fileBase64, mimeType = 'image/jpeg' } = req.body;

  if (!bookingId || !documentType || !fileBase64) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const allowedTypes = ['driving_licence', 'insurance', 'photo_id'];
  if (!allowedTypes.includes(documentType)) {
    return res.status(400).json({ error: 'Invalid document type' });
  }

  if (Buffer.byteLength(fileBase64, 'base64') > MAX_BASE64_BYTES) {
    return res.status(413).json({ error: 'File too large. Maximum 10 MB.' });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(fileBase64, 'base64');
  } catch {
    return res.status(400).json({ error: 'Invalid base64 data' });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', bookingId)
      .eq('user_id', userId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const fileName = `${bookingId}/${documentType}_${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('booking-documents')
      .upload(fileName, buffer, { contentType: mimeType, upsert: false });

    if (uploadError) throw uploadError;

    // OCR via Gemini Vision (replaces Google Cloud Vision dependency)
    let fullText = '';
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent([
        'Extract all text visible in this document image. Return only the raw text.',
        { inlineData: { data: fileBase64, mimeType } },
      ]);
      fullText = result.response.text();
    } catch (ocrErr) {
      console.error('OCR extraction failed (non-fatal):', ocrErr);
    }

    const { data, error: recordError } = await supabase
      .from('booking_documents')
      .insert([{
        booking_id: bookingId,
        user_id: userId,
        document_type: documentType,
        storage_path: fileName,
        extracted_text: fullText,
        verified: false,
        created_at: new Date(),
      }])
      .select()
      .single();

    if (recordError) throw recordError;

    return res.status(200).json({
      success: true,
      documentId: data.id,
      message: 'Document uploaded. Admin will verify within 2 hours.',
      extractedText: fullText.substring(0, 200),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload document';
    console.error('Document upload error:', message);
    return res.status(500).json({ error: message });
  }
}
