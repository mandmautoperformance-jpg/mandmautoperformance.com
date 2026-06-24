import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  // Wait for the PASSWORD_RECOVERY session to be established from the hash
  useEffect(() => {
    const supabase = getSupabaseBrowser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    // Also check if we already have a recovery session (page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const supabase = getSupabaseBrowser();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.replace('/dashboard'), 2500);
  };

  return (
    <>
      <Head>
        <title>Set New Password | M&amp;M Auto Performance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-performance-grey border border-performance-turquoise/20 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={22} className="text-performance-turquoise" />
              <span className="font-bold text-lg">M&amp;M Auto Performance</span>
            </div>

            {done ? (
              <div className="text-center py-4">
                <CheckCircle size={48} className="text-performance-turquoise mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Password updated</h1>
                <p className="text-gray-400">Taking you to your dashboard…</p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2">Set new password</h1>
                <p className="text-gray-400 mb-6">Choose a strong password for your account.</p>

                {error && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {!ready && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm">
                    <AlertCircle size={16} />
                    Verifying your reset link…
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full px-4 py-3 pr-12 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm" className="block text-sm text-gray-300 mb-2">
                      Confirm password
                    </label>
                    <input
                      id="confirm"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !ready}
                    className="w-full py-3 bg-performance-turquoise hover:bg-performance-turquoise/90 disabled:opacity-60 text-performance-grey font-bold rounded-lg transition-all"
                  >
                    {isLoading ? 'Updating…' : 'Update password'}
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
