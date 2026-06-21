import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdmin } from '@/lib/auth-middleware';
import { getSupabaseServer } from '@/lib/supabase-server';

// Status workflow for reservation leads. Keep in sync with the
// booking_requests CHECK constraint (migration 003).
export const RESERVATION_STATUSES = [
  'new',
  'contacted',
  'confirmed',
  'completed',
  'cancelled',
] as const;
type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * Admin reservations (lead) management. Admin-gated.
 *   GET   → list reservation requests, newest first
 *   PATCH → update a request's status ({ id, status })
 *
 * Degrades gracefully: if Supabase isn't configured or the booking_requests
 * table hasn't been migrated yet, GET returns an empty list with
 * tableReady:false so the UI can prompt the operator to run the migration.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await verifyAdmin(req as any, res);
  if (!userId) return;

  if (!supabaseConfigured()) {
    if (req.method === 'GET') {
      return res
        .status(200)
        .json({ requests: [], tableReady: false, reason: 'Supabase is not configured.' });
    }
    return res.status(503).json({ error: 'Supabase is not configured.' });
  }

  const supabase = getSupabaseServer();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('booking_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      // Most likely the table hasn't been created yet — surface that to the UI
      // instead of erroring so the panel still loads.
      return res.status(200).json({ requests: [], tableReady: false, reason: error.message });
    }

    const requests = (data || []).map((r) => ({
      ...r,
      estimate_gbp: Math.round((r.estimate_pence || 0) / 100),
      deposit_gbp: r.deposit_pence != null ? Math.round(r.deposit_pence / 100) : null,
    }));
    return res.status(200).json({ requests, tableReady: true });
  }

  if (req.method === 'PATCH') {
    const { id, status } = (req.body || {}) as { id?: string; status?: ReservationStatus };
    if (!id || !status || !RESERVATION_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ error: 'A request id and a valid status are required.' });
    }

    const { error } = await supabase
      .from('booking_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', 'GET, PATCH');
  return res.status(405).json({ error: 'Method not allowed' });
}
