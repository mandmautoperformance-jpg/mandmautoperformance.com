import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import BookingWidget from '@/components/BookingWidget';
import { ChevronLeft, Star, MapPin, Zap, Shield, Clock } from 'lucide-react';

const VEHICLES: Record<string, any> = {
  'lambo-huracan': {
    model: 'Lamborghini Huracán',
    category: 'Supercar',
    image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1200&h=800&fit=crop',
    specs: { horsepower: 657, acceleration: '2.9s 0-60mph', topSpeed: '217 mph', transmission: 'Automatic' },
    pricing: { daily: 1500, hourly: 200, weekend: 4000 },
    features: ['GPS Navigation', 'Premium Sound System', 'Full Leather Interior', 'Climate Control', 'Keyless Entry', 'Backup Camera'],
    description: 'Experience pure Italian performance. The Huracán is raw, visceral, and unforgettable.',
    rating: 4.9,
    reviews: 127,
    availability: 'Available from tomorrow',
    location: 'Mayfair, London',
  },
  'ferrari-f8': {
    model: 'Ferrari F8 Tributo',
    category: 'Supercar',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&h=800&fit=crop',
    specs: { horsepower: 710, acceleration: '2.9s 0-60mph', topSpeed: '211 mph', transmission: 'Automatic' },
    pricing: { daily: 1800, hourly: 250, weekend: 4800 },
    features: ['Carbon Fiber Trim', 'Sport Package', 'Burmester Audio', 'Daytona Seats', 'F1-Style Shifter', 'Launch Control'],
    description: 'The pinnacle of Ferrari engineering. Every detail designed for performance.',
    rating: 5.0,
    reviews: 89,
    availability: 'Available this weekend',
    location: 'St Albans, Herts',
  },
  'porsche-911': {
    model: 'Porsche 911 Turbo S',
    category: 'Sports Car',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&h=800&fit=crop',
    specs: { horsepower: 640, acceleration: '2.7s 0-60mph', topSpeed: '211 mph', transmission: 'Automatic' },
    pricing: { daily: 800, hourly: 120, weekend: 2200 },
    features: ['Night Vision', 'Adaptive Suspension', 'Premium Leather', 'Paddle Shifters', 'Heated Seats', 'Apple CarPlay'],
    description: 'Iconic performance. Precision engineering. The 911 Turbo S is pure Porsche.',
    rating: 4.8,
    reviews: 234,
    availability: 'Available today',
    location: 'Watford, Herts',
  },
  'bentley-continental': {
    model: 'Bentley Continental GT',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&h=800&fit=crop',
    specs: { horsepower: 626, acceleration: '3.6s 0-60mph', topSpeed: '198 mph', transmission: 'Automatic' },
    pricing: { daily: 600, hourly: 100, weekend: 1600 },
    features: ['Full Leather Interiors', 'Heated/Cooled Seats', 'WiFi Connectivity', 'Premium Bar', 'Panoramic Roof', 'Navigation Plus'],
    description: 'British luxury meets German engineering. Effortless power and elegance.',
    rating: 4.7,
    reviews: 156,
    availability: 'Currently booked',
    location: 'Mayfair, London',
  },
};

export default function VehicleBookingPage() {
  const router = useRouter();
  const { id } = router.query;
  const vehicle = id ? VEHICLES[id as string] : null;
  const [selectedImage, setSelectedImage] = useState(0);

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
                <div className="rounded-xl overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.model}
                    width={800}
                    height={600}
                    className="w-full h-96 object-cover"
                  />
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Horsepower', value: vehicle.specs.horsepower + ' HP' },
                    { label: '0–60 mph', value: vehicle.specs.acceleration },
                    { label: 'Top Speed', value: vehicle.specs.topSpeed },
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
                  <h2 className="text-2xl font-bold text-white mb-4">{vehicle.model}</h2>
                  <p className="text-gray-400 text-sm mb-4">{vehicle.location}</p>

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
                      <span className="text-white font-bold">£{vehicle.pricing.weekend}</span>
                    </div>
                  </div>

                  <p className="text-sm text-performance-turquoise font-semibold mb-4">✓ {vehicle.availability}</p>
                </div>

                {/* Booking Widget */}
                <BookingWidget mode="detailed" />

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
