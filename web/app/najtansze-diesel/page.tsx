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
  const avg = stats?.averages.on;
  return {
    title: `Najtańszy diesel (olej napędowy) w Polsce dziś – ${today}`,
    description: `Gdzie kupić najtańszy diesel w Polsce dziś?${avg ? ` Średnia dziś: ${formatPrice(avg)}/l.` : ''} Ranking ${stats?.total_stations ?? '8 600'}+ stacji paliw z olejem napędowym. Aktualizacja 3× dziennie.`,
    alternates: { canonical: 'https://benzynamapa.pl/najtansze-diesel/' },
    keywords: ['najtańszy diesel', 'diesel cena dziś', 'ON cena', 'olej napędowy ranking', 'tani diesel', 'najtańszy olej napędowy', 'gdzie zatankować diesel tanio'],
    openGraph: {
      title: `Najtańszy diesel w Polsce – ${today}`,
      description: `Aktualny ranking najtańszego diesla na ${stats?.total_stations ?? '8 600'}+ stacjach paliw w Polsce. Aktualizacja 3× dziennie.`,
      type: 'website',
      url: 'https://benzynamapa.pl/najtansze-diesel/',
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
    },
  };
}

const FAQS = [
  { q: 'Gdzie jest dziś najtańszy diesel w Polsce?', a: 'Aktualny ranking najtańszego diesla aktualizujemy 3 razy dziennie. Najtańsze stacje znajdziesz w tabeli powyżej. Najtańsze ceny diesla bywają na stacjach niezależnych (Moya, Huzar) i przy hipermarketach (Auchan, Makro).' },
  { q: 'Ile kosztuje litr diesla w Polsce dziś?', a: 'Średnia cena diesla zmienia się dziennie. Aktualną średnią widzisz powyżej. Diesel jest historycznie zbliżony cenowo do benzyny 95 — niższa akcyza (1,176 zł vs 1,529 zł benzyny), ale wyższy popyt z transportu.' },
  { q: 'Czemu diesel jest droższy od benzyny pomimo niższej akcyzy?', a: 'Globalna podaż diesla jest niższa (mniej rafinerii produkuje diesel), a popyt z transportu drogowego, kolejowego i ciężkiego jest wyższy. Stąd cena hurtowa diesla wyrównuje niższą akcyzę.' },
  { q: 'Gdzie diesel jest najtańszy – supermarket czy stacja markowa?', a: 'Stacje przy hipermarketach (Auchan, Makro, Carrefour) i sieci niezależne (Moya, Huzar) mają zazwyczaj ceny diesla o 0,15-0,40 zł/l poniżej średniej dużych sieci markowych jak Shell czy BP.' },
  { q: 'Co to jest ON Arktic i kiedy go tankować?', a: 'ON Arktic to zimowy diesel o niższej temperaturze blokowania filtra (CFPP -32°C vs -20°C standardowego zimowego). Tankuj przy mrozach poniżej -20°C lub jadąc w góry (Tatry, Bieszczady). Cena: +0,10-0,30 zł/l.' },
  { q: 'Czy diesel potrzebuje AdBlue?', a: 'Tak, wszystkie diesle Euro 5+ (od 2014) z systemem SCR. AdBlue (wodny roztwór mocznika) jest wstrzykiwany do układu wydechowego. Zużycie: 1-2 l/1000 km. Pełen przewodnik: https://benzynamapa.pl/adblue/' },
];

