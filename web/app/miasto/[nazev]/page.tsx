import { getStationsByCity, getStats, formatPrice, slugify } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CITIES } from '@/types';
import CheapestTable from '@/components/CheapestTable';
import Link from 'next/link';
import { MapPin, TrendingDown, Fuel } from 'lucide-react';

export const revalidate = 21600;
export const dynamicParams = false;

type Props = { params: Promise<{ nazev: string }> };

export async function generateStaticParams() {
  return CITIES.map(c => ({ nazev: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nazev } = await params;
  const city = CITIES.find(c => c.slug === nazev);
  if (!city) return { title: 'Miasto nie znalezione' };

  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const stations = getStationsByCity(city.name);
  const real = stations.filter(s => s.price?.source === 'cenapaliw.pl');
  const cheapestPb95 = real.filter(s => s.price?.pb95).sort((a, b) => (a.price!.pb95 ?? 999) - (b.price!.pb95 ?? 999))[0];
  const cheapestOn   = real.filter(s => s.price?.on).sort((a, b) => (a.price!.on ?? 999) - (b.price!.on ?? 999))[0];

  const priceStr = [
    cheapestPb95 ? `Benzyna 95 od ${formatPrice(cheapestPb95.price!.pb95)}` : '',
    cheapestOn   ? `diesel od ${formatPrice(cheapestOn.price!.on)}` : '',
  ].filter(Boolean).join(', ');

  return {
    title: `Najtańsze paliwo ${city.name} dziś – ${today} | Ceny paliw`,
    description: `Aktualne ceny paliw w ${city.name} – ${stations.length} stacji paliw. ${priceStr ? priceStr + '.' : ''} Interaktywna mapa, filtry według sieci, nawigacja. Aktualizacja 3× dziennie.`,
    alternates: { canonical: `https://benzynamapa.pl/miasto/${nazev}/` },
    openGraph: {
      title: `Najtańsze paliwo ${city.name} – ceny dziś`,
      description: `Porównanie cen paliw w ${city.name}. ${priceStr ? priceStr + '. ' : ''}Mapa i przegląd ${stations.length} stacji paliw.`,
      type: 'website',
      url: `https://benzynamapa.pl/miasto/${nazev}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
    },
    keywords: [
      `najtańsza benzyna ${city.name}`,
      `ceny benzyny ${city.name}`,
      `benzyna ${city.name} dziś`,
      `diesel ${city.name}`,
      `stacje paliw ${city.name}`,
      `najtańszy diesel ${city.name}`,
      `gdzie zatankować ${city.name}`,
      `ceny paliw ${city.name}`,
    ],
  };
}

export default async function MiastoPage({ params }: Props) {
  const { nazev } = await params;
  const city = CITIES.find(c => c.slug === nazev);
  if (!city) notFound();

  const allStations = getStationsByCity(city.name);
  const stats = getStats();
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

  const allPrices = allStations.filter(s => s.price != null);
  const pricesPb95  = allPrices.map(s => s.price?.pb95).filter(Boolean) as number[];
  const pricesOn    = allPrices.map(s => s.price?.on).filter(Boolean) as number[];

  const avgPb95  = pricesPb95.length ? pricesPb95.reduce((a, b) => a + b, 0) / pricesPb95.length : null;
  const avgOn    = pricesOn.length   ? pricesOn.reduce((a, b) => a + b, 0)   / pricesOn.length   : null;
  const minPb95  = pricesPb95.length ? Math.min(...pricesPb95) : null;
  const minOn    = pricesOn.length   ? Math.min(...pricesOn)   : null;

  const brandCount: Record<string, number> = {};
  allStations.forEach(s => { const b = s.brand || 'Inne'; brandCount[b] = (brandCount[b] || 0) + 1; });
  const topBrands = Object.entries(brandCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const natAvgPb95 = stats?.averages.pb95;
  const diffVsNat  = avgPb95 && natAvgPb95 ? avgPb95 - natAvgPb95 : null;
  const nearbyCity = CITIES.filter(c => c.slug !== nazev).slice(0, 8);

  const faqs = [
    { q: `Gdzie jest dziś najtańsza benzyna w ${city.name}?`, a: `Najtańszą benzynę 95 w ${city.name} znajdziesz w tabeli poniżej – posortowane od najtańszej stacji. Dane aktualizujemy 3 razy dziennie.${minPb95 ? ` Aktualnie najniższa cena w ${city.name}: ${minPb95.toFixed(2).replace('.', ',')} zł/l.` : ''}` },
    { q: `Ile kosztuje benzyna w ${city.name} dziś?`, a: `${avgPb95 ? `Średnia cena benzyny 95 w ${city.name} wynosi dziś ${avgPb95.toFixed(2).replace('.', ',')} zł/l` : `Średnia cena benzyny 95 w Polsce wynosi ${natAvgPb95?.toFixed(2).replace('.', ',')} zł/l`}. ${natAvgPb95 && avgPb95 ? `Średnia krajowa to ${natAvgPb95.toFixed(2).replace('.', ',')} zł/l – ${city.name} jest ${diffVsNat && diffVsNat > 0 ? 'droższe' : 'tańsze'} o ${Math.abs(diffVsNat ?? 0).toFixed(2).replace('.', ',')} zł/l.` : ''}` },
    { q: `Gdzie jest najtańszy diesel w ${city.name}?`, a: `${minOn ? `Najtańszy diesel w ${city.name} zaczyna się od ${minOn.toFixed(2).replace('.', ',')} zł/l. Średnia w ${city.name}: ${avgOn?.toFixed(2).replace('.', ',')} zł/l.` : `Aktualne ceny diesla w ${city.name} są w tabeli poniżej.`}` },
    { q: `Która stacja paliw jest najtańsza w ${city.name}?`, a: `Ranking stacji zmienia się z każdą aktualizacją cen. Skorzystaj z tabeli lub interaktywnej mapy – zielony kolor oznacza najtańsze stacje (dolne 20% cen), czerwony najdroższe. Generalnie najtańsze bywają sieci niezależne i stacje przy hipermarketach.` },
    { q: `Czy stacje przy autostradach koło ${city.name} są droższe?`, a: `Tak. Stacje paliw bezpośrednio przy zjazdach autostradowych są zazwyczaj o 0,20–0,50 zł/l droższe od średniej w ${city.name}. Zalecamy zatankować wcześniej w mieście – nasza mapa pokaże najbliższą tanią stację na trasie.` },
    { q: `Skąd pochodzi cena paliwa na BenzynaMAPA?`, a: `Ceny pobieramy automatycznie z polskich serwisów agregujących dane o paliwach i łączymy z bazą stacji z OpenStreetMap. Aktualizacja 3 razy dziennie. Stacje bez zgłoszonej ceny otrzymują szacunek na podstawie marki i średniej krajowej.` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'BenzynaMAPA.pl', item: 'https://benzynamapa.pl/' },
          { '@type': 'ListItem', position: 2, name: 'Najtańsza benzyna', item: 'https://benzynamapa.pl/najtansze-benzyna/' },
          { '@type': 'ListItem', position: 3, name: `Paliwa ${city.name}`, item: `https://benzynamapa.pl/miasto/${nazev}/` },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      }) }} />

      <div className="max-w-5xl mx-auto px-4 py-8">

        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span>›</span>
          <Link href="/najtansze-benzyna/" className="hover:text-green-600">Najtańsza benzyna</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white">{city.name}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <MapPin className="text-green-600 flex-shrink-0" size={28} />
            Najtańsze paliwo {city.name} – {today}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Aktualne ceny paliw na <strong>{allStations.length} stacjach paliw</strong> w {city.name}.
            {' '}Interaktywna mapa, filtry według sieci i przegląd najtańszych stacji pomogą Ci zaoszczędzić do 0,40 zł na litrze.
          </p>
        </div>

        {/* Cenové statistiky */}
        {(avgPb95 || avgOn) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {avgPb95 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Benzyna 95 – średnia {city.name}</div>
                <div className="text-2xl font-black text-green-700 dark:text-green-400">{avgPb95.toFixed(2).replace('.', ',')} <span className="text-sm font-normal text-gray-400">zł</span></div>
                {natAvgPb95 && diffVsNat !== null && (
                  <div className={`text-xs mt-1 font-semibold ${diffVsNat > 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {diffVsNat > 0 ? '▲' : '▼'} {Math.abs(diffVsNat).toFixed(2).replace('.', ',')} zł vs. Polska
                  </div>
                )}
              </div>
            )}
            {minPb95 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-green-300 dark:border-green-800 p-4 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Najtańsza benzyna 95</div>
                <div className="text-2xl font-black text-green-700 dark:text-green-400">{minPb95.toFixed(2).replace('.', ',')} <span className="text-sm font-normal text-gray-400">zł</span></div>
              </div>
            )}
            {avgOn && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Diesel – średnia {city.name}</div>
                <div className="text-2xl font-black text-green-700 dark:text-green-400">{avgOn.toFixed(2).replace('.', ',')} <span className="text-sm font-normal text-gray-400">zł</span></div>
              </div>
            )}
            {minOn && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-green-300 dark:border-green-800 p-4 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Najtańszy diesel</div>
                <div className="text-2xl font-black text-green-700 dark:text-green-400">{minOn.toFixed(2).replace('.', ',')} <span className="text-sm font-normal text-gray-400">zł</span></div>
              </div>
            )}
          </div>
        )}

        {/* Tabulky */}
        <div className="space-y-8 mb-10">
          <CheapestTable stations={allStations} fuelType="pb95" city={city.name} />
          <CheapestTable stations={allStations} fuelType="on"   city={city.name} />
          {allStations.some(s => s.price?.lpg) && (
            <CheapestTable stations={allStations} fuelType="lpg" city={city.name} />
          )}
        </div>

        {/* Mapa */}
        <div className="bg-green-50 dark:bg-gray-800 rounded-2xl p-6 mb-8 border border-green-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <MapPin size={18} className="text-green-600" /> Interaktywna mapa stacji paliw – {city.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Na mapie są oznaczone kolorami wszystkie stacje paliw w {city.name} i okolicy.
            <strong className="text-green-700 dark:text-green-400"> Zielony</strong> = najtańsze (dolne 20%),
            <strong className="text-amber-600"> pomarańczowy</strong> = średnia,
            <strong className="text-red-600"> czerwony</strong> = najdroższe.
            Kliknij marker aby zobaczyć aktualne ceny i nawigację.
          </p>
          <Link
            href={`/?q=${encodeURIComponent(city.name)}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <TrendingDown size={16} />
            Otwórz mapę – {city.name}
          </Link>
        </div>

        {/* Brand breakdown */}
        {topBrands.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Fuel size={18} className="text-green-600" /> Sieci stacji paliw w {city.name}
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {topBrands.map(([brand, count]) => (
                <span key={brand} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  {brand} <span className="text-gray-400 text-xs">({count})</span>
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              W {city.name} działa {allStations.length} stacji paliw od {topBrands.length} różnych operatorów.
              Najtańsze ceny trwale oferują sieci niezależne i stacje przy hipermarketach —
              średnio o 0,15–0,40 zł/l poniżej cen Shell czy BP.
            </p>
          </section>
        )}

        {/* SEO text */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Ceny benzyny i diesla w {city.name} – jak zaoszczędzić na tankowaniu
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Ceny paliw w {city.name} są aktualizowane 3 razy dziennie. Monitorujemy
            {' '}{allStations.length} stacji paliw i wyświetlamy zweryfikowane ceny ze źródeł agregujących.
            Interaktywna mapa umożliwia szybkie znalezienie najtańszej stacji na trasie – bez rejestracji i za darmo.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Różnica między najtańszą a najdroższą stacją w {city.name} wynosi zwykle <strong>0,20–0,50 zł/l</strong>.
            Przy tankowaniu 50 litrów oznacza to oszczędność do <strong>25 zł za jedno tankowanie</strong>.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Do porównania cen benzyny w całej Polsce odwiedź{' '}
            <Link href="/najtansze-benzyna/" className="text-green-700 dark:text-green-400 hover:underline">
              przegląd najtańszej benzyny w Polsce
            </Link>
            {' '}lub{' '}
            <Link href="/historia-cen/" className="text-green-700 dark:text-green-400 hover:underline">
              historię cen paliw za 90 dni
            </Link>.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Często zadawane pytania – paliwa w {city.name}
          </h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details key={q} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-green-600 ml-3 flex-shrink-0 text-xs">▼</span>
                </summary>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Okolní mesta */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Ceny paliw w pobliskich miastach
          </h2>
          <div className="flex flex-wrap gap-2">
            {nearbyCity.map(c => (
              <Link key={c.slug} href={`/miasto/${c.slug}/`}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-500 text-sm text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 rounded-lg transition-all">
                Paliwa {c.name}
              </Link>
            ))}
            <Link href="/najtansze-benzyna/"
              className="px-3 py-1.5 bg-green-50 dark:bg-gray-700 border border-green-300 dark:border-green-700 text-sm text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 transition-all font-medium">
              → Cała Polska
            </Link>
          </div>
        </section>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/najtansze-benzyna/" className="text-green-700 dark:text-green-400 hover:underline font-medium">← Najtańsza benzyna Polska</Link>
          <Link href="/najtansze-diesel/" className="text-gray-500 hover:text-green-700 dark:text-gray-400">Najtańszy diesel →</Link>
          <Link href="/historia-cen/" className="text-gray-500 hover:text-green-700 dark:text-gray-400">Historia cen →</Link>
        </div>
      </div>
    </>
  );
}
