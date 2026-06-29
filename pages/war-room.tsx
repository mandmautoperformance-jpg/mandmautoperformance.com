import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

/**
 * War Room — a private control space visible to the single owner account only.
 *
 * Gating is deny-by-default and happens in three layers:
 *   1. No session            → redirect to /login
 *   2. Session but not owner  → /api/war-room/status returns 401/403 → redirect home
 *   3. Owner                  → render the room
 * The page is noindex/nofollow and is linked from nowhere on the site.
 */
const WarRoom: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'ready'>('checking');
  const [ownerEmail, setOwnerEmail] = useState<string>('');

  useEffect(() => {
    async function gate() {
      const supabase = getSupabaseBrowser();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }

      try {
        const res = await fetch('/api/war-room/status', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.status === 401 || res.status === 403) {
          // Not the owner — bounce home with no trace of what lives here.
          router.replace('/');
          return;
        }
        if (!res.ok) {
          router.replace('/');
          return;
        }
      } catch {
        router.replace('/');
        return;
      }

      setOwnerEmail(session.user.email || '');
      setState('ready');
    }
    gate();
  }, [router]);

  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-performance-grey flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-performance-turquoise border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>War Room</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-performance-turquoise text-[10px] font-bold tracking-[0.45em] uppercase mb-3">
                Classified · Owner Only
              </p>
              <h1 className="font-display text-5xl font-bold text-white">War Room</h1>
              <p className="text-gray-400 mt-3 text-sm">
                Signed in as <span className="text-performance-babyblue">{ownerEmail}</span>
              </p>
            </div>
            <div className="hidden sm:flex w-14 h-14 rounded-xl bg-performance-turquoise/10 border border-performance-turquoise/30 items-center justify-center text-2xl">
              🛡️
            </div>
          </div>

          {/* Placeholder canvas — tooling gets built here next. */}
          <div className="rounded-2xl bg-performance-panel border border-performance-turquoise/20 p-10 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-white mb-2">The room is live.</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              This space is yours and yours alone — no one else on the site can see it.
              Tell me what you want to build in here and I&apos;ll wire it up.
            </p>
          </div>

          <p className="text-center text-gray-600 text-xs mt-10">
            M&amp;M Auto Performance · War Room · access restricted to the owner account
          </p>
        </div>
      </main>
    </>
  );
};

export default WarRoom;
