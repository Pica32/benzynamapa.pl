import type { MetadataRoute } from 'next';
import { getStationsWithPrices } from '@/lib/data';
import { CITIES, BRAND_PAGES, REGIONS, HIGHWAYS, BORDERS } from '@/types';

export const dynamic = 'force-static';

const BLOG_SLUGS = [
  'kiedy-tankowac-najtaniej-dzien-pora',
  'lpg-oplacalnosc-kalkulator-2026',
  'ceny-paliw-polska-vs-europa-2026',
  'jak-oszczedzac-na-paliwie-10-sposobow',
  'prognozy-cen-paliw-polska-2026',
  'adblue-co-to-jest-cena-gdzie-kupic-2026',
  'karty-paliwowe-orlen-vitay-bp-porownanie-2026',
  'turystyka-paliwowa-polska-niemcy-czechy-2026',
  // P1.10
  'akcyza-paliwowa-2026-waloryzacja',
  'ets2-system-handlu-emisjami-paliwa-2027',
  'najtansze-stacje-a1-a2-a4-ranking-2026',
  'lotos-navigator-vs-orlen-vitay-2026',
  'paliwo-w-firmie-pit-vat-kilometrowka-2026',
  'pb95-vs-pb98-do-mojego-auta',
  'czy-orlen-ma-najtansze-paliwo-2026',
  'on-arktic-diesel-zimowy-2026',
  'benzyna-e10-czy-niszczy-silnik',
  'stacje-samoobslugowe-vs-obslugowe-cena',
  'tankowanie-zima-porady-paliwa-mroz',
];

const COMPARE_SLUGS = [
  'pb95-vs-pb98', 'diesel-vs-benzyna', 'lpg-vs-benzyna', 'ev-vs-spalinowe',
  'orlen-vs-shell', 'orlen-vs-bp', 'shell-vs-bp', 'moya-vs-huzar', 'orlen-vs-lotos',
  'shell-vpower-vs-orlen-verva', 'polska-vs-niemcy', 'polska-vs-czechy',
  'polska-vs-ukraina', 'orlen-vitay-vs-bp-bonusmania',
];

const BASE = 'https://benzynamapa.pl';

