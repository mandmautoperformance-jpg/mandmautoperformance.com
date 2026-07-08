import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import '@/styles/globals.css';
import CookieConsent, { getStoredConsent, type ConsentChoice } from '@/components/CookieConsent';

const GA_ID = 'G-4DYY4B72L1';

export default function App({ Component, pageProps }: AppProps) {
  // Analytics stays OFF until the visitor actively consents (UK PECR / GDPR).
  // No Google Analytics script is loaded — and therefore no analytics cookies
  // are set — unless and until `consent === 'accepted'`.
  const [consent, setConsent] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="icon" href="/logo.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="mask-icon" href="/logo.svg" color="#000000" />
      </Head>

      {/* Google Analytics — only mounted after explicit consent. */}
      {consent === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      <Component {...pageProps} />

      <CookieConsent onChange={setConsent} />
    </>
  );
}
