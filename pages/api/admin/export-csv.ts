import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdmin } from '@/lib/auth-middleware';
import { getSupabaseServer } from '@/lib/supabase-server';

function esc(v: unknown): string {
  const s = v == null ? '' : String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const HEADERS = [
  'ID',
  'Received',
  'Vehicle',
  'Pickup',
  'Return',
  'Passengers',
  'Estimate (£)',
  'Deposit (£)',
  'Customer Name',
  'Email',
  'Phone',
  'Status',
  'Payment',
  'Notes',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await verifyAdmin(req as any, res);
  if (!userId) return;

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('booking_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5000);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const rows = (data || []).map((r) => [
    esc(r.id),
    esc(r.created_at ? new Date(r.created_at as string).toISOString().split('T')[0] : ''),
    esc(r.model),
    esc(r.pickup_date),
    esc(r.return_date),
    esc(r.passengers),
    esc(r.estimate_pence != null ? Math.round((r.estimate_pence as number) / 100) : ''),
    esc(r.deposit_pence != null ? Math.round((r.deposit_pence as number) / 100) : ''),
    esc(r.customer_name),
    esc(r.customer_email),
    esc(r.customer_phone),
    esc(r.status),
    esc(r.payment_status),
    esc(r.notes),
  ]);

  const csv = [HEADERS.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const filename = `reservations-${new Date().toISOString().split('T')[0]}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(csv);
}
