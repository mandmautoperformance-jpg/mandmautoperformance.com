import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page Not Found | M&M Auto Performance</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white flex flex-col">
        <Navbar isLoggedIn={false} userRole="guest" currentPage="" />

        <section className="flex-1 flex items-center justify-center px-6 py-24">
          <div className="text-center max-w-lg">
            <p className="text-performance-turquoise text-[11px] font-bold tracking-[0.45em] uppercase mb-4">
              Error 404
            </p>
            <h1 className="font-display text-6xl sm:text-7xl font-bold text-white mb-6 leading-none">
              Off the map
            </h1>
            <p className="text-gray-400 mb-10 leading-relaxed">
              The page you&apos;re looking for has taken a different route. Let&apos;s get
              you back to the good stuff — our fleet is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/fleet"
                className="inline-block px-8 py-4 bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey font-bold rounded-lg transition-all transform hover:scale-105"
              >
                Browse the Fleet
              </Link>
              <Link
                href="/"
                className="inline-block px-8 py-4 border border-performance-turquoise/40 hover:border-performance-turquoise text-performance-turquoise font-bold rounded-lg transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
