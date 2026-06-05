/**
 * AdminGodMode.tsx
 *
 * The owner's command center. Control everything from one place:
 * - MIA personality and behavior settings
 * - Financial reporting (HMRC-compliant Annual Returns)
 * - Asset generation (business cards, letterheads)
 * - API key management
 * - Analytics and fleet metrics
 *
 * This is the weaponized business control panel.
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  DollarSign,
  Zap,
  Key,
  FileText,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';

interface MIAConfig {
  personality: 'Sales' | 'Support' | 'Balanced';
  aggressiveness: number; // 1-10
  responseTime: number; // ms
  autoApproveDocuments: boolean;
  enableCrypto: boolean;
}

interface APIKey {
  name: string;
  key: string;
  masked: string;
  status: 'active' | 'inactive';
  lastUsed: string;
}

interface AdminTab {
  id: 'mia' | 'financials' | 'assets' | 'api' | 'analytics';
  label: string;
  icon: React.ReactNode;
}

const AdminGodMode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mia' | 'financials' | 'assets' | 'api' | 'analytics'>('mia');
  const [miaConfig, setMiaConfig] = useState<MIAConfig>({
    personality: 'Balanced',
    aggressiveness: 6,
    responseTime: 450,
    autoApproveDocuments: false,
    enableCrypto: true,
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const tabs: AdminTab[] = [
    { id: 'mia', label: 'MIA Control', icon: <Zap size={20} /> },
    { id: 'financials', label: 'Financials', icon: <DollarSign size={20} /> },
    { id: 'assets', label: 'Asset Gen', icon: <FileText size={20} /> },
    { id: 'api', label: 'API Hub', icon: <Key size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  ];

  const apiKeys: APIKey[] = [
    {
      name: 'Gemini API',
      key: 'AIzaSyDxZahYz_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      masked: 'AIzaSy••••••••••••••••••••••••••••••',
      status: 'active',
      lastUsed: '2 minutes ago',
    },
    {
      name: 'Google Maps',
      key: 'AIzaSyB_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      masked: 'AIzaSyB•••••••••••••••••••••••••••',
      status: 'active',
      lastUsed: '5 minutes ago',
    },
    {
      name: 'SendGrid',
      key: 'SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      masked: 'SG.•••••••••••••••••••••••',
      status: 'active',
      lastUsed: '1 hour ago',
    },
    {
      name: 'Groq API',
      key: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxx',
      masked: 'gsk_•••••••••••••••••••',
      status: 'inactive',
      lastUsed: 'Never',
    },
  ];

  const handleCopyKey = (keyName: string, keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Settings size={28} className="text-turquoise" />
              Admin God Mode
            </h1>
            <p className="text-slate-400 text-sm mt-1">Owner command center — Control MIA, finances, and everything</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-semibold">System Live</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-700/50 px-6">
          <div className="flex gap-2 overflow-x-auto pb-4 pt-4 scroll-smooth">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-turquoise/20 to-cyan/10 text-turquoise border border-turquoise/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* MIA Control Panel */}
        {activeTab === 'mia' && <MIAControlPanel config={miaConfig} setConfig={setMiaConfig} />}

        {/* Financials Dashboard */}
        {activeTab === 'financials' && <FinancialsDashboard />}

        {/* Asset Generator */}
        {activeTab === 'assets' && <AssetGenerator />}

        {/* API Hub */}
        {activeTab === 'api' && <APIHub keys={apiKeys} onCopyKey={handleCopyKey} copiedKey={copiedKey} />}

        {/* Analytics */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>
    </div>
  );
};

/* ============================================================================
 * Tab Components
 * ============================================================================ */

