import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | M&M Auto Performance</title>
        <meta name="description" content="M&M Auto Performance privacy policy. How we collect, use, and protect your personal data under UK GDPR." />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar />
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-gray-400 mb-6">Last updated: April 2026</p>

            <section className="space-y-8 text-gray-300">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                <p className="mb-4">
                  M&M Performance operates mandmautoperformance.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                <p className="mb-4">We collect information in the following ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Personal Information:</strong> Name, email, phone, address, date of birth (for age verification)</li>
                  <li><strong className="text-white">Driver Information:</strong> Licence number, expiry date, driving history (for vehicle rental)</li>
                  <li><strong className="text-white">Payment Information:</strong> Card details (processed securely via Stripe — we never store raw card data)</li>
                  <li><strong className="text-white">Device Information:</strong> IP address, browser type, operating system</li>
                  <li><strong className="text-white">Usage Data:</strong> Pages visited, time spent, actions taken</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processing rental bookings and payments</li>
                  <li>Verifying your identity and eligibility</li>
                  <li>Communicating with you about bookings</li>
                  <li>Improving our services</li>
                  <li>Marketing (with your consent only)</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>HTTPS encryption (SSL/TLS) on all connections</li>
                  <li>Secure password hashing via Supabase Auth (bcrypt)</li>
                  <li>PCI DSS compliance for payment processing (Stripe)</li>
                  <li>Regular security audits</li>
                  <li>Limited staff access to sensitive data</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights (UK GDPR)</h2>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion (right to be forgotten)</li>
                  <li>Restrict processing</li>
                  <li>Data portability</li>
                  <li>Object to processing</li>
                </ul>
                <p>To exercise these rights, contact: <strong className="text-performance-turquoise">privacy@mandmautoperformance.com</strong></p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
                <p>We use cookies for authentication, preferences, and analytics. See our <Link href="/cookie-policy" className="text-performance-turquoise hover:underline">Cookie Policy</Link> for details.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">7. Third Parties</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Stripe:</strong> Payment processing</li>
                  <li><strong className="text-white">Supabase:</strong> Data hosting (EU region)</li>
                  <li><strong className="text-white">Google Gemini:</strong> AI concierge (anonymised prompts)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">8. Contact</h2>
                <p>
                  Data Protection Officer: <strong className="text-performance-turquoise">dpo@mandmautoperformance.com</strong><br />
                  General Inquiries: <strong className="text-performance-turquoise">privacy@mandmautoperformance.com</strong><br />
                  Address: London, United Kingdom
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
