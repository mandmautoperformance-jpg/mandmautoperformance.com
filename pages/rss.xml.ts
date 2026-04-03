import { GetServerSideProps } from 'next';

function generateRSS() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>M&M Performance - Premium Vehicle Rental</title>
    <link>https://mandmautoperformance.com</link>
    <description>AI-powered luxury vehicle rental platform for London and Hertfordshire</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://mandmautoperformance.com/rss.xml" rel="self" type="application/rss+xml"/>
    
    <item>
      <title>Welcome to M&M Performance</title>
      <link>https://mandmautoperformance.com</link>
      <guid>mandmautoperformance.com</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Premium AI-powered vehicle rental platform now live. Book luxury cars with Driver&apos;s Passport gamification.</description>
    </item>
  </channel>
</rss>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rss = generateRSS();
  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(rss);
  res.end();
  return { props: {} };
};

export default function RSS() { return null; }
