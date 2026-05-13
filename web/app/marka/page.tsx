import { BRAND_PAGES, FUEL_LABELS, type FuelType } from '@/types';
import { getBrandOffset, getBrandAvgPrice, formatOffset, formatPrice, getStats } from '@/lib/data';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Porównanie sieci stacji paliw w Polsce – ceny 2026',
  description: 'Porównaj średnie ceny paliw na stacjach Orlen, Shell, BP, Circle K, Moya, Huzar i Lotos w Polsce. Która sieć stacji jest najtańsza? Dane BenzynaMAPA.pl.',
  alternates: { canonical: 'https://benzynamapa.pl/marka/' },
  openGraph: {
    title: 'Porównanie sieci stacji paliw w Polsce – ceny 2026',
    description: 'Średnie odchylenia cen Pb95, Pb98, ON i LPG dla głównych sieci stacji paliw w Polsce.',
    url: 'https://benzynamapa.pl/marka/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'website',
  },
};

const FUELS: FuelType[] = ['pb95', 'pb98', 'on', 'lpg'];

export default function MarkaPage() {
  const stats = getStats();

  const brands = BRAND_PAGES.map(b => {
    const fuelStats = FUELS.map(f => {
      const avg = getBrandAvgPrice(b.brandKeys, f);
      const nat = stats?.averages[f];
      return {
        fuel: f,
        avg: avg?.avg ?? null,
        offset: avg && nat != null ? avg.avg - nat : null,
      };
    });
    const pb95 = fuelStats.find(x => x.fuel === 'pb95');
    return {
      ...b,
      fuelStats,
      offsetNum: pb95?.offset ?? b.priceOffsetNum,
      offsetLabel: pb95?.offset != null ? formatOffset(pb95.offset) : b.priceOffset,
      avgPb95: pb95?.avg ?? null,
    };
  });

  const sorted = [...brands].sort((a, b) => (a.offsetNum ?? 0) - (b.offsetNum ?? 0));
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];

  const faqs = [
    {
      q: 'Która sieć stacji paliw jest najtańsza w Polsce?',
      a: cheapest
        ? `Według danych BenzynaMAPA.pl najtańszą siecią stacji paliw jest ${cheapest.fullName} ze średnią ceną Pb95 ${cheapest.avgPb95 ? formatPrice(cheapest.avgPb95) : '—'}/l (${cheapest.offsetLabel} od średniej krajowej). Niezależne sieci typu Moya i Huzar są zwykle o 0,10–0,20 zł/l tańsze niż duże marki brandowe.`
        : 'Najtańszymi sieciami stacji paliw w Polsce są zwykle niezależni operatorzy Moya, Huzar oraz stacje przy hipermarketach (Auchan, Carrefour, Intermarché).',
    },
    {
      q: 'Która sieć stacji paliw jest najdroższa w Polsce?',
      a: mostExpensive
        ? `Najdroższe ceny paliw oferuje sieć ${mostExpensive.fullName} (Pb95 ${mostExpensive.avgPb95 ? formatPrice(mostExpensive.avgPb95) : '—'}/l, ${mostExpensive.offsetLabel} od średniej). Marki premium Shell i BP są zwykle o 0,30–0,40 zł/l droższe niż średnia krajowa.`
        : 'Najwyższe ceny mają zwykle stacje sieciowe Shell, BP oraz Circle K, szczególnie zlokalizowane przy autostradach i głównych drogach krajowych.',
    },
    {
      q: 'Czy Orlen ma drogie paliwo?',
      a: 'Orlen, jako największa polska sieć paliwowa, ma ceny zbliżone do krajowej średniej. Po przejęciu Lotosu w 2022 r. obie marki działają jako jedna sieć z ujednoliconym cennikiem. Ceny są niższe niż Shell czy BP, ale wyższe niż Moya czy Huzar.',
    },
    {
      q: 'Dlaczego Shell i BP są droższe od średniej?',
      a: 'Shell i BP pozycjonują się jako marki premium oferujące paliwa wyższej jakości (V-Power, Ultimate), bogaty asortyment sklepu, kawiarnię oraz programy lojalnościowe. Ich lokalizacje są zwykle przy głównych trasach i autostradach, co podwyższa koszty operacyjne.',
    },
    {
      q: 'Czy warto tankować na stacjach Moya i Huzar?',
      a: 'Tak. Niezależne sieci Moya i Huzar oferują paliwa spełniające te same normy jakości (PN-EN 228 / PN-EN 590) co duże marki, ale za niższą cenę. Są szczególnie konkurencyjne poza autostradami. Różnica może wynieść 0,15–0,40 zł/l, czyli 7–20 zł oszczędności na pełnym baku.',
    },
    {
      q: 'Jak często aktualizujecie ceny paliw na stacjach?',
      a: 'Dane o cenach pobieramy automatycznie 3 razy dziennie z serwisów agregujących ceny paliw w Polsce (m.in. cenapaliw.pl). Bazę stacji łączymy z OpenStreetMap, co daje ponad 8 600 stacji w całej Polsce.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
                  { '@type': 'ListItem', position: 2, name: 'Sieci stacji paliw', item: 'https://benzynamapa.pl/marka/' },
                ],
              },
              {
                '@type': 'FAQPage',
                mainEntity: faqs.map(({ q, a }) => ({
                  '@type': 'Question',
                  name: q,
                  acceptedAnswer: { '@type': 'Answer', text: a },
                })),
              },
              {
                '@type': 'ItemList',
                name: 'Sieci stacji paliw w Polsce',
                itemListElement: sorted.map((b, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  url: `https://benzynamapa.pl/marka/${b.slug}/`,
                  name: b.fullName,
                })),
              },
            ],
          }),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <ol className="flex flex-wrap gap-1 text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-green-700 dark:hover:text-green-400">Strona główna</Link><span className="mx-1">›</span></li>
          <li className="text-gray-900 dark:text-white font-semibold">Sieci stacji paliw</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Porównanie sieci stacji paliw w Polsce</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
        Średnie ceny paliw na największych sieciach stacji paliw w Polsce – Orlen, Lotos, Shell, BP, Circle K, Moya i Huzar.
        Sprawdź, która sieć stacji oferuje najtańszą benzynę 95, diesel oraz LPG.
        {stats && (
          <> Krajowa średnia Pb95 wynosi obecnie <strong>{formatPrice(stats.averages.pb95)}/l</strong>, diesel <strong>{formatPrice(stats.averages.on)}/l</strong>.</>
        )}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Tabela porównania cen sieci stacji paliw</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Odchylenia średnich cen poszczególnych sieci stacji od krajowej średniej (dane BenzynaMAPA.pl).
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="text-left p-3 font-semibold">Sieć stacji</th>
                {FUELS.map(f => (
                  <th key={f} className="text-right p-3 font-semibold">{FUEL_LABELS[f]}</th>
                ))}
                <th className="text-right p-3 font-semibold">Strona</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {sorted.map(b => (
                <tr key={b.slug} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`${b.color} text-white rounded px-2 py-0.5 text-xs font-black`} aria-hidden="true">{b.name}</span>
                      <span className="text-gray-700 dark:text-gray-300 text-xs">{b.fullName}</span>
                    </div>
                  </td>
                  {b.fuelStats.map(({ fuel, offset }) => (
                    <td key={fuel} className={`p-3 text-right font-bold ${offset == null ? 'text-gray-400' : offset > 0.025 ? 'text-red-600 dark:text-red-400' : offset < -0.025 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {offset != null ? formatOffset(offset) : '—'}
                    </td>
                  ))}
                  <td className="p-3 text-right">
                    <Link href={`/marka/${b.slug}/`} className="text-green-700 dark:text-green-400 hover:underline text-xs font-semibold whitespace-nowrap">
                      {b.name} szczegóły →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Wartości dodatnie = sieć droższa od średniej, ujemne = tańsza. Pb95 = benzyna 95, Pb98 = benzyna 98, ON = olej napędowy (diesel), LPG = autogaz.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Wszystkie sieci stacji paliw – wybierz sieć</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {sorted.map(brand => {
            const n = brand.offsetNum ?? brand.priceOffsetNum;
            return (
              <Link key={brand.slug} href={`/marka/${brand.slug}/`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-green-500 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${brand.color} text-white rounded-lg px-3 py-1.5 text-sm font-black`} aria-hidden="true">{brand.name}</div>
                  <div className={`font-bold text-lg ${n > 0.025 ? 'text-red-600 dark:text-red-400' : n < -0.025 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {brand.offsetLabel}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{brand.description}</p>
                {brand.stationsCount && (
                  <div className="mt-3 text-xs text-gray-400">{brand.stationsCount.toLocaleString('pl')} stacji w Polsce</div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-green-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Jak czytać porównanie cen sieci stacji</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          Każda sieć stacji paliw ma własną politykę cenową. Marki premium (Shell, BP, Circle K) oferują dodatkowe usługi i są o 0,20–0,40 zł/l droższe od średniej.
          Polskie sieci niezależne (Moya, Huzar) konkurują niższymi cenami, szczególnie poza autostradami.
          Orlen z Lotosem trzymają ceny zbliżone do krajowej średniej. Na cenę wpływa też lokalizacja – stacje przy autostradach i w centrach miast są zwykle droższe.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Dane aktualizujemy automatycznie 3 razy dziennie z serwisów agregujących i OpenStreetMap.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Najczęściej zadawane pytania o sieci stacji paliw</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                {q}
                <span className="text-green-600 group-open:rotate-180 transition-transform ml-3 flex-shrink-0" aria-hidden="true">▼</span>
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
