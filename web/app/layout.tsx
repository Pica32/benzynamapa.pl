import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WebVitals from '@/components/WebVitals';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import GoogleAnalytics from '@/components/GoogleAnalytics';

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
        {/* Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#16a34a" />
        <meta name="theme-color" content="#16a34a" />

        {/* PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BenzynaMAPA" />

        {/* Performance */}
        {/* map_data.json se nenačítá eagerly — spouští se až po hover/klik na mapu */}
        <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://ip-api.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'BenzynaMAPA',
              url: 'https://benzynamapa.pl',
              description: 'Aktualne ceny paliw w Polsce – mapa stacji, porównanie cen',
              inLanguage: 'pl',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://benzynamapa.pl/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
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
                url: 'https://benzynamapa.pl/icon-512.svg',
                width: 512,
                height: 512,
              },
              sameAs: ['https://benzinmapa.cz'],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col`}>
        <GoogleAnalytics />
        <ServiceWorkerRegistration />
        <WebVitals />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
