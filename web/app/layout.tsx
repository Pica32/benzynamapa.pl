import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WebVitals from '@/components/WebVitals';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/CookieConsent';

// Google Consent Mode v2: default 'denied' MUSÍ být v <head> PŘED načtením
// AdSense / GA scriptů, jinak Google nezohlední uživatelovu volbu.
const CONSENT_DEFAULTS = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
`;

const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap', preload: true });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16a34a',
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://benzynamapa.pl'),
  title: {
    default: 'Najtańsze paliwo w Polsce dziś – BenzynaMAPA',
    template: '%s – BenzynaMAPA',
  },
  description: 'Aktualne ceny paliw w Polsce. Najtańsza benzyna 95, diesel i LPG na mapie 8000+ stacji paliw. Porównaj ceny i zatankuj taniej. Aktualizacja 3× dziennie.',
  keywords: [
    'ceny paliw Polska', 'najtańsza benzyna', 'najtańszy diesel', 'mapa stacji paliw',
    'benzyna 95 cena', 'olej napędowy cena', 'LPG cena', 'gdzie zatankować najtaniej',
    'stacje paliw najtaniej', 'porównanie cen paliw', 'ceny paliw dziś',
    'benzyna cena mapa', 'diesel cena dzisiaj', 'tanie paliwo Warszawa',
    'aplikacja ceny paliw', 'BenzynaMAPA',
  ],
  authors: [{ name: 'BenzynaMAPA.pl' }],
  creator: 'BenzynaMAPA.pl',
  publisher: 'BenzynaMAPA.pl',
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://benzynamapa.pl/',
    siteName: 'BenzynaMAPA',
    title: 'Najtańsze paliwo w Polsce – BenzynaMAPA',
    description: 'Aktualne ceny paliw na 8000+ stacjach w Polsce. Interaktywna mapa. Benzyna 95, diesel, LPG.',
    images: [{
      url: 'https://benzynamapa.pl/og-image.jpg',
      width: 1200,
      height: 630,
      type: 'image/jpeg',
      alt: 'BenzynaMAPA – mapa najtańszych stacji paliw w Polsce',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Najtańsze paliwo w Polsce – BenzynaMAPA',
    description: 'Aktualne ceny paliw na 8000+ stacjach. Znajdź najtańszą stację w pobliżu.',
    images: ['https://benzynamapa.pl/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://benzynamapa.pl/',
    languages: {
      'pl-PL': 'https://benzynamapa.pl/',
      'cs-CZ': 'https://benzinmapa.cz/',
      'x-default': 'https://benzynamapa.pl/',
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BenzynaMAPA',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        {/* Consent Mode v2 — MUSÍ být první script, před AdSense/GA, jinak nezachytí default 'denied' */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS }} />

        {/* Google AdSense — must be in raw <head> for ownership verification */}
        <meta name="google-adsense-account" content="ca-pub-5944037956815415" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5944037956815415"
          crossOrigin="anonymous"
        />

        {/* Icons — PNG pro max. kompatibilitu (Safari, SEO auditátoři) */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#16a34a" />
        <meta name="theme-color" content="#16a34a" />

        {/* PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BenzynaMAPA" />

        {/* Performance */}
        {/* stats_latest.json: malý ~2 KB, čte ho většina stránek pro průměry — preload pomáhá LCP */}
        <link rel="preload" href="/data/stats_latest.json" as="fetch" crossOrigin="anonymous" />
        {/* map_data.json se nenačítá eagerly — spouští se až po hover/klik na mapu */}
        <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://ip-api.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Hreflang vazby pro EU cross-border traffic (Polacy v CZ, Czesi v PL) */}
        <link rel="alternate" hrefLang="pl-PL" href="https://benzynamapa.pl/" />
        <link rel="alternate" hrefLang="cs-CZ" href="https://benzinmapa.cz/" />
        <link rel="alternate" hrefLang="x-default" href="https://benzynamapa.pl/" />

        {/* llms.txt — pro AI asistenty (dynamic, refresh 6h) */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs guide (compact)" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLMs guide (full data dump)" />

        {/* RSS feed — Google News, Feedly, AI crawlery */}
        <link rel="alternate" type="application/rss+xml" href="/rss.xml" title="BenzynaMAPA - aktualne ceny i blog" />

        {/* JSON-LD — WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'BenzynaMAPA',
              alternateName: 'BenzynaMAPA.pl',
              url: 'https://benzynamapa.pl',
              description: 'Aktualne ceny paliw w Polsce – mapa stacji, porównanie cen benzyny, diesla i LPG',
              inLanguage: 'pl',
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://benzynamapa.pl/?q={search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* JSON-LD — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'BenzynaMAPA',
              url: 'https://benzynamapa.pl',
              logo: {
                '@type': 'ImageObject',
                url: 'https://benzynamapa.pl/icon-512.png',
                width: 512,
                height: 512,
              },
              sameAs: [
                'https://benzinmapa.cz',
                'https://github.com/Pica32/benzynamapa.pl',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'kontakt@benzynamapa.pl',
                availableLanguage: 'Polish',
              },
            }),
          }}
        />
        {/* JSON-LD — Dataset (Google Dataset Search index)
            JSON endpointy z aktualnymi cenami jsou publicznym datasetem.
            To pomáhá nás indexovat v Google Dataset Search + signál pro AI o strojově čitelných datech. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Dataset',
              name: 'Aktualne ceny paliw w Polsce – BenzynaMAPA dataset',
              description: 'Otwarty dataset aktualnych cen paliw (Pb95, Pb98, ON, LPG) na 8 600+ stacjach paliw w Polsce. Aktualizacja 3× dziennie.',
              url: 'https://benzynamapa.pl',
              keywords: ['ceny paliw', 'benzyna 95', 'diesel', 'LPG', 'Polska', 'stacje paliw', 'open data'],
              creator: { '@type': 'Organization', name: 'BenzynaMAPA.pl', url: 'https://benzynamapa.pl' },
              publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', url: 'https://benzynamapa.pl' },
              license: 'https://opendatacommons.org/licenses/odbl/1-0/',
              isAccessibleForFree: true,
              spatialCoverage: { '@type': 'Country', name: 'Polska', '@id': 'https://www.wikidata.org/wiki/Q36' },
              temporalCoverage: '2026-01/..',
              distribution: [
                {
                  '@type': 'DataDownload',
                  encodingFormat: 'application/json',
                  contentUrl: 'https://benzynamapa.pl/data/stats_latest.json',
                  name: 'Aktualne średnie ceny + statystyki',
                },
                {
                  '@type': 'DataDownload',
                  encodingFormat: 'application/json',
                  contentUrl: 'https://benzynamapa.pl/data/prices_latest.json',
                  name: 'Wszystkie aktualne ceny paliw',
                },
                {
                  '@type': 'DataDownload',
                  encodingFormat: 'application/json',
                  contentUrl: 'https://benzynamapa.pl/data/stations_latest.json',
                  name: 'Pełna lista stacji (GPS, adres, usługi)',
                },
                {
                  '@type': 'DataDownload',
                  encodingFormat: 'application/json',
                  contentUrl: 'https://benzynamapa.pl/data/history_90d.json',
                  name: '90-dniowa historia średnich cen',
                },
              ],
            }),
          }}
        />

        {/* JSON-LD — WebApplication (signál pro Google + AI o povaze aplikace) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'BenzynaMAPA',
              alternateName: 'BenzynaMAPA.pl',
              url: 'https://benzynamapa.pl',
              applicationCategory: 'TravelApplication',
              operatingSystem: 'Web (cross-platform)',
              browserRequirements: 'JavaScript, HTML5',
              inLanguage: 'pl',
              isAccessibleForFree: true,
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'PLN',
              },
              featureList: [
                'Mapa stacji paliw 8 600+',
                'Ceny benzyny 95, 98, diesla, LPG',
                'Aktualizacja 3× dziennie',
                'Filtry: sieć, paliwo, lokalizacja',
                'Nawigacja (Google Maps, Waze, Apple Maps)',
                'Historia cen 90 dni',
                'Kalkulator zużycia paliwa',
                'Porównanie sieci stacji',
                'Bez rejestracji, bez reklam',
              ],
              screenshot: 'https://benzynamapa.pl/map-preview.png',
              softwareVersion: '2.0',
              datePublished: '2025-10-01',
              dateModified: new Date().toISOString().slice(0, 10),
              author: { '@type': 'Organization', name: 'BenzynaMAPA.pl', url: 'https://benzynamapa.pl' },
              maintainer: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            }),
          }}
        />
        {/* JSON-LD — SoftwareSourceCode (open source signal pro AI + Knowledge Graph) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareSourceCode',
              name: 'BenzynaMAPA.pl source code',
              description: 'Otwarty kod scrapera i aplikacji webowej BenzynaMAPA.pl.',
              codeRepository: 'https://github.com/Pica32/benzynamapa.pl',
              programmingLanguage: ['TypeScript', 'Python', 'JavaScript'],
              runtimePlatform: ['Next.js 16', 'React 19', 'Node.js', 'Python 3.12'],
              license: 'https://opendatacommons.org/licenses/odbl/1-0/',
              maintainer: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
              codeSampleType: 'full',
            }),
          }}
        />
        {/* JSON-LD — LocalBusiness (fuel price aggregator) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'BenzynaMAPA – porównywarka cen paliw',
              serviceType: 'Fuel Price Comparison',
              provider: { '@type': 'Organization', name: 'BenzynaMAPA', url: 'https://benzynamapa.pl' },
              areaServed: { '@type': 'Country', name: 'Poland', '@id': 'https://www.wikidata.org/wiki/Q36' },
              description: 'Porównywarka cen benzyny, diesla i LPG na 8600+ stacjach paliw w Polsce',
              url: 'https://benzynamapa.pl',
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col`}>
        <GoogleAnalytics />
        <WebVitals />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        {/* Vercel real-user monitoring — CWV bez třetích stran (LCP/INP/CLS) + page views */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
