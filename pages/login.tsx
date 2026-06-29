import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowser();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | M&M Auto Performance</title>
        <meta name="description" content="Sign in to your M&M Auto Performance account." />
      </Head>
      <main className="min-h-screen bg-performance-grey flex items-center justify-center px-4">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-performance-turquoise/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-performance-babyblue/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <Image src="/logo.svg" alt="M&M Auto Performance" width={44} height={44} unoptimized className="rounded-full" />
              <span className="text-white font-bold text-xl">M&amp;M Auto Performance</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 mt-2">Sign in to continue your journey</p>
          </div>

          {/* Card */}
          <div className="bg-performance-grey border border-performance-turquoise/20 rounded-2xl p-8 shadow-2xl shadow-performance-turquoise/10">

            {error && (
              <div className="flex items-center gap-3 bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-300">Password</label>
                  <Link href="/forgot-password" className="text-xs text-performance-turquoise hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg hover:shadow-lg hover:shadow-performance-turquoise/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-performance-grey/30 border-t-performance-grey rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-performance-turquoise/20 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="text-performance-turquoise hover:underline font-semibold">
                  Create one free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
