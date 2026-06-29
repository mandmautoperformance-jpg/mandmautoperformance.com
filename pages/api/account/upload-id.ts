import type { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { verifyAuth, type AuthenticatedRequest } from '@/lib/auth-middleware';
import { sendEmail, OWNER_EMAIL, idUploadNotificationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

const uploadRateLimit = rateLimit('account-upload-id', 10, 60_000); // 10 per minute per IP
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const BUCKET = 'booking-documents';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!uploadRateLimit(req, res)) return;

  const userId = await verifyAuth(req, res, true);
  if (!userId) return;

  const { docType, fileBase64, mimeType = 'image/jpeg' } = req.body as {
    docType: string;
    fileBase64: string;
    mimeType?: string;
  };

  if (!['driving_licence', 'photo_id'].includes(docType)) {
    return res.status(400).json({ error: 'Invalid document type. Expected driving_licence or photo_id.' });
  }
  if (!fileBase64) {
    return res.status(400).json({ error: 'File data is required.' });
  }
  if (!ALLOWED_MIME.includes(mimeType)) {
    return res.status(400).json({ error: 'File type not allowed. Upload a JPG, PNG, WebP, or PDF.' });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(fileBase64, 'base64');
  } catch {
    return res.status(400).json({ error: 'Invalid file data.' });
  }

  if (buffer.byteLength > MAX_BYTES) {
    return res.status(413).json({ error: 'File too large. Maximum 10 MB.' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Retrieve user info from their JWT for the notification email
  const token = (req.headers.authorization as string)?.slice(7) || '';
  const { data: { user } } = await supabase.auth.getUser(token);
  const userEmail = user?.email || '';
  const firstName = (user?.user_metadata?.first_name as string) || '';
  const lastName = (user?.user_metadata?.last_name as string) || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || userEmail;

  const ext = mimeType === 'application/pdf' ? 'pdf' : (mimeType.split('/')[1] ?? 'jpg');
  const storagePath = `user-id/${userId}/${docType}_${Date.now()}.${ext}`;

  try {
    // Store in Supabase Storage (booking-documents bucket, user-id/ prefix)
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: mimeType, upsert: true });

    if (uploadError) throw uploadError;

    // Record in user_id_uploads table (created in migration 005)
    const { error: dbError } = await supabase.from('user_id_uploads').upsert(
      {
        user_id: userId,
        doc_type: docType,
        storage_path: storagePath,
        verification_status: 'pending',
      },
      { onConflict: 'user_id,doc_type' },
    );

    if (dbError) {
      console.error('user_id_uploads upsert failed (non-fatal):', dbError.message);
    }

    // Check if both documents are now uploaded
    const { data: uploaded } = await supabase
      .from('user_id_uploads')
      .select('doc_type')
      .eq('user_id', userId);

    const uploadedTypes = (uploaded ?? []).map((r: { doc_type: string }) => r.doc_type);
    const bothUploaded = uploadedTypes.includes('driving_licence') && uploadedTypes.includes('photo_id');

    // Notify admin when both docs are in — so the employee has everything they need to verify
    if (bothUploaded) {
      await sendEmail({
        to: OWNER_EMAIL,
        subject: `ID verification needed — ${fullName}`,
        html: idUploadNotificationEmail({ name: fullName, email: userEmail }),
      }).catch((err) => console.error('Admin ID notification email failed (non-fatal):', err));
    }

    return res.status(200).json({ success: true, docType, bothUploaded });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    console.error('account/upload-id error:', msg);
    return res.status(500).json({ error: msg });
  }
}
