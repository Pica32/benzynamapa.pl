import { getCheapestStations, getStats, getStationsWithPrices, formatPrice } from '@/lib/data';
import type { Metadata } from 'next';
import CheapestTable from '@/components/CheapestTable';
import Link from 'next/link';
import { CITIES } from '@/types';
import { Info } from 'lucide-react';

export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  const stats = getStats();
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const avg = stats?.averages.pb95;
  return {
    title: `Najtańsza benzyna 95 w Polsce dziś – ${today}`,
    description: `Gdzie jest dziś najtańsza benzyna 95 w Polsce?${avg ? ` Średnia dziś: ${formatPrice(avg)}/l.` : ''} Przegląd ${stats?.total_stations ?? '8000'}+ stacji paliw. Aktualizacja 3× dziennie.`,
    alternates: { canonical: 'https://benzynamapa.pl/najtansze-benzyna/' },
    keywords: ['najtańsza benzyna', 'benzyna 95 cena dziś', 'tania benzyna', 'PB95 cena', 'ceny benzyny stacje paliw', 'gdzie zatankować tanio', 'benzyna Polska dziś'],
    openGraph: {
      title: `Najtańsza benzyna 95 w Polsce – ${today}`,
      description: `Aktualny przegląd najtańszej benzyny 95 na ${stats?.total_stations ?? '8000'}+ stacjach paliw w Polsce. Aktualizacja 3× dziennie.`,
      type: 'website',
      url: 'https://benzynamapa.pl/najtansze-benzyna/',
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
    },
  };
}

const FAQS = [
  { q: 'Gdzie jest dziś najtańsza benzyna 95 w Polsce?', a: 'Przegląd najtańszych stacji z benzyną 95 jest aktualizowany 3 razy dziennie. Najtańsze stacje znajdziesz w tabeli poniżej. Trwale najtańsze bywają stacje niezależne (Moya, Huzar) i stacje przy hipermarketach (Auchan, Makro).' },
  { q: 'Ile kosztuje litr benzyny 95 w Polsce dziś?', a: 'Średnia cena benzyny 95 w Polsce zmienia się co tydzień w zależności od ceny ropy i kurzu dolara. Aktualną średnią wyświetlamy w górnym pasku strony i na stronie historia cen.' },
  { q: 'Jaka jest różnica między benzyną 95 a 98?', a: 'Benzyna 98 ma wyższą liczbę oktanową (98 RON vs 95 RON). Jest odpowiednia dla wydajnych silników turbodoładowanych marek premium (BMW, Mercedes, Porsche). Do zwykłych samochodów benzyna 95 w pełni wystarcza – tankowanie 98 nie przyniesie korzyści, a kosztuje o 0,30–0,60 zł/l więcej.' },
  { q: 'Gdzie benzyna jest najtańsza – supermarket czy stacja markowa?', a: 'Stacje przy hipermarketach (Auchan, Makro, Carrefour) i sieci niezależne (Moya, Huzar) mają zazwyczaj ceny o 0,15–0,40 zł/l poniżej średniej dużych sieci markowych jak Shell czy BP. Przy baku 50 litrów oszczędzasz 7–20 zł za jedno tankowanie.' },
  { q: 'Czy ceny w tabeli są aktualne?', a: 'Dane aktualizujemy automatycznie 3 razy dziennie. Wyświetlamy tylko zweryfikowane ceny z realnego źródła. Każda cena ma wyświetlony czas ostatniej aktualizacji.' },
  { q: 'Kiedy benzyna jest najtańsza?', a: 'Historycznie najniższe ceny bywają na przełomie października i listopada (niska sezonowa popyt). W szczycie wakacyjnym (lipiec–sierpień) ceny nieznacznie rosną wraz z popytem turystycznym.' },
];

