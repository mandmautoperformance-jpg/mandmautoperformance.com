import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="M&M Auto Performance - Premium AI-powered luxury and supercar hire in Hertfordshire and London. Featuring MIA, your Motor Intelligence Assistant." />
        <meta name="keywords" content="luxury car hire, supercar rental, Hertfordshire, London, St Albans, Watford, performance cars, AI booking, M&M Auto Performance" />
        <meta property="og:title" content="M&M Auto Performance | Premium AI Car Hire" />
        <meta property="og:description" content="Premium luxury and supercar hire powered by MIA - your Motor Intelligence Assistant. Serving Hertfordshire and London." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mandmautoperformance.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="M&M Auto Performance" />
        <meta name="twitter:description" content="Premium AI-powered luxury car hire in Hertfordshire & London" />
        <link rel="canonical" href="https://mandmautoperformance.com" />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoRental",
              "name": "M&M Auto Performance",
              "description": "Premium AI-powered luxury and supercar hire in Hertfordshire and London",
              "url": "https://mandmautoperformance.com",
              "email": "hello@mandmautoperformance.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "St Albans",
                "addressRegion": "Hertfordshire",
                "addressCountry": "GB"
              },
              "areaServed": [
                { "@type": "City", "name": "St Albans" },
                { "@type": "City", "name": "Watford" },
                { "@type": "City", "name": "Hemel Hempstead" },
                { "@type": "City", "name": "Luton" },
                { "@type": "City", "name": "Harpenden" },
                { "@type": "City", "name": "London" }
              ],
              "priceRange": "£££",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                "opens": "00:00",
                "closes": "23:59"
              }
            })
          }}
        />
      </Head>
      <body className="bg-gunmetal text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
