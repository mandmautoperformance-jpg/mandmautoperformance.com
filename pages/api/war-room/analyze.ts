import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyOwner } from '@/lib/auth-middleware';
import { analyzeDeal, type AssetClass } from '@/lib/gemini-deal-engine';

/**
 * Owner-only: run the AI Deal Engine on a candidate flip (land or car).
 * Returns the structured analysis; saving to the pipeline is a separate call.
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

  if (assetClass !== 'land' && assetClass !== 'car') {
    return res.status(400).json({ error: 'assetClass must be "land" or "car"' });
  }
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'A title / description is required' });
  }

  const asking =
    askingPriceGbp != null && `${askingPriceGbp}`.trim() !== ''
      ? Number(`${askingPriceGbp}`.replace(/[^0-9.]/g, ''))
      : undefined;

  try {
    const analysis = await analyzeDeal({
      assetClass: assetClass as AssetClass,
      title: title.trim().slice(0, 300),
      location: (location || '').trim().slice(0, 200) || undefined,
      askingPriceGbp: Number.isFinite(asking as number) ? (asking as number) : undefined,
      details: (details || '').trim().slice(0, 4000) || undefined,
    });
    return res.status(200).json({ analysis });
  } catch (err: any) {
    console.error('War Room analyze error:', err);
    return res.status(502).json({ error: err?.message || 'Analysis failed' });
  }
}
