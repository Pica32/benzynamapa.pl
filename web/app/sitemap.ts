import type { MetadataRoute } from 'next';
import { getStations } from '@/lib/data';
import { CITIES, BRAND_PAGES } from '@/types';

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://benzynamapa.pl';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`,                   changeFrequency: 'hourly', priority: 1.0, lastModified: now },
    { url: `${base}/najtansze-benzyna/`, changeFrequency: 'hourly', priority: 0.9, lastModified: now },
    { url: `${base}/najtansze-diesel/`,  changeFrequency: 'hourly', priority: 0.9, lastModified: now },
    { url: `${base}/najtansze-lpg/`,     changeFrequency: 'hourly', priority: 0.8, lastModified: now },
    { url: `${base}/historia-cen/`,      changeFrequency: 'daily',  priority: 0.7, lastModified: now },
    { url: `${base}/kalkulator/`,        changeFrequency: 'weekly', priority: 0.6, lastModified: now },
    { url: `${base}/marka/`,             changeFrequency: 'weekly', priority: 0.7, lastModified: now },
    { url: `${base}/benzyna-vs-diesel/`, changeFrequency: 'monthly',priority: 0.7, lastModified: now },
    { url: `${base}/aktualnosci/`,       changeFrequency: 'daily',  priority: 0.8, lastModified: now },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => ({
    url: `${base}/aktualnosci/${slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    lastModified: new Date('2026-05-07'),
  }));

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map(c => ({
    url: `${base}/miasto/${c.slug}/`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
    lastModified: now,
  }));

  const brandRoutes: MetadataRoute.Sitemap = BRAND_PAGES.map(b => ({
    url: `${base}/marka/${b.slug}/`,
    changeFrequency: 'daily' as const,
    priority: 0.7,
    lastModified: now,
  }));

  let stationRoutes: MetadataRoute.Sitemap = [];
  try {
    const stations = getStations();
    stationRoutes = stations.map(s => ({
      url: `${base}/stacja/${s.id}/`,
      changeFrequency: 'daily' as const,
      priority: 0.5,
      lastModified: now,
    }));
  } catch {
    // No stations data yet
  }

  return [...staticRoutes, ...blogRoutes, ...cityRoutes, ...brandRoutes, ...stationRoutes];
}
