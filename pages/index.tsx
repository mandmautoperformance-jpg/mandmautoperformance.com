import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BookingWidget from '@/components/BookingWidget';
import FleetCard from '@/components/FleetCard';
import AIConcierge from '@/components/AIConcierge';
import CategoryShowcase from '@/components/CategoryShowcase';
import { VEHICLES } from '@/lib/vehicles';

// Pick one showcase car per highlight category for the Featured Fleet strip.
const FEATURED_KEYS = [
  'lambo-huracan-rosso-corsa',
  'ferrari-f8-bianco-white',
  'porsche-911-nero-black',
  'rolls-ghost-grigio-silver',
];

export default function HomePage() {
  const [conciergeOpen, setConciergeOpen] = useState(false);

  const featuredVehicles = (() => {
    const specific = VEHICLES.filter((v) => FEATURED_KEYS.includes(v.vehicleId));
    if (specific.length >= 4) return specific.slice(0, 4);
    // Fallback: first vehicle from each of 4 distinct makes
    const seen = new Set<string>();
    return VEHICLES.filter((v) => {
      if (seen.has(v.make)) return false;
      seen.add(v.make);
      return true;
    }).slice(0, 4);
  })();

  return (
    <main className="min-h-screen bg-performance-grey text-white">
      <Navbar isLoggedIn={false} userRole="guest" currentPage="home" />

      {/* Hero Section */}
      <Hero />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Booking Widget Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-performance-grey/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Booking Made Simple
            </h2>
            <p className="text-gray-300">
              Our AI Sky Concierge handles everything. Instant document
              verification, real-time availability, and 24/7 support.
            </p>
          </div>
          <BookingWidget mode="quick" />
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Featured Fleet
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Handpicked supercars and luxury vehicles, all available for
              immediate booking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle) => (
              <FleetCard key={vehicle.vehicleId} {...vehicle} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/fleet"
              className="inline-block px-8 py-4 bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey font-bold rounded-lg transition-all transform hover:scale-105"
            >
              View Complete Fleet
            </Link>
          </div>
        </div>
      </section>

      {/* Why M&M Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-performance-turquoise/5 border-t border-performance-turquoise/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-white mb-12 text-center">
            Why Choose M&M Auto Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI Sky Concierge',
                description:
                  '24/7 automated booking and document verification. Instant confirmations with zero hassle.',
              },
              {
                icon: '⚡',
                title: 'Lightning Fast Booking',
                description:
                  'Real-time availability, instant document processing, and immediate confirmation.',
              },
              {
                icon: '🏆',
                title: 'Habit Score Rewards',
                description:
                  'Earn rewards with every booking. Disciplined driving = exclusive benefits.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 bg-performance-grey border border-performance-turquoise/20 rounded-xl hover:border-performance-turquoise/50 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Premium Vehicles', value: '500+' },
              { label: 'Active Users', value: '15K+' },
              { label: 'Bookings This Year', value: '5K+' },
              { label: 'Service Uptime', value: '99.9%' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-performance-turquoise mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-performance-turquoise/10 to-performance-babyblue/10 border-t border-performance-turquoise/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-6">
            Ready to Experience Elite Performance?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of discerning drivers who trust M&M Auto Performance
            for their high-performance automotive needs.
          </p>
          <Link
            href="/booking"
            className="inline-block px-8 py-4 bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey font-bold rounded-lg transition-all transform hover:scale-105"
          >
            Book Your Experience Now
          </Link>
        </div>
      </section>

      {/* AI Concierge */}
      <AIConcierge
        isOpen={conciergeOpen}
        onClose={() => setConciergeOpen(false)}
      />

      {/* Floating Chat Button */}
      {!conciergeOpen && (
        <button
          onClick={() => setConciergeOpen(true)}
          aria-label="Open MIA AI Concierge chat"
          className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-performance-babyblue to-performance-turquoise rounded-full shadow-lg hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center text-performance-grey font-bold text-2xl hover:bg-gradient-to-br hover:from-performance-turquoise hover:to-performance-babyblue"
        >
          💬
        </button>
      )}

      {/* Footer */}
      <footer className="bg-performance-grey border-t border-performance-turquoise/20 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {[
              {
                title: 'Company',
                links: [
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms & Conditions', href: '/terms' },
                ],
              },
              {
                title: 'Fleet',
                links: [
                  { label: 'All Vehicles', href: '/fleet' },
                  { label: 'Book Now', href: '/booking' },
                  { label: 'Cookie Policy', href: '/cookie-policy' },
                  { label: 'Dashboard', href: '/dashboard' },
                ],
              },
              {
                title: 'Support',
                links: [
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Terms & Conditions', href: '/terms' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Cookie Policy', href: '/cookie-policy' },
                ],
              },
              {
                title: 'Account',
                links: [
                  { label: 'Sign In', href: '/login' },
                  { label: 'Create Account', href: '/signup' },
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Settings', href: '/settings' },
                ],
              },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-performance-turquoise transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-performance-turquoise/20 pt-8 flex flex-col items-center gap-3 text-gray-400 text-center">
            <Image src="/logo.svg" alt="M&M Auto Performance UK" width={56} height={56} className="opacity-80" />
            <p>© 2026 M&amp;M Auto Performance. Part of the RichHabits Ecosystem.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
