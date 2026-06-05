import Head from 'next/head';
import Navbar from '@/components/Navbar';

export default function CookiePolicy() {
  return (
    <>
      <Head>
        <title>Cookie Policy | M&M Auto Performance</title>
        <meta name="description" content="M&M Auto Performance cookie policy — how we use cookies and how to control them." />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar />
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
            <p className="text-gray-400 mb-6">Last updated: April 2026</p>

            <section className="space-y-6 text-gray-300">
              <p>We use cookies to enhance your experience. By continuing to use this site, you consent to our use of cookies as described below.</p>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Essential Cookies</h3>
                <p>Required for site functionality — authentication sessions, security tokens, and CSRF protection. These cannot be disabled.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Analytics Cookies</h3>
                <p>Anonymous usage statistics to help us improve the site. No personal data is shared with analytics providers.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Preference Cookies</h3>
                <p>Remember your settings such as chosen vehicle filters and notification preferences.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Marketing Cookies</h3>
                <p>Used for targeted advertising only with your explicit consent. You can withdraw consent at any time via your browser settings.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">How to Control Cookies</h3>
                <p>You can manage or disable cookies in your browser settings. Note that disabling essential cookies will prevent login and booking functionality.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Contact</h3>
                <p>Cookie queries: <span className="text-performance-turquoise">privacy@mandmautoperformance.com</span></p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
