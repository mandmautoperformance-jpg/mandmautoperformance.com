import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import BookingWidget from '@/components/BookingWidget';
import VehicleGallery from '@/components/VehicleGallery';
import { getVehicle, weekendPrice } from '@/lib/vehicles';
import { getCategoryRequirement, requirementLabel } from '@/lib/driver-eligibility';
import { ChevronLeft, Star, Zap, Shield, Clock, ShieldCheck } from 'lucide-react';

export default function VehicleBookingPage() {
  const router = useRouter();
  const { id } = router.query;
  const vehicle = getVehicle(id as string | undefined);

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-performance-grey flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl font-bold mb-4">Vehicle not found</p>
          <Link href="/fleet" className="text-performance-turquoise hover:underline">
            Back to fleet
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{vehicle.model} | M&M Auto Performance</title>
        <meta name="description" content={vehicle.description} />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar isLoggedIn={false} userRole="guest" currentPage="fleet" />

        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <Link href="/fleet" className="inline-flex items-center gap-2 text-gray-400 hover:text-performance-turquoise mb-8 text-sm">
              <ChevronLeft size={16} /> Back to Fleet
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Images & Details */}
              <div className="lg:col-span-2 space-y-6">
                <VehicleGallery
                  heroPhoto={vehicle.heroPhoto}
                  model={vehicle.model}
                  category={vehicle.category}
                  color={vehicle.color}
                  colorHex={vehicle.colorHex}
                />

                {/* Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Horsepower', value: vehicle.specs.horsepower + ' HP' },
                    { label: '0–60 mph', value: vehicle.specs.acceleration },
                    { label: 'Top Speed', value: `${vehicle.specs.topSpeed} mph` },
                    { label: 'Transmission', value: vehicle.specs.transmission },
                  ].map((spec, i) => (
                    <div key={i} className="bg-performance-grey border border-performance-turquoise/20 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-xs mb-1">{spec.label}</p>
                      <p className="text-white font-bold text-lg">{spec.value}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Included Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {vehicle.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <Zap size={16} className="text-performance-turquoise flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">About This Vehicle</h3>
                  <p className="text-gray-400 leading-relaxed">{vehicle.description}</p>
                </div>

                {/* Reviews */}
                <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(vehicle.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                      />
                    ))}
                    <span className="text-white font-bold ml-2">{vehicle.rating}</span>
                    <span className="text-gray-400 text-sm">({vehicle.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Booking Sidebar */}
              <div className="space-y-6">
                {/* Price Card */}
                <div className="bg-gradient-to-br from-performance-turquoise/20 to-performance-babyblue/10 border border-performance-turquoise/30 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{vehicle.model}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    {vehicle.colorHex && (
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: vehicle.colorHex }}
                        aria-hidden
                      />
                    )}
                    <span className="text-gray-300 text-sm">{vehicle.color}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{vehicle.location} · {vehicle.plate}</p>

                  <div className="space-y-3 mb-6 pb-6 border-b border-performance-turquoise/20">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Daily rate</span>
                      <span className="text-white font-bold">£{vehicle.pricing.daily}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Hourly rate</span>
                      <span className="text-white font-bold">£{vehicle.pricing.hourly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Weekend (3 days)</span>
                      <span className="text-white font-bold">£{weekendPrice(vehicle.pricing.daily)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-performance-turquoise font-semibold mb-4">
                    {vehicle.availability ? '✓ Available to reserve now' : 'Currently on hire — request dates'}
                  </p>

                  <div className="flex items-start gap-2 text-xs text-gray-300 bg-performance-grey/40 border border-performance-turquoise/20 rounded-lg px-3 py-2">
                    <ShieldCheck size={15} className="text-performance-turquoise flex-shrink-0 mt-0.5" />
                    <span>{requirementLabel(getCategoryRequirement(vehicle.category))}. Instant DVLA-grade licence check at booking.</span>
                  </div>
                </div>

                {/* Booking Widget */}
                <BookingWidget mode="detailed" vehicle={vehicle} />

                {/* Guarantees */}
                <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-5 space-y-3">
                  {[
                    { icon: <Shield size={18} className="text-performance-turquoise" />, text: '100% Secure Booking' },
                    { icon: <Clock size={18} className="text-performance-turquoise" />, text: '24/7 Roadside Support' },
                    { icon: <Zap size={18} className="text-performance-turquoise" />, text: 'MIA AI Concierge' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div>{item.icon}</div>
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
