import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

/**
 * Handles all Supabase auth email redirects:
 * - Email confirmation (SIGNED_IN / USER_UPDATED): new users → /account/verify-id, existing → /dashboard
 * - Password recovery (PASSWORD_RECOVERY): → /reset-password
 * Supports both implicit flow (hash-based) and PKCE flow (code in query).
 */
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const supabase = getSupabaseBrowser();

    const redirectAfterConfirm = (idUploaded: boolean) => {
      router.replace(idUploaded ? '/dashboard' : '/account/verify-id');
    };

    // PKCE flow: code in query string — exchange for session
    const code = router.query.code as string | undefined;
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data }) => {
        redirectAfterConfirm(Boolean(data.session?.user?.user_metadata?.id_uploaded));
      });
      return;
    }

    // Implicit flow: Supabase auto-processes the hash, listen for the state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        subscription.unsubscribe();
        router.replace('/reset-password');
        return;
      }
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        subscription.unsubscribe();
        redirectAfterConfirm(Boolean(session?.user?.user_metadata?.id_uploaded));
      }
    });

    // Fallback if already signed in (page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        redirectAfterConfirm(Boolean(session.user?.user_metadata?.id_uploaded));
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <>
      <Head>
        <title>Confirming account… | M&amp;M Auto Performance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-performance-grey flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-performance-turquoise/30 border-t-performance-turquoise rounded-full animate-spin mx-auto mb-6" />
          <p className="text-white text-lg font-semibold">Confirming your account…</p>
          <p className="text-gray-400 text-sm mt-2">One moment please</p>
        </div>
      </main>
    </>
  );
}
