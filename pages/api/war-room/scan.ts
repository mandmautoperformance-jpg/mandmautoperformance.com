import type { NextApiRequest, NextApiResponse } from 'next';
import { timingSafeEqual } from 'crypto';
import { verifyOwner } from '@/lib/auth-middleware';
import { getSupabaseServer } from '@/lib/supabase-server';
import { runScoutScan, getCronSecret, type ScoutKind } from '@/lib/car-scout';

/**
 * Run a Car Auto-Scout web scan and store fresh finds.
 *
 * Callers:
 *  - Vercel cron (GET, Authorization: Bearer <CRON_SECRET>)
 *  - GitHub Actions hourly workflow (POST, x-cron-key: <CRON_SECRET>)
 *  - The owner's "Scan now" button (POST, Supabase JWT)
 * Search-grounded generation is slow, so allow up to 60s.
 */
export const config = { maxDuration: 60 };

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function isCronCaller(req: NextApiRequest): boolean {
  const secret = getCronSecret();
  if (!secret) return false;
  const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const headerKey = (req.headers['x-cron-key'] as string) || '';
  return (bearer !== '' && safeEqual(bearer, secret)) || (headerKey !== '' && safeEqual(headerKey, secret));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isCronCaller(req)) {
    const userId = await verifyOwner(req as any, res);
    if (!userId) return;
  }

  // ?kind=car | land | all — cron callers send nothing and sweep both markets.
  const kindParam = String(req.query.kind || (req.body as any)?.kind || 'all');
  const kinds: ScoutKind[] =
    kindParam === 'car' ? ['car'] : kindParam === 'land' ? ['land'] : ['car', 'land'];

  let finds;
  try {
    // Both sweeps run concurrently to stay inside the function time limit;
    // one market failing must not sink the other's finds.
    const settled = await Promise.allSettled(kinds.map((k) => runScoutScan(k)));
    finds = settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
    const failures = settled.filter((r) => r.status === 'rejected');
    failures.forEach((f) => console.error('Scout scan error:', (f as PromiseRejectedResult).reason));
    if (failures.length === kinds.length) {
      const first = failures[0] as PromiseRejectedResult;
      throw first.reason instanceof Error ? first.reason : new Error('Scan failed');
    }
  } catch (err: any) {
    console.error('Scout scan error:', err);
    return res.status(502).json({ error: err?.message || 'Scan failed' });
  }

  let inserted = 0;
  if (finds.length > 0) {
    try {
      const supabase = getSupabaseServer();
      // ignoreDuplicates keeps re-scans idempotent: a listing already seen
      // (same dedupe_key) is silently skipped, so the feed only grows with
      // genuinely new finds.
      const { data, error } = await supabase
        .from('war_room_finds')
        .upsert(finds, { onConflict: 'dedupe_key', ignoreDuplicates: true })
        .select('id');
      if (error) {
        console.error('Scout insert error:', error.message);
      } else {
        inserted = data?.length ?? 0;
      }
    } catch (err) {
      console.error('Scout persistence failed:', err);
    }
  }

  return res.status(200).json({
    ok: true,
    kinds,
    scanned: finds.length,
    newFinds: inserted,
    at: new Date().toISOString(),
  });
}
