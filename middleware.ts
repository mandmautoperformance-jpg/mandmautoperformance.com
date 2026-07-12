import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge firewall — runs in front of every request, before any page or API code.
 *
 * Layer 1: drop obvious attack probes (WordPress/PHP scanners, dotfile and
 *          config sniffing, VCS folders) with a bare 404.
 * Layer 2: per-IP burst limiter on sensitive API endpoints (best-effort,
 *          per-edge-isolate memory — the app-level limiters remain the
 *          authoritative ones; this just blunts floods early and cheaply).
 * Layer 3: security headers on everything that passes, including HSTS.
 */

const BLOCKED_PATTERNS: RegExp[] = [
  /^\/(?:wp-admin|wp-login|wp-content|wp-includes|wordpress|xmlrpc\.php)/i,
  /^\/(?:phpmyadmin|pma|mysql|adminer)/i,
  /\.(?:php|asp|aspx|jsp|cgi)$/i,
  /^\/\.(?:env|git|svn|hg|DS_Store|htaccess|htpasswd)/i,
  /^\/(?:config\.json|\.aws|\.ssh|backup|dump\.sql|database\.sql)/i,
  /^\/(?:vendor|cgi-bin)\//i,
];

// Sensitive endpoints that deserve an edge-level burst cap (requests/minute).
const BURST_LIMITS: { pattern: RegExp; limit: number }[] = [
  { pattern: /^\/api\/contact/, limit: 10 },
  { pattern: /^\/api\/war-room\//, limit: 60 },
  { pattern: /^\/api\/chat\//, limit: 40 },
  { pattern: /^\/api\/email-selftest/, limit: 6 },
  { pattern: /^\/api\/account\//, limit: 30 },
  { pattern: /^\/api\/documents\//, limit: 30 },
];

// Per-isolate sliding window: ip|bucket -> timestamps of recent hits.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;

function overBurstLimit(ip: string, path: string): boolean {
  const rule = BURST_LIMITS.find((r) => r.pattern.test(path));
  if (!rule) return false;
  const key = `${ip}|${rule.pattern.source}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > rule.limit;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Layer 1 — attack-surface probes get a silent 404.
  if (BLOCKED_PATTERNS.some((re) => re.test(path))) {
    return new NextResponse(null, { status: 404 });
  }

  // Layer 2 — burst limiting on sensitive endpoints.
  const ip =
    req.headers.get('x-real-ip') ||
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown';
  if (overBurstLimit(ip, path)) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
    });
  }

  // Layer 3 — hardened headers on every response.
  const res = NextResponse.next();
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-DNS-Prefetch-Control', 'off');
  return res;
}

export const config = {
  // Everything except Next's own static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
