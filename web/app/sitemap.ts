import type { MetadataRoute } from 'next';
import { getStations } from '@/lib/data';
import { CITIES, BRAND_PAGES } from '@/types';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://benzynamapa.pl';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${base}/najtansze-benzyna/`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/najtansze-diesel/`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/najtansze-lpg/`, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${base}/historia-cen/`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/kalkulator/`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/marka/`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/aktualnosci/`, changeFrequency: 'daily', priority: 0.7 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map(c => ({
    url: `${base}/miasto/${c.slug}/`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const brandRoutes: MetadataRoute.Sitemap = BRAND_PAGES.map(b => ({
    url: `${base}/marka/${b.slug}/`,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  let stationRoutes: MetadataRoute.Sitemap = [];
  try {
    const stations = getStations();
    stationRoutes = stations.map(s => ({
      url: `${base}/stacja/${s.id}/`,
      changeFrequency: 'daily' as const,
      priority: 0.5,
    }));
  } catch {
    // No stations data yet
  }

  return [...staticRoutes, ...cityRoutes, ...brandRoutes, ...stationRoutes];
}
