import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CinematicHero from '@/components/CinematicHero';
import BookingWidget from '@/components/BookingWidget';
import FleetCard from '@/components/FleetCard';
import AIConcierge from '@/components/AIConcierge';
import CategoryShowcase from '@/components/CategoryShowcase';
import { VEHICLES, FLEET_SIZE } from '@/lib/vehicles';
import { Bot, Zap, Trophy, Star } from 'lucide-react';

// Four marquee models for the Featured Fleet strip (first listing of each).
const FEATURED_MODELS = [
  'Lamborghini Huracán',
  'Ferrari F8 Tributo',
  'Porsche 911 Turbo S',
  'Rolls-Royce Ghost',
];

export default function HomePage() {
  const [conciergeOpen, setConciergeOpen] = useState(false);

  const featuredVehicles = FEATURED_MODELS
    .map((m) => VEHICLES.find((v) => v.model === m))
    .filter((v): v is (typeof VEHICLES)[number] => Boolean(v));

  return (
    <main className="min-h-screen bg-performance-grey text-white relative">
      <Navbar isLoggedIn={false} userRole="guest" currentPage="home" />

      {/* Cinematic hero */}
      <CinematicHero />

      {/* Page content */}
      <div>
      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Booking Widget Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-performance-grey/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-performance-turquoise text-[10px] font-bold tracking-[0.45em] uppercase mb-3">
              Reserve Your Drive
            </p>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Your next chapter starts here
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto">
              MIA handles everything — from document verification to real-time availability. Instant confirmation, zero hassle, 24 hours a day.
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
          <div className="text-center mb-12">
            <p className="text-performance-turquoise text-[10px] font-bold tracking-[0.45em] uppercase mb-3">
              The M&amp;M Difference
            </p>
            <h2 className="font-display text-4xl font-bold text-white">
              What sets us apart
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot size={28} className="text-performance-turquoise" />,
                title: 'MIA — AI Concierge',
                description: '24/7 automated booking and instant document verification. Confirm your reservation in minutes, not days.',
              },
              {
                icon: <Zap size={28} className="text-performance-turquoise" />,
                title: 'Lightning Booking',
                description: 'Real-time availability, AI document processing, and immediate confirmation — all in under 3 minutes.',
              },
              {
                icon: <Trophy size={28} className="text-performance-turquoise" />,
                title: "Driver's Passport",
                description: 'Earn points with every booking. Climb through Bronze, Silver, Platinum, and Elite tiers for exclusive rewards.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 bg-performance-panel border border-performance-turquoise/20 rounded-xl hover:border-performance-turquoise/50 hover:shadow-gold transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-performance-turquoise/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-performance-turquoise/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="gold-hairline mb-16" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Vehicles in Fleet', value: `${FLEET_SIZE}` },
              { label: 'Drivers Trust Us', value: '15K+' },
              { label: 'Bookings This Year', value: '5K+' },
              { label: 'Platform Uptime', value: '99.9%' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="font-display text-5xl font-bold text-performance-turquoise mb-2 group-hover:text-performance-babyblue transition-colors duration-300">
                  {stat.value}
                </div>
                <p className="text-gray-400 text-sm tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="gold-hairline mt-16" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-r from-performance-turquoise/10 to-performance-babyblue/10 border-t border-performance-turquoise/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star size={14} className="text-performance-turquoise fill-performance-turquoise" />
            <Star size={14} className="text-performance-turquoise fill-performance-turquoise" />
            <Star size={14} className="text-performance-turquoise fill-performance-turquoise" />
            <Star size={14} className="text-performance-turquoise fill-performance-turquoise" />
            <Star size={14} className="text-performance-turquoise fill-performance-turquoise" />
            <span className="text-performance-turquoise text-xs font-bold ml-2 tracking-wider">TRUSTED BY 15,000+ DRIVERS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
            Begin your elite drive
          </h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Thousands of discerning drivers across London and Hertfordshire choose M&amp;M Auto Performance. Your next extraordinary journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-block px-10 py-4 bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey font-bold rounded-full tracking-wider uppercase text-sm transition-all transform hover:scale-105 shadow-gold"
            >
              Book Your Experience
            </Link>
            <Link
              href="/fleet"
              className="inline-block px-10 py-4 border border-performance-turquoise/50 hover:border-performance-turquoise text-performance-turquoise font-bold rounded-full tracking-wider uppercase text-sm transition-all hover:bg-performance-turquoise/10"
            >
              Browse the Fleet
            </Link>
          </div>
        </div>
      </section>

      </div>{/* end scroll-over wrapper */}

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
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms & Conditions', href: '/terms' },
                ],
              },
              {
                title: 'Our Fleet',
                links: [
                  { label: 'All Vehicles', href: '/fleet' },
                  { label: 'Exotic Collection', href: '/fleet?cat=exotic' },
                  { label: 'Luxury Cars', href: '/fleet?cat=luxury' },
                  { label: 'Sports Cars', href: '/fleet?cat=sports' },
                ],
              },
              {
                title: 'Booking',
                links: [
                  { label: 'Book a Vehicle', href: '/booking' },
                  { label: 'Chat with MIA', href: '/' },
                  { label: 'Cookie Policy', href: '/cookie-policy' },
                  { label: 'Payment Help', href: '/contact' },
                ],
              },
              {
                title: 'Account',
                links: [
                  { label: 'Sign In', href: '/login' },
                  { label: 'Create Account', href: '/signup' },
                  { label: 'My Dashboard', href: '/dashboard' },
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
            <Image src="/logo.svg" alt="M&M Auto Performance UK" width={56} height={56} className="opacity-80" unoptimized />
            <p>© 2026 M&amp;M Auto Performance. Part of the RichHabits Ecosystem.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