const MIAControlPanel: React.FC<{
  config: MIAConfig;
  setConfig: (config: MIAConfig) => void;
}> = ({ config, setConfig }) => {
  const [saved, setSaved] = React.useState(false);

  const handleSave = async () => {
    try {
      await fetch('/api/admin/mia-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Config save is non-fatal in this context
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">MIA Personality Control</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personality Setting */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <h3 className="font-semibold text-white mb-6">Primary Personality</h3>

          <div className="space-y-3 mb-6">
            {(['Sales', 'Support', 'Balanced'] as const).map((mode) => (
              <label
                key={mode}
                className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all border border-slate-600/50"
              >
                <input
                  type="radio"
                  name="personality"
                  value={mode}
                  checked={config.personality === mode}
                  onChange={(e) => setConfig({ ...config, personality: e.target.value as MIAConfig['personality'] })}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-white">{mode}</p>
                  <p className="text-xs text-slate-400">
                    {mode === 'Sales' && 'Aggressive upselling, unlock elite cars immediately'}
                    {mode === 'Support' && 'Empathetic, help-focused, document verification priority'}
                    {mode === 'Balanced' && 'Professional, conversational, balanced approach'}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="bg-turquoise/10 border border-turquoise/30 rounded-lg p-4">
            <p className="text-sm text-slate-200">
              <span className="font-semibold">Current Mode:</span> {config.personality} personality active on all new conversations.
            </p>
          </div>
        </div>

        {/* Aggressiveness Slider */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <h3 className="font-semibold text-white mb-6">Aggressiveness Level</h3>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-slate-400 text-sm">Conversational</p>
              <span className="text-2xl font-bold text-turquoise">{config.aggressiveness}/10</span>
              <p className="text-slate-400 text-sm">Hard Sell</p>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={config.aggressiveness}
              onChange={(e) => setConfig({ ...config, aggressiveness: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-turquoise"
            />
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <p className="text-xs text-slate-300">
              {config.aggressiveness <= 3 && '🎯 Friendly, low-pressure approach. Good for nurturing leads.'}
              {config.aggressiveness > 3 && config.aggressiveness <= 6 && '⚡ Balanced — recommend bookings but no pressure.'}
              {config.aggressiveness > 6 && '🚀 High energy — pushes upgrades and premium vehicles hard.'}
            </p>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <h3 className="font-semibold text-white mb-6">Response Time</h3>

          <div className="mb-6">
            <label className="block text-sm text-slate-400 mb-3">Target response latency (milliseconds)</label>
            <input
              type="number"
              value={config.responseTime}
              onChange={(e) => setConfig({ ...config, responseTime: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-turquoise/50 outline-none"
            />
          </div>

          <div className="text-xs text-slate-400">
            <p className="mb-2">⚡ Current setting: {config.responseTime}ms (Human-like speed)</p>
            <p>Lower = faster (may feel robotic)</p>
            <p>Higher = slower (feels more thoughtful)</p>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <h3 className="font-semibold text-white mb-6">Advanced Features</h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all">
              <input
                type="checkbox"
                checked={config.autoApproveDocuments}
                onChange={(e) => setConfig({ ...config, autoApproveDocuments: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-slate-300">Auto-approve documents (OCR confidence &gt; 95%)</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all">
              <input
                type="checkbox"
                checked={config.enableCrypto}
                onChange={(e) => setConfig({ ...config, enableCrypto: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-slate-300">Enable crypto payment options</span>
            </label>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-turquoise to-cyan text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-turquoise/30 transition-all duration-300"
          >
            {saved ? '✓ Saved' : 'Save MIA Config'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FinancialsDashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Financial Reports & HMRC Compliance</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Revenue" value="£45,230" change="+23%" color="from-green-500 to-emerald-600" />
        <StatCard label="Active Bookings" value="127" change="+15" color="from-blue-500 to-cyan-600" />
        <StatCard label="Fleet Utilization" value="84%" change="+7%" color="from-purple-500 to-pink-600" />
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <h3 className="font-semibold text-white mb-6">Annual Returns Generator (HMRC-Compliant)</h3>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <p className="text-sm text-slate-300 mb-2">📊 Generate Auto-Calculated Annual Returns</p>
            <p className="text-xs text-slate-400">Pulls booking data, calculates revenue, expenses, generates CSV/PDF for accountant submission</p>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <p className="text-sm text-slate-300 mb-2">✅ Tax Deductions Identified</p>
            <p className="text-xs text-slate-400">Automatically detects eligible vehicle maintenance, insurance, fuel costs</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-turquoise to-cyan text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-turquoise/30 transition-all">
            Generate 2024 Annual Return
          </button>
          <button className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-semibold rounded-lg transition-all">
            Download PDF
          </button>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <h3 className="font-semibold text-white mb-6">Monthly Revenue Breakdown</h3>

        <div className="space-y-2">
          {[
            { month: 'January', revenue: '£2,340', bookings: 8 },
            { month: 'February', revenue: '£3,120', bookings: 11 },
            { month: 'March', revenue: '£4,890', bookings: 15 },
          ].map((row, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div className="flex-1">
                <p className="font-semibold text-white">{row.month}</p>
                <p className="text-xs text-slate-400">{row.bookings} bookings</p>
              </div>
              <p className="text-lg font-bold text-turquoise">{row.revenue}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const AssetGenerator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Auto-Generate Business Assets</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AssetCard
          title="Business Cards"
          description="Auto-generated from fleet data & branding"
          icon="📇"
          cta="Generate & Download"
        />
        <AssetCard
          title="Letterheads"
          description="PDF templates with live fleet pricing"
          icon="📄"
          cta="Generate & Download"
        />
        <AssetCard
          title="Social Media Templates"
          description="Instagram, Twitter, LinkedIn posts auto-formatted"
          icon="📱"
          cta="Generate & Download"
        />
        <AssetCard
          title="Invoice Templates"
          description="Branded invoices with auto-calculated M&M Credits"
          icon="💰"
          cta="Generate & Download"
        />
      </div>
    </motion.div>
  );
};

const APIHub: React.FC<{
  keys: APIKey[];
  onCopyKey: (name: string, key: string) => void;
  copiedKey: string | null;
}> = ({ keys, onCopyKey, copiedKey }) => {
  const [showKeys, setShowKeys] = React.useState<Record<string, boolean>>({});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">API Key Management</h2>

      <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 flex gap-3">
        <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-300 text-sm">
          Keep your API keys secure. Never share them in version control or public repositories.
        </p>
      </div>

      <div className="space-y-4">
        {keys.map((apiKey, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-lg p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{apiKey.name}</h3>
                <p className="text-xs text-slate-400">Last used: {apiKey.lastUsed}</p>
              </div>
              <div
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  apiKey.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {apiKey.status}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 px-4 py-2 bg-slate-700/50 rounded border border-slate-600/50 text-slate-300 text-sm font-mono">
                {showKeys[apiKey.name] ? apiKey.key : apiKey.masked}
              </div>
              <button
                onClick={() => setShowKeys({ ...showKeys, [apiKey.name]: !showKeys[apiKey.name] })}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded border border-slate-600/50 transition-all"
              >
                {showKeys[apiKey.name] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button
                onClick={() => onCopyKey(apiKey.name, apiKey.key)}
                className="px-4 py-2 bg-turquoise/20 hover:bg-turquoise/30 text-turquoise rounded border border-turquoise/30 transition-all"
              >
                {copiedKey === apiKey.name ? <CheckCircle size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full px-6 py-3 bg-gradient-to-r from-turquoise to-cyan text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-turquoise/30 transition-all">
        + Add New API Key
      </button>
    </motion.div>
  );
};

const AnalyticsDashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Real-Time Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Users" value="1,247" trend="+12%" />
        <MetricCard label="Daily Bookings" value="23" trend="+8%" />
        <MetricCard label="Avg Session" value="8m 34s" trend="-2%" />
        <MetricCard label="Conversion Rate" value="12.4%" trend="+3%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Bookings by Vehicle Type" />
        <ChartCard title="Revenue Trend (30 days)" />
        <ChartCard title="User Acquisition" />
        <ChartCard title="Top Locations" />
      </div>
    </motion.div>
  );
};

/* ============================================================================
 * Shared Mini Components
 * ============================================================================ */

const StatCard: React.FC<{
  label: string;
  value: string;
  change: string;
  color: string;
}> = ({ label, value, change, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-lg p-6 border border-opacity-20 border-white/20 shadow-lg`}>
    <p className="text-white/80 text-sm mb-2">{label}</p>
    <p className="text-3xl font-bold text-white mb-2">{value}</p>
    <p className="text-xs text-white/70">{change} from last month</p>
  </div>
);

const AssetCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  cta: string;
}> = ({ title, description, icon, cta }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-lg p-6 border border-slate-700/50 hover:border-turquoise/30 transition-all group cursor-pointer">
    <p className="text-4xl mb-4">{icon}</p>
    <h3 className="font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 mb-4">{description}</p>
    <button className="w-full px-4 py-2 bg-turquoise/20 group-hover:bg-turquoise/30 text-turquoise rounded text-sm font-semibold transition-all">
      {cta}
    </button>
  </div>
);

const MetricCard: React.FC<{ label: string; value: string; trend: string }> = ({
  label,
  value,
  trend,
}) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-lg p-4 border border-slate-700/50">
    <p className="text-slate-400 text-xs mb-2">{label}</p>
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <p className={`text-xs ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{trend}</p>
  </div>
);

const ChartCard: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-lg p-6 border border-slate-700/50 min-h-64 flex items-center justify-center">
    <div className="text-center">
      <p className="text-slate-400 text-sm mb-4">{title}</p>
      <div className="w-full h-32 bg-slate-700/30 rounded flex items-center justify-center">
        <p className="text-slate-500 text-xs">[Chart Placeholder]</p>
      </div>
    </div>
  </div>
);

export default AdminGodMode;