function brandStyle(diff: number) {
  if (diff <= -0.15) return { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
  if (diff < 0)      return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
  if (diff === 0)    return { color: 'text-gray-600 dark:text-gray-400',   bg: 'bg-gray-50 dark:bg-gray-800' };
  if (diff < 0.30)   return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' };
  return               { color: 'text-red-700 dark:text-red-400',          bg: 'bg-red-50 dark:bg-red-900/20' };
}

export default function NajtanszeBenzynaPage() {
  const stations = getCheapestStations('pb95', 25);
  const stats = getStats();
  const date = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const avg = stats?.averages.pb95;

  // Regionalne średnie z dostępnych cen
  const allWithPrices = getStationsWithPrices().filter(s => s.price?.pb95 != null);
  const regionMap: Record<string, number[]> = {};
  allWithPrices.forEach(s => {
    const r = s.region || s.city;
    if (!r) return;
    if (!regionMap[r]) regionMap[r] = [];
    regionMap[r].push(s.price!.pb95!);
  });
  const regionAvgs = Object.entries(regionMap)
    .filter(([, prices]) => prices.length >= 3)
    .map(([region, prices]) => ({ region, avg: prices.reduce((a, b) => a + b, 0) / prices.length }))
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 6);

  // Brand stats
  const brandMap: Record<string, number[]> = {};
  allWithPrices.forEach(s => {
    const b = s.brand || 'Inne';
    if (!brandMap[b]) brandMap[b] = [];
    if (s.price?.pb95) brandMap[b].push(s.price.pb95);
  });
  const brandStats = Object.entries(brandMap)
    .filter(([, prices]) => prices.length >= 3)
    .map(([label, prices]) => {
      const brandAvg = prices.reduce((a, b) => a + b, 0) / prices.length;
      const diff = avg ? brandAvg - avg : 0;
      return { label, diff, diffLabel: `${diff > 0 ? '+' : ''}${diff.toFixed(2).replace('.', ',')} zł`, count: prices.length };
    })
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'BenzynaMAPA.pl', item: 'https://benzynamapa.pl/' },
          { '@type': 'ListItem', position: 2, name: 'Najtańsza benzyna w Polsce', item: 'https://benzynamapa.pl/najtansze-benzyna/' },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6 flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white">Najtańsza benzyna 95 w Polsce</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Najtańsza benzyna 95 w Polsce – {date}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-1">
          Aktualny przegląd stacji paliw z najniższą ceną benzyny 95 w całej Polsce.
          {avg && ` Średnia cena benzyny 95 dziś: `}<strong>{avg ? formatPrice(avg) + '/l' : ''}</strong>
          {stats?.total_stations ? `. Monitorujemy ${stats.total_stations.toLocaleString('pl')} stacji paliw.` : ''}
        </p>
        {stats?.trend_7d?.pb95 != null && (
          <p className="text-sm mb-4 font-medium">
            <span className={stats.trend_7d.pb95 >= 0 ? 'text-red-600' : 'text-green-600'}>
              {stats.trend_7d.pb95 >= 0 ? '▲' : '▼'} {Math.abs(stats.trend_7d.pb95).toFixed(2)} zł/l za ostatnie 7 dni
            </span>
          </p>
        )}

        {/* Info box */}
        <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-900 rounded-xl p-4 mb-6 flex flex-wrap gap-6 items-center">
          <Info size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Średnia cena benzyny 95 w Polsce</div>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{avg ? `${avg.toFixed(2).replace('.', ',')} zł/l` : '–'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Średnia cena diesla w Polsce</div>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{stats?.averages.on ? `${stats.averages.on.toFixed(2).replace('.', ',')} zł/l` : '–'}</div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex-1 min-w-[200px]">
            Ceny aktualizowane 3× dziennie na podstawie danych z polskich portali cenowych i OpenStreetMap.
          </p>
        </div>

        <CheapestTable stations={stations} fuelType="pb95" />

        {/* Regionalne średnie */}
        {regionAvgs.length > 0 && (
          <section className="mt-10 mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Średnia cena benzyny 95 według województw
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {regionAvgs.map(({ region, avg: rAvg }) => (
                <div key={region} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                  <div className="text-xs text-gray-500 truncate mb-1">{region}</div>
                  <div className="text-lg font-black text-green-700 dark:text-green-400">
                    {rAvg.toFixed(2).replace('.', ',')} zł
                  </div>
                  {avg && (
                    <div className={`text-xs font-semibold ${rAvg < avg ? 'text-green-600' : 'text-red-500'}`}>
                      {rAvg < avg ? '▼' : '▲'} {Math.abs(rAvg - avg).toFixed(2).replace('.', ',')} zł vs. średnia
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gdzie tankować */}
        <section className="mt-6 bg-green-50 dark:bg-gray-800 rounded-2xl p-6 border border-green-100 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Gdzie kupić najtańszą benzynę 95 w Polsce</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Ceny benzyny 95 w Polsce różnią się nawet o <strong>0,50–0,80 zł/l</strong> między najtańszą a najdroższą stacją.
            Przy baku 50 litrów oznacza to oszczędność do <strong>40 zł</strong> za jedno tankowanie —
            rocznie ponad 500 zł. Trwale najtańszą benzynę oferują stacje niezależne
            (Moya, Huzar) i stacje przy hipermarketach (Auchan, Makro, Carrefour, E.Leclerc).
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Duże sieci markowe Shell i BP mają zazwyczaj cenę o <strong>0,25–0,40 zł/l powyżej średniej</strong>.
            Orlen i Circle K są zwykle blisko średniej rynkowej. Do najtańszego tankowania
            polecamy interaktywną mapę na stronie głównej – stacje oznaczone są kolorami
            według ceny z nawigacją do Google Maps lub Waze.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Ceny benzyny zależą od światowej ceny ropy Brent, kursu PLN/USD, podatku akcyzowego
            i marż stacji paliw. Aktualne trendy cenowe za ostatnie 90 dni śledź na stronie{' '}
            <Link href="/historia-cen/" className="text-green-700 dark:text-green-400 hover:underline">historia cen paliw</Link>.
          </p>
        </section>

        {/* Srovnání značek */}
        {brandStats.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Porównanie cen benzyny według sieci stacji
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Średnie odchylenie ceny benzyny 95 danej sieci od krajowej średniej – obliczone z aktualnych cen.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {brandStats.map(({ label, diff, diffLabel, count }) => {
                const { color, bg } = brandStyle(diff);
                return (
                  <div key={label} className={`${bg} rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center`}>
                    <div className={`text-lg font-black ${color}`}>{diffLabel}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">{label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{count} stacji</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Miasta */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <p className="col-span-full text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Najtańsza benzyna według miast:
          </p>
          {CITIES.slice(0, 40).map(c => (
            <Link key={c.slug} href={`/miasto/${c.slug}/`}
              className="text-sm text-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:text-green-700 dark:hover:text-green-400 transition-all">
              Benzyna {c.name}
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Często zadawane pytania o cenach benzyny</h2>
          {FAQS.map(({ q, a }) => (
            <details key={q} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <summary className="font-semibold cursor-pointer list-none text-gray-900 dark:text-white flex justify-between items-center">
                {q}<span className="text-green-600 ml-3 text-xs flex-shrink-0">▼</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
            </details>
          ))}
        </section>

        <div className="mt-6 flex gap-4 text-sm flex-wrap">
          <Link href="/najtansze-diesel/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańszy diesel w Polsce</Link>
          <Link href="/historia-cen/" className="text-green-700 dark:text-green-400 hover:underline">→ Historia cen benzyny 90 dni</Link>
          <Link href="/aktualnosci/" className="text-green-700 dark:text-green-400 hover:underline">→ Aktualności o cenach paliw</Link>
        </div>
      </div>
    </>
  );
}
