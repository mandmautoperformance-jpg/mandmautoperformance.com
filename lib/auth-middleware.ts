import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
  isAuthenticated: boolean;
}

/**
 * Verifies a Supabase JWT from the Authorization header.
 * Falls back to x-user-id header for development only.
 * In production, always require a valid JWT.
 */
export async function verifyAuth(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  requireAuth: boolean = true,
): Promise<string | null> {
  const isDev = process.env.NODE_ENV === 'development';

  // Try Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.userId = user.id;
        req.isAuthenticated = true;
        return user.id;
      }
    } catch {
      // fall through
    }
  }

  // Dev-only fallback
  if (isDev) {
    const devUserId = req.headers['x-user-id'] as string;
    if (devUserId) {
      req.userId = devUserId;
      req.isAuthenticated = true;
      return devUserId;
    }
  }

  req.isAuthenticated = false;

  if (requireAuth) {
    res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    return null;
  }

  return null;
}

/**
 * Verifies the caller is an authenticated ADMIN. A user counts as an admin if
 * EITHER their Supabase `app_metadata.role === 'admin'` OR their email appears
 * in the `ADMIN_EMAILS` env var (comma-separated, case-insensitive).
 *
 * Deny-by-default: with no admin configured, every caller is rejected. Returns
 * the userId on success, or null after writing a 401 (not signed in) / 403
 * (signed in but not an admin) response.
 */
export async function verifyAdmin(
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    req.isAuthenticated = false;
    res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    return null;
  }

  const token = authHeader.slice(7);
  let user;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      req.isAuthenticated = false;
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return null;
    }
    user = data.user;
  } catch {
    req.isAuthenticated = false;
    res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    return null;
  }

  const allowlist = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const email = (user.email || '').toLowerCase();
  const metaRole = (user.app_metadata as { role?: string } | undefined)?.role;
  const isAdmin = metaRole === 'admin' || (email !== '' && allowlist.includes(email));

  if (!isAdmin) {
    req.isAuthenticated = true;
    res.status(403).json({ error: 'Forbidden: admin access required.' });
    return null;
  }

  req.userId = user.id;
  req.isAuthenticated = true;
  return user.id;
}

/**
 * The single owner login that may access the private "War Room". Configurable
 * via WAR_ROOM_OWNER_EMAIL; falls back to the known owner so the gate works
 * even before that env var is set. Always compared case-insensitively.
 */
export function getOwnerEmail(): string {
  return (process.env.WAR_ROOM_OWNER_EMAIL || 'mahdikermanii@outlook.com')
    .trim()
    .toLowerCase();
}

/**
 * Verifies the caller is THE owner — a much stricter gate than verifyAdmin:
 * the signed-in user's email must exactly match getOwnerEmail(). Other admins
 * are intentionally rejected, so the War Room is visible to one account only.
 *
 * Returns the userId on success, or null after writing a 401 (not signed in)
 * / 403 (signed in but not the owner) response.
 */
export async function verifyOwner(
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    req.isAuthenticated = false;
    res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    return null;
  }

  const token = authHeader.slice(7);
  let user;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      req.isAuthenticated = false;
      res.status(401).json({ error: 'Unauthorized. Please sign in.' });
      return null;
    }
    user = data.user;
  } catch {
    req.isAuthenticated = false;
    res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    return null;
  }

  const email = (user.email || '').toLowerCase();
  if (email === '' || email !== getOwnerEmail()) {
    req.isAuthenticated = true;
    res.status(403).json({ error: 'Forbidden: owner access only.' });
    return null;
  }

  req.userId = user.id;
  req.isAuthenticated = true;
  return user.id;
}
