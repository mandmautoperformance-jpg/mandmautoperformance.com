import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Shield, Zap, Award, MapPin } from 'lucide-react';
import { FLEET_SIZE } from '@/lib/vehicles';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | M&M Auto Performance</title>
        <meta name="description" content="M&M Auto Performance — the UK's premier AI-powered luxury and supercar hire platform, serving Hertfordshire and London." />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar isLoggedIn={false} userRole="guest" currentPage="about" />
        <section className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-performance-turquoise/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-performance-babyblue/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-full mb-6">
              <Zap size={14} className="text-performance-turquoise" />
              <span className="text-sm font-medium text-performance-turquoise">Premium AI Car Hire — Hertfordshire &amp; London</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-6">
              Built for Drivers Who <span className="bg-gradient-to-r from-performance-turquoise to-performance-babyblue bg-clip-text text-transparent">Demand More</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">M&M Auto Performance is the UK's most advanced vehicle hire platform — combining elite cars with AI-powered booking and a rewards system that actually respects your time.</p>
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-performance-turquoise/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>M&M Auto Performance was founded on a simple belief: hiring a supercar should be as thrilling as driving one. No endless paperwork. No waiting around. No compromise.</p>
                <p>Operating across Hertfordshire and London, we've built an end-to-end platform powered by MIA — our Motor Intelligence Assistant — that handles everything from document verification to personalised vehicle recommendations in real time.</p>
                <p>We're not just a car hire company. We're a performance ecosystem. With the Driver's Passport gamification system, every booking earns you habit points, unlocks rewards, and moves you up through Bronze, Silver, Platinum, and Elite tiers.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ value: `${FLEET_SIZE}`, label: 'Elite Vehicles' }, { value: '24/7', label: 'AI Concierge' }, { value: 'Herts', label: '& London Coverage' }, { value: '4.9★', label: 'Average Rating' }].map((stat, i) => (
                <div key={i} className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-6 text-center hover:border-performance-turquoise/40 transition-all">
                  <div className="text-3xl font-bold text-performance-turquoise mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-performance-turquoise/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{ icon: <Shield size={28} className="text-performance-turquoise" />, title: 'Trust & Transparency', desc: 'Every price is shown upfront. No hidden fees, no surprises. Our AI verification system protects both drivers and vehicles.' }, { icon: <Zap size={28} className="text-performance-turquoise" />, title: 'Speed & Efficiency', desc: 'Real-time availability, sub-2-minute document processing, and instant booking confirmation. We respect your time.' }, { icon: <Award size={28} className="text-performance-turquoise" />, title: 'Rewarding Loyalty', desc: "The Driver's Passport rewards disciplined, consistent drivers. The better your habits, the better your benefits." }].map((item, i) => (
                <div key={i} className="p-8 bg-performance-grey border border-performance-turquoise/20 rounded-xl hover:border-performance-turquoise/40 transition-all">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-performance-turquoise/10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Where We Operate</h2>
            <p className="text-gray-400 mb-10">Serving the full Hertfordshire–London corridor</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['St Albans', 'Watford', 'Hemel Hempstead', 'Harpenden', 'Luton', 'Mayfair', 'Chelsea', 'Canary Wharf', 'Shoreditch', 'Hampstead'].map((loc) => (
                <span key={loc} className="flex items-center gap-1.5 px-4 py-2 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-full text-sm text-performance-turquoise"><MapPin size={12} /> {loc}</span>
              ))}
            </div>
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-performance-turquoise/10 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Drive?</h2>
            <p className="text-gray-400 mb-8">Join M&M Auto Performance and experience what elite car hire should feel like.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fleet" className="px-8 py-4 bg-performance-turquoise text-performance-grey font-bold rounded-lg hover:bg-performance-turquoise/90 transition-all">Browse Fleet</Link>
              <Link href="/contact" className="px-8 py-4 border-2 border-performance-turquoise text-performance-turquoise font-bold rounded-lg hover:bg-performance-turquoise/10 transition-all">Get in Touch</Link>
            </div>
          </div>
        </section>
        <footer className="border-t border-performance-turquoise/20 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">© 2026 M&M Auto Performance. All rights reserved.</div>
        </footer>
      </main>
    </>
  );
}