/**
 * Sitemap — jediná, ~11 067 URL.
 *
 * Předtím se používala generateSitemaps() (split do 6 batches /sitemap/0..5.xml),
 * ale to negeneruje root /sitemap.xml. Robots.txt + Google očekávají /sitemap.xml.
 *
 * Google podporuje až 50 000 URL nebo 50 MB per sitemap — my pod limitem (~11k URL).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Statické routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                       changeFrequency: 'hourly',  priority: 1.0,  lastModified: now },
    { url: `${BASE}/najtansze-benzyna/`,     changeFrequency: 'hourly',  priority: 0.9,  lastModified: now },
    { url: `${BASE}/najtansze-diesel/`,      changeFrequency: 'hourly',  priority: 0.9,  lastModified: now },
    { url: `${BASE}/najtansze-lpg/`,         changeFrequency: 'hourly',  priority: 0.85, lastModified: now },
    { url: `${BASE}/historia-cen/`,          changeFrequency: 'daily',   priority: 0.8,  lastModified: now },
    { url: `${BASE}/kalkulator/`,            changeFrequency: 'weekly',  priority: 0.7,  lastModified: now },
    { url: `${BASE}/marka/`,                 changeFrequency: 'weekly',  priority: 0.8,  lastModified: now },
    { url: `${BASE}/wojewodztwo/`,           changeFrequency: 'daily',   priority: 0.85, lastModified: now },
    { url: `${BASE}/autostrada/`,            changeFrequency: 'weekly',  priority: 0.8,  lastModified: now },
    { url: `${BASE}/granica/`,               changeFrequency: 'weekly',  priority: 0.75, lastModified: now },
    { url: `${BASE}/api-docs/`,              changeFrequency: 'monthly', priority: 0.6,  lastModified: now },
    { url: `${BASE}/porownanie/`,            changeFrequency: 'weekly',  priority: 0.75, lastModified: now },
    { url: `${BASE}/ceny-paliw-dzisiaj/`,    changeFrequency: 'hourly',  priority: 0.95, lastModified: now },
    { url: `${BASE}/en/`,                    changeFrequency: 'daily',   priority: 0.6,  lastModified: now },
    { url: `${BASE}/benzyna-vs-diesel/`,     changeFrequency: 'monthly', priority: 0.75, lastModified: now },
    { url: `${BASE}/aktualnosci/`,           changeFrequency: 'daily',   priority: 0.85, lastModified: now },
    { url: `${BASE}/maksymalne-ceny-paliw/`, changeFrequency: 'monthly', priority: 0.8,  lastModified: now },
    // Stránky pro paliva
    { url: `${BASE}/benzyna-95/`,            changeFrequency: 'daily',   priority: 0.85, lastModified: now },
    { url: `${BASE}/benzyna-98/`,            changeFrequency: 'daily',   priority: 0.8,  lastModified: now },
    { url: `${BASE}/olej-napedowy/`,         changeFrequency: 'daily',   priority: 0.85, lastModified: now },
    { url: `${BASE}/lpg/`,                   changeFrequency: 'daily',   priority: 0.85, lastModified: now },
    { url: `${BASE}/adblue/`,                changeFrequency: 'weekly',  priority: 0.7,  lastModified: now },
    { url: `${BASE}/stacje-ladowania-ev/`,   changeFrequency: 'weekly',  priority: 0.7,  lastModified: now },
    // Informativní statické
    { url: `${BASE}/o-nas/`,                 changeFrequency: 'monthly', priority: 0.5,  lastModified: now },
    { url: `${BASE}/jak-dziala/`,            changeFrequency: 'monthly', priority: 0.6,  lastModified: now },
    { url: `${BASE}/regulamin/`,             changeFrequency: 'yearly',  priority: 0.3,  lastModified: now },
    { url: `${BASE}/cookies/`,               changeFrequency: 'yearly',  priority: 0.3,  lastModified: now },
    { url: `${BASE}/polityka-prywatnosci/`,  changeFrequency: 'yearly',  priority: 0.3,  lastModified: now },
    { url: `${BASE}/kontakt/`,               changeFrequency: 'monthly', priority: 0.5,  lastModified: now },
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map(c => ({
    url: `${BASE}/miasto/${c.slug}/`,
    changeFrequency: 'daily' as const,
    priority: 0.85,
    lastModified: now,
  }));

  const regionRoutes: MetadataRoute.Sitemap = REGIONS.map(r => ({
    url: `${BASE}/wojewodztwo/${r.slug}/`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
    lastModified: now,
  }));

  const highwayRoutes: MetadataRoute.Sitemap = HIGHWAYS.map(h => ({
    url: `${BASE}/autostrada/${h.slug}/`,
    changeFrequency: 'daily' as const,
    priority: 0.75,
    lastModified: now,
  }));

  const borderRoutes: MetadataRoute.Sitemap = BORDERS.map(b => ({
    url: `${BASE}/granica/${b.slug}/`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    lastModified: now,
  }));

  const compareRoutes: MetadataRoute.Sitemap = COMPARE_SLUGS.map(s => ({
    url: `${BASE}/porownanie/${s}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
    lastModified: now,
  }));

  const brandRoutes: MetadataRoute.Sitemap = BRAND_PAGES.map(b => ({
    url: `${BASE}/marka/${b.slug}/`,
    changeFrequency: 'daily' as const,
    priority: 0.75,
    lastModified: now,
  }));

  // Brand × City: 6 × 165 = ~990 URL
  const brandCityRoutes: MetadataRoute.Sitemap = BRAND_PAGES.flatMap(b =>
    CITIES.map(c => ({
      url: `${BASE}/marka/${b.slug}/${c.slug}/`,
      changeFrequency: 'daily' as const,
      priority: 0.65,
      lastModified: now,
    }))
  );

  // Brand × Region: 6 × 16 = 96 URL
  const brandRegionRoutes: MetadataRoute.Sitemap = BRAND_PAGES.flatMap(b =>
    REGIONS.map(r => ({
      url: `${BASE}/marka/${b.slug}/wojewodztwo/${r.slug}/`,
      changeFrequency: 'daily' as const,
      priority: 0.7,
      lastModified: now,
    }))
  );

  const blogRoutes: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => ({
    url: `${BASE}/aktualnosci/${slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    lastModified: new Date('2026-05-18'),
  }));

  // ~8 700 stanic — hourly priority pro stanice s real cenou
  let stationRoutes: MetadataRoute.Sitemap = [];
  try {
    const stations = getStationsWithPrices();
    stationRoutes = stations
      .filter(s => s.price?.pb95 != null || s.price?.on != null)
      .map(s => ({
        url: `${BASE}/stacja/${s.id}/`,
        changeFrequency: 'hourly' as const,
        priority: s.price?.source === 'cenapaliw.pl' ? 0.7 : 0.5,
        lastModified: now,
      }));
  } catch {
    // No stations data yet
  }

  return [
    ...staticRoutes,
    ...cityRoutes,
    ...regionRoutes,
    ...highwayRoutes,
    ...borderRoutes,
    ...compareRoutes,
    ...brandRoutes,
    ...brandCityRoutes,
    ...brandRegionRoutes,
    ...blogRoutes,
    ...stationRoutes,
  ];
}
