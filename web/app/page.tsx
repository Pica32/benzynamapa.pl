import { getStats, getCheapestStations, formatPrice } from '@/lib/data';
import HomeClient from './HomeClient';
import CheapestTable from '@/components/CheapestTable';
import Top4Cheapest from '@/components/Top4Cheapest';
import Link from 'next/link';
import { CITIES } from '@/types';
import type { Metadata } from 'next';

export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  const stats = getStats();
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const avg95 = stats?.averages.pb95;
  return {
    title: `Ceny paliw w Polsce dziś – ${today} | BenzynaMAPA`,
    description: `Aktualne ceny benzyny i diesla w Polsce ${today}.${avg95 ? ` Benzyna 95 średnio ${formatPrice(avg95)}/l.` : ''} Gdzie zatankować najtaniej? Mapa ${stats?.total_stations?.toLocaleString('pl') ?? '8600'}+ stacji. Aktualizacja 3× dziennie.`,
    alternates: {
      canonical: 'https://benzynamapa.pl/',
      languages: { 'x-default': 'https://benzynamapa.pl/', 'pl-PL': 'https://benzynamapa.pl/' },
    },
    openGraph: {
      title: `Ceny paliw w Polsce – ${today} | BenzynaMAPA`,
      description: `Benzyna 95${avg95 ? ` ${formatPrice(avg95)}/l` : ''} · Mapa ${stats?.total_stations?.toLocaleString('pl') ?? '8600'}+ stacji paliw w Polsce`,
      url: 'https://benzynamapa.pl/',
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'website',
    },
  };
}

const FAQS = [
  { q: 'Gdzie jest dziś najtańsza benzyna w Polsce?', a: 'Aktualne najtańsze ceny benzyny 95 i diesla znajdziesz na naszej interaktywnej mapie i w tabeli najtańszych stacji powyżej. Dane aktualizujemy 3 razy dziennie.' },
  { q: 'Jak znaleźć najtańszy diesel w pobliżu?', a: 'Kliknij przycisk „Znajdź mnie" na mapie – zobaczysz stacje paliw posortowane według odległości od Twojej lokalizacji z cenami diesla.' },
  { q: 'Czy ceny na BenzynaMAPA są aktualne?', a: 'Dane aktualizujemy automatycznie 3 razy dziennie. Każda cena ma wyświetlony czas ostatniej aktualizacji.' },
  { q: 'Jak działają kolory stacji na mapie?', a: 'Zielony = najtańsze 20% stacji, pomarańczowy = cena średnia, czerwony = najdroższe 20%. Kolory zmieniają się w zależności od wybranego rodzaju paliwa.' },
  { q: 'Ile stacji paliw monitorujecie?', a: 'Monitorujemy ponad 8600 stacji paliw w całej Polsce – od dużych sieci (Orlen, Shell, BP, Circle K) po niezależnych operatorów i stacje przy hipermarketach.' },
  { q: 'Które sieci stacji są najtańsze w Polsce?', a: 'Trwale niższe ceny mają zwykle stacje niezależne (Moya, Huzar, niezależne) oraz stacje przy supermarketach. Shell, BP i Circle K są z reguły droższe od średniej o 0,20–0,40 zł/l.' },
  { q: 'Czy warto tankować LPG zamiast benzyny?', a: 'LPG jest zwykle o 60–70% tańsze niż benzyna 95. Wadą jest wyższe spalanie (~25%) i konieczność przeróbki samochodu. Przy rocznym przebiegu powyżej 25 000 km przeróbka zwraca się zazwyczaj w 4–6 lat.' },
  { q: 'Jak duża jest różnica między najtańszą a najdroższą stacją?', a: 'Różnica między najtańszą a najdroższą stacją w tym samym mieście wynosi zazwyczaj 0,30–0,60 zł/l. Przy pełnym baku 50 litrów to oszczędność 15–30 zł za jedno tankowanie.' },
  { q: 'Czy stacje przy autostradach są droższe?', a: 'Tak. Stacje paliw przy autostradach mają zazwyczaj o 0,20–0,50 zł/l wyższe ceny niż średnia. Wyjątkiem są Orlen przy głównych trasach, gdzie ceny bywają konkurencyjne.' },
  { q: 'Skąd pobieracie dane o cenach paliw?', a: 'Dane zbieramy automatycznie ze stron agregujących ceny paliw w Polsce, m.in. cenapaliw.pl, i łączymy z bazą stacji z OpenStreetMap. Aktualizacja 3× dziennie.' },
];

