'use client';
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-Y900JP5XKF';

// Consent Mode v2 default 'denied' je nastaven v layout.tsx PŘED načtením tohoto scriptu.
// Tento komponent jen načte gtag.js a propojí ho s GA propertou — ciasteczka se uloží
// až po updateGtagConsent('granted') z CookieConsent komponenty.
export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
