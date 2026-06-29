import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyOwner } from '@/lib/auth-middleware';
import { getSupabaseServer } from '@/lib/supabase-server';

/**
 * Owner-only CRUD for the War Room deal pipeline (table: war_room_deals).
 *   GET    → list all deals (newest first)
 *   POST   → create a deal (from an AI analysis + the inputs)
 *   PATCH  → update a deal's stage
 *   DELETE → remove a deal (?id=...)
 * Money is stored in pence (bigint) to match the rest of the schema.
 */

// Flip stages + market stages. "passed" applies to both.
const STAGES = [
  'sourced',
  'offer_sent',
  'negotiating',
  'buyer_matched',
  'closed',
  'passed',
  'watching',
  'entered',
  'holding',
  'exited',
];

const VALID_CLASSES = ['land', 'car', 'stock', 'gold'];
const isFlip = (c: string) => c === 'land' || c === 'car';

const toPence = (gbp: unknown): number | null => {
  const n = typeof gbp === 'string' ? parseFloat(gbp.replace(/[^0-9.]/g, '')) : Number(gbp);
  return Number.isFinite(n) ? Math.round(n * 100) : null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await verifyOwner(req as any, res);
  if (!userId) return;

  let supabase;
  try {
    supabase = getSupabaseServer();
  } catch {
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('war_room_deals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('deals list error:', error.message);
      return res.status(500).json({ error: 'Failed to load deals' });
    }
    return res.status(200).json({ deals: data || [] });
  }

  if (req.method === 'POST') {
    const b = req.body as any;
    if (!VALID_CLASSES.includes(b.assetClass)) {
      return res.status(400).json({ error: 'assetClass must be land, car, stock or gold' });
    }
    if (!b.title || !`${b.title}`.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    const analysis = b.analysis || {};
    const flip = isFlip(b.assetClass);
    // Map both shapes onto the shared money columns; market assets carry no
    // single "profit" figure (no position size) so that stays null.
    const row = {
      asset_class: b.assetClass,
      title: `${b.title}`.trim().slice(0, 300),
      location: b.location ? `${b.location}`.trim().slice(0, 200) : null,
      asking_price_pence: toPence(flip ? b.askingPriceGbp : (b.askingPriceGbp ?? analysis.currentPriceGbp)),
      target_buy_pence: toPence(flip ? analysis.targetBuyPriceGbp : analysis.entryPriceGbp),
      resale_pence: toPence(flip ? analysis.projectedResalePriceGbp : analysis.targetPriceGbp),
      projected_profit_pence: flip ? toPence(analysis.projectedProfitGbp) : null,
      stage: flip ? 'sourced' : 'watching',
      analysis,
    };
    const { data, error } = await supabase
      .from('war_room_deals')
      .insert(row)
      .select('*')
      .single();
    if (error) {
      console.error('deal insert error:', error.message);
      return res.status(500).json({ error: 'Failed to save deal' });
    }
    return res.status(200).json({ deal: data });
  }

  if (req.method === 'PATCH') {
    const { id, stage } = req.body as { id?: string; stage?: string };
    if (!id) return res.status(400).json({ error: 'id is required' });
    if (!stage || !STAGES.includes(stage)) {
      return res.status(400).json({ error: 'invalid stage' });
    }
    const { data, error } = await supabase
      .from('war_room_deals')
      .update({ stage, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) {
      console.error('deal update error:', error.message);
      return res.status(500).json({ error: 'Failed to update deal' });
    }
    return res.status(200).json({ deal: data });
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id as string) || '';
    if (!id) return res.status(400).json({ error: 'id is required' });
    const { error } = await supabase.from('war_room_deals').delete().eq('id', id);
    if (error) {
      console.error('deal delete error:', error.message);
      return res.status(500).json({ error: 'Failed to delete deal' });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
