import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyOwner } from '@/lib/auth-middleware';

/**
 * Owner-only gate for the private War Room page.
 *
 * Returns 200 only when the caller's signed-in email is the owner; the page
 * uses a 401/403 here to bounce everyone else. Kept deliberately small — the
 * War Room's actual tooling will be added later behind this same gate.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await verifyOwner(req as any, res);
  if (!userId) return;

  return res.status(200).json({
    ok: true,
    owner: true,
    serverTime: new Date().toISOString(),
  });
}
