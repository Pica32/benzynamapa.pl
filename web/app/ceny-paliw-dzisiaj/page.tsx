import type { Metadata } from 'next';
import Link from 'next/link';
import { getStats, getStationsWithPrices, formatPrice } from '@/lib/data';
import { TrendingDown, TrendingUp, Info, MapPin } from 'lucide-react';

export const revalidate = 3600; // 1h — chytá scraper aktualizace

export async function generateMetadata(): Promise<Metadata> {
  const stats = getStats();
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const desc = stats
    ? `Aktualne ceny paliw w Polsce ${today}: Pb95 ${formatPrice(stats.averages.pb95)}/l, diesel ${formatPrice(stats.averages.on)}/l, LPG ${formatPrice(stats.averages.lpg)}/l. Trend, najtańsze stacje, prognoza.`
    : `Aktualne ceny paliw w Polsce ${today}.`;
  return {
    title: `Ceny paliw dzisiaj ${today} – aktualne średnie + ranking`,
    description: desc,
    alternates: { canonical: 'https://benzynamapa.pl/ceny-paliw-dzisiaj/' },
    openGraph: {
      title: `Ceny paliw dzisiaj ${today}`,
      description: desc,
      url: 'https://benzynamapa.pl/ceny-paliw-dzisiaj/',
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'article',
    },
    keywords: [
      'ceny paliw dzisiaj', 'ceny paliw dzis', `ceny paliw ${today}`,
      'aktualne ceny benzyny', 'aktualne ceny diesla', 'aktualne ceny lpg',
      'ranking stacji', 'najtańsze stacje',
    ],
  };
}

