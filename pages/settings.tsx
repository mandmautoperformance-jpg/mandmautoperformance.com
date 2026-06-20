import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { createClient } from '@supabase/supabase-js';
import { Bell, Lock, User } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    bookingConfirmed: true,
    bookingReminder: true,
    promotions: false,
    newsletter: true,
  });

  // Real account profile, loaded from the signed-in Supabase user.
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && key ? createClient(url, key) : null;
  }, []);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [changes, setChanges] = useState(false);
  const [accountStatus, setAccountStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [accountError, setAccountError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const meta = (u.user_metadata || {}) as Record<string, string>;
      setFirstName(meta.first_name || '');
      setLastName(meta.last_name || '');
      setPhone(meta.phone || '');
      setEmail(u.email || '');
    });
  }, [supabase]);

  const handleAccountSave = async () => {
    if (!supabase || !changes) return;
    setAccountStatus('loading');
    setAccountError('');
    const { error } = await supabase.auth.updateUser({
      email: email || undefined,
      data: { first_name: firstName, last_name: lastName, phone },
    });
    if (error) {
      setAccountError(error.message);
      setAccountStatus('error');
    } else {
      setAccountStatus('success');
      setChanges(false);
      setTimeout(() => setAccountStatus('idle'), 3000);
    }
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordUpdate = async () => {
    setPasswordError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    setPasswordStatus('loading');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError(error.message);
      setPasswordStatus('error');
    } else {
      setPasswordStatus('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordStatus('idle'), 3000);
    }
  };

  return (
    <>
      <Head>
        <title>Settings | M&M Auto Performance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar isLoggedIn={true} userRole="user" currentPage="settings" />

        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-10">Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="md:col-span-1">
                {[
                  { id: 'account', label: 'Account', icon: <User size={18} /> },
                  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
                  { id: 'security', label: 'Security', icon: <Lock size={18} /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all mb-2 ${
                      activeTab === tab.id
                        ? 'bg-performance-turquoise text-performance-grey font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-performance-turquoise/10'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="md:col-span-3">
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Account Settings</h2>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">First Name</label>
                        <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setChanges(true); }} placeholder="First name" className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setChanges(true); }} placeholder="Last name" className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                      <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setChanges(true); }} placeholder="you@email.com" className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                      <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setChanges(true); }} placeholder="+44 (0) 7..." className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise" />
                    </div>

                    {accountError && <p className="text-red-400 text-sm">{accountError}</p>}
                    {accountStatus === 'success' && <p className="text-green-400 text-sm">Account updated successfully.</p>}

                    <div className="pt-6 border-t border-performance-turquoise/20 flex gap-3">
                      <button
                        onClick={handleAccountSave}
                        disabled={!changes || accountStatus === 'loading'}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${changes && accountStatus !== 'loading' ? 'bg-performance-turquoise text-performance-grey hover:bg-performance-turquoise/90' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                      >
                        {accountStatus === 'loading' ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Notification Preferences</h2>

                    {[
                      { key: 'bookingConfirmed', label: 'Booking Confirmations', desc: 'Get notified when your booking is confirmed' },
                      { key: 'bookingReminder', label: 'Booking Reminders', desc: 'Reminders 24h before your booking' },
                      { key: 'promotions', label: 'Promotions & Offers', desc: 'Special deals and exclusive offers' },
                      { key: 'newsletter', label: 'Newsletter', desc: 'Weekly updates and news' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between pt-4 pb-4 border-b border-performance-turquoise/10">
                        <div>
                          <p className="font-semibold text-white mb-1">{item.label}</p>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                          className={`flex-shrink-0 w-12 h-6 rounded-full relative transition-all ${notifications[item.key as keyof typeof notifications] ? 'bg-performance-turquoise' : 'bg-gray-600'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}

                    <div className="pt-6 flex gap-3">
                      <button className="px-6 py-3 bg-performance-turquoise text-performance-grey rounded-lg font-bold hover:bg-performance-turquoise/90 transition-all">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Security Settings</h2>

                    <div>
                      <h3 className="font-semibold text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Current Password</label>
                          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">New Password</label>
                          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm Password</label>
                          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-performance-turquoise/20">
                      <h3 className="font-semibold text-white mb-4">Two-Factor Authentication</h3>
                      <p className="text-gray-400 text-sm mb-4">Add an extra layer of security to your account</p>
                      <button className="px-6 py-3 border-2 border-performance-turquoise text-performance-turquoise rounded-lg font-bold hover:bg-performance-turquoise/10 transition-all">
                        Enable 2FA
                      </button>
                    </div>

                    {passwordError && (
                      <p className="text-red-400 text-sm">{passwordError}</p>
                    )}
                    {passwordStatus === 'success' && (
                      <p className="text-green-400 text-sm">Password updated successfully.</p>
                    )}
                    <div className="pt-6 border-t border-performance-turquoise/20 flex gap-3">
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={passwordStatus === 'loading'}
                        className="px-6 py-3 bg-performance-turquoise text-performance-grey rounded-lg font-bold hover:bg-performance-turquoise/90 transition-all disabled:opacity-60"
                      >
                        {passwordStatus === 'loading' ? 'Updating…' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
