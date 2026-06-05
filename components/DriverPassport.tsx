/**
 * DriverPassport.tsx
 *
 * The "Driver's Passport" - Deep user profile system that makes competitors look antiquated.
 * Combines luxury UX with hidden gamification loops.
 *
 * Features:
 * - The Vault: Secure driver docs (license, proof of address)
 * - Telematics Score: Driver rating that unlocks elite cars (presented as status indicator)
 * - Preferences: Car/engine preferences
 * - The Garage: Rental history + Wall of Fame photos
 * - Wallet: Payment methods + M&M Credits
 *
 * Design: High-End Luxury (but the psychology is pure gamification)
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Settings, Award, CreditCard, LogOut, Menu } from 'lucide-react';
import Image from 'next/image';

interface PassportUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  telematicsScore: number; // 0-100, presented as "Driver Status"
  tier: 'Bronze' | 'Silver' | 'Platinum' | 'Elite';
  totalMiles: number;
  rentalCount: number;
  mmCredits: number;
}

interface PassportSection {
  id: 'vault' | 'telematics' | 'preferences' | 'garage' | 'wallet';
  label: string;
  icon: React.ReactNode;
  color: string;
}

const DriverPassport: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'vault' | 'telematics' | 'preferences' | 'garage' | 'wallet'>('telematics');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user] = useState<PassportUser>({
    id: 'user_001',
    name: 'James Mitchell',
    email: 'james.mitchell@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    joinDate: '2024-01-15',
    telematicsScore: 87,
    tier: 'Platinum',
    totalMiles: 8432,
    rentalCount: 12,
    mmCredits: 4250,
  });

  const sections: PassportSection[] = [
    {
      id: 'telematics',
      label: 'Driver Status',
      icon: <Zap size={20} />,
      color: 'from-turquoise to-cyan',
    },
    {
      id: 'vault',
      label: 'The Vault',
      icon: <Shield size={20} />,
      color: 'from-slate-600 to-slate-700',
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: <Settings size={20} />,
      color: 'from-slate-500 to-slate-600',
    },
    {
      id: 'garage',
      label: 'The Garage',
      icon: <Award size={20} />,
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: <CreditCard size={20} />,
      color: 'from-green-500 to-emerald-600',
    },
  ];

  // Tier unlock levels (gamification hidden in luxury design)
  const tierLevels = {
    Bronze: { minScore: 0, color: '#8B7355', unlockedCars: 'Economy & Standard' },
    Silver: { minScore: 40, color: '#C0C0C0', unlockedCars: 'Premium & Sports' },
    Platinum: { minScore: 70, color: '#E5E4E2', unlockedCars: 'Luxury & Exotic' },
    Elite: { minScore: 90, color: '#FFD700', unlockedCars: 'All Fleet (Priority)' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-turquoise to-cyan flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Driver's Passport</h1>
              <p className="text-xs text-slate-400">Your M&M Elite Profile</p>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            <Menu size={24} />
          </button>

          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm transition-all">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`lg:col-span-1 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}
          >
            <div className="space-y-2 sticky top-24">
              {sections.map((section, idx) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-turquoise/20 to-cyan/10 border border-turquoise/30 text-turquoise'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                  }`}
                >
                  {section.icon}
                  <span className="text-sm font-medium">{section.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-turquoise/30">
                    <Image
                      src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'}
                      alt={user.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-slate-400 text-sm">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Tier Badge (Gamification Disguised as Status) */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="px-6 py-2 rounded-lg font-bold text-white text-center"
                    style={{ backgroundColor: tierLevels[user.tier].color }}
                  >
                    {user.tier} Member
                  </div>
                  <p className="text-xs text-slate-400">{tierLevels[user.tier].unlockedCars}</p>
                </motion.div>
              </div>
            </div>

            {/* Dynamic Content Based on Active Section */}
            <TelematicsScoreSection
              isActive={activeSection === 'telematics'}
              score={user.telematicsScore}
              tier={user.tier}
              totalMiles={user.totalMiles}
              rentalCount={user.rentalCount}
            />

            <VaultSection isActive={activeSection === 'vault'} />

            <PreferencesSection isActive={activeSection === 'preferences'} />

            <GarageSection
              isActive={activeSection === 'garage'}
              totalMiles={user.totalMiles}
              rentalCount={user.rentalCount}
            />

            <WalletSection
              isActive={activeSection === 'wallet'}
              mmCredits={user.mmCredits}
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                label="Total Miles"
                value={user.totalMiles.toLocaleString()}
                icon="🛣️"
                highlight="turquoise"
              />
              <StatsCard
                label="Rentals"
                value={user.rentalCount.toString()}
                icon="🏎️"
                highlight="amber"
              />
              <StatsCard
                label="M&M Credits"
                value={user.mmCredits.toLocaleString()}
                icon="💎"
                highlight="green"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * Section Components (Modular, Reusable)
 * ============================================================================ */