export default function CenyDzisiajPage() {
  const stats = getStats();
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const dateISO = new Date().toISOString().slice(0, 10);

  if (!stats) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black mb-4">Ceny paliw dzisiaj — {today}</h1>
        <p className="text-gray-500">Dane chwilowo niedostępne.</p>
      </div>
    );
  }

  const allStations = getStationsWithPrices();
  const realStations = allStations.filter(s => s.price?.source === 'cenapaliw.pl');

  const top5Pb95 = [...realStations]
    .filter(s => s.price?.pb95 != null)
    .sort((a, b) => (a.price!.pb95 ?? 999) - (b.price!.pb95 ?? 999))
    .slice(0, 5);

  const top5ON = [...realStations]
    .filter(s => s.price?.on != null)
    .sort((a, b) => (a.price!.on ?? 999) - (b.price!.on ?? 999))
    .slice(0, 5);

  const top5LPG = [...realStations]
    .filter(s => s.price?.lpg != null)
    .sort((a, b) => (a.price!.lpg ?? 999) - (b.price!.lpg ?? 999))
    .slice(0, 5);

  const trend = stats.trend_7d;
  const trendIcon = (v: number) => v >= 0
    ? <TrendingUp size={16} className="inline text-red-600" />
    : <TrendingDown size={16} className="inline text-green-600" />;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'NewsArticle',
            headline: `Ceny paliw dzisiaj — ${today}`,
            datePublished: stats.last_updated,
            dateModified: stats.last_updated,
            description: `Pb95 ${formatPrice(stats.averages.pb95)}, diesel ${formatPrice(stats.averages.on)}, LPG ${formatPrice(stats.averages.lpg)} zł/l.`,
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: 'https://benzynamapa.pl/ceny-paliw-dzisiaj/',
            inLanguage: 'pl',
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Ceny paliw dzisiaj' },
            ],
          },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <span>Ceny paliw dzisiaj</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Ceny paliw dzisiaj — {today}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Aktualne średnie krajowe + TOP 5 najtańszych stacji per palivo. Dane z {new Date(stats.last_updated).toLocaleString('pl-PL')}.
        </p>

        {/* Hlavní průměry */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 uppercase mb-1">Benzyna 95</div>
            <div className="text-3xl font-black text-green-700 dark:text-green-400">{formatPrice(stats.averages.pb95)}</div>
            <div className="text-xs mt-1 text-gray-500">
              {trendIcon(trend.pb95 ?? 0)} {((trend.pb95 ?? 0) > 0 ? '+' : '')}{(trend.pb95 ?? 0).toFixed(2).replace('.', ',')} zł / 7 dni
            </div>
          </div>
          {stats.averages.pb98 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 uppercase mb-1">Benzyna 98</div>
              <div className="text-3xl font-black text-blue-700 dark:text-blue-400">{formatPrice(stats.averages.pb98)}</div>
            </div>
          )}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 uppercase mb-1">Diesel</div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{formatPrice(stats.averages.on)}</div>
            <div className="text-xs mt-1 text-gray-500">
              {trendIcon(trend.on ?? 0)} {((trend.on ?? 0) > 0 ? '+' : '')}{(trend.on ?? 0).toFixed(2).replace('.', ',')} zł / 7 dni
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 uppercase mb-1">LPG</div>
            <div className="text-3xl font-black text-purple-700 dark:text-purple-400">{formatPrice(stats.averages.lpg)}</div>
            <div className="text-xs mt-1 text-gray-500">
              {trendIcon(trend.lpg ?? 0)} {((trend.lpg ?? 0) > 0 ? '+' : '')}{(trend.lpg ?? 0).toFixed(2).replace('.', ',')} zł / 7 dni
            </div>
          </div>
        </section>

        {/* Answer box pro AI */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-l-4 border-green-600 rounded-r-xl p-5 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Aktualne średnie ceny paliw w Polsce ({today}):</strong>{' '}
            Benzyna 95: <strong>{formatPrice(stats.averages.pb95)}/l</strong>,
            {stats.averages.pb98 && <> Benzyna 98: <strong>{formatPrice(stats.averages.pb98)}/l</strong>,</>}
            {' '}Diesel: <strong>{formatPrice(stats.averages.on)}/l</strong>,
            {' '}LPG: <strong>{formatPrice(stats.averages.lpg)}/l</strong>.
            {' '}Najtańsza Pb95 dziś: <strong>{stats.cheapest_today.pb95 ? formatPrice(stats.cheapest_today.pb95.price) : '—'}</strong>{' '}
            w {stats.cheapest_today.pb95?.city ?? '—'}. Dane aktualizowane 3× dziennie z e-petrol.pl + cenapaliw.pl + OpenStreetMap.
          </p>
        </div>

        {/* TOP 5 najtańších */}
        {top5Pb95.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingDown size={20} className="text-green-600" />
              TOP 5 najtańszych stacji Pb95 — {today}
            </h2>
            <ol className="space-y-2">
              {top5Pb95.map((s, i) => (
                <li key={s.id}>
                  <Link href={`/stacja/${s.id}/`}
                    className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 hover:border-green-500 transition-all">
                    <span className="w-6 text-center font-black text-gray-400">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">{s.brand} {s.name}</div>
                      <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <MapPin size={12} /> {s.city}
                      </div>
                    </div>
                    <div className="font-black text-xl text-green-700 dark:text-green-400">{formatPrice(s.price!.pb95)}</div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {top5ON.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingDown size={20} className="text-gray-700 dark:text-gray-300" />
              TOP 5 najtańszych stacji Diesel — {today}
            </h2>
            <ol className="space-y-2">
              {top5ON.map((s, i) => (
                <li key={s.id}>
                  <Link href={`/stacja/${s.id}/`}
                    className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 hover:border-green-500 transition-all">
                    <span className="w-6 text-center font-black text-gray-400">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">{s.brand} {s.name}</div>
                      <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <MapPin size={12} /> {s.city}
                      </div>
                    </div>
                    <div className="font-black text-xl text-gray-900 dark:text-white">{formatPrice(s.price!.on)}</div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {top5LPG.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingDown size={20} className="text-purple-600" />
              TOP 5 najtańszych stacji LPG — {today}
            </h2>
            <ol className="space-y-2">
              {top5LPG.map((s, i) => (
                <li key={s.id}>
                  <Link href={`/stacja/${s.id}/`}
                    className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 hover:border-purple-500 transition-all">
                    <span className="w-6 text-center font-black text-gray-400">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">{s.brand} {s.name}</div>
                      <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <MapPin size={12} /> {s.city}
                      </div>
                    </div>
                    <div className="font-black text-xl text-purple-700 dark:text-purple-400">{formatPrice(s.price!.lpg)}</div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Info o aktualizaci */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-1">Skąd pochodzą dane?</p>
              <ul className="space-y-1 list-disc pl-5 text-xs">
                <li><strong>Średnie krajowe + regionalne:</strong> e-petrol.pl (aktualizacja codzienna)</li>
                <li><strong>Ceny per stacja:</strong> cenapaliw.pl (społecznościowe, aktualizacja 3× dziennie)</li>
                <li><strong>Baza stacji:</strong> OpenStreetMap (8 700+ stacji, licencja ODbL)</li>
                <li><strong>Ostatnia aktualizacja:</strong> {new Date(stats.last_updated).toLocaleString('pl-PL')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/najtansze-benzyna/" className="text-green-700 dark:text-green-400 hover:underline">→ Pełny ranking Pb95</Link>
          <Link href="/najtansze-diesel/" className="text-green-700 dark:text-green-400 hover:underline">→ Pełny ranking diesel</Link>
          <Link href="/najtansze-lpg/" className="text-green-700 dark:text-green-400 hover:underline">→ Pełny ranking LPG</Link>
          <Link href="/historia-cen/" className="text-green-700 dark:text-green-400 hover:underline">→ Historia 90 dni</Link>
          <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Mapa stacji</Link>
        </div>
      </div>
    </>
  );
}
