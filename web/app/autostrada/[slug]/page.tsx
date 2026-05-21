import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HIGHWAYS, CITIES, type Highway } from '@/types';
import { getStationsWithPrices, formatPrice, slugify } from '@/lib/data';
import CheapestTable from '@/components/CheapestTable';
import { Map, TrendingDown, Info } from 'lucide-react';

export const revalidate = 21600;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return HIGHWAYS.map(h => ({ slug: h.slug }));
}

function inBbox(lat: number, lng: number, bbox: Highway['bbox']) {
  const [s, w, n, e] = bbox;
  return lat >= s && lat <= n && lng >= w && lng <= e;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hwy = HIGHWAYS.find(h => h.slug === slug);
  if (!hwy) return { title: 'Trasa nie znaleziona' };

  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

  return {
    title: `Najtańsze stacje paliw na ${hwy.code} – ceny ${today} | BenzynaMAPA`,
    description: `Aktualne ceny benzyny i diesla na stacjach paliw przy ${hwy.name}. Trasa ${hwy.from} → ${hwy.to} (${hwy.lengthKm} km). Ranking najtańszych stacji, mapa, główne miasta na trasie.`,
    alternates: { canonical: `https://benzynamapa.pl/autostrada/${slug}/` },
    openGraph: {
      title: `Stacje paliw na ${hwy.code} – ${hwy.name}`,
      description: `Najtańsze stacje na ${hwy.code} (${hwy.from} → ${hwy.to}, ${hwy.lengthKm} km).`,
      url: `https://benzynamapa.pl/autostrada/${slug}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'website',
    },
    keywords: [
      `stacje paliw ${hwy.code}`,
      `najtańsza stacja na ${hwy.code}`,
      `ceny paliw ${hwy.code}`,
      `tankowanie ${hwy.code}`,
      `${hwy.code} benzyna`,
      `${hwy.code} diesel`,
      `najtańszy diesel ${hwy.code}`,
    ],
  };
}

export default async function HighwayPage({ params }: Props) {
  const { slug } = await params;
  const hwy = HIGHWAYS.find(h => h.slug === slug);
  if (!hwy) notFound();

  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const allStations = getStationsWithPrices();
  // Stanice v BBox autostrady — heuristika, ne přesné, ale dostatečné pro long-tail SEO
  const stations = allStations.filter(s => inBbox(s.lat, s.lng, hwy.bbox));
  const withPb95 = stations.filter(s => s.price?.pb95 != null);
  const withOn   = stations.filter(s => s.price?.on != null);

  const avgPb95 = withPb95.length
    ? withPb95.reduce((a, s) => a + (s.price!.pb95 ?? 0), 0) / withPb95.length
    : null;
  const avgOn = withOn.length
    ? withOn.reduce((a, s) => a + (s.price!.on ?? 0), 0) / withOn.length
    : null;

  const top10pb95 = [...withPb95].sort((a, b) => (a.price!.pb95 ?? 999) - (b.price!.pb95 ?? 999)).slice(0, 15);
  const top10on   = [...withOn].sort((a, b) => (a.price!.on ?? 999) - (b.price!.on ?? 999)).slice(0, 15);

  // Cities na trase v naší CITIES databázi (s odkazy)
  const citiesOnRoute = hwy.cities
    .map(name => CITIES.find(c => c.name === name || slugify(c.name) === slugify(name)))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const faqs = [
    {
      q: `Gdzie są najtańsze stacje paliw na ${hwy.code}?`,
      a: `Najtańsze stacje paliw na trasie ${hwy.code} (${hwy.from} → ${hwy.to}) znajdziesz w tabeli powyżej, posortowane od najniższej ceny benzyny 95. Aktualizujemy 3× dziennie. Ogólna zasada: stacje wewnątrz miast wzdłuż trasy są zwykle 0,20-0,50 zł/l tańsze niż te bezpośrednio przy zjazdach.`,
    },
    {
      q: `Ile kosztuje benzyna na ${hwy.code} dziś?`,
      a: avgPb95
        ? `Średnia cena benzyny 95 wzdłuż ${hwy.code} (region BBox) wynosi dziś ${formatPrice(avgPb95)}/l. Stacje przy samych zjazdach autostradowych mogą być droższe o 0,20-0,50 zł/l.`
        : `Aktualne ceny benzyny 95 na stacjach przy ${hwy.code} sprawdzisz na mapie. Aktualizacja 3× dziennie.`,
    },
    {
      q: `Czy stacje na ${hwy.code} są droższe od średniej krajowej?`,
      a: `Tak, zwykle o 0,20-0,50 zł/l. Stacje przy autostradach mają wyższe koszty operacyjne (24h obsługa, większa restauracja, parking) i wykorzystują nieelastyczny popyt zmęczonych kierowców. Najtańsze warianty: zjazd do najbliższego miasta (1-3 km) i tankowanie w okolicy.`,
    },
    {
      q: `Jakie miasta są na trasie ${hwy.code}?`,
      a: `${hwy.name} przebiega przez następujące większe miasta: ${hwy.cities.join(', ')}. Trasa: ${hwy.from} → ${hwy.to}, długość ${hwy.lengthKm} km.`,
    },
    {
      q: `Czy ${hwy.code} jest płatna?`,
      a: hwy.code.startsWith('A')
        ? `${hwy.code} jest autostradą — w Polsce większość autostrad jest płatna (system viaTOLL/e-TOLL). Sprawdź aktualne stawki na stronie GDDKiA. Drogi ekspresowe (S) są bezpłatne.`
        : `${hwy.code} jest drogą ekspresową — w Polsce drogi ekspresowe są bezpłatne dla samochodów osobowych. Tylko klasyczne autostrady (A) są zwykle płatne.`,
    },
    {
      q: `Jak zaoszczędzić na paliwie podczas jazdy ${hwy.code}?`,
      a: `1) Zatankuj przed wjazdem (stacje w miastach 0,20-0,50 zł/l taniej). 2) Trzymaj tempomat na 110-120 km/h - spalanie o 15% niższe niż przy 130-140 km/h. 3) Używaj kart lojalnościowych (Orlen Vitay, BP BonusMania) - 0,05-0,15 zł/l rabatu. 4) Sprawdzaj BenzynaMAPA.pl wzdłuż trasy.`,
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
              { '@type': 'ListItem', position: 2, name: 'Autostrady', item: 'https://benzynamapa.pl/autostrada/' },
              { '@type': 'ListItem', position: 3, name: hwy.code, item: `https://benzynamapa.pl/autostrada/${slug}/` },
            ],
          },
          {
            '@type': 'Road',
            '@id': `https://benzynamapa.pl/autostrada/${slug}/#road`,
            name: hwy.name,
            url: `https://benzynamapa.pl/autostrada/${slug}/`,
            sameAs: `https://www.wikidata.org/wiki/${hwy.wikidata}`,
          },
          {
            '@type': 'TouristTrip',
            name: `Trasa ${hwy.code}: ${hwy.from} → ${hwy.to}`,
            description: hwy.description,
            itinerary: {
              '@type': 'ItemList',
              numberOfItems: hwy.cities.length,
              itemListElement: hwy.cities.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: { '@type': 'Place', name: c },
              })),
            },
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question', '.highway-stats'] },
          },
        ],
      }) }} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <Link href="/autostrada/" className="hover:text-green-600">Autostrady</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 dark:text-white">{hwy.code}</span>
        </nav>

        <div className="flex items-baseline gap-4 mb-2">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {hwy.name} – ceny paliw {today}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          <strong>{hwy.from}</strong> → <strong>{hwy.to}</strong> ({hwy.lengthKm} km).
          {' '}{hwy.description}
        </p>

        {/* Answer box */}
        <div className="bg-green-50 dark:bg-gray-800 border-l-4 border-green-500 rounded-r-xl p-5 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Stacje paliw na {hwy.code}</strong>: {stations.length} w bazie wzdłuż trasy.
            {avgPb95 && <> Średnia cena Pb95: <strong className="text-green-700 dark:text-green-400">{formatPrice(avgPb95)}/l</strong></>}
            {avgOn && <>, diesel: <strong className="text-green-700 dark:text-green-400">{formatPrice(avgOn)}/l</strong></>}.
            {' '}Stacje przy zjazdach autostradowych zazwyczaj +0,20-0,50 zł/l vs średnia.
          </p>
        </div>

        {/* Stats */}
        {(avgPb95 || avgOn) && (
          <section className="highway-stats grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Stacji w bazie</div>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-400">{stations.length.toLocaleString('pl')}</div>
            </div>
            {avgPb95 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Średnia Pb95</div>
                <div className="text-2xl font-black text-green-700 dark:text-green-400">{formatPrice(avgPb95)}</div>
              </div>
            )}
            {avgOn && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Średnia diesla</div>
                <div className="text-2xl font-black text-green-700 dark:text-green-400">{formatPrice(avgOn)}</div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Długość trasy</div>
              <div className="text-2xl font-black text-gray-700 dark:text-gray-300">{hwy.lengthKm} <span className="text-sm font-normal text-gray-400">km</span></div>
            </div>
          </section>
        )}

        {/* Top stacji */}
        {top10pb95.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingDown size={20} className="text-green-600" />
              Najtańsza benzyna 95 wzdłuż {hwy.code}
            </h2>
            <CheapestTable stations={top10pb95} fuelType="pb95" />
          </section>
        )}

        {top10on.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingDown size={20} className="text-green-600" />
              Najtańszy diesel wzdłuż {hwy.code}
            </h2>
            <CheapestTable stations={top10on} fuelType="on" />
          </section>
        )}

        {/* Miasta na trasie */}
        {citiesOnRoute.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Map size={20} className="text-green-600" />
              Miasta na trasie {hwy.code} — sprawdź ceny lokalne
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Stacje wewnątrz miast są zwykle tańsze niż te bezpośrednio przy zjazdach. Kliknij miasto aby zobaczyć ceny lokalne.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {citiesOnRoute.map(c => (
                <Link key={c.slug} href={`/miasto/${c.slug}/`}
                  className="block p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 transition-all text-center group">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400">{c.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tip box */}
        <section className="mb-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-2">Tip: Tankuj poza autostradą</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Stacje przy samych zjazdach mają zwykle <strong>+0,20-0,50 zł/l vs średnia</strong>.
                Najlepsza strategia: zjazd do najbliższego miasta (1-3 km), tankowanie tam, powrót na autostradę.
                Przy 50l baku oszczędzasz 10-25 zł na każdym tankowaniu, co szybko zwraca koszt zjazdu.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">FAQ — {hwy.code}</h2>
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

        {/* Inne trasy */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Inne polskie trasy</h2>
          <div className="flex flex-wrap gap-2">
            {HIGHWAYS.filter(h => h.slug !== slug).map(h => (
              <Link key={h.slug} href={`/autostrada/${h.slug}/`}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-all">
                {h.code}
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/autostrada/" className="text-green-700 dark:text-green-400 hover:underline">← Wszystkie autostrady</Link>
          <Link href="/najtansze-benzyna/" className="text-gray-500 hover:text-green-700">Najtańsza Pb95 →</Link>
          <Link href="/najtansze-diesel/" className="text-gray-500 hover:text-green-700">Najtańszy diesel →</Link>
        </div>
      </div>
    </>
  );
}