const TelematicsScoreSection: React.FC<{
  isActive: boolean;
  score: number;
  tier: string;
  totalMiles: number;
  rentalCount: number;
}> = ({ isActive, score, tier, totalMiles, rentalCount }) => {
  if (!isActive) return null;

  const scorePercentage = (score / 100) * 100;
  const nextTierScore = score < 90 ? Math.ceil(score / 20) * 20 + 20 : 100;
  const pointsToNextTier = Math.max(0, nextTierScore - score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl"
    >
      <h3 className="text-2xl font-bold text-white mb-8">Your Driver Status</h3>

      {/* Main Score Visualization (Presented as elegant metric, actually gamification) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex-1">
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-turquoise to-cyan mb-2">
            {score}
          </div>
          <p className="text-slate-400 mb-6">Current Driver Rating</p>

          {/* Hidden Leveling System (Gamification Core) */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-300">Progress to Next Tier</p>
              <p className="text-xs text-turquoise font-semibold">{pointsToNextTier} points</p>
            </div>
            <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scorePercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-turquoise to-cyan"
              />
            </div>
          </div>

          {/* What This Score Unlocks */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <p className="text-xs text-slate-400 mb-2">Your tier unlocks:</p>
            <p className="text-sm font-semibold text-slate-200">
              {tier === 'Bronze' && 'Economy & Standard vehicles with insurance discounts'}
              {tier === 'Silver' && 'Premium & Sports cars with priority bookings'}
              {tier === 'Platinum' && 'Luxury & Exotic vehicles with VIP concierge'}
              {tier === 'Elite' && 'Entire fleet with priority, white-glove service & exclusive events'}
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="flex-1 space-y-3">
          <MetricCard
            label="Smooth Acceleration"
            value="92%"
            icon="⚡"
            color="from-turquoise/20 to-cyan/10"
          />
          <MetricCard
            label="Smooth Braking"
            value="85%"
            icon="🛑"
            color="from-red-500/20 to-orange-500/10"
          />
          <MetricCard
            label="Speed Compliance"
            value="94%"
            icon="🚗"
            color="from-green-500/20 to-emerald-500/10"
          />
          <MetricCard
            label="Overall Smoothness"
            value={`${score}%`}
            icon="✨"
            color="from-purple-500/20 to-pink-500/10"
          />
        </div>
      </div>

      {/* How Score is Calculated */}
      <div className="bg-slate-700/20 rounded-lg p-6 border border-slate-600/30">
        <h4 className="font-semibold text-white mb-4">How Your Score Is Calculated</h4>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>✓ Acceleration smoothness: Real-time telemetry from vehicle sensors</li>
          <li>✓ Braking performance: Detected harsh braking events (penalize repeated incidents)</li>
          <li>✓ Speed compliance: GPS vs speed limits (staying within ±5 mph)</li>
          <li>✓ Return condition: Car returned clean, fuel level, no damage</li>
          <li>✓ Booking punctuality: On-time pickups and returns (bonus for 10+ bookings)</li>
        </ul>
      </div>
    </motion.div>
  );
};

const VaultSection: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl"
    >
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <Shield size={24} className="text-slate-400" />
        The Vault - Secure Document Storage
      </h3>

      <div className="space-y-6">
        {/* Driver's License */}
        <DocumentCard
          title="UK Driving License"
          status="Verified"
          expiryDate="2029-03-14"
          uploadedDate="2024-01-15"
          icon="🪪"
          statusColor="from-green-500/30 to-emerald-500/10"
        />

        {/* Proof of Address */}
        <DocumentCard
          title="Proof of Address"
          status="Verified"
          expiryDate={null}
          uploadedDate="2024-01-15"
          icon="📄"
          statusColor="from-blue-500/30 to-cyan-500/10"
        />

        {/* DVLA Check Code */}
        <DocumentCard
          title="DVLA Check Code"
          status="Valid"
          expiryDate="2025-04-03"
          uploadedDate="2024-04-03"
          icon="✅"
          statusColor="from-purple-500/30 to-pink-500/10"
        />

        {/* Insurance Documents */}
        <DocumentCard
          title="Insurance Documents"
          status="Attached"
          expiryDate={null}
          uploadedDate="2024-01-15"
          icon="🛡️"
          statusColor="from-amber-500/30 to-orange-500/10"
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-turquoise to-cyan text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-turquoise/30 transition-all duration-300">
            Update Documents
          </button>
          <button className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-semibold rounded-lg transition-all duration-300">
            Download Copies
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const PreferencesSection: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl"
    >
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <Settings size={24} className="text-slate-400" />
        Your Preferences
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Favorite Marques */}
        <div>
          <h4 className="font-semibold text-white mb-4">Favorite Marques</h4>
          <div className="space-y-2">
            {['Porsche', 'Ferrari', 'Lamborghini'].map((brand) => (
              <label key={brand} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-slate-300">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Engine Mapping */}
        <div>
          <h4 className="font-semibold text-white mb-4">Engine Mapping Profile</h4>
          <div className="space-y-2">
            {['Standard', 'Sport', 'Aggressive'].map((mode) => (
              <label key={mode} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all">
                <input type="radio" name="engine" defaultChecked={mode === 'Sport'} className="w-4 h-4" />
                <span className="text-slate-300">{mode}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Interior Climate */}
        <div>
          <h4 className="font-semibold text-white mb-4">Preferred Interior Climate</h4>
          <select className="w-full px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 focus:border-turquoise/50 outline-none">
            <option>Cool (18°C)</option>
            <option selected>Moderate (21°C)</option>
            <option>Warm (24°C)</option>
          </select>
        </div>

        {/* Communication Prefs */}
        <div>
          <h4 className="font-semibold text-white mb-4">Communication</h4>
          <label className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-slate-300">Notify me of fleet updates</span>
          </label>
        </div>
      </div>

      <button className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-turquoise to-cyan text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-turquoise/30 transition-all duration-300">
        Save Preferences
      </button>
    </motion.div>
  );
};

const GarageSection: React.FC<{ isActive: boolean; totalMiles: number; rentalCount: number }> = ({
  isActive,
  totalMiles,
  rentalCount,
}) => {
  if (!isActive) return null;

  const garageItems = [
    {
      model: 'Porsche 911 Turbo S',
      date: '2024-03-20',
      miles: 142,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692cd0c43?w=600&h=400&fit=crop',
    },
    {
      model: 'Lamborghini Huracán',
      date: '2024-03-10',
      miles: 89,
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop',
    },
    {
      model: 'Mercedes-Benz S-Class',
      date: '2024-02-28',
      miles: 234,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl"
    >
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <Award size={24} className="text-slate-400" />
        The Garage - Your Rental History
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard label="Total Rentals" value={rentalCount.toString()} icon="🏎️" highlight="turquoise" />
        <StatsCard label="Total Miles" value={totalMiles.toLocaleString()} icon="🛣️" highlight="cyan" />
        <StatsCard label="Wall of Fame Photos" value="28" icon="📸" highlight="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {garageItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-700/30 rounded-lg overflow-hidden border border-slate-600/50 hover:border-turquoise/30 transition-all duration-300 group cursor-pointer"
          >
            <div className="relative h-40 overflow-hidden">
              <Image
                src={item.image}
                alt={item.model}
                width={400}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-white mb-2">{item.model}</h4>
              <div className="space-y-1 text-xs text-slate-400">
                <p>📅 {new Date(item.date).toLocaleDateString()}</p>
                <p>🛣️ {item.miles} miles</p>
              </div>
              <button className="mt-4 w-full px-3 py-2 bg-turquoise/20 hover:bg-turquoise/30 text-turquoise rounded text-xs font-semibold transition-all">
                View Photos (4)
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const WalletSection: React.FC<{ isActive: boolean; mmCredits: number }> = ({ isActive, mmCredits }) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl"
    >
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <CreditCard size={24} className="text-slate-400" />
        Your Wallet
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* M&M Credits */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
          <p className="text-slate-400 text-sm mb-2">M&M Credits Balance</p>
          <p className="text-4xl font-bold text-green-400 mb-4">£{mmCredits}</p>
          <p className="text-xs text-slate-400 mb-4">1 point = £0.01 discount on next booking</p>
          <button className="w-full px-4 py-2 bg-green-500/30 hover:bg-green-500/40 text-green-300 rounded-lg text-sm font-semibold transition-all">
            View Rewards History
          </button>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-semibold text-white mb-4">Saved Payment Methods</h4>
          <div className="space-y-3">
            <PaymentMethodCard
              type="Visa"
              last4="4242"
              expiry="12/26"
              isDefault={true}
            />
            <PaymentMethodCard
              type="Mastercard"
              last4="5555"
              expiry="08/25"
              isDefault={false}
            />
            <button className="w-full px-4 py-3 border-2 border-dashed border-slate-600 hover:border-turquoise/50 text-slate-400 hover:text-turquoise rounded-lg transition-all text-sm font-semibold">
              + Add Payment Method
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h4 className="font-semibold text-white mb-4">Recent Transactions</h4>
        <div className="space-y-2">
          <TransactionRow
            type="Earned"
            description="Booking Complete - Porsche 911"
            amount="+142 points"
            color="green"
          />
          <TransactionRow
            type="Used"
            description="Applied to Mercedes-Benz Rental"
            amount="-50 points"
            color="red"
          />
          <TransactionRow
            type="Earned"
            description="Referral Bonus"
            amount="+300 points"
            color="green"
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ============================================================================
 * Mini Components (Reusable UI Elements)
 * ============================================================================ */

const MetricCard: React.FC<{
  label: string;
  value: string;
  icon: string;
  color: string;
}> = ({ label, value, icon, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-lg p-4 border border-slate-600/30`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

const DocumentCard: React.FC<{
  title: string;
  status: string;
  expiryDate: string | null;
  uploadedDate: string;
  icon: string;
  statusColor: string;
}> = ({ title, status, expiryDate, uploadedDate, icon, statusColor }) => (
  <div className="bg-slate-700/20 rounded-lg p-6 border border-slate-600/30 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-xs text-slate-400">Uploaded {new Date(uploadedDate).toLocaleDateString()}</p>
        {expiryDate && <p className="text-xs text-amber-400 mt-1">Expires {new Date(expiryDate).toLocaleDateString()}</p>}
      </div>
    </div>
    <div className={`bg-gradient-to-r ${statusColor} px-4 py-2 rounded-lg`}>
      <p className="text-xs font-semibold text-white">{status}</p>
    </div>
  </div>
);

const StatsCard: React.FC<{
  label: string;
  value: string;
  icon: string;
  highlight: string;
}> = ({ label, value, icon, highlight }) => {
  const colors = {
    turquoise: 'from-turquoise/20 to-cyan/10 text-turquoise',
    amber: 'from-amber-500/20 to-orange-500/10 text-amber-400',
    green: 'from-green-500/20 to-emerald-500/10 text-green-400',
    cyan: 'from-cyan-500/20 to-blue-500/10 text-cyan-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colors[highlight as keyof typeof colors]} rounded-lg p-6 border border-slate-600/30`}
    >
      <p className="text-2xl mb-2">{icon}</p>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  );
};

const PaymentMethodCard: React.FC<{
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}> = ({ type, last4, expiry, isDefault }) => (
  <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30 flex items-center justify-between">
    <div>
      <p className="font-semibold text-white">{type}</p>
      <p className="text-xs text-slate-400">•••• {last4} • Exp {expiry}</p>
    </div>
    {isDefault && <span className="px-3 py-1 bg-turquoise/20 text-turquoise text-xs font-semibold rounded">Default</span>}
  </div>
);

const TransactionRow: React.FC<{
  type: string;
  description: string;
  amount: string;
  color: 'green' | 'red';
}> = ({ type, description, amount, color }) => (
  <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
    <div>
      <p className="font-semibold text-white text-sm">{description}</p>
      <p className="text-xs text-slate-400">{type}</p>
    </div>
    <p className={`font-bold ${color === 'green' ? 'text-green-400' : 'text-red-400'}`}>{amount}</p>
  </div>
);

export default DriverPassport;
