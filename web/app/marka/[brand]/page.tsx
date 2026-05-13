import { getStationsByBrand, formatPrice, getBrandOffset, formatOffset, getBrandAvgPrice, getStats, slugify } from '@/lib/data';
import { BRAND_PAGES, FUEL_LABELS, type FuelType } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 21600;

export async function generateStaticParams() {
  return BRAND_PAGES.map(b => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand } = await params;
  const brandPage = BRAND_PAGES.find(b => b.slug === brand);
  if (!brandPage) return { title: 'Sieć nie znaleziona' };

  const offset = getBrandOffset(brandPage.brandKeys, 'pb95');
  const avg = getBrandAvgPrice(brandPage.brandKeys, 'pb95');
  const offsetLabel = offset != null ? formatOffset(offset) : brandPage.priceOffset;
  const avgPart = avg ? ` Średnia cena Pb95 ${formatPrice(avg.avg)}/l (${offsetLabel} od krajowej).` : '';

  return {
    title: `${brandPage.fullName} – ceny paliw 2026, stacje w Polsce`,
    description: `Aktualne ceny paliw na stacjach ${brandPage.fullName} w Polsce.${avgPart} Porównanie z innymi sieciami, mapa stacji, najtańsze tankowanie.`,
    alternates: { canonical: `https://benzynamapa.pl/marka/${brand}/` },
    openGraph: {
      title: `${brandPage.fullName} ceny paliw – BenzynaMAPA`,
      description: brandPage.description,
      url: `https://benzynamapa.pl/marka/${brand}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'website',
    },
  };
}

const FUELS: FuelType[] = ['pb95', 'pb98', 'on', 'lpg'];

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const brandPage = BRAND_PAGES.find(b => b.slug === brand);
  if (!brandPage) notFound();

  const stats = getStats();
  const stations = getStationsByBrand(brandPage);
  const withPrice = stations.filter(s => s.price?.pb95 != null || s.price?.on != null);

  const fuelStats = FUELS.map(f => {
    const avg = getBrandAvgPrice(brandPage.brandKeys, f);
    const nat = stats?.averages[f];
    return {
      fuel: f,
      avg: avg?.avg ?? null,
      n: avg?.n ?? 0,
      offset: avg && nat != null ? avg.avg - nat : null,
      nat: nat ?? null,
    };
  });

  const pb95Stat = fuelStats.find(f => f.fuel === 'pb95');
  const offsetNum = pb95Stat?.offset ?? brandPage.priceOffsetNum;
  const offsetLabel = pb95Stat?.offset != null ? formatOffset(pb95Stat.offset) : brandPage.priceOffset;

  const cheapest = [...withPrice]
    .filter(s => s.price?.pb95 != null && s.price.pb95 >= 5.0)
    .sort((a, b) => (a.price!.pb95 ?? 999) - (b.price!.pb95 ?? 999))
    .slice(0, 10);

  const cities = Array.from(new Set(stations.map(s => s.city).filter(Boolean)))
    .sort((a, b) =>
      stations.filter(s => s.city === b).length - stations.filter(s => s.city === a).length
    )
    .slice(0, 12);

  const faqs = [
    {
      q: `Jakie są aktualne ceny paliw na stacjach ${brandPage.name}?`,
      a: pb95Stat?.avg
        ? `Średnia cena benzyny 95 na stacjach ${brandPage.fullName} w Polsce wynosi ${formatPrice(pb95Stat.avg)}/l, co stanowi ${offsetLabel} od średniej krajowej. Dane aktualizujemy 3 razy dziennie.`
        : `Ceny paliw na stacjach ${brandPage.name} aktualizujemy 3 razy dziennie i pochodzą z serwisów agregujących oraz OpenStreetMap.`,
    },
    {
      q: `Czy ${brandPage.name} jest droższy od średniej krajowej?`,
      a: offsetNum > 0.05
        ? `Tak, ${brandPage.name} jest średnio o ${offsetLabel} droższy od krajowej średniej Pb95. Powodem są usługi premium, lokalizacje przy głównych trasach oraz programy lojalnościowe.`
        : offsetNum < -0.05
          ? `Nie, ${brandPage.name} oferuje ceny średnio ${offsetLabel} poniżej średniej krajowej Pb95. To jedna z tańszych sieci w Polsce.`
          : `Ceny na stacjach ${brandPage.name} są zbliżone do średniej krajowej Pb95 (${offsetLabel} odchylenie).`,
    },
    {
      q: `Ile stacji ${brandPage.name} jest w Polsce?`,
      a: `W naszej bazie znajduje się ${stations.length.toLocaleString('pl')} stacji ${brandPage.name}${brandPage.stationsCount ? `, łącznie sieć liczy ok. ${brandPage.stationsCount.toLocaleString('pl')} stacji` : ''}. Pełną listę znajdziesz na mapie BenzynaMAPA.pl.`,
    },
    {
      q: `Gdzie jest najtańsza stacja ${brandPage.name}?`,
      a: cheapest[0]
        ? `Najtańsza stacja ${brandPage.name} w naszej bazie to ${cheapest[0].name} w mieście ${cheapest[0].city} z ceną Pb95 ${formatPrice(cheapest[0].price!.pb95)}/l. Ranking aktualizujemy 3× dziennie.`
        : `Najtańsze stacje ${brandPage.name} znajdziesz w rankingu na BenzynaMAPA.pl. Ranking aktualizujemy 3× dziennie.`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
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
                  { '@type': 'ListItem', position: 3, name: brandPage.fullName, item: `https://benzynamapa.pl/marka/${brand}/` },
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
            ],
          }),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <ol className="flex flex-wrap gap-1 text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-green-700 dark:hover:text-green-400">Strona główna</Link><span className="mx-1">›</span></li>
          <li><Link href="/marka/" className="hover:text-green-700 dark:hover:text-green-400">Sieci stacji</Link><span className="mx-1">›</span></li>
          <li className="text-gray-900 dark:text-white font-semibold">{brandPage.fullName}</li>
        </ol>
      </nav>

      <div className="flex items-center gap-4 mb-6">
        <div className={`${brandPage.color} text-white rounded-xl px-4 py-2 text-xl font-black`} aria-hidden="true">{brandPage.name}</div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{brandPage.fullName} – ceny paliw</h1>
          <div className={`font-bold text-sm ${offsetNum > 0.025 ? 'text-red-600' : offsetNum < -0.025 ? 'text-green-600' : 'text-gray-500'}`}>
            Pb95: {offsetLabel} od średniej krajowej
          </div>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">{brandPage.description}</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Średnie ceny paliw na stacjach {brandPage.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Porównanie cen {brandPage.name} z krajową średnią według danych BenzynaMAPA.pl.</p>
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="text-left p-3 font-semibold">Paliwo</th>
                <th className="text-right p-3 font-semibold">Średnia {brandPage.name}</th>
                <th className="text-right p-3 font-semibold">Średnia Polska</th>
                <th className="text-right p-3 font-semibold">Różnica</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {fuelStats.map(({ fuel, avg, nat, offset, n }) => (
                <tr key={fuel} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-3 font-semibold text-gray-900 dark:text-white">{FUEL_LABELS[fuel]} <span className="text-xs text-gray-400 font-normal">(n={n.toLocaleString('pl')})</span></td>
                  <td className="p-3 text-right text-gray-700 dark:text-gray-300">{avg != null ? formatPrice(avg) : '—'}</td>
                  <td className="p-3 text-right text-gray-500 dark:text-gray-400">{nat != null ? formatPrice(nat) : '—'}</td>
                  <td className={`p-3 text-right font-bold ${offset == null ? 'text-gray-400' : offset > 0.025 ? 'text-red-600 dark:text-red-400' : offset < -0.025 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {offset != null ? formatOffset(offset) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {cheapest.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Najtańsze stacje {brandPage.name} w Polsce</h2>
          <ol className="space-y-2">
            {cheapest.map((s, i) => (
              <li key={s.id}>
                <Link href={`/stacja/${s.id}/`} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 hover:border-green-500 transition-all">
                  <span className="w-6 text-center font-black text-gray-400">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">{s.name}</div>
                    <div className="text-xs text-gray-500 truncate">{s.address}, {s.city}</div>
                  </div>
                  <div className="text-green-700 dark:text-green-400 font-black text-lg whitespace-nowrap">{formatPrice(s.price!.pb95)}</div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {cities.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Stacje {brandPage.name} w największych miastach</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map(city => (
              <Link
                key={city}
                href={`/miasto/${slugify(city)}/`}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 dark:hover:text-green-400 transition-all"
              >
                {brandPage.name} {city}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Wszystkie stacje {brandPage.name} z cenami ({withPrice.length})
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {withPrice.slice(0, 40).map(s => (
            <Link key={s.id} href={`/stacja/${s.id}/`} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition-all group">
              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 mb-1 truncate">{s.name}</div>
              <div className="text-xs text-gray-500 mb-3 truncate">{s.address}, {s.city}</div>
              <div className="flex gap-3 flex-wrap">
                {(['pb95', 'on', 'lpg'] as const).map(fuel => {
                  const price = s.price?.[fuel];
                  if (!price) return null;
                  return (
                    <div key={fuel} className="text-center">
                      <div className="text-xs text-gray-400">{FUEL_LABELS[fuel]}</div>
                      <div className="font-black text-green-700 dark:text-green-400 text-sm">{formatPrice(price)}</div>
                    </div>
                  );
                })}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Najczęściej zadawane pytania o {brandPage.name}</h2>
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

      <div className="text-sm">
        <Link href="/marka/" className="text-green-700 dark:text-green-400 hover:underline">← Porównaj wszystkie sieci stacji paliw</Link>
      </div>
    </div>
  );
}
