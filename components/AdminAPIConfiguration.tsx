'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface APIConfig {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'error';
  keys: Record<string, string>;
  description: string;
  docs: string;
  required: boolean;
  icon: string;
}

const AdminAPIConfiguration: React.FC = () => {
  const [apis, setApis] = useState<APIConfig[]>([
    // Core Services
    {
      id: 'supabase',
      name: 'Supabase',
      category: 'Database',
      status: 'inactive',
      keys: {
        url: '',
        anonKey: '',
        serviceRoleKey: '',
      },
      description: 'PostgreSQL Database + Auth + Real-time',
      docs: 'https://supabase.com/docs',
      required: true,
      icon: '🗄️',
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      category: 'AI',
      status: 'inactive',
      keys: {
        apiKey: '',
      },
      description: 'MIA AI Concierge - 12.5M tokens/month free',
      docs: 'https://ai.google.dev/',
      required: true,
      icon: '🤖',
    },
    {
      id: 'googleMaps',
      name: 'Google Maps',
      category: 'Location',
      status: 'inactive',
      keys: {
        apiKey: '',
      },
      description: 'Vehicle location mapping & ULEZ routing',
      docs: 'https://developers.google.com/maps',
      required: true,
      icon: '🗺️',
    },
    {
      id: 'googleVision',
      name: 'Google Vision API',
      category: 'AI',
      status: 'inactive',
      keys: {
        apiKey: '',
      },
      description: 'Document OCR - Driver license & insurance verification',
      docs: 'https://cloud.google.com/vision',
      required: true,
      icon: '📄',
    },

    // OAuth Providers
    {
      id: 'googleOAuth',
      name: 'Google OAuth',
      category: 'Authentication',
      status: 'inactive',
      keys: {
        clientId: '',
        clientSecret: '',
      },
      description: 'One-click signup via Google account',
      docs: 'https://developers.google.com/identity',
      required: false,
      icon: '🔐',
    },
    {
      id: 'appleOAuth',
      name: 'Apple OAuth',
      category: 'Authentication',
      status: 'inactive',
      keys: {
        teamId: '',
        keyId: '',
        bundleId: '',
      },
      description: 'Apple Sign In for iOS users',
      docs: 'https://developer.apple.com/sign-in-with-apple/',
      required: false,
      icon: '🍎',
    },
    {
      id: 'xOAuth',
      name: 'X (Twitter) OAuth',
      category: 'Authentication',
      status: 'inactive',
      keys: {
        clientId: '',
        clientSecret: '',
      },
      description: 'Sign in via X/Twitter account',
      docs: 'https://developer.twitter.com/en/docs/authentication',
      required: false,
      icon: '𝕏',
    },

    // Payments
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'Payments',
      status: 'inactive',
      keys: {
        publishableKey: '',
        secretKey: '',
        webhookSecret: '',
      },
      description: 'Credit card processing & subscription billing',
      docs: 'https://stripe.com/docs',
      required: false,
      icon: '💳',
    },

    // Communications
    {
      id: 'sendgrid',
      name: 'SendGrid',
      category: 'Email',
      status: 'inactive',
      keys: {
        apiKey: '',
        fromEmail: '',
      },
      description: 'Transactional email (confirmations, receipts)',
      docs: 'https://sendgrid.com/docs',
      required: false,
      icon: '📧',
    },
    {
      id: 'twilio',
      name: 'Twilio',
      category: 'SMS',
      status: 'inactive',
      keys: {
        accountSid: '',
        authToken: '',
        phoneNumber: '',
      },
      description: 'SMS & WhatsApp messaging',
      docs: 'https://www.twilio.com/docs',
      required: false,
      icon: '💬',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      category: 'Messaging',
      status: 'inactive',
      keys: {
        phoneNumberId: '',
        accessToken: '',
        businessAccountId: '',
      },
      description: 'WhatsApp customer support & notifications',
      docs: 'https://www.whatsapp.com/business/api',
      required: false,
      icon: '💚',
    },

    // Analytics & Monitoring
    {
      id: 'sentry',
      name: 'Sentry',
      category: 'Monitoring',
      status: 'inactive',
      keys: {
        dsn: '',
        authToken: '',
      },
      description: 'Error tracking & crash reporting',
      docs: 'https://sentry.io/docs',
      required: false,
      icon: '🐛',
    },
    {
      id: 'vercelAnalytics',
      name: 'Vercel Analytics',
      category: 'Analytics',
      status: 'inactive',
      keys: {
        analyticsId: '',
      },
      description: 'Real-time performance monitoring',
      docs: 'https://vercel.com/analytics',
      required: false,
      icon: '📊',
    },

    // Business Tools
    {
      id: 'slack',
      name: 'Slack',
      category: 'Notifications',
      status: 'inactive',
      keys: {
        webhookUrl: '',
        botToken: '',
      },
      description: 'Real-time booking & system alerts to Slack',
      docs: 'https://api.slack.com/messaging/webhooks',
      required: false,
      icon: '🔔',
    },
    {
      id: 'github',
      name: 'GitHub',
      category: 'DevOps',
      status: 'inactive',
      keys: {
        token: '',
        repository: '',
      },
      description: 'Source code management & deployments',
      docs: 'https://docs.github.com/en/developers',
      required: false,
      icon: '🐙',
    },
  ]);

  const [selectedApi, setSelectedApi] = useState<APIConfig | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Load from localStorage
    if (typeof window !== "undefined") { const savedApis = localStorage.getItem('mia_api_config');
    if (savedApis) {
      setApis(JSON.parse(savedApis));
    }
  }, []);

  const categories = [
    'all',
    ...Array.from(new Set(apis.map((a) => a.category))),
  ];

  const filteredApis = filterCategory === 'all' ? apis : apis.filter((a) => a.category === filterCategory);

  const handleSaveConfig = (updatedApi: APIConfig) => {
    const newApis = apis.map((a) =>
      a.id === updatedApi.id
        ? {
            ...updatedApi,
            status: Object.values(updatedApi.keys).every((k) => k)
              ? 'active'
              : 'inactive',
          }
        : a
    );
    setApis(newApis);
    localStorage.setItem('mia_api_config', JSON.stringify(newApis));
    setSelectedApi(null);
    setEditMode(false);
  };

  const activeCount = apis.filter((a) => a.status === 'active').length;
  const requiredCount = apis.filter((a) => a.required).length;
  const requiredActive = apis.filter((a) => a.required && a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-electric-turquoise/20 to-baby-blue/20 border border-electric-turquoise/30 p-6 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-white mb-2">API Configuration</h2>
        <p className="text-gray-400 mb-4">
          Manage all integrations and external service connections
        </p>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-dark-gunmetal/50 rounded-lg p-3 border border-electric-turquoise/20">
            <p className="text-sm text-gray-400">Active APIs</p>
            <p className="text-2xl font-bold text-electric-turquoise">{activeCount}</p>
          </div>
          <div className="bg-dark-gunmetal/50 rounded-lg p-3 border border-baby-blue/20">
            <p className="text-sm text-gray-400">Required Setup</p>
            <p className="text-2xl font-bold text-baby-blue">
              {requiredActive}/{requiredCount}
            </p>
          </div>
          <div className="bg-dark-gunmetal/50 rounded-lg p-3 border border-gray-500/20">
            <p className="text-sm text-gray-400">Total Available</p>
            <p className="text-2xl font-bold text-gray-300">{apis.length}</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              filterCategory === cat
                ? 'bg-electric-turquoise text-gunmetal'
                : 'bg-gunmetal/50 border border-gray-500/30 text-gray-400 hover:border-electric-turquoise/50'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* API Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApis.map((api) => (
          <motion.div
            key={api.id}
            layoutId={api.id}
            onClick={() => {
              setSelectedApi(api);
              setEditMode(false);
            }}
            className={`cursor-pointer rounded-lg border p-4 backdrop-blur-md transition ${
              api.status === 'active'
                ? 'bg-electric-turquoise/10 border-electric-turquoise/40 hover:border-electric-turquoise/60'
                : api.required
                  ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
                  : 'bg-gunmetal/30 border-gray-500/20 hover:border-gray-500/40'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{api.icon}</span>
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  api.status === 'active'
                    ? 'bg-green-500'
                    : api.status === 'error'
                      ? 'bg-red-500'
                      : 'bg-gray-500'
                }`}
                animate={{ scale: api.status === 'active' ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 2, repeat: api.status === 'active' ? Infinity : 0 }}
              />
            </div>

            <h3 className="font-semibold text-white mb-1">{api.name}</h3>
            <p className="text-xs text-gray-400 mb-3">{api.description}</p>

            <div className="flex items-center justify-between text-xs">
              <span
                className={`px-2 py-1 rounded ${
                  api.required
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {api.required ? 'Required' : 'Optional'}
              </span>
              <span
                className={`px-2 py-1 rounded font-semibold ${
                  api.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {api.status === 'active' ? '✓ Active' : 'Not Setup'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedApi && (
        <motion.div
          layoutId={selectedApi.id}
          className="rounded-xl bg-gradient-to-br from-gunmetal to-dark-gunmetal border border-electric-turquoise/30 p-8 backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{selectedApi.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedApi.name}</h3>
                <p className="text-gray-400">{selectedApi.description}</p>
              </div>
            </div>
            <a
              href={selectedApi.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-baby-blue/20 border border-baby-blue/40 text-baby-blue rounded-lg hover:bg-baby-blue/30 transition"
            >
              📖 Docs
            </a>
          </div>

          {!editMode ? (
            <div className="space-y-4">
              <div className="bg-dark-gunmetal/50 rounded-lg p-4 border border-gray-500/20">
                <p className="text-sm text-gray-400 mb-3">Configured Keys:</p>
                {Object.keys(selectedApi.keys).map((key) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-gray-500/10 last:border-0">
                    <span className="text-gray-400 capitalize">{key}</span>
                    <span
                      className={`text-sm font-mono ${
                        selectedApi.keys[key] ? 'text-green-400' : 'text-gray-600'
                      }`}
                    >
                      {selectedApi.keys[key]
                        ? `••••••••${selectedApi.keys[key].slice(-4)}`
                        : 'Not configured'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full px-4 py-2 bg-electric-turquoise text-gunmetal font-semibold rounded-lg hover:bg-electric-turquoise/90 transition"
              >
                ✏️ Edit Configuration
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.keys(selectedApi.keys).map((key) => (
                <div key={key}>
                  <label className="block text-sm text-gray-400 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="password"
                    value={selectedApi.keys[key]}
                    onChange={(e) =>
                      setSelectedApi({
                        ...selectedApi,
                        keys: {
                          ...selectedApi.keys,
                          [key]: e.target.value,
                        },
                      })
                    }
                    placeholder={`Enter ${key}`}
                    className="w-full px-4 py-2 rounded-lg bg-dark-gunmetal/80 border border-electric-turquoise/30 text-white placeholder-gray-600 focus:outline-none focus:border-electric-turquoise"
                  />
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    handleSaveConfig(selectedApi);
                  }}
                  className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-400 font-semibold rounded-lg hover:bg-green-500/30 transition"
                >
                  ✓ Save Configuration
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setSelectedApi(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500/20 border border-gray-500/40 text-gray-400 font-semibold rounded-lg hover:bg-gray-500/30 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdminAPIConfiguration;
