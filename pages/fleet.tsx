import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import FleetCard from '@/components/FleetCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { VEHICLES as ALL_VEHICLES } from '@/lib/vehicles';

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
