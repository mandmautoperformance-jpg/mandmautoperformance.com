import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyOwner } from '@/lib/auth-middleware';
import {
  analyzeDeal,
  analyzeMarket,
  isFlipClass,
  type AssetClass,
} from '@/lib/gemini-deal-engine';

const VALID: AssetClass[] = ['land', 'car', 'stock', 'gold'];

/**
 * Owner-only: run the AI engine on a candidate.
 *  - land / car  → flip analysis (value, negotiate, flip-to-buyer)
 *  - stock / gold → market analysis (entry/target/stop, thesis, call)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await verifyOwner(req as any, res);
  if (!userId) return;

  const { assetClass, title, location, askingPriceGbp, details } = req.body as {
    assetClass?: string;
    title?: string;
    location?: string;
    askingPriceGbp?: number | string;
    details?: string;
  };

  if (!VALID.includes(assetClass as AssetClass)) {
    return res.status(400).json({ error: 'assetClass must be land, car, stock or gold' });
  }
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'A title / description is required' });
  }

  const asking =
    askingPriceGbp != null && `${askingPriceGbp}`.trim() !== ''
      ? Number(`${askingPriceGbp}`.replace(/[^0-9.]/g, ''))
      : undefined;

  const input = {
    assetClass: assetClass as AssetClass,
    title: title.trim().slice(0, 300),
    location: (location || '').trim().slice(0, 200) || undefined,
    askingPriceGbp: Number.isFinite(asking as number) ? (asking as number) : undefined,
    details: (details || '').trim().slice(0, 4000) || undefined,
  };

  try {
    const analysis = isFlipClass(input.assetClass)
      ? await analyzeDeal(input)
      : await analyzeMarket(input);
    return res.status(200).json({ analysis });
  } catch (err: any) {
    console.error('War Room analyze error:', err);
    return res.status(502).json({ error: err?.message || 'Analysis failed' });
  }
}
