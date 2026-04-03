export default function Privacy() {
  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-6">Last updated: April 2026</p>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              M&M Performance ("we", "us", "our") operates mandmautoperformance.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 mb-4">We collect information in the following ways:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Personal Information:</strong> Name, email, phone, address, date of birth (for age verification)</li>
              <li><strong>Driver Information:</strong> License number, expiry date, driving history (for vehicle rental)</li>
              <li><strong>Payment Information:</strong> Card details (processed securely via Stripe)</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, actions taken (via Google Analytics)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use your information for:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Processing rental bookings and payments</li>
              <li>Verifying your identity and eligibility</li>
              <li>Communicating with you about bookings</li>
              <li>Improving our services</li>
              <li>Marketing (with your consent)</li>
              <li>Complying with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>HTTPS encryption (SSL/TLS)</li>
              <li>Secure password hashing</li>
              <li>PCI DSS compliance for payment processing</li>
              <li>Regular security audits</li>
              <li>Limited staff access to sensitive data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">5. Your Rights (GDPR)</h2>
            <p className="text-gray-700 mb-4">Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion (right to be forgotten)</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
              <li>Object to processing</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, contact: <strong>privacy@mandmautoperformance.com</strong>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies for authentication, preferences, and analytics. You can control cookie settings in your browser.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">7. Third Parties</h2>
            <p className="text-gray-700 mb-4">We share data with:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Google Analytics:</strong> Website analytics</li>
              <li><strong>Supabase:</strong> Data hosting</li>
              <li><strong>SendGrid:</strong> Email delivery</li>
              <li><strong>Insurance providers:</strong> For rental protection</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
            <p className="text-gray-700">
              Data Protection Officer: <strong>dpo@mandmautoperformance.com</strong><br/>
              General Inquiries: <strong>privacy@mandmautoperformance.com</strong><br/>
              Address: London, United Kingdom
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
