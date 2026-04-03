export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <section className="space-y-6 text-gray-700">
          <p>We use cookies to enhance your experience. By continuing to use this site, you consent to our use of cookies.</p>
          
          <div>
            <h3 className="text-xl font-bold mb-2">Essential Cookies</h3>
            <p>Required for site functionality (authentication, security)</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">Analytics Cookies</h3>
            <p>Google Analytics for usage statistics</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">Marketing Cookies</h3>
            <p>For targeted advertising (with consent)</p>
          </div>
        </section>
      </div>
    </main>
  );
}
