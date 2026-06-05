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
