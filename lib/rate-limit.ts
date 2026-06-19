import type { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

function getKey(req: NextApiRequest, prefix: string): string {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown';
  return `${prefix}:${ip}`;
}

export function rateLimit(
  prefix: string,
  limit: number,
  windowMs: number,
): (req: NextApiRequest, res: NextApiResponse) => boolean {
  return (req, res) => {
    const key = getKey(req, prefix);
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (entry.count >= limit) {
      res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
      res.status(429).json({ error: 'Too many requests. Please slow down.' });
      return false;
    }

    entry.count++;
    return true;
  };
}

// Periodically clean up expired entries to avoid memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);
