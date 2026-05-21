export const dynamic = 'force-static';

/**
 * Sitemap index — odkazuje na 6 sub-sitemap batches.
 *
 * Next.js generateSitemaps() vytváří /sitemap/0.xml ... /sitemap/5.xml,
 * ale ne automatický index pod /sitemap.xml. Robots.txt + Google očekávají
 * `Sitemap: https://benzynamapa.pl/sitemap.xml`, takže potřebujeme manual index.
 *
 * Sitemap protocol: https://www.sitemaps.org/protocol.html#index
 */
export function GET() {
  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://benzynamapa.pl/sitemap/0.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://benzynamapa.pl/sitemap/1.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://benzynamapa.pl/sitemap/2.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://benzynamapa.pl/sitemap/3.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://benzynamapa.pl/sitemap/4.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://benzynamapa.pl/sitemap/5.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
