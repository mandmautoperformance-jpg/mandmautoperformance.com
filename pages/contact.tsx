import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | M&M Auto Performance</title>
        <meta name="description" content="Get in touch with M&M Auto Performance. Available 24/7 via MIA AI concierge or contact us directly." />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar isLoggedIn={false} userRole="guest" currentPage="contact" />

        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">

            <div className="text-center mb-14">
              <h1 className="text-5xl font-bold text-white mb-4">Get in Touch</h1>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                We're available 24/7 via MIA, or reach us directly below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Info Cards */}
              <div className="space-y-5">
                {[
                  {
                    icon: <Phone size={22} className="text-performance-turquoise" />,
                    title: 'Phone',
                    lines: ['Coming soon', 'Call or WhatsApp'],
                  },
                  {
                    icon: <Mail size={22} className="text-performance-turquoise" />,
                    title: 'Email',
                    lines: ['hello@mandmautoperformance.com', 'Replies within 2 hours'],
                  },
                  {
                    icon: <MapPin size={22} className="text-performance-turquoise" />,
                    title: 'Base',
                    lines: ['St Albans, Hertfordshire', 'Serving Herts & London'],
                  },
                  {
                    icon: <Clock size={22} className="text-performance-turquoise" />,
                    title: 'Hours',
                    lines: ['MIA AI: 24/7', 'Team: Mon–Sat 9am–8pm'],
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-performance-grey border border-performance-turquoise/20 rounded-xl p-5 flex gap-4 hover:border-performance-turquoise/40 transition-all">
                    <div className="flex-shrink-0 w-10 h-10 bg-performance-turquoise/10 rounded-lg flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm mb-1">{item.title}</p>
                      {item.lines.map((line, j) => (
                        <p key={j} className="text-gray-400 text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-performance-grey border border-performance-turquoise/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

                  {status === 'error' && (
                    <div className="mb-4 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                      <AlertCircle size={18} />
                      <span className="text-sm">Something went wrong. Please try again or email us directly.</span>
                    </div>
                  )}
                  {status === 'success' ? (
                    <div className="text-center py-12">
                      <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Message sent!</h3>
                      <p className="text-gray-400">We'll get back to you within 2 hours. Or chat with MIA now for instant help.</p>
                      <button
                        onClick={() => setStatus('idle')}
                        className="mt-6 px-6 py-3 border border-performance-turquoise text-performance-turquoise rounded-lg hover:bg-performance-turquoise/10 transition-all"
                      >
                        Send another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Your name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="James Bond"
                            className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Email address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Subject</label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white focus:outline-none focus:border-performance-turquoise"
                        >
                          <option value="" className="bg-performance-grey">Select a subject</option>
                          <option value="booking" className="bg-performance-grey">Booking enquiry</option>
                          <option value="fleet" className="bg-performance-grey">Fleet question</option>
                          <option value="pricing" className="bg-performance-grey">Pricing & packages</option>
                          <option value="support" className="bg-performance-grey">Customer support</option>
                          <option value="other" className="bg-performance-grey">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Message</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows={5}
                          placeholder="Tell us what you need..."
                          className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-4 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg hover:shadow-lg hover:shadow-performance-turquoise/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {status === 'loading' ? (
                          <span className="w-5 h-5 border-2 border-performance-grey/30 border-t-performance-grey rounded-full animate-spin" />
                        ) : (
                          <><Send size={18} /> Send Message</>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-performance-turquoise/20 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            © 2026 M&M Auto Performance. Part of the RichHabits Ecosystem.
          </div>
        </footer>
      </main>
    </>
  );
}
