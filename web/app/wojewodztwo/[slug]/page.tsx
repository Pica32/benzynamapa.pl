import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CITIES, REGIONS, BRAND_PAGES } from '@/types';
import { getStationsWithPrices, getStats, formatPrice } from '@/lib/data';
import CheapestTable from '@/components/CheapestTable';
import { MapPin, TrendingDown, Fuel } from 'lucide-react';

export const revalidate = 21600;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return REGIONS.map(r => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = REGIONS.find(r => r.slug === slug);
  if (!region) return { title: 'Województwo nie znalezione' };

  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

  return {
    title: `Ceny paliw – województwo ${region.name} ${today} | BenzynaMAPA`,
    description: `Aktualne ceny benzyny 95, diesla i LPG w województwie ${region.name}. Stolica: ${region.capital}. Najtańsze stacje paliw w regionie, średnie ceny, mapa.`,
    alternates: { canonical: `https://benzynamapa.pl/wojewodztwo/${slug}/` },
    openGraph: {
      title: `Ceny paliw w województwie ${region.name} – BenzynaMAPA`,
      description: `Aktualne ceny paliw w województwie ${region.name}. Stolica: ${region.capital}. Średnie regionalne i ranking najtańszych stacji.`,
      url: `https://benzynamapa.pl/wojewodztwo/${slug}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'website',
    },
    keywords: [
      `ceny paliw ${region.name}`,
      `najtańsza benzyna ${region.name}`,
      `najtańszy diesel ${region.name}`,
      `stacje paliw ${region.name}`,
      `paliwo ${region.capital}`,
      `województwo ${region.name} ceny benzyny`,
      `LPG ${region.name}`,
    ],
  };
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const region = REGIONS.find(r => r.slug === slug);
  if (!region) notFound();

  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const allStations = getStationsWithPrices().filter(s =>
    (s.region || '').toLowerCase().includes(region.name.toLowerCase()) ||
    (s.region || '').toLowerCase() === region.slug
  );

  const stats = getStats();
  const pricesPb95 = allStations.map(s => s.price?.pb95).filter(Boolean) as number[];
  const pricesOn = allStations.map(s => s.price?.on).filter(Boolean) as number[];
  const pricesLpg = allStations.map(s => s.price?.lpg).filter(Boolean) as number[];

  const avgPb95 = pricesPb95.length ? pricesPb95.reduce((a, b) => a + b, 0) / pricesPb95.length : null;
  const avgOn = pricesOn.length ? pricesOn.reduce((a, b) => a + b, 0) / pricesOn.length : null;
  const avgLpg = pricesLpg.length ? pricesLpg.reduce((a, b) => a + b, 0) / pricesLpg.length : null;

  const natAvgPb95 = stats?.averages.pb95;
  const natAvgOn = stats?.averages.on;
  const diffPb95 = avgPb95 && natAvgPb95 ? avgPb95 - natAvgPb95 : null;
  const diffOn = avgOn && natAvgOn ? avgOn - natAvgOn : null;

  // Miasta v regionu
  const citiesInRegion = CITIES.filter(c => c.region === region.name);

  // Top 10 nejlevnějších stanic v regionu
  const top10 = [...allStations]
    .filter(s => s.price?.pb95 != null)
    .sort((a, b) => (a.price!.pb95 ?? 999) - (b.price!.pb95 ?? 999))
    .slice(0, 25);

  const faqs = [
    {
      q: `Ile kosztuje benzyna 95 w województwie ${region.name}?`,
      a: avgPb95
        ? `Średnia cena benzyny 95 w województwie ${region.name} wynosi dziś ${formatPrice(avgPb95)}/l. ${diffPb95 != null ? `To ${diffPb95 > 0 ? 'więcej' : 'mniej'} niż średnia krajowa o ${Math.abs(diffPb95).toFixed(2).replace('.', ',')} zł/l.` : ''}`
        : `Aktualną średnią cenę benzyny 95 w województwie ${region.name} sprawdź na liście stacji poniżej. Dane aktualizujemy 3× dziennie.`,
    },
    {
      q: `Gdzie jest najtańszy diesel w województwie ${region.name}?`,
      a: avgOn
        ? `Średnia cena diesla w województwie ${region.name} to ${formatPrice(avgOn)}/l. ${diffOn != null ? `Region jest ${diffOn > 0 ? 'droższy' : 'tańszy'} od średniej krajowej o ${Math.abs(diffOn).toFixed(2).replace('.', ',')} zł/l.` : ''} Najtańsze stacje sortuje tabela powyżej.`
        : `Najtańszy diesel w województwie ${region.name} znajdziesz w tabeli rankingu. Aktualizacja 3× dziennie.`,
    },
    {
      q: `Ile stacji paliw jest w województwie ${region.name}?`,
      a: `W naszej bazie znajduje się ${allStations.length.toLocaleString('pl')} stacji paliw w województwie ${region.name}. Pełną mapę z filtrami i nawigacją znajdziesz na stronie głównej BenzynaMAPA.pl.`,
    },
    {
      q: `Czy ceny paliw w województwie ${region.name} są wyższe od średniej krajowej?`,
      a: diffPb95 != null
        ? diffPb95 > 0.05
          ? `Tak, województwo ${region.name} ma średnio o ${diffPb95.toFixed(2).replace('.', ',')} zł/l droższą benzynę 95 niż średnia krajowa. Powodem są zwykle wyższy popyt w aglomeracjach lub stacje przy popularnych trasach.`
          : diffPb95 < -0.05
            ? `Nie, województwo ${region.name} oferuje benzynę 95 średnio o ${Math.abs(diffPb95).toFixed(2).replace('.', ',')} zł/l taniej niż średnia krajowa. To jeden z tańszych regionów w Polsce.`
            : `Ceny w województwie ${region.name} są zbliżone do średniej krajowej (różnica ${Math.abs(diffPb95).toFixed(2).replace('.', ',')} zł/l).`
        : `Aktualne porównanie cen w województwie ${region.name} ze średnią krajową dostępne po pełnym uzupełnieniu danych. Sprawdź ranking stacji powyżej.`,
    },
    {
      q: `Jakie są największe miasta w województwie ${region.name}?`,
      a: citiesInRegion.length > 0
        ? `Główne miasta w województwie ${region.name} to: ${citiesInRegion.slice(0, 8).map(c => c.name).join(', ')}. Stolica regionu: ${region.capital}.`
        : `Stolica województwa ${region.name} to ${region.capital}.`,
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
              { '@type': 'ListItem', position: 2, name: 'Województwa', item: 'https://benzynamapa.pl/wojewodztwo/' },
              { '@type': 'ListItem', position: 3, name: region.name, item: `https://benzynamapa.pl/wojewodztwo/${slug}/` },
            ],
          },
          {
            '@type': 'AdministrativeArea',
            '@id': `https://benzynamapa.pl/wojewodztwo/${slug}/#region`,
            name: `Województwo ${region.name}`,
            url: `https://benzynamapa.pl/wojewodztwo/${slug}/`,
            sameAs: `https://www.wikidata.org/wiki/${region.wikidata}`,
            geo: { '@type': 'GeoCoordinates', latitude: region.lat, longitude: region.lng },
            containedInPlace: { '@type': 'Country', name: 'Polska', '@id': 'https://www.wikidata.org/wiki/Q36' },
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.region-stats', '.faq-question'] },
          },
        ],
      }) }} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span>›</span>
          <Link href="/wojewodztwo/" className="hover:text-green-600">Województwa</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white">{region.name}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <MapPin className="text-green-600 flex-shrink-0" size={28} />
            Ceny paliw – województwo {region.name} – {today}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Aktualne ceny paliw na <strong>{allStations.length.toLocaleString('pl')} stacjach paliw</strong> w województwie {region.name}.
            Stolica: <strong>{region.capital}</strong>. Populacja: {(region.population / 1000000).toFixed(1)} mln mieszkańców.
            {region.description && ` ${region.description}`}
          </p>
        </div>

        {/* Cenové statistiky regionu */}
        <div className="region-stats grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {avgPb95 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Benzyna 95 średnia</div>
              <div className="text-2xl font-black text-green-700 dark:text-green-400">{avgPb95.toFixed(2).replace('.', ',')} <span className="text-sm font-normal text-gray-400">zł</span></div>
              {diffPb95 != null && (
                <div className={`text-xs mt-1 font-semibold ${diffPb95 > 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {diffPb95 > 0 ? '▲' : '▼'} {Math.abs(diffPb95).toFixed(2).replace('.', ',')} zł vs. Polska
                </div>
              )}
            </div>
          )}
          {avgOn && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Diesel średnia</div>
              <div className="text-2xl font-black text-green-700 dark:text-green-400">{avgOn.toFixed(2).replace('.', ',')} <span className="text-sm font-normal text-gray-400">zł</span></div>
              {diffOn != null && (
                <div className={`text-xs mt-1 font-semibold ${diffOn > 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {diffOn > 0 ? '▲' : '▼'} {Math.abs(diffOn).toFixed(2).replace('.', ',')} zł vs. Polska
                </div>
              )}
            </div>
          )}
          {avgLpg && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">LPG średnia</div>
              <div className="text-2xl font-black text-green-700 dark:text-green-400">{avgLpg.toFixed(2).replace('.', ',')} <span className="text-sm font-normal text-gray-400">zł</span></div>
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Stacji w bazie</div>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-400">{allStations.length.toLocaleString('pl')}</div>
          </div>
        </div>

        {/* Top stanic */}
        {top10.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingDown size={20} className="text-green-600" />
              Najtańsza benzyna 95 w województwie {region.name}
            </h2>
            <CheapestTable stations={top10} fuelType="pb95" />
          </section>
        )}

        {/* Miasta v regionu */}
        {citiesInRegion.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Fuel size={20} className="text-green-600" />
              Miasta w województwie {region.name} ({citiesInRegion.length})
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Wybierz miasto aby zobaczyć aktualne ceny paliw na lokalnych stacjach.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {citiesInRegion
                .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
                .map(c => (
                  <Link key={c.slug} href={`/miasto/${c.slug}/`}
                    className="block p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition-all text-center group">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400">{c.name}</span>
                    {c.population && (
                      <div className="text-[10px] text-gray-400 mt-0.5">{(c.population / 1000).toFixed(0)}k mieszkańców</div>
                    )}
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* SEO text */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Ceny paliw w województwie {region.name} – co warto wiedzieć
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Województwo {region.name} liczy {(region.population / 1000000).toFixed(1)} mln mieszkańców. {region.description}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Aktualnie monitorujemy <strong>{allStations.length.toLocaleString('pl')} stacji paliw</strong> w regionie.
            {avgPb95 && ` Średnia cena benzyny 95 wynosi ${formatPrice(avgPb95)}/l`}{avgOn && `, diesla ${formatPrice(avgOn)}/l`}.
            {diffPb95 != null && ` Region jest ${diffPb95 > 0 ? 'droższy' : 'tańszy'} od średniej krajowej o ${Math.abs(diffPb95).toFixed(2).replace('.', ',')} zł/l.`}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Dane pobieramy automatycznie 3× dziennie z polskich źródeł danych o cenach paliw oraz OpenStreetMap.
            Najtańsze stacje znajdziesz w tabeli powyżej, pełną interaktywną mapę na stronie głównej.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Często zadawane pytania – paliwa w województwie {region.name}
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

        {/* Sieci stacji v tomto regionu — long-tail SEO cross-link */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Sieci stacji paliw w województwie {region.name}</h2>
          <p className="text-sm text-gray-500 mb-3">Porównaj ceny i lokalizacje konkretnej sieci w regionie.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BRAND_PAGES.map(b => (
              <Link key={b.slug} href={`/marka/${b.slug}/wojewodztwo/${slug}/`}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-500 text-sm text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 rounded-lg transition-all">
                <span className={`${b.color} text-white rounded px-1.5 py-0.5 text-[10px] font-black`} aria-hidden="true">{b.name}</span>
                <span>{b.name} {region.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Pozostałe województwa */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Sprawdź ceny paliw w innych województwach</h2>
          <div className="flex flex-wrap gap-2">
            {REGIONS.filter(r => r.slug !== slug).map(r => (
              <Link key={r.slug} href={`/wojewodztwo/${r.slug}/`}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-500 text-sm text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 rounded-lg transition-all">
                {r.name}
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/wojewodztwo/" className="text-green-700 dark:text-green-400 hover:underline font-medium">← Wszystkie województwa</Link>
          <Link href="/najtansze-benzyna/" className="text-gray-500 hover:text-green-700 dark:text-gray-400">Najtańsza benzyna →</Link>
          <Link href={`/miasto/${region.capitalSlug}/`} className="text-gray-500 hover:text-green-700 dark:text-gray-400">Ceny w {region.capital} →</Link>
        </div>
      </div>
    </>
  );
}
