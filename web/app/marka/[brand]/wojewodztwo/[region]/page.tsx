import { getStationsByBrand, getStationsWithPrices, formatPrice, slugify } from '@/lib/data';
import { BRAND_PAGES, REGIONS, CITIES, FUEL_LABELS, type FuelType } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, TrendingDown, ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 21600;
export const dynamicParams = false;

type Props = { params: Promise<{ brand: string; region: string }> };

export async function generateStaticParams() {
  // 6 marek × 16 vojvodství = 96 stránek
  return BRAND_PAGES.flatMap(b =>
    REGIONS.map(r => ({ brand: b.slug, region: r.slug }))
  );
}

function intersectByRegion(brandStations: ReturnType<typeof getStationsByBrand>, regionName: string) {
  const target = regionName.toLowerCase();
  return brandStations.filter(s =>
    (s.region || '').toLowerCase().includes(target) ||
    slugify(s.region || '') === slugify(regionName)
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, region } = await params;
  const brandPage = BRAND_PAGES.find(b => b.slug === brand);
  const regionPage = REGIONS.find(r => r.slug === region);
  if (!brandPage || !regionPage) return { title: 'Strona nie znaleziona' };

  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const stations = intersectByRegion(getStationsByBrand(brandPage), regionPage.name);
  const realPb95 = stations.map(s => s.price?.pb95).filter((p): p is number => p != null);
  const avgPart = realPb95.length
    ? ` Średnia Pb95: ${formatPrice(realPb95.reduce((a, b) => a + b, 0) / realPb95.length)}/l.`
    : '';

  return {
    title: `${brandPage.name} ${regionPage.name} – stacje paliw, ceny (${today})`,
    description: `Stacje ${brandPage.fullName} w województwie ${regionPage.name}.${avgPart} ${stations.length} stacji, aktualne ceny, mapa, lokalizacje w głównych miastach (${regionPage.capital}).`,
    alternates: { canonical: `https://benzynamapa.pl/marka/${brand}/wojewodztwo/${region}/` },
    openGraph: {
      title: `${brandPage.name} ${regionPage.name} – ceny paliw`,
      description: `${stations.length} stacji ${brandPage.fullName} w województwie ${regionPage.name}. Aktualne ceny dziś.`,
      url: `https://benzynamapa.pl/marka/${brand}/wojewodztwo/${region}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'website',
    },
    keywords: [
      `${brandPage.name} ${regionPage.name}`,
      `stacje ${brandPage.name} ${regionPage.name}`,
      `${brandPage.name} województwo ${regionPage.name}`,
      `ceny ${brandPage.name} ${regionPage.name}`,
      `${brandPage.name} ${regionPage.capital}`,
    ],
  };
}

const FUELS: FuelType[] = ['pb95', 'pb98', 'on', 'lpg'];

export default async function BrandRegionPage({ params }: Props) {
  const { brand, region } = await params;
  const brandPage = BRAND_PAGES.find(b => b.slug === brand);
  const regionPage = REGIONS.find(r => r.slug === region);
  if (!brandPage || !regionPage) notFound();

  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const brandStations = getStationsByBrand(brandPage);
  const stations = intersectByRegion(brandStations, regionPage.name);

  const allInRegion = getStationsWithPrices().filter(s =>
    (s.region || '').toLowerCase().includes(regionPage.name.toLowerCase())
  );

  // Fuel stats
  const fuelStats = FUELS.map(f => {
    const brandPrices = stations.map(s => s.price?.[f]).filter((p): p is number => p != null && p > 0);
    const regionAll = allInRegion.map(s => s.price?.[f]).filter((p): p is number => p != null && p > 0);
    const brandAvg = brandPrices.length ? brandPrices.reduce((a, b) => a + b, 0) / brandPrices.length : null;
    const regionAvg = regionAll.length ? regionAll.reduce((a, b) => a + b, 0) / regionAll.length : null;
    return {
      fuel: f,
      brandAvg,
      regionAvg,
      diff: brandAvg && regionAvg ? brandAvg - regionAvg : null,
      n: brandPrices.length,
    };
  });
  const pb95 = fuelStats.find(f => f.fuel === 'pb95');

  // Top 10 stanic této marky v regionu
  const top10 = [...stations]
    .filter(s => s.price?.pb95 != null && s.price.pb95 > 0)
    .sort((a, b) => (a.price!.pb95 ?? 999) - (b.price!.pb95 ?? 999))
    .slice(0, 10);

  // Cities této marky v regionu
  const citiesWithBrand = Array.from(new Set(
    stations.map(s => s.city).filter(Boolean)
  ))
    .map(cityName => CITIES.find(c => c.name === cityName || slugify(c.name) === slugify(cityName)))
    .filter((c): c is NonNullable<typeof c> => c != null)
    .filter(c => c.region === regionPage.name)
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    .slice(0, 12);

  // Cross-link: jiné značky v tomto regionu
  const otherBrandsInRegion = BRAND_PAGES
    .filter(b => b.slug !== brand)
    .map(b => ({
      brand: b,
      count: intersectByRegion(getStationsByBrand(b), regionPage.name).length,
    }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count);

  // Cross-link: tato značka v jiných regionech
  const otherRegions = REGIONS
    .filter(r => r.slug !== region)
    .map(r => ({
      region: r,
      count: intersectByRegion(brandStations, r.name).length,
    }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const faqs = [
    {
      q: `Ile stacji ${brandPage.name} jest w województwie ${regionPage.name}?`,
      a: `W województwie ${regionPage.name} działa ${stations.length} stacji paliw sieci ${brandPage.fullName}. Pełna mapa: BenzynaMAPA.pl. Stolica regionu: ${regionPage.capital}.`,
    },
    {
      q: `Ile kosztuje benzyna 95 na stacjach ${brandPage.name} w ${regionPage.name}?`,
      a: pb95?.brandAvg
        ? `Średnia cena Pb95 na stacjach ${brandPage.name} w województwie ${regionPage.name} wynosi ${formatPrice(pb95.brandAvg)}/l. ${pb95.diff != null ? `Względem średniej regionu (${pb95.regionAvg ? formatPrice(pb95.regionAvg) : '—'}): ${pb95.diff > 0 ? '+' : ''}${pb95.diff.toFixed(2).replace('.', ',')} zł/l.` : ''}`
        : `Aktualne ceny benzyny 95 na stacjach ${brandPage.name} w ${regionPage.name} sprawdzisz w tabeli powyżej. Aktualizacja 3× dziennie.`,
    },
    {
      q: `Czy ${brandPage.name} jest tańszy w ${regionPage.name} niż średnia regionu?`,
      a: pb95?.diff != null
        ? pb95.diff > 0.05
          ? `Nie. ${brandPage.name} w województwie ${regionPage.name} jest średnio o ${pb95.diff.toFixed(2).replace('.', ',')} zł/l droższy od średniej regionu. Sieć ${brandPage.name} typowo ${brandPage.priceOffset} od średniej krajowej.`
          : pb95.diff < -0.05
            ? `Tak. ${brandPage.name} w ${regionPage.name} oferuje Pb95 średnio o ${Math.abs(pb95.diff).toFixed(2).replace('.', ',')} zł/l taniej od średniej regionu.`
            : `Ceny ${brandPage.name} w ${regionPage.name} są zbliżone do średniej regionu (różnica poniżej 0,05 zł/l).`
        : `Pełne porównanie cen dostępne w tabeli powyżej.`,
    },
    {
      q: `W jakich miastach w ${regionPage.name} są stacje ${brandPage.name}?`,
      a: citiesWithBrand.length > 0
        ? `${brandPage.name} ma stacje w następujących miastach województwa ${regionPage.name}: ${citiesWithBrand.slice(0, 10).map(c => c.name).join(', ')}${citiesWithBrand.length > 10 ? ` i ${citiesWithBrand.length - 10} innych` : ''}.`
        : `Stacje ${brandPage.name} są rozłożone głównie wokół ${regionPage.capital} i większych miast województwa ${regionPage.name}.`,
    },
    {
      q: `Jakie inne sieci stacji są w województwie ${regionPage.name}?`,
      a: otherBrandsInRegion.length > 0
        ? `W województwie ${regionPage.name} dostępne są też sieci: ${otherBrandsInRegion.slice(0, 6).map(x => `${x.brand.name} (${x.count})`).join(', ')}.`
        : `W województwie ${regionPage.name} dostępne są również stacje innych sieci - sprawdź pełną listę na stronie regionu.`,
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Sieci stacji', item: 'https://benzynamapa.pl/marka/' },
              { '@type': 'ListItem', position: 3, name: brandPage.fullName, item: `https://benzynamapa.pl/marka/${brand}/` },
              { '@type': 'ListItem', position: 4, name: `Województwo ${regionPage.name}`, item: `https://benzynamapa.pl/marka/${brand}/wojewodztwo/${region}/` },
            ],
          },
          {
            '@type': 'CollectionPage',
            '@id': `https://benzynamapa.pl/marka/${brand}/wojewodztwo/${region}/#CollectionPage`,
            name: `Stacje ${brandPage.fullName} w województwie ${regionPage.name}`,
            description: `${stations.length} stacji paliw sieci ${brandPage.fullName} w województwie ${regionPage.name}. Aktualne ceny.`,
            url: `https://benzynamapa.pl/marka/${brand}/wojewodztwo/${region}/`,
            inLanguage: 'pl',
            about: { '@type': 'Brand', name: brandPage.fullName },
            spatialCoverage: {
              '@type': 'AdministrativeArea',
              name: `Województwo ${regionPage.name}`,
              sameAs: `https://www.wikidata.org/wiki/${regionPage.wikidata}`,
              geo: { '@type': 'GeoCoordinates', latitude: regionPage.lat, longitude: regionPage.lng },
            },
          },
          {
            '@type': 'ItemList',
            name: `Najtańsze stacje ${brandPage.name} w województwie ${regionPage.name}`,
            numberOfItems: top10.length,
            itemListElement: top10.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'GasStation',
                name: s.name,
                brand: { '@type': 'Brand', name: brandPage.fullName },
                address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: s.city, addressRegion: regionPage.name, addressCountry: 'PL' },
                url: `https://benzynamapa.pl/stacja/${s.id}/`,
                ...(s.price?.pb95 != null ? {
                  makesOffer: { '@type': 'Offer', name: 'Benzyna 95', price: s.price.pb95, priceCurrency: 'PLN' },
                } : {}),
              },
            })),
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question', '.brand-region-answer'] },
          },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-1">›</span>
          <Link href="/marka/" className="hover:text-green-600">Sieci</Link>
          <span className="mx-1">›</span>
          <Link href={`/marka/${brand}/`} className="hover:text-green-600">{brandPage.name}</Link>
          <span className="mx-1">›</span>
          <span className="text-gray-900 dark:text-white">{regionPage.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`${brandPage.color} text-white rounded-xl px-4 py-2 text-xl font-black`} aria-hidden="true">
            {brandPage.name}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {brandPage.name} {regionPage.name} – stacje paliw {today}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stations.length} stacji {brandPage.fullName} w województwie {regionPage.name}
            </p>
          </div>
        </div>

        {/* AI Answer Box */}
        <div className="brand-region-answer bg-green-50 dark:bg-gray-800 border-l-4 border-green-500 rounded-r-xl p-4 mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>{brandPage.name} w województwie {regionPage.name}:</strong> {stations.length} stacji paliw{' '}
            {pb95?.brandAvg ? <>– średnia <strong>Pb95: {formatPrice(pb95.brandAvg)}/l</strong></> : ''}.
            {' '}Stolica województwa: <Link href={`/miasto/${regionPage.capitalSlug}/`} className="text-green-700 underline">{regionPage.capital}</Link>.
            {' '}Sieć {brandPage.fullName} typowo {brandPage.priceOffset} od średniej krajowej.
          </p>
        </div>

        {/* Tabulka cen */}
        {fuelStats.some(f => f.brandAvg !== null) && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Średnie ceny paliw – {brandPage.name} w województwie {regionPage.name}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="text-left p-3 font-semibold">Paliwo</th>
                    <th className="text-right p-3 font-semibold">Średnia {brandPage.name}</th>
                    <th className="text-right p-3 font-semibold">Średnia regionu</th>
                    <th className="text-right p-3 font-semibold">Różnica</th>
                    <th className="text-right p-3 font-semibold">Stacji</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {fuelStats.map(({ fuel, brandAvg, regionAvg, diff, n }) => (
                    <tr key={fuel}>
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">{FUEL_LABELS[fuel]}</td>
                      <td className="p-3 text-right font-bold text-green-700 dark:text-green-400">
                        {brandAvg != null ? formatPrice(brandAvg) : '—'}
                      </td>
                      <td className="p-3 text-right text-gray-600 dark:text-gray-400">
                        {regionAvg != null ? formatPrice(regionAvg) : '—'}
                      </td>
                      <td className={`p-3 text-right font-bold ${diff == null ? 'text-gray-400' : diff > 0.025 ? 'text-red-600' : diff < -0.025 ? 'text-green-600' : 'text-gray-500'}`}>
                        {diff != null ? `${diff > 0 ? '+' : ''}${diff.toFixed(2).replace('.', ',')}` : '—'}
                      </td>
                      <td className="p-3 text-right text-gray-400 text-xs">{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Top 10 stanic */}
        {top10.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingDown size={20} className="text-green-600" />
              Najtańsze stacje {brandPage.name} w {regionPage.name}
            </h2>
            <ol className="space-y-2">
              {top10.map((s, i) => (
                <li key={s.id}>
                  <Link href={`/stacja/${s.id}/`}
                    className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 hover:border-green-500 transition-all">
                    <span className="w-6 text-center font-black text-gray-400">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">{s.name}</div>
                      <div className="text-xs text-gray-500 truncate">{s.address}, {s.city}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-green-700 dark:text-green-400 font-black text-lg whitespace-nowrap">{formatPrice(s.price!.pb95)}</div>
                      {s.price?.on != null && (
                        <div className="text-xs text-gray-500 whitespace-nowrap">{formatPrice(s.price.on)} <span className="text-[10px]">ON</span></div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Brak stanic */}
        {stations.length === 0 && (
          <section className="mb-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-2">Brak stacji {brandPage.name} w województwie {regionPage.name}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              W naszej bazie aktualnie nie ma stacji {brandPage.fullName} w województwie {regionPage.name}.
              Sprawdź <Link href={`/wojewodztwo/${region}/`} className="text-green-600 hover:underline">wszystkie stacje w województwie {regionPage.name}</Link>{' '}
              lub <Link href={`/marka/${brand}/`} className="text-green-600 hover:underline">wszystkie stacje {brandPage.name}</Link>.
            </p>
          </section>
        )}

        {/* Miasta této marky */}
        {citiesWithBrand.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-green-600" />
              {brandPage.name} w miastach województwa {regionPage.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {citiesWithBrand.map(c => (
                <Link key={c.slug} href={`/marka/${brand}/${c.slug}/`}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-all">
                  {brandPage.name} {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Inne sieci v regionu */}
        {otherBrandsInRegion.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Inne sieci stacji w województwie {regionPage.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherBrandsInRegion.map(({ brand: b, count }) => (
                <Link key={b.slug} href={`/marka/${b.slug}/wojewodztwo/${region}/`}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-all">
                  {b.name} {regionPage.name} <span className="text-xs text-gray-400">({count})</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tato značka v jiných regionech */}
        {otherRegions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {brandPage.name} w innych województwach
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherRegions.map(({ region: r, count }) => (
                <Link key={r.slug} href={`/marka/${brand}/wojewodztwo/${r.slug}/`}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-all">
                  {brandPage.name} {r.name} <span className="text-xs text-gray-400">({count})</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SEO text */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Sieć {brandPage.name} w województwie {regionPage.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            {regionPage.description}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Sieć stacji paliw <strong>{brandPage.fullName}</strong> w województwie {regionPage.name} oferuje
            paliwo {pb95?.brandAvg ? <>w średniej cenie {formatPrice(pb95.brandAvg)}/l (Pb95)</> : 'w cenach zbliżonych do średniej regionu'}.
            {' '}{brandPage.description}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Pełna lista wszystkich stacji w województwie {regionPage.name} (wszystkie sieci):{' '}
            <Link href={`/wojewodztwo/${region}/`} className="text-green-700 dark:text-green-400 hover:underline">
              ceny paliw w województwie {regionPage.name}
            </Link>. Wszystkie stacje {brandPage.name} w Polsce:{' '}
            <Link href={`/marka/${brand}/`} className="text-green-700 dark:text-green-400 hover:underline">
              {brandPage.name} – pełna lista
            </Link>.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            FAQ – {brandPage.name} w województwie {regionPage.name}
          </h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details key={q} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <summary className="faq-question font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-green-600 ml-3 flex-shrink-0 text-xs">▼</span>
                </summary>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={`/marka/${brand}/`} className="text-green-700 dark:text-green-400 hover:underline">
            <ChevronLeft size={14} className="inline -mt-0.5" /> Wszystkie {brandPage.name} w Polsce
          </Link>
          <Link href={`/wojewodztwo/${region}/`} className="text-green-700 dark:text-green-400 hover:underline">→ Wszystkie stacje w {regionPage.name}</Link>
          <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Mapa stacji paliw</Link>
        </div>
      </div>
    </>
  );
}
