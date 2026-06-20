import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
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

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-4DYY4B72L1"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4DYY4B72L1');
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}
