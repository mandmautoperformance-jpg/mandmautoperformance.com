import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import FleetCard from '@/components/FleetCard';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';

interface Vehicle {
  vehicleId: string;
  model: string;
  category: 'luxury' | 'sports' | 'supercar' | 'exotic';
  image: string;
  specs: { horsepower: number; acceleration: string; topSpeed: number; transmission: string };
  pricing: { daily: number; hourly: number };
  availability: boolean;
  features: string[];
  location?: string;
  rating?: number;
}

const ALL_VEHICLES: Vehicle[] = [
  {
    vehicleId: 'lambo-huracan',
    model: 'Lamborghini Huracán',
    category: 'supercar',
    image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=400&fit=crop',
    specs: { horsepower: 657, acceleration: '2.9s', topSpeed: 217, transmission: 'Automatic' },
    pricing: { daily: 1500, hourly: 200 },
    availability: true,
    features: ['GPS Navigation', 'Premium Sound', 'Leather Seats', 'Climate Control'],
    location: 'Mayfair, London',
    rating: 4.9,
  },
  {
    vehicleId: 'ferrari-f8',
    model: 'Ferrari F8 Tributo',
    category: 'supercar',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop',
    specs: { horsepower: 710, acceleration: '2.9s', topSpeed: 211, transmission: 'Automatic' },
    pricing: { daily: 1800, hourly: 250 },
    availability: true,
    features: ['Carbon Fiber', 'Sport Package', 'Premium Audio', 'Daytona Seats'],
    location: 'St Albans, Herts',
    rating: 5.0,
  },
  {
    vehicleId: 'porsche-911',
    model: 'Porsche 911 Turbo S',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=400&fit=crop',
    specs: { horsepower: 640, acceleration: '2.7s', topSpeed: 211, transmission: 'Automatic' },
    pricing: { daily: 800, hourly: 120 },
    availability: true,
    features: ['Night Vision', 'Adaptive Suspension', 'Premium Interior', 'Paddle Shifters'],
    location: 'Watford, Herts',
    rating: 4.8,
  },
  {
    vehicleId: 'bentley-continental',
    model: 'Bentley Continental GT',
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop',
    specs: { horsepower: 626, acceleration: '3.6s', topSpeed: 198, transmission: 'Automatic' },
    pricing: { daily: 600, hourly: 100 },
    availability: false,
    features: ['Leather Interiors', 'Heated Seats', 'WiFi', 'Premium Bar'],
    location: 'Mayfair, London',
    rating: 4.7,
  },
  {
    vehicleId: 'rolls-ghost',
    model: 'Rolls-Royce Ghost',
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&h=400&fit=crop',
    specs: { horsepower: 563, acceleration: '4.6s', topSpeed: 155, transmission: 'Automatic' },
    pricing: { daily: 1200, hourly: 180 },
    availability: true,
    features: ['Starlight Headliner', 'Bespoke Audio', 'Champagne Cooler', 'Massage Seats'],
    location: 'Mayfair, London',
    rating: 5.0,
  },
  {
    vehicleId: 'aston-db12',
    model: 'Aston Martin DB12',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop',
    specs: { horsepower: 671, acceleration: '3.6s', topSpeed: 202, transmission: 'Automatic' },
    pricing: { daily: 950, hourly: 140 },
    availability: true,
    features: ['Sport Plus', 'Bang & Olufsen Audio', 'Alcantara Interior', 'Launch Control'],
    location: 'St Albans, Herts',
    rating: 4.9,
  },
  {
    vehicleId: 'lambo-revuelto',
    model: 'Lamborghini Revuelto',
    category: 'exotic',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop',
    specs: { horsepower: 1001, acceleration: '2.5s', topSpeed: 217, transmission: 'Automatic' },
    pricing: { daily: 2200, hourly: 350 },
    availability: true,
    features: ['Hybrid V12', 'Carbon Chassis', 'ALA System', 'Track Mode'],
    location: 'Mayfair, London',
    rating: 5.0,
  },
  {
    vehicleId: 'tesla-plaid',
    model: 'Tesla Model S Plaid',
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop',
    specs: { horsepower: 1020, acceleration: '1.99s', topSpeed: 200, transmission: 'Automatic' },
    pricing: { daily: 350, hourly: 60 },
    availability: true,
    features: ['Autopilot', '17" Touchscreen', 'HEPA Filter', 'Gaming Mode'],
    location: 'Watford, Herts',
    rating: 4.6,
  },
  {
    vehicleId: 'range-rover-sport',
    model: 'Range Rover Sport',
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop',
    specs: { horsepower: 523, acceleration: '4.3s', topSpeed: 162, transmission: 'Automatic' },
    pricing: { daily: 400, hourly: 70 },
    availability: true,
    features: ['Terrain Response', 'Meridian Audio', 'Air Suspension', 'Panoramic Roof'],
    location: 'Hemel Hempstead',
    rating: 4.7,
  },
  {
    vehicleId: 'mercedes-amg',
    model: 'Mercedes-AMG GT 63S',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop',
    specs: { horsepower: 630, acceleration: '3.2s', topSpeed: 196, transmission: 'Automatic' },
    pricing: { daily: 700, hourly: 110 },
    availability: false,
    features: ['AMG Track Pace', 'Burmester Audio', 'Carbon Package', 'Performance Exhaust'],
    location: 'St Albans, Herts',
    rating: 4.8,
  },
];

