import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import FleetCard from '@/components/FleetCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { VEHICLES as ALL_VEHICLES, MAKES, CATEGORY_LABELS, type VehicleCategory } from '@/lib/vehicles';

const CATEGORIES: (VehicleCategory | 'all')[] = ['all', 'exotic', 'supercar', 'sports', 'luxury', 'suv', 'executive'];
const PAGE_SIZE = 24;

// Branded gold-fleet hero, served locally from public/ — fetched directly by the
// browser as a plain CSS background, so it always displays.
const FLEET_HERO = '/gold-fleet-london.jpg';

export default function FleetPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [make, setMake] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () =>
      ALL_VEHICLES.filter((v) => {
        if (search) {
          const q = search.toLowerCase();
          if (!v.model.toLowerCase().includes(q) && !v.color.toLowerCase().includes(q) && !v.make.toLowerCase().includes(q)) {
            return false;
          }
        }
        if (category !== 'all' && v.category !== category) return false;
        if (make !== 'all' && v.make !== make) return false;
        if (v.pricing.daily > maxPrice) return false;
        if (showAvailableOnly && !v.availability) return false;
        return true;
      }),
    [search, category, make, maxPrice, showAvailableOnly],
  );

  // Pre-select category from URL query param (e.g. /fleet?cat=exotic)
  useEffect(() => {
    const { cat } = router.query;
    if (cat && CATEGORIES.includes(cat as VehicleCategory)) {
      setCategory(cat as string);
    }
  }, [router.query]);

  // Reset how many cards are shown whenever the filters change.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, category, make, maxPrice, showAvailableOnly]);

  const shown = filtered.slice(0, visible);

  return (
    <>
      <Head>
        <title>Our Fleet | M&M Auto Performance</title>
        <meta name="description" content="Browse our full fleet of luxury, supercar, exotic, sports and executive vehicles available to hire across Hertfordshire and London." />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar isLoggedIn={false} userRole="guest" currentPage="fleet" />

        {/* ── Cinematic Gold Fleet Hero ── */}
        <section
          style={{
            width: '100%',
            height: '100vh',
            backgroundImage: `url("${FLEET_HERO}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
          }}
        >
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
          {/* Bottom fade into page background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, #121316 0%, transparent 45%)',
            }}
          />
          {/* Hero copy — anchored to the bottom, same pattern as the About hero */}
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-12 px-6">
            <p className="text-performance-turquoise text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
              London &amp; Hertfordshire
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-bold text-white mb-6 leading-[1.05] tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)]">
              The{' '}
              <span className="bg-gradient-to-r from-performance-turquoise to-performance-babyblue bg-clip-text text-transparent">
                Gold Standard
              </span>{' '}
              Fleet
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              {ALL_VEHICLES.length} individually curated supercars, luxury saloons and prestige SUVs —
              ready to drive across London &amp; Hertfordshire.
            </p>
          </div>
        </section>

        {/* Header */}
        <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-12 border-t border-performance-turquoise/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">The Collection</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {ALL_VEHICLES.length} individually curated vehicles — supercars, luxury saloons, prestige SUVs &amp; more
              </p>
            </div>

            {/* Search + Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by model, make or colour…"
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
              <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        {cat === 'all' ? 'All' : CATEGORY_LABELS[cat as VehicleCategory]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Make */}
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-3">Make</p>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3 py-2 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white text-sm focus:outline-none focus:border-performance-turquoise"
                  >
                    <option value="all" className="bg-performance-grey">All makes</option>
                    {MAKES.map((m) => (
                      <option key={m} value={m} className="bg-performance-grey">{m}</option>
                    ))}
                  </select>
                </div>

                {/* Max Price */}
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-3">
                    Max Price: <span className="text-performance-turquoise">£{maxPrice}/day</span>
                  </p>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-performance-turquoise"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>£100</span><span>£5,000</span>
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
                  {cat === 'all' ? 'All Vehicles' : CATEGORY_LABELS[cat as VehicleCategory]}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-gray-400 text-sm mb-6">
              Showing <span className="text-performance-turquoise font-bold">{Math.min(visible, filtered.length)}</span> of{' '}
              <span className="text-performance-turquoise font-bold">{filtered.length}</span> vehicles
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {shown.map((vehicle) => (
                    <FleetCard key={vehicle.vehicleId} {...vehicle} />
                  ))}
                </div>

                {visible < filtered.length && (
                  <div className="text-center mt-12">
                    <button
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      className="px-8 py-3 bg-performance-turquoise text-performance-grey font-bold rounded-lg hover:bg-performance-turquoise/90 transition-all"
                    >
                      Load more vehicles
                    </button>
                    <p className="text-gray-500 text-xs mt-3">
                      {filtered.length - visible} more to explore
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">🏎️</p>
                <p className="text-white font-bold text-xl mb-2">No vehicles match your filters</p>
                <p className="text-gray-400">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearch(''); setCategory('all'); setMake('all'); setMaxPrice(5000); setShowAvailableOnly(false); }}
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
