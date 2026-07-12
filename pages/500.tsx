import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function ServerErrorPage() {
  return (
    <>
      <Head>
        <title>Server Error | M&M Auto Performance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle size={56} className="text-performance-turquoise mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-3">Something went wrong</h1>
          <p className="text-gray-400 mb-8">
            We hit an unexpected error on our end. The team has been notified. Please try again in
            a moment.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-performance-turquoise text-performance-grey font-bold rounded-lg hover:bg-performance-turquoise/90 transition-all"
            >
              Go home
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-performance-turquoise/40 text-white font-semibold rounded-lg hover:border-performance-turquoise transition-all"
            >
              Contact us
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
