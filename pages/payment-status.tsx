import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';

export default function PaymentStatusPage() {
  const router = useRouter();
  const status = (router.query.status as string) || 'success';
  const success = status === 'success';

  return (
    <>
      <Head>
        <title>{success ? 'Payment Received' : 'Payment Cancelled'} | M&M Auto Performance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white flex flex-col">
        <Navbar isLoggedIn={false} userRole="guest" currentPage="" />

        <section className="flex-1 flex items-center justify-center px-6 py-24">
          <div className="text-center max-w-lg">
            <div
              className={`mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                success
                  ? 'bg-green-500/15 border border-green-500/40'
                  : 'bg-yellow-500/15 border border-yellow-500/40'
              }`}
            >
              {success ? '✓' : '⏸'}
            </div>
            <p className="text-performance-turquoise text-[11px] font-bold tracking-[0.45em] uppercase mb-4">
              {success ? 'Deposit Received' : 'Payment Cancelled'}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              {success ? 'Thank you — you’re all set' : 'No payment was taken'}
            </h1>
            <p className="text-gray-400 mb-10 leading-relaxed">
              {success
                ? 'We’ve received your deposit and your reservation is confirmed. Our team will be in touch shortly with the final details. A receipt has been emailed to you by Stripe.'
                : 'Your payment was cancelled and nothing was charged. If this was a mistake, you can reopen the payment link we sent you, or get in touch and we’ll help.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/fleet"
                className="inline-block px-8 py-4 bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey font-bold rounded-lg transition-all transform hover:scale-105"
              >
                Browse the Fleet
              </Link>
              <Link
                href="/contact"
                className="inline-block px-8 py-4 border border-performance-turquoise/40 hover:border-performance-turquoise text-performance-turquoise font-bold rounded-lg transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
