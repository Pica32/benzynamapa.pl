import { getStationsByBrand, getStationsByCity, formatPrice, getBrandAvgPrice, getStats, slugify } from '@/lib/data';
import { BRAND_PAGES, CITIES, FUEL_LABELS, type FuelType } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, TrendingDown, ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 21600;
export const dynamicParams = false;

type Props = { params: Promise<{ brand: string; city: string }> };

export async function generateStaticParams() {
  // 6 marek × 165 miast = ~990 stránek
  return BRAND_PAGES.flatMap(b =>
    CITIES.map(c => ({ brand: b.slug, city: c.slug }))
  );
}

function intersect(brandStations: ReturnType<typeof getStationsByBrand>, cityName: string) {
  const cityLower = cityName.toLowerCase();
  return brandStations.filter(s =>
    s.city.toLowerCase() === cityLower ||
    slugify(s.city) === slugify(cityName)
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, city } = await params;
  const brandPage = BRAND_PAGES.find(b => b.slug === brand);
  const cityPage = CITIES.find(c => c.slug === city);
  if (!brandPage || !cityPage) return { title: 'Strona nie znaleziona' };

  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const brandStations = getStationsByBrand(brandPage);
  const stations = intersect(brandStations, cityPage.name);
  const realPrices = stations
    .map(s => s.price?.pb95)
    .filter((p): p is number => p != null);
  const avgPart = realPrices.length
    ? ` Średnia Pb95: ${formatPrice(realPrices.reduce((a, b) => a + b, 0) / realPrices.length)}/l.`
    : '';

  return {
    title: `${brandPage.name} ${cityPage.name} – ceny paliw dziś (${today}) | BenzynaMAPA`,
    description: `Aktualne ceny paliw na stacjach ${brandPage.fullName} w ${cityPage.name}.${avgPart} ${stations.length} stacji ${brandPage.name} w ${cityPage.name}, mapa, nawigacja, godziny otwarcia.`,
    alternates: { canonical: `https://benzynamapa.pl/marka/${brand}/${city}/` },
    openGraph: {
      title: `${brandPage.name} ${cityPage.name} – ceny benzyny i diesla`,
      description: `${stations.length} stacji ${brandPage.fullName} w ${cityPage.name}. Aktualne ceny, mapa.`,
      url: `https://benzynamapa.pl/marka/${brand}/${city}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'website',
    },
    keywords: [
      `${brandPage.name} ${cityPage.name}`,
      `stacja ${brandPage.name} ${cityPage.name}`,
      `${brandPage.name} ${cityPage.name} ceny`,
      `${brandPage.name} ${cityPage.name} benzyna`,
      `${brandPage.name} ${cityPage.name} diesel`,
      `tankowanie ${brandPage.name} ${cityPage.name}`,
    ],
  };
}

const FUELS: FuelType[] = ['pb95', 'pb98', 'on', 'lpg'];

export default async function BrandCityPage({ params }: Props) {
  const { brand, city } = await params;
  const brandPage = BRAND_PAGES.find(b => b.slug === brand);
  const cityPage = CITIES.find(c => c.slug === city);
  if (!brandPage || !cityPage) notFound();

  const stats = getStats();
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

  const brandStations = getStationsByBrand(brandPage);
  const stations = intersect(brandStations, cityPage.name);
  const allCityStations = getStationsByCity(cityPage.name);

  const fuelStats = FUELS.map(f => {
    const prices = stations.map(s => s.price?.[f]).filter((p): p is number => p != null && p > 0);
    const avg = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
    const cityAll = allCityStations.map(s => s.price?.[f]).filter((p): p is number => p != null && p > 0);
    const cityAvg = cityAll.length ? cityAll.reduce((a, b) => a + b, 0) / cityAll.length : null;
    const nat = stats?.averages[f] ?? null;
    return {
      fuel: f,
      avg,
      cityAvg,
      nat,
      diffVsCity: avg && cityAvg ? avg - cityAvg : null,
      diffVsNat: avg && nat ? avg - nat : null,
      n: prices.length,
    };
  });

  const pb95 = fuelStats.find(f => f.fuel === 'pb95');
  const onStat = fuelStats.find(f => f.fuel === 'on');

  // Top 10 nejlevnějších stanic této marky v daném městě
  const top10 = [...stations]
    .filter(s => s.price?.pb95 != null && s.price.pb95 > 0)
    .sort((a, b) => (a.price!.pb95 ?? 999) - (b.price!.pb95 ?? 999))
    .slice(0, 10);

  // Cross-link: jiná města kde má stejná značka stanice
  const otherCities = BRAND_PAGES
    .find(b => b.slug === brand)!
    .stationsCount && true
    ? CITIES
        .filter(c => c.slug !== city)
        .filter(c => intersect(brandStations, c.name).length > 0)
        .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
        .slice(0, 12)
    : [];

  // Cross-link: jiné značky ve stejném městě
  const otherBrandsInCity = BRAND_PAGES
    .filter(b => b.slug !== brand)
    .map(b => ({
      brand: b,
      count: intersect(getStationsByBrand(b), cityPage.name).length,
    }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count);

  const faqs = [
    {
      q: `Ile stacji ${brandPage.name} jest w ${cityPage.name}?`,
      a: `W ${cityPage.name} działa ${stations.length} stacji paliw sieci ${brandPage.fullName}. Pełna mapa stacji z aktualnymi cenami dostępna na stronie głównej BenzynaMAPA.pl.`,
    },
    {
      q: `Ile kosztuje benzyna 95 na stacjach ${brandPage.name} w ${cityPage.name}?`,
      a: pb95?.avg
        ? `Średnia cena Pb95 na stacjach ${brandPage.name} w ${cityPage.name} wynosi ${formatPrice(pb95.avg)}/l. ${pb95.diffVsCity != null ? `To ${pb95.diffVsCity > 0 ? 'więcej' : 'mniej'} od średniej miasta o ${Math.abs(pb95.diffVsCity).toFixed(2).replace('.', ',')} zł/l.` : ''}`
        : `Aktualne ceny benzyny 95 na stacjach ${brandPage.name} w ${cityPage.name} sprawdzisz w tabeli powyżej. Aktualizujemy 3× dziennie.`,
    },
    {
      q: `Ile kosztuje diesel na stacjach ${brandPage.name} w ${cityPage.name}?`,
      a: onStat?.avg
        ? `Średnia cena oleju napędowego na stacjach ${brandPage.name} w ${cityPage.name} wynosi ${formatPrice(onStat.avg)}/l. ${onStat.diffVsNat != null ? `To ${onStat.diffVsNat > 0 ? 'więcej' : 'mniej'} od średniej krajowej o ${Math.abs(onStat.diffVsNat).toFixed(2).replace('.', ',')} zł/l.` : ''}`
        : `Aktualne ceny diesla na stacjach ${brandPage.name} w ${cityPage.name} sprawdzisz w tabeli rankingu.`,
    },
    {
      q: `Czy ${brandPage.name} jest tańszy w ${cityPage.name} niż średnia miasta?`,
      a: pb95?.diffVsCity != null
        ? pb95.diffVsCity > 0.05
          ? `Nie. ${brandPage.name} w ${cityPage.name} jest średnio o ${pb95.diffVsCity.toFixed(2).replace('.', ',')} zł/l droższy od średniej miasta. To zgodne z polityką cenową sieci ${brandPage.name} (zazwyczaj ${brandPage.priceOffset} od średniej krajowej).`
          : pb95.diffVsCity < -0.05
            ? `Tak. ${brandPage.name} w ${cityPage.name} oferuje benzynę średnio o ${Math.abs(pb95.diffVsCity).toFixed(2).replace('.', ',')} zł/l taniej od średniej miasta.`
            : `Ceny ${brandPage.name} w ${cityPage.name} są zbliżone do średniej miasta (różnica poniżej 0,05 zł/l).`
        : `Pełne porównanie cen ${brandPage.name} w ${cityPage.name} z innymi sieciami dostępne w tabeli powyżej.`,
    },
    {
      q: `Jakie inne sieci stacji są dostępne w ${cityPage.name}?`,
      a: otherBrandsInCity.length > 0
        ? `W ${cityPage.name} działają stacje sieci: ${otherBrandsInCity.map(x => `${x.brand.name} (${x.count})`).join(', ')}.`
        : `W ${cityPage.name} dostępne są również stacje innych sieci - sprawdź pełną listę na stronie miasta.`,
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
              { '@type': 'ListItem', position: 4, name: cityPage.name, item: `https://benzynamapa.pl/marka/${brand}/${city}/` },
            ],
          },
          {
            // CollectionPage: lokální subset jedné značky v jednom městě
            '@type': 'CollectionPage',
            '@id': `https://benzynamapa.pl/marka/${brand}/${city}/#CollectionPage`,
            name: `Stacje ${brandPage.name} w ${cityPage.name} - aktualne ceny paliw`,
            description: `${stations.length} stacji paliw sieci ${brandPage.fullName} w ${cityPage.name}, aktualne ceny benzyny 95, diesla i LPG.`,
            url: `https://benzynamapa.pl/marka/${brand}/${city}/`,
            inLanguage: 'pl',
            isPartOf: { '@id': `https://benzynamapa.pl/marka/${brand}/` },
            about: { '@type': 'Brand', name: brandPage.fullName },
            spatialCoverage: {
              '@type': 'City',
              name: cityPage.name,
              ...(cityPage.wikidata ? { sameAs: `https://www.wikidata.org/wiki/${cityPage.wikidata}` } : {}),
              geo: { '@type': 'GeoCoordinates', latitude: cityPage.lat, longitude: cityPage.lng },
            },
          },
          {
            '@type': 'ItemList',
            name: `Najtańsze stacje ${brandPage.name} w ${cityPage.name}`,
            numberOfItems: top10.length,
            itemListElement: top10.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'GasStation',
                name: s.name,
                brand: { '@type': 'Brand', name: brandPage.fullName },
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: s.address,
                  addressLocality: cityPage.name,
                  addressCountry: 'PL',
                },
                url: `https://benzynamapa.pl/stacja/${s.id}/`,
                ...(s.price?.pb95 != null ? {
                  makesOffer: {
                    '@type': 'Offer',
                    name: 'Benzyna 95',
                    price: s.price.pb95,
                    priceCurrency: 'PLN',
                  },
                } : {}),
              },
            })),
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question', '.brand-city-stats'] },
          },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-1">›</span>
          <Link href="/marka/" className="hover:text-green-600">Sieci</Link>
          <span className="mx-1">›</span>
          <Link href={`/marka/${brand}/`} className="hover:text-green-600">{brandPage.name}</Link>
          <span className="mx-1">›</span>
          <span className="text-gray-900 dark:text-white">{cityPage.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`${brandPage.color} text-white rounded-xl px-4 py-2 text-xl font-black`} aria-hidden="true">
            {brandPage.name}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {brandPage.name} {cityPage.name} – ceny paliw {today}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stations.length} stacji {brandPage.fullName} w {cityPage.name}
            </p>
          </div>
        </div>

        {/* Krátky úvod / answer box pro AI */}
        <div className="bg-green-50 dark:bg-gray-800 border-l-4 border-green-500 rounded-r-xl p-4 mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>{brandPage.name} {cityPage.name}:</strong> {stations.length} stacji paliw{' '}
            {pb95?.avg ? <>– średnia cena <strong>benzyny 95: {formatPrice(pb95.avg)}/l</strong></> : ''}
            {pb95?.avg && onStat?.avg ? <>, <strong>diesla: {formatPrice(onStat.avg)}/l</strong></> : ''}.
            {' '}Sieć {brandPage.fullName} typowo {brandPage.priceOffset} od średniej krajowej.
          </p>
        </div>

        {/* Tabulka cen – hlavní data */}
        {fuelStats.some(f => f.avg !== null) && (
          <section className="brand-city-stats mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Średnie ceny paliw – {brandPage.name} w {cityPage.name}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="text-left p-3 font-semibold">Paliwo</th>
                    <th className="text-right p-3 font-semibold">Średnia {brandPage.name} {cityPage.name}</th>
                    <th className="text-right p-3 font-semibold">Średnia {cityPage.name}</th>
                    <th className="text-right p-3 font-semibold">Średnia Polska</th>
                    <th className="text-right p-3 font-semibold">Stacji</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {fuelStats.map(({ fuel, avg, cityAvg, nat, n }) => (
                    <tr key={fuel}>
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">{FUEL_LABELS[fuel]}</td>
                      <td className="p-3 text-right font-bold text-green-700 dark:text-green-400">
                        {avg != null ? formatPrice(avg) : '—'}
                      </td>
                      <td className="p-3 text-right text-gray-600 dark:text-gray-400">
                        {cityAvg != null ? formatPrice(cityAvg) : '—'}
                      </td>
                      <td className="p-3 text-right text-gray-500">
                        {nat != null ? formatPrice(nat) : '—'}
                      </td>
                      <td className="p-3 text-right text-gray-400 text-xs">{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">Aktualizacja 3× dziennie. Dane z polskich źródeł cen paliw oraz OpenStreetMap.</p>
          </section>
        )}

        {/* Top 10 stacji */}
        {top10.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingDown size={20} className="text-green-600" />
              Najtańsze stacje {brandPage.name} w {cityPage.name}
            </h2>
            <ol className="space-y-2">
              {top10.map((s, i) => (
                <li key={s.id}>
                  <Link href={`/stacja/${s.id}/`}
                    className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 hover:border-green-500 transition-all">
                    <span className="w-6 text-center font-black text-gray-400">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">{s.name}</div>
                      <div className="text-xs text-gray-500 truncate">{s.address}</div>
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

        {/* Pokud žádné stanice — vysvětlení */}
        {stations.length === 0 && (
          <section className="mb-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-2">Brak stacji {brandPage.name} w {cityPage.name}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              W naszej bazie aktualnie nie ma stacji {brandPage.fullName} w {cityPage.name}.
              Sprawdź <Link href={`/miasto/${city}/`} className="text-green-600 hover:underline">wszystkie stacje paliw w {cityPage.name}</Link>{' '}
              lub <Link href={`/marka/${brand}/`} className="text-green-600 hover:underline">wszystkie stacje {brandPage.name}</Link> w innych miastach.
            </p>
          </section>
        )}

        {/* Inne sieci v tomto městě */}
        {otherBrandsInCity.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Inne sieci stacji w {cityPage.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherBrandsInCity.map(({ brand: b, count }) => (
                <Link key={b.slug} href={`/marka/${b.slug}/${city}/`}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-all">
                  {b.name} {cityPage.name} <span className="text-xs text-gray-400">({count})</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tato značka v jiných městech */}
        {otherCities.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {brandPage.name} w innych miastach
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherCities.map(c => (
                <Link key={c.slug} href={`/marka/${brand}/${c.slug}/`}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-all">
                  {brandPage.name} {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SEO text */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            {brandPage.name} {cityPage.name} – ceny benzyny i diesla
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Sieć stacji paliw <strong>{brandPage.fullName}</strong> w {cityPage.name} oferuje paliwo
            {pb95?.avg ? <> w średniej cenie {formatPrice(pb95.avg)}/l (Pb95)</> : ''}{onStat?.avg ? <> i {formatPrice(onStat.avg)}/l (diesel)</> : ''}.
            {' '}{brandPage.description}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            W {cityPage.name} działa łącznie <strong>{allCityStations.length} stacji paliw</strong> wszystkich sieci
            i operatorów. Pełną mapę z cenami znajdziesz na{' '}
            <Link href={`/miasto/${city}/`} className="text-green-700 dark:text-green-400 hover:underline">stronie miasta {cityPage.name}</Link>.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Ceny aktualizujemy 3× dziennie z polskich źródeł danych o paliwach. Klikając na konkretną stację
            zobaczysz aktualne ceny wszystkich paliw, godziny otwarcia, GPS i nawigację (Google Maps, Waze).
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            FAQ – {brandPage.name} w {cityPage.name}
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
          <Link href={`/miasto/${city}/`} className="text-green-700 dark:text-green-400 hover:underline">→ Wszystkie stacje w {cityPage.name}</Link>
          <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Mapa stacji paliw</Link>
        </div>
      </div>
    </>
  );
}
