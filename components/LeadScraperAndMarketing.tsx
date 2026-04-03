'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Lead {
  id: string;
  name: string;
  location: string;
  type: 'company' | 'individual';
  relevance: 'high' | 'medium' | 'low';
  notes: string;
  contacted: boolean;
}

interface MarketingTemplate {
  id: string;
  name: string;
  type: 'sms' | 'email' | 'whatsapp' | 'instagram';
  template: string;
  conversions: number;
  active: boolean;
}

const LeadScraperAndMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scraper' | 'messages'>('scraper');
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'London Tech Startups Hub',
      location: 'Shoreditch, London',
      type: 'company',
      relevance: 'high',
      notes: 'Fast-growing tech company, likely high employee turnover, recurring rentals',
      contacted: false,
    },
    {
      id: '2',
      name: 'Hertfordshire Wedding Planners',
      location: 'Welwyn Garden City',
      type: 'company',
      relevance: 'high',
      notes: 'B2B opportunity: Premium wedding transport for groom, best man, bridal party',
      contacted: false,
    },
    {
      id: '3',
      name: 'London Finance District Execs',
      location: 'City of London',
      type: 'individual',
      relevance: 'medium',
      notes: 'High-net-worth individuals for luxury car rentals, business trips',
      contacted: false,
    },
  ]);

  const [templates, setTemplates] = useState<MarketingTemplate[]>([
    {
      id: '1',
      name: 'First-Time Renter Offer',
      type: 'sms',
      template: `🚗 First rental only at M&M Auto? Get 15% off! Book now: [link] Use code: FIRST15 - Ends Sunday!`,
      conversions: 34,
      active: true,
    },
    {
      id: '2',
      name: 'Weekly Deal Blast',
      type: 'whatsapp',
      template: `Hey! 🎉 This week's spotlight: Premium Tesla Model 3 @ just £65/day (usually £89). Perfect for your next adventure. Book: [link]`,
      conversions: 28,
      active: true,
    },
    {
      id: '3',
      name: 'B2B Fleet Inquiry',
      type: 'email',
      template: `Subject: Premium Fleet Solutions for Your Team

Hi [Name],

Are you looking for reliable, premium vehicle rentals for your team?

M&M Auto specializes in:
✓ Executive transport (Tesla, Range Rover)
✓ Event logistics (weddings, conferences)
✓ Corporate accounts (volume discounts)
✓ 24/7 support

Available 24/7 in London & Hertfordshire.

Let's chat: [phone]

Cheers,
The M&M Team`,
      conversions: 12,
      active: true,
    },
    {
      id: '4',
      name: 'Instagram Story Ad',
      type: 'instagram',
      template: `Slide 1: "No ordinary rental 🚗"
Slide 2: "Premium cars. Instant booking. Pure vibes 🎉"
Slide 3: "First rental 15% OFF → Link in Bio"

CTA: "Book Now"`,
      conversions: 156,
      active: true,
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<MarketingTemplate | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [sendMode, setSendMode] = useState<'draft' | 'preview' | 'send'>('draft');

  // Lead scraping data sources
  const scraperSources = [
    {
      name: '🏢 Companies Hiring (Fast Growth)',
      query: 'Tech startups in London/Hertfordshire 2024-2025',
      approach: 'LinkedIn Sales Navigator + Indeed + Crunchbase',
      value: 'Recurring rentals, team building events, airport transfers',
    },
    {
      name: '💍 Wedding & Event Planners',
      query: 'Wedding planners + event organizers in Hertfordshire',
      approach: 'Google Maps scrape + Wedding.com listings',
      value: 'B2B partnerships: transport packages, bridal party',
    },
    {
      name: '💰 High-Net-Worth Individuals',
      query: 'Luxury car enthusiasts in London, Hertfordshire',
      approach: 'Instagram hashtags (#LuxuryCars #London) + LinkedIn Premium',
      value: 'High-margin bookings, repeat customers',
    },
    {
      name: '✈️ Business Travelers',
      query: 'Frequent travelers (flights 2+ per month)',
      approach: 'Twitter scrape + LinkedIn job titles (Consultant, Exec)',
      value: 'Weekly recurring bookings, predictable revenue',
    },
    {
      name: '🎓 Corporate Groups',
      query: 'Team building event organizers',
      approach: 'Google Maps "event spaces", "conference venues"',
      value: 'Bulk bookings (10-20 cars), fleet discounts',
    },
  ];

  const growthHacks = [
    {
      title: 'Referral Loop',
      description: 'Every booking gives £5 M&M Credit + friend gets 10% off first rental',
      effort: '⚡ 1 hour',
      impact: '📈 Viral loops = 3-5x user acquisition',
      code: 'ReferralComponent.tsx (ready to implement)',
    },
    {
      title: 'SMS Flash Deals',
      description: 'Last-minute unsold inventory → SMS to inactive users at 40% off',
      effort: '⚡ 2 hours',
      impact: '📈 Fill empty slots, 25-30% conversion on flash deals',
      code: 'FlashDealService.ts',
    },
    {
      title: 'Wall of Fame Social Proof',
      description: 'User-generated photos with geo-tags → Instagram/TikTok auto-posts',
      effort: '⚡ 3 hours',
      impact: '📈 UGC = 80% more engagement than brand content',
      code: 'WallOfFameGallery.tsx (already in DriverPassport)',
    },
    {
      title: 'Discord Community',
      description: 'Private Discord: early access to new cars, exclusive deals, events',
      effort: '⚡ 1 hour',
      impact: '📈 Community lock-in, brand advocates',
      code: 'DiscordBot integration script',
    },
    {
      title: 'Geo-Targeted Ads',
      description: 'Google Ads targeting Hertfordshire → "Uber for cars" messaging',
      effort: '⚡ 30 min setup',
      impact: '📈 £50 budget = 200+ impressions/day in target area',
      code: 'Google Ads campaign brief',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-500/20">
        <button
          onClick={() => setActiveTab('scraper')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'scraper'
              ? 'border-b-2 border-electric-turquoise text-electric-turquoise'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          🎯 Lead Scraper & Targeting
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'messages'
              ? 'border-b-2 border-electric-turquoise text-electric-turquoise'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          💬 Marketing Messages
        </button>
      </div>

      {/* Scraper Tab */}
      {activeTab === 'scraper' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Lead Targeting Sources */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Where to Find High-Value Leads</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {scraperSources.map((source, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-gunmetal/50 border border-electric-turquoise/20 p-4 hover:border-electric-turquoise/40 transition"
                >
                  <h4 className="font-semibold text-electric-turquoise mb-2">{source.name}</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    <span className="font-semibold">Target:</span> {source.query}
                  </p>
                  <p className="text-sm text-gray-400 mb-3">
                    <span className="font-semibold">Method:</span> {source.approach}
                  </p>
                  <p className="text-sm text-baby-blue">
                    <span className="font-semibold">💰 Value:</span> {source.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Leads */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Your Warm Leads (Ready to Contact)</h3>
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className={`rounded-lg p-4 border ${
                    lead.relevance === 'high'
                      ? 'bg-green-500/5 border-green-500/30'
                      : 'bg-gunmetal/50 border-gray-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{lead.name}</h4>
                      <p className="text-sm text-gray-400">{lead.location}</p>
                      <p className="text-sm text-gray-500 mt-2">{lead.notes}</p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          lead.relevance === 'high'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {lead.relevance.toUpperCase()}
                      </span>
                      <button className="px-3 py-1 rounded text-xs font-semibold bg-electric-turquoise/20 text-electric-turquoise hover:bg-electric-turquoise/30 transition">
                        📞 Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Hacks */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Win Growth Hacks</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {growthHacks.map((hack, idx) => (
                <div key={idx} className="rounded-lg bg-dark-gunmetal/50 border border-baby-blue/20 p-4">
                  <h4 className="font-semibold text-baby-blue mb-2">{hack.title}</h4>
                  <p className="text-sm text-gray-400 mb-3">{hack.description}</p>
                  <div className="space-y-2 text-xs">
                    <p className="text-gray-500">
                      <span className="font-semibold">Effort:</span> {hack.effort}
                    </p>
                    <p className="text-green-400">
                      <span className="font-semibold">Impact:</span> {hack.impact}
                    </p>
                    <p className="text-electric-turquoise">
                      <span className="font-semibold">Code:</span> {hack.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h3 className="text-xl font-bold text-white">Marketing Message Templates</h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`cursor-pointer rounded-lg border p-4 transition ${
                  selectedTemplate?.id === template.id
                    ? 'bg-electric-turquoise/20 border-electric-turquoise/50'
                    : 'bg-gunmetal/50 border-gray-500/20 hover:border-gray-500/40'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{template.name}</h4>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-baby-blue/20 text-baby-blue uppercase">
                    {template.type}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-2">{template.template}</p>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">{template.conversions}</span> conversions
                </p>
              </div>
            ))}
          </div>

          {selectedTemplate && (
            <div className="rounded-lg bg-gradient-to-br from-gunmetal to-dark-gunmetal border border-electric-turquoise/30 p-6">
              <h4 className="text-lg font-bold text-white mb-4">{selectedTemplate.name}</h4>

              <textarea
                value={messageContent || selectedTemplate.template}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full h-32 p-4 rounded-lg bg-dark-gunmetal/80 border border-electric-turquoise/30 text-white placeholder-gray-600 focus:outline-none focus:border-electric-turquoise mb-4 resize-none"
                placeholder="Message content..."
              />

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSendMode('draft')}
                  className={`flex-1 px-4 py-2 rounded font-semibold transition ${
                    sendMode === 'draft'
                      ? 'bg-electric-turquoise text-gunmetal'
                      : 'bg-gunmetal/50 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  ✏️ Draft
                </button>
                <button
                  onClick={() => setSendMode('preview')}
                  className={`flex-1 px-4 py-2 rounded font-semibold transition ${
                    sendMode === 'preview'
                      ? 'bg-electric-turquoise text-gunmetal'
                      : 'bg-gunmetal/50 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  👁️ Preview
                </button>
                <button
                  onClick={() => setSendMode('send')}
                  className={`flex-1 px-4 py-2 rounded font-semibold transition ${
                    sendMode === 'send'
                      ? 'bg-green-500 text-white'
                      : 'bg-gunmetal/50 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  🚀 Send
                </button>
              </div>

              {sendMode === 'send' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 font-semibold mb-3">Ready to send:</p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>📱 Channel: {selectedTemplate.type.toUpperCase()}</p>
                    <p>👥 Recipients: Select from leads above</p>
                    <p>⏰ Schedule: Immediate or set time</p>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
                    Confirm & Send Campaign
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LeadScraperAndMarketing;
