import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Zap, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowser();
      const redirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password | M&M Auto Performance</title>
        <meta name="description" content="Reset your M&M Auto Performance account password." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-performance-turquoise transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>

          <div className="bg-performance-grey border border-performance-turquoise/20 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={22} className="text-performance-turquoise" />
              <span className="font-bold text-lg">M&M Auto Performance</span>
            </div>

            {sent ? (
              <div className="text-center py-4">
                <CheckCircle size={48} className="text-performance-turquoise mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
                <p className="text-gray-400">
                  If an account exists for <span className="text-white">{email}</span>, we&apos;ve
                  sent a link to reset your password.
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
                <p className="text-gray-400 mb-6">
                  Enter your email and we&apos;ll send you a secure reset link.
                </p>

                {error && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-performance-turquoise hover:bg-performance-turquoise/90 disabled:opacity-60 text-performance-grey font-bold rounded-lg transition-all"
                  >
                    {isLoading ? 'Sending...' : 'Send reset link'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