export default async function HomePage() {
  const stats = getStats();
  if (!stats) return <div className="p-8 text-center text-gray-500">Błąd ładowania danych</div>;

  const cheapestDiesel  = getCheapestStations('on', 10);
  const cheapestBenzyna = getCheapestStations('pb95', 10);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />

      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Ceny paliw w Polsce dziś —{' '}
            <span className="text-green-700 dark:text-green-400">
              {stats.total_stations.toLocaleString('pl')} stacji paliw
            </span>
            {' '}na mapie, benzyna 95 najtaniej
          </h1>
        </div>
      </div>

      <Top4Cheapest stationsOn={cheapestDiesel.slice(0,4)} stationsPb95={cheapestBenzyna.slice(0,4)} />

      <HomeClient stats={stats} />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        <div className="grid md:grid-cols-2 gap-8">
          <CheapestTable stations={cheapestDiesel}  fuelType="on"   />
          <CheapestTable stations={cheapestBenzyna} fuelType="pb95" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/najtansze-benzyna/" className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white rounded-xl p-4 text-center transition-colors">
            <div className="text-lg font-black">Benzyna 95</div>
            <div className="text-xs text-green-100 mt-0.5">PB95 – ranking Polska</div>
          </Link>
          <Link href="/najtansze-diesel/" className="flex-1 min-w-[140px] bg-gray-700 hover:bg-gray-800 text-white rounded-xl p-4 text-center transition-colors">
            <div className="text-lg font-black">Diesel</div>
            <div className="text-xs text-gray-300 mt-0.5">Olej napędowy – ranking Polska</div>
          </Link>
          <Link href="/najtansze-lpg/" className="flex-1 min-w-[140px] bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 text-center transition-colors">
            <div className="text-lg font-black">LPG Autogaz</div>
            <div className="text-xs text-purple-100 mt-0.5">Autogaz – ranking Polska</div>
          </Link>
          <Link href="/historia-cen/" className="flex-1 min-w-[140px] bg-blue-700 hover:bg-blue-800 text-white rounded-xl p-4 text-center transition-colors">
            <div className="text-lg font-black">Historia cen</div>
            <div className="text-xs text-blue-200 mt-0.5">Wykres 90 dni</div>
          </Link>
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Ceny paliw według miast
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Wybierz miasto i sprawdź najtańsze stacje paliw w Twojej okolicy.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CITIES.slice(0, 48).map(city => (
              <Link
                key={city.slug}
                href={`/miasto/${city.slug}/`}
                className="block p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition-all text-center group"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400">
                  {city.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Często zadawane pytania o cenach paliw
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-green-600 group-open:rotate-180 transition-transform ml-3 flex-shrink-0">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Jak oszczędzać na paliwie</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Porównaj ceny w okolicy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Różnica między najtańszą a najdroższą stacją w tym samym mieście wynosi 0,30–0,60 zł/l.
                Użyj mapy i filtra „Najtańsza benzyna 95" lub „Najtańszy diesel" —
                posortujemy stacje od najtańszej.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="text-2xl mb-2">🏪</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Supermarkety i sieci niezależne</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Stacje paliw przy hipermarketach i niezależni operatorzy (Moya, Huzar)
                są trwale o 0,15–0,40 zł/l tańsi od dużych sieci brandowych Shell czy BP.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Śledź historię cen</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Ceny benzyny i diesla zmieniają się co tydzień wraz z ceną ropy Brent i kursem PLN/USD.
                Na stronie{' '}
                <Link href="/historia-cen/" className="text-green-700 dark:text-green-400 underline">historia cen</Link>
                {' '}śledź 90-dniowy trend i tankuj przy spadkach.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Porównanie sieci stacji paliw</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Średnie odchylenia od krajowej średniej ceny benzyny 95 według danych BenzynaMAPA.pl:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { brand: 'Moya / Huzar', diff: '−0,20 zł', color: 'text-green-700 dark:text-green-400' },
              { brand: 'Orlen / Lotos', diff: '±0 zł', color: 'text-gray-600 dark:text-gray-300' },
              { brand: 'Circle K', diff: '+0,25 zł', color: 'text-gray-600 dark:text-gray-300' },
              { brand: 'BP', diff: '+0,30 zł', color: 'text-orange-600 dark:text-orange-400' },
              { brand: 'Shell', diff: '+0,35 zł', color: 'text-red-600 dark:text-red-400' },
              { brand: 'Autostrady', diff: '+0,40 zł', color: 'text-red-700 dark:text-red-500' },
            ].map(({ brand, diff, color }) => (
              <div key={brand} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                <div className={`text-lg font-black ${color}`}>{diff}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">{brand}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 border border-green-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">O BenzynaMAPA.pl</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            BenzynaMAPA monitoruje ceny benzyny i diesla na {stats.total_stations.toLocaleString('pl')} stacjach paliw
            w całej Polsce — od dużych sieci Orlen, Shell, BP i Circle K po niezależnych
            operatorów jak Moya i Huzar, którzy oferują zazwyczaj niższe ceny.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Dane zbieramy automatycznie trzy razy dziennie. Ceny pobieramy z serwisów
            agregujących dane o paliwach i łączymy z bazą stacji z OpenStreetMap.
            Dla stacji bez zgłoszonej ceny wyświetlamy szacunek na podstawie
            średniej krajowej i historycznych odchyleń danej sieci.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link href="/najtansze-benzyna/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Najtańsza benzyna w Polsce</Link>
            <Link href="/najtansze-diesel/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Najtańszy diesel w Polsce</Link>
            <Link href="/najtansze-lpg/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Najtańszy LPG autogaz</Link>
            <Link href="/aktualnosci/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Aktualności o cenach paliw</Link>
            <a href="https://benzinmapa.cz" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">🇨🇿 Ceny paliw w Czechach – BenzinMapa.cz</a>
          </div>
        </section>

      </div>
    </>
  );
}