const CATEGORIES = ['all', 'luxury', 'sports', 'supercar', 'exotic'] as const;

export default function FleetPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = ALL_VEHICLES.filter((v) => {
    if (search && !v.model.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'all' && v.category !== category) return false;
    if (v.pricing.daily > maxPrice) return false;
    if (showAvailableOnly && !v.availability) return false;
    return true;
  });

  return (
    <>
      <Head>
        <title>Our Fleet | M&M Auto Performance</title>
        <meta name="description" content="Browse our full fleet of luxury supercars and performance vehicles available to hire across Hertfordshire and London." />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar isLoggedIn={false} userRole="guest" currentPage="fleet" />

        {/* Header */}
        <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold text-white mb-4">Our Fleet</h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {ALL_VEHICLES.length} elite vehicles available across London & Hertfordshire
              </p>
            </div>

            {/* Search + Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-5 py-3 border border-performance-turquoise/30 rounded-lg text-performance-turquoise hover:bg-performance-turquoise/10 transition-all"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Category */}
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-3">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                          category === cat
                            ? 'bg-performance-turquoise text-performance-grey'
                            : 'border border-performance-turquoise/30 text-gray-400 hover:border-performance-turquoise'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-3">
                    Max Price: <span className="text-performance-turquoise">£{maxPrice}/day</span>
                  </p>
                  <input
                    type="range"
                    min={100}
                    max={2500}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-performance-turquoise"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>£100</span><span>£2,500</span>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-3">Availability</p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        showAvailableOnly ? 'bg-performance-turquoise' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showAvailableOnly ? 'left-7' : 'left-1'}`} />
                    </div>
                    <span className="text-gray-300 text-sm">Available only</span>
                  </label>
                </div>
              </div>
            )}

            {/* Category Pills (quick filter) */}
            <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                    category === cat
                      ? 'bg-performance-turquoise text-performance-grey'
                      : 'border border-performance-turquoise/30 text-gray-400 hover:border-performance-turquoise hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Vehicles' : cat}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-gray-400 text-sm mb-6">
              Showing <span className="text-performance-turquoise font-bold">{filtered.length}</span> vehicles
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((vehicle) => (
                  <FleetCard key={vehicle.vehicleId} {...vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">🏎️</p>
                <p className="text-white font-bold text-xl mb-2">No vehicles match your filters</p>
                <p className="text-gray-400">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearch(''); setCategory('all'); setMaxPrice(2500); setShowAvailableOnly(false); }}
                  className="mt-6 px-6 py-3 bg-performance-turquoise text-performance-grey font-bold rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-performance-turquoise/20 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            © 2026 M&M Auto Performance. Part of the RichHabits Ecosystem.
          </div>
        </footer>
      </main>
    </>
  );
}
