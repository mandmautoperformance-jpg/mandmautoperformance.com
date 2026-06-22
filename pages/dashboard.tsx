import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Car, Calendar, Star, Award, TrendingUp, Clock, ChevronRight, Zap } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowser();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUser(session.user);

      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setBookings(data || []);
      setLoading(false);
    }
    load();
  }, [router]);

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Driver';

  const statCards = [
    { icon: <Car size={22} className="text-performance-turquoise" />, label: 'Total Bookings', value: bookings.length.toString(), sub: 'All time' },
    { icon: <Star size={22} className="text-yellow-400" />, label: 'Habit Score', value: '750', sub: 'Silver tier' },
    { icon: <Award size={22} className="text-performance-babyblue" />, label: 'M&M Credits', value: '£24.50', sub: 'Redeemable' },
    { icon: <TrendingUp size={22} className="text-green-400" />, label: 'Savings', value: '£120', sub: 'This year' },
  ];

  const statusColors: Record<string, string> = {
    pending_verification: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    confirmed: 'text-green-400 bg-green-400/10 border-green-400/30',
    active: 'text-performance-turquoise bg-performance-turquoise/10 border-performance-turquoise/30',
    completed: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-performance-grey flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-performance-turquoise/30 border-t-performance-turquoise rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Dashboard | M&M Auto Performance</title>
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar isLoggedIn={true} userRole="user" currentPage="dashboard" />

        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">

            {/* Welcome */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, <span className="text-performance-turquoise">{firstName}</span> 👋
              </h1>
              <p className="text-gray-400">Your M&M performance dashboard</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {statCards.map((card, i) => (
                <div key={i} className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-5 hover:border-performance-turquoise/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    {card.icon}
                    <span className="text-xs text-gray-500">{card.sub}</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
                  <div className="text-sm text-gray-400">{card.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Bookings */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
                  <Link href="/fleet" className="text-performance-turquoise text-sm hover:underline">Book new →</Link>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-10 text-center">
                    <Car size={40} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-white font-bold mb-2">No bookings yet</p>
                    <p className="text-gray-400 text-sm mb-6">Browse our fleet and book your first experience</p>
                    <Link href="/fleet" className="inline-block px-6 py-3 bg-performance-turquoise text-performance-grey font-bold rounded-lg">
                      Browse Fleet
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-5 flex items-center justify-between hover:border-performance-turquoise/40 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-performance-turquoise/10 rounded-lg flex items-center justify-center">
                            <Car size={20} className="text-performance-turquoise" />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm">{booking.vehicle_id}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Calendar size={12} /> {booking.pickup_date} → {booking.return_date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {booking.total_cost_pence && (
                            <span className="text-performance-turquoise font-bold text-sm">
                              £{(booking.total_cost_pence / 100).toFixed(0)}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded border capitalize ${statusColors[booking.status] || 'text-gray-400 bg-gray-400/10 border-gray-400/30'}`}>
                            {booking.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Panel */}
              <div className="space-y-5">

                {/* Quick Book */}
                <div className="bg-gradient-to-br from-performance-turquoise/20 to-performance-babyblue/10 border border-performance-turquoise/30 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Zap size={18} className="text-performance-turquoise" /> Quick Book
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">Browse our full fleet and book instantly</p>
                  <Link href="/fleet" className="block w-full py-2.5 bg-performance-turquoise text-performance-grey font-bold rounded-lg text-center text-sm hover:bg-performance-turquoise/90 transition-all">
                    Browse Fleet
                  </Link>
                </div>

                {/* Habit Score */}
                <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4">Habit Score</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Silver Tier</span>
                    <span className="text-performance-turquoise font-bold">750 / 1000</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-performance-turquoise to-performance-babyblue rounded-full" style={{ width: '75%' }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">250 points to Platinum tier</p>
                  <div className="mt-4 pt-4 border-t border-performance-turquoise/20">
                    <p className="text-xs text-gray-400">🏆 Next reward at 1,000 points</p>
                    <p className="text-xs text-gray-400 mt-1">⭐ Earn points by completing bookings on time</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4">Activity</h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { text: 'Account created', time: 'Just now', icon: '✓' },
                      { text: 'MIA Concierge active', time: '24/7', icon: '🤖' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-400">
                        <span className="text-base">{item.icon}</span>
                        <span className="flex-1">{item.text}</span>
                        <span className="text-xs text-gray-600">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
