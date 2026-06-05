import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import BookingWidget from '@/components/BookingWidget';
import { ChevronLeft, Car, Shield, Clock } from 'lucide-react';

export default function BookingPage() {
  const router = useRouter();
  const { vehicle } = router.query;

  return (
    <>
      <Head>
        <title>Book Your Vehicle | M&M Auto Performance</title>
        <meta name="description" content="Book a luxury or supercar with M&M Auto Performance. AI-powered instant verification, 24/7 booking." />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar isLoggedIn={false} userRole="guest" currentPage="booking" />

        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">

            {/* Back link */}
            <Link href="/fleet" className="inline-flex items-center gap-2 text-gray-400 hover:text-performance-turquoise mb-8 transition-colors text-sm">
              <ChevronLeft size={16} /> Back to Fleet
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Left: Booking Widget */}
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold text-white mb-2">Book Your Experience</h1>
                <p className="text-gray-400 mb-8">AI-powered booking with instant document verification</p>
                <BookingWidget mode="detailed" />
              </div>

              {/* Right: Info Panel */}
              <div className="space-y-6">

                {/* Why book with us */}
                <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4 text-lg">Why Book With Us</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <Clock size={20} className="text-performance-turquoise" />, title: 'Instant Confirmation', desc: 'Real-time booking confirmation within minutes' },
                      { icon: <Shield size={20} className="text-performance-turquoise" />, title: 'AI Verification', desc: 'Documents verified automatically in under 2 minutes' },
                      { icon: <Car size={20} className="text-performance-turquoise" />, title: 'Concierge Delivery', desc: 'Vehicle delivered to your location across Herts & London' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                        <div>
                          <p className="font-semibold text-white text-sm">{item.title}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What you need */}
                <div className="bg-performance-turquoise/5 border border-performance-turquoise/20 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4 text-lg">What You'll Need</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {[
                      '✓ Valid UK driving licence (min. 3 years)',
                      '✓ Proof of insurance or we arrange cover',
                      '✓ Photo ID (passport or national ID)',
                      '✓ Security deposit (refundable)',
                      '✓ Must be 21+ years of age',
                    ].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Need help? */}
                <div className="bg-performance-babyblue/10 border border-performance-babyblue/30 rounded-xl p-6 text-center">
                  <p className="text-white font-bold mb-2">Need help booking?</p>
                  <p className="text-gray-400 text-sm mb-4">MIA is here 24/7 to guide you through the process</p>
                  <Link href="/" className="inline-block px-5 py-2.5 bg-performance-turquoise text-performance-grey font-bold rounded-lg text-sm hover:bg-performance-turquoise/90 transition-all">
                    Chat with MIA
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
