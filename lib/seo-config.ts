// SEO Configuration for M&M Performance
export const siteConfig = {
  name: 'M&M Performance - MIA',
  description: 'Premium AI-powered vehicle rental. Driver\'s Passport gamification. London & Hertfordshire.',
  url: 'https://mandmautoperformance.com',
  ogImage: 'https://mandmautoperformance.com/og-image.png',
};

export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'M&M Performance',
    url: 'https://mandmautoperformance.com',
    description: siteConfig.description,
    areaServed: ['London', 'Hertfordshire'],
    serviceType: 'Car Rental',
  },
};
