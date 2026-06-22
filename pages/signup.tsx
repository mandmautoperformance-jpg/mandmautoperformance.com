import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError('Please agree to the terms and conditions.'); return; }
    setIsLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowser();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName } },
      });
      if (authError) throw authError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'][passwordStrength];
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][passwordStrength];

  return (
    <>
      <Head>
        <title>Create Account | M&M Auto Performance</title>
        <meta name="description" content="Join M&M Auto Performance and access the UK's finest supercar hire with AI-powered booking." />
      </Head>
      <main className="min-h-screen bg-performance-grey flex items-center justify-center px-4 py-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-performance-turquoise/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-performance-babyblue/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <Image src="/logo.svg" alt="M&M Auto Performance" width={44} height={44} unoptimized className="rounded-full" />
              <span className="text-white font-bold text-xl">M&amp;M Auto Performance</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-white">Create your account</h1>
            <p className="text-gray-400 mt-2">Join thousands of elite drivers</p>
          </div>

          {success ? (
            <div className="bg-performance-grey border border-green-500/30 rounded-2xl p-8 text-center">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Check your email!</h2>
              <p className="text-gray-400 mb-6">We've sent a confirmation link to <span className="text-performance-turquoise">{email}</span></p>
              <Link href="/login" className="inline-block px-6 py-3 bg-performance-turquoise text-performance-grey font-bold rounded-lg">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <div className="bg-performance-grey border border-performance-turquoise/20 rounded-2xl p-8 shadow-2xl shadow-performance-turquoise/10">
              {error && (
                <div className="flex items-center gap-3 bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
                  <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">First name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="James"
                      className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Bond"
                      className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Min. 8 characters"
                      className="w-full px-4 py-3 pr-12 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${strengthColor}`} style={{ width: `${(passwordStrength / 3) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{strengthLabel}</span>
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded border-performance-turquoise/30 text-performance-turquoise" />
                  <span className="text-sm text-gray-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-performance-turquoise hover:underline">Terms & Conditions</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-performance-turquoise hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg hover:shadow-lg hover:shadow-performance-turquoise/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-performance-grey/30 border-t-performance-grey rounded-full animate-spin" />
                  ) : (
                    <><Zap size={18} /> Create Account</>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-performance-turquoise/20 text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="text-performance-turquoise hover:underline font-semibold">Sign in</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
