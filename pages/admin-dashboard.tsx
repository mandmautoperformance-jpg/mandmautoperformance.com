import React, { useState } from 'react';
import AdminAPIConfiguration from '@/components/AdminAPIConfiguration';
import LeadScraperAndMarketing from '@/components/LeadScraperAndMarketing';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'api-config' | 'marketing' | 'analytics'
  >('overview');

  const sections = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'api-config', label: '🔧 API Configuration', icon: '🔧' },
    { id: 'marketing', label: '🎯 Growth & Marketing', icon: '🎯' },
    { id: 'analytics', label: '📈 Analytics', icon: '📈' },
  ];

  return (
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
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <StatCard title="Active Users" value="1,234" trend="+12% this week" />
              <StatCard title="Total Bookings" value="567" trend="+23% this month" />
              <StatCard title="Revenue" value="£24,580" trend="+34% MoM" />
              <StatCard title="Avg Rating" value="4.8/5" trend="⭐ Excellent" />
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
                  <StatusLine label="Database" status="✓ Online" color="green" />
                  <StatusLine label="APIs Active" status="5/5 configured" color="green" />
                  <StatusLine label="OAuth Providers" status="3/3 active" color="green" />
                  <StatusLine label="Email Service" status="✓ Operational" color="green" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Configuration Section */}
        {activeSection === 'api-config' && <AdminAPIConfiguration />}

        {/* Growth & Marketing Section */}
        {activeSection === 'marketing' && <LeadScraperAndMarketing />}

        {/* Analytics Section (Placeholder) */}
        {activeSection === 'analytics' && (
          <div className="rounded-xl bg-gradient-to-br from-gunmetal to-dark-gunmetal border border-electric-turquoise/30 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">📈 Analytics Dashboard</h3>
            <div className="bg-dark-gunmetal/50 rounded-lg p-8 border border-gray-500/20 text-center">
              <p className="text-gray-400">Advanced analytics coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">
                Tracks user behavior, revenue trends, fleet utilization, driver performance
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend }) => (
  <div className="rounded-lg bg-gradient-to-br from-electric-turquoise/10 to-baby-blue/10 border border-electric-turquoise/30 p-4">
    <p className="text-gray-400 text-sm mb-2">{title}</p>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-xs text-gray-500">{trend}</p>
  </div>
);

interface ActionButtonProps {
  label: string;
  href: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, href }) => (
  <a
    href={href}
    className="block px-4 py-2 rounded-lg bg-dark-gunmetal/50 border border-gray-500/20 text-gray-400 hover:border-electric-turquoise/40 hover:text-electric-turquoise transition"
  >
    {label} →
  </a>
);

interface StatusLineProps {
  label: string;
  status: string;
  color: 'green' | 'yellow' | 'red';
}

const StatusLine: React.FC<StatusLineProps> = ({ label, status, color }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-500/10 last:border-0">
    <span className="text-gray-400">{label}</span>
    <span
      className={`font-semibold ${
        color === 'green'
          ? 'text-green-400'
          : color === 'yellow'
            ? 'text-yellow-400'
            : 'text-red-400'
      }`}
    >
      {status}
    </span>
  </div>
);

export default AdminDashboard;
