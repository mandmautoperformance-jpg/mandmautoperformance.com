'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Returns the shared browser-side Supabase client.
 * Throws a descriptive error (not the raw SDK message) if the required env
 * vars are missing from the Vercel / runtime config.
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Site configuration error — please contact support. (Supabase credentials are not configured)',
    );
  }

  _client = createClient(url, key);
  return _client;
}
