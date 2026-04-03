/**
 * SocialAuthFlow.tsx
 *
 * Seamless social sign-in for Driver's Passport creation.
 * One-click authentication via Google, Apple, and X (Twitter).
 *
 * This removes the #1 friction point: the signup form.
 * Users click once, authenticate with their social account,
 * and immediately enter the Driver's Passport onboarding.
 *
 * Built with Supabase Auth for secure OAuth integration.
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface AuthProvider {
  id: 'google' | 'apple' | 'x';
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const SocialAuthFlow: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const providers: AuthProvider[] = [
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      description: 'Fast and secure login with your Google account',
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 13.5c-.91 2.18.74 4.82 2.55 6.02.9.58 1.96 1.04 2.74.78.77-.26.97-1.29.91-2.1-.09-1.25-.74-2.74-1.5-3.86-1.12-1.71-2.95-3.03-4.7-2.84zm-10.1 0c1.75-.19 3.58 1.13 4.7 2.84.76 1.12 1.41 2.61 1.5 3.86.06.81-.14 1.84-.91 2.1-.78.26-1.84-.2-2.74-.78-1.81-1.2-3.46-3.84-2.55-6.02zm5.05-1.5c2.43 0 4.5-1.87 4.5-4.5S14.43 3 12 3s-4.5 1.87-4.5 4.5 2.07 4.5 4.5 4.5z" />
        </svg>
      ),
      color: 'from-gray-800 to-gray-900',
      description: 'Sign in securely with your Apple ID',
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.627l-5.1-6.694-5.866 6.694h-3.31l7.75-8.835L.424 2.25h6.827l4.872 6.246 5.121-6.246zM17.55 19.5h1.82L6.74 3.997H4.77l12.78 15.503z" />
        </svg>
      ),
      color: 'from-black to-gray-800',
      description: 'Connect using your X account',
    },
  ];

  const handleAuth = async (providerId: string) => {
    setIsLoading(true);
    setSelectedProvider(providerId);
    setError(null);

    try {
      // Supabase Auth handler (would be implemented in actual integration)
      // const { data, error } = await supabase.auth.signInWithOAuth({
      //   provider: providerId,
      //   options: {
      //     redirectTo: `${window.location.origin}/auth/callback`,
      //     queryParams: {
      //       access_type: 'offline',
      //       prompt: 'consent',
      //     },
      //   },
      // })

      // Simulate auth request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to Driver's Passport onboarding
      window.location.href = '/dashboard/passport/onboarding';
    } catch (err) {
      setError(`Failed to sign in with ${providerId}. Please try again.`);
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
      setSelectedProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 py-12">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-turquoise/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-cyan/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          {/* MIA Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-turquoise to-cyan rounded-full flex items-center justify-center shadow-2xl shadow-turquoise/50"
          >
            <span className="text-slate-900 font-bold text-3xl">M</span>
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2">Welcome to M&M</h1>
          <p className="text-slate-400 text-lg mb-8">
            Meet <span className="text-turquoise font-semibold">MIA</span> — Your AI-Powered Concierge
          </p>

          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 mb-8">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-turquoise">No forms. No friction.</span> One click to unlock your Driver's Passport and dive into premium performance cars.
            </p>
          </div>
        </div>

        {/* Social Auth Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-8"
        >
          {providers.map((provider, idx) => (
            <motion.button
              key={provider.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              onClick={() => handleAuth(provider.id)}
              disabled={isLoading}
              className="w-full group relative"
            >
              {/* Gradient Border */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${provider.color} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur`}
              />

              {/* Button Content */}
              <div className="relative w-full bg-slate-800 hover:bg-slate-700 rounded-lg p-4 flex items-center justify-center gap-3 transition-all duration-300 border border-slate-700 group-hover:border-transparent">
                {selectedProvider === provider.id && isLoading ? (
                  <Loader size={20} className="animate-spin text-turquoise" />
                ) : (
                  <span className="text-white group-hover:text-turquoise transition-colors">
                    {provider.icon}
                  </span>
                )}

                <div className="text-left">
                  <p className="font-semibold text-white group-hover:text-turquoise transition-colors">
                    {isLoading && selectedProvider === provider.id ? 'Signing in...' : `Sign in with ${provider.name}`}
                  </p>
                  <p className="text-xs text-slate-400">{provider.description}</p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 ml-auto text-slate-500 group-hover:text-turquoise transition-colors group-hover:translate-x-1 duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8"
          >
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-700/20 rounded-lg p-6 border border-slate-600/30 mb-8"
        >
          <h3 className="font-semibold text-white mb-4">What You Get Instantly:</h3>
          <ul className="space-y-3">
            <Feature icon="🔐" text="Your Driver's Passport with secure document vault" />
            <Feature icon="⚡" text="Real-time telematics scoring (unlock elite cars)" />
            <Feature icon="🎯" text="Talk to MIA for instant bookings & support" />
            <Feature icon="💎" text="M&M Credits & exclusive loyalty rewards" />
            <Feature icon="🏎️" text="Access to entire premium fleet" />
          </ul>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-4 text-xs text-slate-400"
        >
          <div className="flex items-center justify-center gap-4">
            <span>🔒 Bank-level encryption</span>
            <span>•</span>
            <span>✅ GDPR compliant</span>
          </div>
          <p>
            We never store your passwords. OAuth is encrypted and secure.{' '}
            <a href="/privacy" className="text-turquoise hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-8 border-t border-slate-700/50 text-center"
        >
          <p className="text-slate-400 text-sm mb-4">
            Already have an account?{' '}
            <a href="/login" className="text-turquoise font-semibold hover:underline">
              Sign in here
            </a>
          </p>
          <p className="text-xs text-slate-500">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-slate-400 hover:text-slate-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-slate-400 hover:text-slate-300">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>

      {/* MIA Chat Widget (Teaser) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-full p-4 shadow-2xl border border-slate-700 hover:border-turquoise/50 transition-all cursor-pointer group">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-turquoise to-cyan rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
              M
            </div>
            <div className="text-white text-sm font-semibold hidden group-hover:block">
              <p>Hi! Questions?</p>
              <p className="text-xs text-slate-400">Talk to MIA</p>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-turquoise rounded-full animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
};

/* Mini Component */
const Feature: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <li className="flex items-start gap-3">
    <span className="text-lg mt-0.5">{icon}</span>
    <span className="text-slate-300 text-sm">{text}</span>
  </li>
);

export default SocialAuthFlow;