function brandStyle(diff: number) {
  if (diff <= -0.15) return { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
  if (diff < 0)      return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
  if (diff === 0)    return { color: 'text-gray-600 dark:text-gray-400',   bg: 'bg-gray-50 dark:bg-gray-800' };
  if (diff < 0.30)   return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' };
  return               { color: 'text-red-700 dark:text-red-400',          bg: 'bg-red-50 dark:bg-red-900/20' };
}

export default function NajtanszeDieselPage() {
  const stations = getCheapestStations('on', 25);
  const stats = getStats();
  const date = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const avg = stats?.averages.on;

  // Regionalne średnie z dostępnych cen
  const allWithPrices = getStationsWithPrices().filter(s => s.price?.on != null);
  const regionMap: Record<string, number[]> = {};
  allWithPrices.forEach(s => {
    const r = s.region || s.city;
    if (!r) return;
    if (!regionMap[r]) regionMap[r] = [];
    regionMap[r].push(s.price!.on!);
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
    if (s.price?.on) brandMap[b].push(s.price.on);
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
          { '@type': 'ListItem', position: 2, name: 'Najtańszy diesel w Polsce', item: 'https://benzynamapa.pl/najtansze-diesel/' },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question', '.fuel-answer'] },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Najtańsze stacje z dieslem w Polsce',
        description: 'Ranking najtańszych stacji paliw z olejem napędowym (diesel) w Polsce.',
        numberOfItems: stations.length,
        itemListElement: stations.slice(0, 10).map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'GasStation',
            name: s.name,
            address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: s.city, addressCountry: 'PL' },
            url: `https://benzynamapa.pl/stacja/${s.id}/`,
            ...(s.price?.on != null ? {
              makesOffer: { '@type': 'Offer', name: 'Olej napędowy', price: s.price.on, priceCurrency: 'PLN' },
            } : {}),
          },
        })),
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6 flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white">Najtańszy diesel w Polsce</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Najtańszy diesel (olej napędowy) w Polsce – {date}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-1">
          Aktualny przegląd stacji paliw z najniższą ceną oleju napędowego w całej Polsce.
          {avg && ` Średnia cena diesla dziś: `}<strong>{avg ? formatPrice(avg) + '/l' : ''}</strong>
          {stats?.total_stations ? `. Monitorujemy ${stats.total_stations.toLocaleString('pl')} stacji paliw.` : ''}
        </p>
        {stats?.trend_7d?.on != null && (
          <p className="text-sm mb-4 font-medium">
            <span className={stats.trend_7d.on >= 0 ? 'text-red-600' : 'text-green-600'}>
              {stats.trend_7d.on >= 0 ? '▲' : '▼'} {Math.abs(stats.trend_7d.on).toFixed(2).replace('.', ',')} zł/l za ostatnie 7 dni
            </span>
          </p>
        )}

        {/* AI Answer Box */}
        <div className="fuel-answer bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800 border-l-4 border-gray-700 dark:border-gray-300 rounded-r-xl p-5 mb-6">
          <h2 className="sr-only">Krótka odpowiedź</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Najtańszy diesel w Polsce {date}:</strong>{' '}
            {stations[0] && (
              <>
                <strong className="text-gray-900 dark:text-white text-lg">{formatPrice(stations[0].price!.on!)}</strong>
                {' '}na stacji <strong>{stations[0].brand} {stations[0].name}</strong> w {stations[0].city}.{' '}
              </>
            )}
            {avg && <>Średnia krajowa: <strong className="text-gray-900 dark:text-white">{formatPrice(avg)}</strong>. </>}
            Najtańsze sieci: <strong>Moya, Huzar</strong> + stacje przy hipermarketach.
            Diesle Euro 5+ wymagają <Link href="/adblue/" className="underline text-green-700 dark:text-green-400">AdBlue</Link>.
            Zimą tankuj <Link href="/olej-napedowy/" className="underline text-green-700 dark:text-green-400">ON Arktic</Link> przy mrozach &lt; -20°C.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-900 rounded-xl p-4 mb-6 flex flex-wrap gap-6 items-center">
          <Info size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Średnia cena diesla w Polsce</div>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{avg ? `${avg.toFixed(2).replace('.', ',')} zł/l` : '–'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Średnia cena Pb95 w Polsce</div>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{stats?.averages.pb95 ? `${stats.averages.pb95.toFixed(2).replace('.', ',')} zł/l` : '–'}</div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex-1 min-w-[200px]">
            Ceny aktualizowane 3× dziennie. Akcyza diesla: 1,176 zł/l (niższa niż Pb95: 1,529 zł/l).
          </p>
        </div>

        <CheapestTable stations={stations} fuelType="on" />

        {/* Regionalne średnie */}
        {regionAvgs.length > 0 && (
          <section className="mt-10 mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Średnia cena diesla według województw
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {regionAvgs.map(({ region, avg: rAvg }) => (
                <div key={region} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                  <div className="text-xs text-gray-500 truncate mb-1">{region}</div>
                  <div className="text-lg font-black text-gray-800 dark:text-gray-100">
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

        {/* SEO text */}
        <section className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Gdzie kupić najtańszy diesel w Polsce</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Ceny diesla w Polsce różnią się nawet o <strong>0,40-0,70 zł/l</strong> między najtańszą a najdroższą stacją.
            Przy baku 60 litrów oznacza to oszczędność do <strong>42 zł</strong> za jedno tankowanie.
            Trwale najtańszy diesel oferują stacje niezależne (Moya, Huzar) i stacje przy hipermarketach.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Diesel jest historycznie zbliżony cenowo do benzyny 95 — niższa akcyza (1,176 zł vs 1,529 zł)
            wyrównuje wyższy popyt z transportu drogowego. Auta diesel Euro 5+ wymagają dodatkowego AdBlue
            (1-2 l/1000 km, koszt: 1,80-3,00 zł/l z dystrybutora).
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Aktualne trendy cenowe za ostatnie 90 dni śledź na stronie{' '}
            <Link href="/historia-cen/" className="text-green-700 dark:text-green-400 hover:underline">historia cen paliw</Link>.
            Więcej o właściwościach: <Link href="/olej-napedowy/" className="text-green-700 dark:text-green-400 hover:underline">olej napędowy (diesel)</Link>.
          </p>
        </section>

        {/* Srovnání značek */}
        {brandStats.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Porównanie cen diesla według sieci stacji
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Średnie odchylenie ceny diesla danej sieci od krajowej średniej.
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
            Najtańszy diesel według miast:
          </p>
          {CITIES.slice(0, 40).map(c => (
            <Link key={c.slug} href={`/miasto/${c.slug}/`}
              className="text-sm text-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:text-green-700 dark:hover:text-green-400 transition-all">
              Diesel {c.name}
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Często zadawane pytania o cenach diesla</h2>
          {FAQS.map(({ q, a }) => (
            <details key={q} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <summary className="faq-question font-semibold cursor-pointer list-none text-gray-900 dark:text-white flex justify-between items-center">
                {q}<span className="text-green-600 ml-3 text-xs flex-shrink-0">▼</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
            </details>
          ))}
        </section>

        <div className="mt-6 flex gap-4 text-sm flex-wrap">
          <Link href="/najtansze-benzyna/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańsza benzyna 95</Link>
          <Link href="/najtansze-lpg/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańszy LPG</Link>
          <Link href="/olej-napedowy/" className="text-green-700 dark:text-green-400 hover:underline">→ Olej napędowy – parametry, normy</Link>
          <Link href="/adblue/" className="text-green-700 dark:text-green-400 hover:underline">→ AdBlue – cena, gdzie kupić</Link>
          <Link href="/historia-cen/" className="text-green-700 dark:text-green-400 hover:underline">→ Historia cen 90 dni</Link>
        </div>
      </div>
    </>
  );
}
