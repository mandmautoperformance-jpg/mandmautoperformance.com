import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServer } from '@/lib/supabase-server';
import { rateLimit } from '@/lib/rate-limit';

const uploadRateLimit = rateLimit('reservation-doc-upload', 12, 60_000); // 12/min per IP

const MAX_BASE64_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['driving_licence', 'insurance', 'photo_id'];
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Public, token-gated document upload for a reservation. The customer reaches
 * this via a secret upload_token link — no account required. The token is the
 * capability, so we only ever expose/accept it; we never reveal reservation
 * details here.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!uploadRateLimit(req, res)) return;

  if (!supabaseConfigured()) {
    return res.status(503).json({ error: 'Uploads are temporarily unavailable.' });
  }

  const { token, documentType, fileBase64, mimeType = 'image/jpeg' } = (req.body || {}) as {
    token?: string;
    documentType?: string;
    fileBase64?: string;
    mimeType?: string;
  };

  if (!token || !UUID_RE.test(token)) {
    return res.status(400).json({ error: 'Invalid or missing upload link.' });
  }
  if (!documentType || !ALLOWED_TYPES.includes(documentType)) {
    return res.status(400).json({ error: 'Invalid document type.' });
  }
  if (!fileBase64) {
    return res.status(400).json({ error: 'No file provided.' });
  }
  if (!EXT[mimeType]) {
    return res.status(415).json({ error: 'Unsupported file type. Use JPG, PNG, WebP or PDF.' });
  }
  if (Buffer.byteLength(fileBase64, 'base64') > MAX_BASE64_BYTES) {
    return res.status(413).json({ error: 'File too large. Maximum 10 MB.' });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(fileBase64, 'base64');
  } catch {
    return res.status(400).json({ error: 'Invalid file data.' });
  }

  const supabase = getSupabaseServer();

  // Resolve the reservation from its secret token.
  const { data: reservation, error: lookupErr } = await supabase
    .from('booking_requests')
    .select('id')
    .eq('upload_token', token)
    .single();

  if (lookupErr || !reservation) {
    return res.status(404).json({ error: 'This upload link is no longer valid.' });
  }

  const path = `reservations/${reservation.id}/${documentType}_${Date.now()}.${EXT[mimeType]}`;

  const { error: uploadErr } = await supabase.storage
    .from('booking-documents')
    .upload(path, buffer, { contentType: mimeType, upsert: false });
  if (uploadErr) {
    console.error('Reservation doc storage error:', uploadErr.message);
    return res.status(500).json({ error: 'Could not store the file. Please try again.' });
  }

  const { error: recordErr } = await supabase.from('reservation_documents').insert([
    {
      request_id: reservation.id,
      document_type: documentType,
      storage_path: path,
      status: 'pending',
    },
  ]);
  if (recordErr) {
    console.error('Reservation doc record error:', recordErr.message);
    return res.status(500).json({ error: 'Could not record the document. Please try again.' });
  }

  return res.status(200).json({ success: true });
}
