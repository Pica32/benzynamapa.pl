import { POSTS } from '@/app/aktualnosci/page';
import { getStats, formatPrice } from '@/lib/data';

export const dynamic = 'force-static';
export const revalidate = 21600;

/**
 * RSS 2.0 feed pro blog + aktualne ceny.
 *
 * Konsumováno:
 * - Google News
 * - Feed readers (Feedly, NewsBlur, Inoreader)
 * - AI crawlery (citácí novinky o cenách paliw)
 * - Email digesty
 *
 * Spec: https://www.rssboard.org/rss-specification
 */
export function GET() {
  const stats = getStats();
  const now = new Date();
  const buildDate = now.toUTCString();

  const escape = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Items: nejdřív aktualne ceny jako "news" item (refresh každý feed), pak blog posty
  const priceItem = stats ? `
    <item>
      <title>Aktualne średnie ceny paliw w Polsce (${now.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })})</title>
      <link>https://benzynamapa.pl/</link>
      <guid isPermaLink="false">benzynamapa-pl-prices-${now.toISOString().slice(0, 10)}</guid>
      <pubDate>${buildDate}</pubDate>
      <category>Ceny paliw</category>
      <description><![CDATA[
        <p><strong>Średnie ceny paliw w Polsce dziś:</strong></p>
        <ul>
          <li>Benzyna 95: <strong>${formatPrice(stats.averages.pb95)}/l</strong></li>
          ${stats.averages.pb98 ? `<li>Benzyna 98: <strong>${formatPrice(stats.averages.pb98)}/l</strong></li>` : ''}
          <li>Olej napędowy (diesel): <strong>${formatPrice(stats.averages.on)}/l</strong></li>
          <li>LPG Autogaz: <strong>${formatPrice(stats.averages.lpg)}/l</strong></li>
        </ul>
        <p>Trend ostatnich 7 dni: Pb95 ${(stats.trend_7d?.pb95 ?? 0) >= 0 ? '+' : ''}${(stats.trend_7d?.pb95 ?? 0).toFixed(2)} zł/l,
        Diesel ${(stats.trend_7d?.on ?? 0) >= 0 ? '+' : ''}${(stats.trend_7d?.on ?? 0).toFixed(2)} zł/l.</p>
        <p>Monitorujemy ${stats.total_stations.toLocaleString('pl')} stacji paliw. Aktualizacja 3× dziennie.</p>
        <p><a href="https://benzynamapa.pl/">Sprawdź najtańsze stacje na mapie BenzynaMAPA.pl</a></p>
      ]]></description>
    </item>` : '';

  const blogItems = POSTS.map(post => `
    <item>
      <title>${escape(post.title)}</title>
      <link>https://benzynamapa.pl/aktualnosci/${post.slug}/</link>
      <guid isPermaLink="true">https://benzynamapa.pl/aktualnosci/${post.slug}/</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escape(post.tag)}</category>
      <description><![CDATA[<p>${post.excerpt}</p><p><strong>Czytaj więcej:</strong> <a href="https://benzynamapa.pl/aktualnosci/${post.slug}/">${post.title}</a></p>]]></description>
      <author>kontakt@benzynamapa.pl (BenzynaMAPA.pl)</author>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>BenzynaMAPA.pl - ceny paliw w Polsce</title>
    <link>https://benzynamapa.pl/</link>
    <atom:link href="https://benzynamapa.pl/rss.xml" rel="self" type="application/rss+xml" />
    <description>Aktualne ceny benzyny, diesla i LPG na 8 600+ stacjach paliw w Polsce. Analizy, porady i prognozy.</description>
    <language>pl-PL</language>
    <copyright>© ${now.getFullYear()} BenzynaMAPA.pl</copyright>
    <pubDate>${buildDate}</pubDate>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <ttl>360</ttl>
    <category>Ceny paliw</category>
    <category>Motoryzacja</category>
    <category>Polska</category>
    <generator>Next.js 16 + BenzynaMAPA RSS generator</generator>
    <managingEditor>kontakt@benzynamapa.pl (BenzynaMAPA.pl)</managingEditor>
    <webMaster>kontakt@benzynamapa.pl (BenzynaMAPA.pl)</webMaster>
    <image>
      <url>https://benzynamapa.pl/icon-512.png</url>
      <title>BenzynaMAPA.pl</title>
      <link>https://benzynamapa.pl/</link>
      <width>512</width>
      <height>512</height>
    </image>
${priceItem}
${blogItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=21600',
    },
  });
}
