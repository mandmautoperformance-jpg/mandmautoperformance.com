import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminAPIConfiguration from '@/components/AdminAPIConfiguration';
import LeadScraperAndMarketing from '@/components/LeadScraperAndMarketing';
import { createClient } from '@supabase/supabase-js';

interface AdminStats {
  users: number;
  revenue: string;
  activeBookings: number;
  fleetUtilization: number;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<
    'overview' | 'api-config' | 'marketing' | 'analytics'
  >('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setAuthChecked(true);

      try {
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Stats fetch is non-fatal
      }
    }
    checkAuth();
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gunmetal via-dark-gunmetal to-gunmetal flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-electric-turquoise border-t-transparent rounded-full" />
      </div>
    );
  }

  const sections = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'api-config', label: '🔧 API Configuration', icon: '🔧' },
    { id: 'marketing', label: '🎯 Growth & Marketing', icon: '🎯' },
    { id: 'analytics', label: '📈 Analytics', icon: '📈' },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard | M&M Auto Performance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gunmetal via-dark-gunmetal to-gunmetal">
        {/* Header */}
        <div className="bg-gradient-to-r from-electric-turquoise/20 to-baby-blue/20 border-b border-electric-turquoise/20 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-turquoise to-baby-blue">
              M&M Admin Control Center
            </h1>
            <p className="text-gray-400 mt-2">Manage everything. Run the entire platform from here.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-500/20 bg-gunmetal/30 backdrop-blur-sm sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as typeof activeSection)}
                  className={`px-6 py-4 font-semibold transition border-b-2 ${
                    activeSection === section.id
                      ? 'border-electric-turquoise text-electric-turquoise'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {section.icon} {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Active Users" value={stats ? String(stats.users) : '—'} trend="from Supabase" />
                <StatCard title="Active Bookings" value={stats ? String(stats.activeBookings) : '—'} trend="confirmed + active" />
                <StatCard title="Revenue" value={stats ? `£${stats.revenue}` : '—'} trend="completed bookings" />
                <StatCard title="Fleet Utilisation" value={stats ? `${stats.fleetUtilization}%` : '—'} trend="vehicles active" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-gradient-to-br from-gunmetal to-dark-gunmetal border border-electric-turquoise/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🚀 Quick Actions</h3>
                  <div className="space-y-3">
                    <ActionButton label="Setup Wizard" href="/setup" />
                    <ActionButton label="View Analytics" href="/analytics" />
                    <ActionButton label="Manage Fleet" href="/fleet" />
                    <ActionButton label="User Settings" href="/settings" />
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-gunmetal to-dark-gunmetal border border-baby-blue/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">📋 System Status</h3>
                  <div className="space-y-3 text-sm">
                    <StatusLine label="Database" status={stats ? '✓ Online' : '…'} color="green" />
                    <StatusLine label="Auth" status="✓ Supabase" color="green" />
                    <StatusLine label="Payments" status="✓ Stripe" color="green" />
                    <StatusLine label="AI Concierge" status="✓ Gemini" color="green" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'api-config' && <AdminAPIConfiguration />}
          {activeSection === 'marketing' && <LeadScraperAndMarketing />}
          {activeSection === 'analytics' && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Analytics dashboard — go to <Link href="/analytics" className="text-electric-turquoise hover:underline">/analytics</Link> for full charts.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const StatCard: React.FC<{ title: string; value: string; trend: string }> = ({ title, value, trend }) => (
  <div className="rounded-xl bg-gradient-to-br from-gunmetal to-dark-gunmetal border border-electric-turquoise/20 p-5">
    <p className="text-gray-400 text-sm mb-1">{title}</p>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-xs text-electric-turquoise">{trend}</p>
  </div>
);

const ActionButton: React.FC<{ label: string; href: string }> = ({ label, href }) => (
  <a
    href={href}
    className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-electric-turquoise/10 border border-electric-turquoise/30 text-white hover:bg-electric-turquoise/20 transition-all"
  >
    <span>{label}</span>
    <span className="text-electric-turquoise">→</span>
  </a>
);

const StatusLine: React.FC<{ label: string; status: string; color: string }> = ({ label, status, color }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-400">{label}</span>
    <span className={color === 'green' ? 'text-green-400' : 'text-red-400'}>{status}</span>
  </div>
);

export default AdminDashboard;
