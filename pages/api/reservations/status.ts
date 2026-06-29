import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rate-limit';

const statusRateLimit = rateLimit('reservation-status', 20, 60_000);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Public, token-gated endpoint. Returns non-sensitive reservation status.
 * GET /api/reservations/status?token=<upload_token>
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!statusRateLimit(req, res)) return;

  const token = req.query.token as string | undefined;
  if (!token || !UUID_RE.test(token)) {
    return res.status(400).json({ error: 'A valid token is required.' });
  }

  if (!supabaseConfigured()) {
    return res.status(503).json({ error: 'Service not configured.' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: reservation, error } = await supabase
    .from('booking_requests')
    .select(
      'id, model, pickup_date, return_date, passengers, status, payment_status, deposit_pence, created_at',
    )
    .eq('upload_token', token)
    .single();

  if (error || !reservation) {
    return res.status(404).json({ error: 'Reservation not found.' });
  }

  // Fetch doc summary (count only — no paths/URLs exposed)
  const { data: docs } = await supabase
    .from('reservation_documents')
    .select('document_type, status')
    .eq('request_id', reservation.id);

  const docSummary = (docs || []).map((d) => ({
    type: d.document_type as string,
    status: d.status as string,
  }));

  return res.status(200).json({
    model: reservation.model as string,
    pickupDate: reservation.pickup_date as string,
    returnDate: reservation.return_date as string,
    passengers: reservation.passengers as number,
    status: reservation.status as string,
    paymentStatus: reservation.payment_status as string,
    depositGbp: reservation.deposit_pence != null ? Math.round((reservation.deposit_pence as number) / 100) : null,
    createdAt: reservation.created_at as string,
    documents: docSummary,
  });
}
