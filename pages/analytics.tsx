import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { TrendingUp, Users, Eye, MousePointerClick, Calendar, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    // Simulated analytics data
    const data = {
      '7d': {
        pageViews: 3421,
        uniqueVisitors: 1240,
        bookings: 34,
        conversionRate: 2.7,
        avgSessionDuration: '4m 32s',
        bounceRate: 28,
      },
      '30d': {
        pageViews: 14230,
        uniqueVisitors: 4890,
        bookings: 156,
        conversionRate: 3.2,
        avgSessionDuration: '5m 18s',
        bounceRate: 32,
      },
      '90d': {
        pageViews: 48920,
        uniqueVisitors: 14560,
        bookings: 487,
        conversionRate: 3.3,
        avgSessionDuration: '5m 45s',
        bounceRate: 35,
      },
    };

    setStats(data[timeframe as keyof typeof data]);
  }, [timeframe]);

  if (!stats) return null;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Analytics | M&M Auto Performance</title>
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar isLoggedIn={false} userRole="guest" currentPage="analytics" />

        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-gray-400">Track booking performance & user behavior</p>
              </div>
              <div className="flex gap-2">
                {['7d', '30d', '90d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      timeframe === period
                        ? 'bg-performance-turquoise text-performance-grey'
                        : 'border border-performance-turquoise/30 text-gray-400 hover:border-performance-turquoise'
                    }`}
                  >
                    {period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : 'Last 90 days'}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {[
                { icon: <Eye size={22} className="text-performance-turquoise" />, label: 'Page Views', value: stats.pageViews.toLocaleString() },
                { icon: <Users size={22} className="text-performance-babyblue" />, label: 'Unique Visitors', value: stats.uniqueVisitors.toLocaleString() },
                { icon: <MousePointerClick size={22} className="text-green-400" />, label: 'Bookings', value: stats.bookings },
                { icon: <TrendingUp size={22} className="text-yellow-400" />, label: 'Conversion Rate', value: stats.conversionRate + '%' },
                { icon: <Calendar size={22} className="text-purple-400" />, label: 'Avg Session', value: stats.avgSessionDuration },
                { icon: <Zap size={22} className="text-red-400" />, label: 'Bounce Rate', value: stats.bounceRate + '%' },
              ].map((card, i) => (
                <div key={i} className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-5 hover:border-performance-turquoise/40 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm">{card.label}</p>
                    {card.icon}
                  </div>
                  <p className="text-white text-2xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Traffic by Page */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {[
                    { page: '/', views: 1240, percentage: 36 },
                    { page: '/fleet', views: 890, percentage: 26 },
                    { page: '/booking', views: 620, percentage: 18 },
                    { page: '/about', views: 420, percentage: 12 },
                    { page: '/contact', views: 251, percentage: 8 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <p className="text-gray-300 text-sm font-medium">{item.page}</p>
                        <span className="text-performance-turquoise text-sm">{item.views.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-performance-turquoise to-performance-babyblue rounded-full" style={{ width: item.percentage + '%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Traffic Sources</h3>
                <div className="space-y-3">
                  {[
                    { source: 'Direct', visits: 1560, percentage: 46 },
                    { source: 'Google Search', visits: 980, percentage: 29 },
                    { source: 'Social Media', visits: 520, percentage: 15 },
                    { source: 'Referral', visits: 240, percentage: 7 },
                    { source: 'Email', visits: 121, percentage: 3 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <p className="text-gray-300 text-sm font-medium">{item.source}</p>
                        <span className="text-performance-turquoise text-sm">{item.visits.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-performance-turquoise to-performance-babyblue rounded-full" style={{ width: item.percentage + '%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Funnel */}
            <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Booking Funnel</h3>
              <div className="space-y-4">
                {[
                  { step: 'Visited Fleet', count: 3421, percentage: 100 },
                  { step: 'Viewed Vehicle', count: 1240, percentage: 36 },
                  { step: 'Started Booking', count: 456, percentage: 13 },
                  { step: 'Completed Booking', count: 156, percentage: 4.6 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-300 font-medium text-sm">{item.step}</p>
                      <span className="text-performance-turquoise text-sm font-bold">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-performance-turquoise to-performance-babyblue rounded-full" style={{ width: item.percentage + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
