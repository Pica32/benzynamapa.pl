import { getCheapestStations, getStats, getStationsWithPrices, formatPrice } from '@/lib/data';
import type { Metadata } from 'next';
import CheapestTable from '@/components/CheapestTable';
import Link from 'next/link';
import { CITIES } from '@/types';
import { Info, Calculator } from 'lucide-react';

export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  const stats = getStats();
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const avg = stats?.averages.lpg;
  return {
    title: `Najtańszy LPG autogaz w Polsce dziś – ${today}`,
    description: `Gdzie kupić najtańszy LPG autogaz w Polsce dziś?${avg ? ` Średnia dziś: ${formatPrice(avg)}/l.` : ''} Ranking ${stats?.total_stations ?? '8 600'}+ stacji z LPG. Aktualizacja 3× dziennie.`,
    alternates: { canonical: 'https://benzynamapa.pl/najtansze-lpg/' },
    keywords: ['najtańszy LPG', 'LPG cena dziś', 'autogaz cena', 'tani LPG', 'gdzie tankować LPG', 'najtańszy autogaz Polska'],
    openGraph: {
      title: `Najtańszy LPG autogaz w Polsce – ${today}`,
      description: `Aktualny ranking najtańszego LPG na ${stats?.total_stations ?? '8 600'}+ stacjach paliw w Polsce.`,
      type: 'website',
      url: 'https://benzynamapa.pl/najtansze-lpg/',
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
    },
  };
}

const FAQS = [
  { q: 'Gdzie jest dziś najtańszy LPG w Polsce?', a: 'Aktualny ranking najtańszego LPG aktualizujemy 3 razy dziennie. Najtańsze stacje znajdziesz w tabeli powyżej. LPG jest dostępne na ok. 6 000 stacjach w Polsce (~70% wszystkich).' },
  { q: 'Ile kosztuje LPG w Polsce dziś?', a: 'Średnia cena LPG jest historycznie ok. 2-3× niższa od benzyny 95. Akcyza LPG to tylko 0,387 zł/l (vs 1,529 zł/l benzyny) - stąd dramatyczna oszczędność. Aktualną średnią widzisz powyżej.' },
  { q: 'Czy warto przerobić auto na LPG?', a: 'Przy rocznym przebiegu powyżej 20 000 km – tak. Zwrot inwestycji (instalacja 2 500-5 000 zł) w 1-2 lata. Przy 10 000 km/rok – 2-3 lata. Pełen kalkulator: https://benzynamapa.pl/aktualnosci/lpg-oplacalnosc-kalkulator-2026/' },
  { q: 'Ile zużywa auto na LPG?', a: 'Silnik na LPG zużywa o 15-25% więcej paliwa w litrach (LPG ma niższą wartość kaloryczną). Auto pali 7l/100km na benzynie, na LPG ~8-9 l/100km. Mimo to koszt na km jest o 40-50% niższy.' },
  { q: 'Czy LPG jest bezpieczne?', a: 'Tak. Butle LPG mają wytrzymałość 60+ bar (ciśnienie robocze 6-12 bar), wyposażone w zawory bezpieczeństwa. Wymagają corocznego przeglądu (badanie szczelności, koszt 100-150 zł).' },
  { q: 'Które samochody nadają się na LPG?', a: 'Najlepiej silniki wolnossące do 2015 (proste instalacje 2 500-3 500 zł). Silniki z bezpośrednim wtryskiem (FSI, TSI, EcoBoost) - droższa instalacja 4 500-6 000 zł. Hybryda i auta z DPF/SCR są zwykle nieopłacalne.' },
];

function brandStyle(diff: number) {
  if (diff <= -0.10) return { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
  if (diff < 0)      return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
  if (diff === 0)    return { color: 'text-gray-600 dark:text-gray-400',   bg: 'bg-gray-50 dark:bg-gray-800' };
  if (diff < 0.15)   return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' };
  return               { color: 'text-red-700 dark:text-red-400',          bg: 'bg-red-50 dark:bg-red-900/20' };
}

export default function NajtanszeLpgPage() {
  const stations = getCheapestStations('lpg', 25);
  const stats = getStats();
  const date = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const avg = stats?.averages.lpg;
  const avgPb95 = stats?.averages.pb95;
  const lpgVsPb95Pct = avgPb95 && avg ? Math.round((1 - avg / avgPb95) * 100) : null;

  // Regionalne średnie
  const allWithPrices = getStationsWithPrices().filter(s => s.price?.lpg != null);
  const regionMap: Record<string, number[]> = {};
  allWithPrices.forEach(s => {
    const r = s.region || s.city;
    if (!r) return;
    if (!regionMap[r]) regionMap[r] = [];
    regionMap[r].push(s.price!.lpg!);
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
    if (s.price?.lpg) brandMap[b].push(s.price.lpg);
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
          { '@type': 'ListItem', position: 2, name: 'Najtańszy LPG w Polsce', item: 'https://benzynamapa.pl/najtansze-lpg/' },
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
        name: 'Najtańsze stacje z LPG w Polsce',
        description: 'Ranking najtańszych stacji paliw z LPG (autogaz) w Polsce.',
        numberOfItems: stations.length,
        itemListElement: stations.slice(0, 10).map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'GasStation',
            name: s.name,
            address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: s.city, addressCountry: 'PL' },
            url: `https://benzynamapa.pl/stacja/${s.id}/`,
            ...(s.price?.lpg != null ? {
              makesOffer: { '@type': 'Offer', name: 'LPG Autogaz', price: s.price.lpg, priceCurrency: 'PLN' },
            } : {}),
          },
        })),
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6 flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white">Najtańszy LPG autogaz w Polsce</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Najtańszy LPG autogaz w Polsce – {date}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-1">
          Aktualny przegląd stacji paliw z najniższą ceną LPG (autogazu) w całej Polsce.
          {avg && ` Średnia cena LPG dziś: `}<strong>{avg ? formatPrice(avg) + '/l' : ''}</strong>
          {stats?.total_stations ? `. Monitorujemy ${stats.total_stations.toLocaleString('pl')} stacji paliw, ~70% oferuje LPG.` : ''}
        </p>
        {stats?.trend_7d?.lpg != null && (
          <p className="text-sm mb-4 font-medium">
            <span className={stats.trend_7d.lpg >= 0 ? 'text-red-600' : 'text-green-600'}>
              {stats.trend_7d.lpg >= 0 ? '▲' : '▼'} {Math.abs(stats.trend_7d.lpg).toFixed(2)} zł/l za ostatnie 7 dni
            </span>
          </p>
        )}

        {/* AI Answer Box */}
        <div className="fuel-answer bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-l-4 border-purple-600 rounded-r-xl p-5 mb-6">
          <h2 className="sr-only">Krótka odpowiedź</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Najtańszy LPG w Polsce {date}:</strong>{' '}
            {stations[0] && (
              <>
                <strong className="text-purple-700 dark:text-purple-400 text-lg">{formatPrice(stations[0].price!.lpg!)}</strong>
                {' '}na stacji <strong>{stations[0].brand} {stations[0].name}</strong> w {stations[0].city}.{' '}
              </>
            )}
            {avg && <>Średnia krajowa: <strong className="text-purple-700 dark:text-purple-400">{formatPrice(avg)}</strong></>}
            {lpgVsPb95Pct && <> ({lpgVsPb95Pct}% taniej od benzyny 95)</>}.
            {' '}LPG dostępne na ~6 000 stacjach (Orlen, Lotos, Shell, BP, Moya, Huzar).
            Przy przebiegu &gt;20 tys. km/rok przeróbka na LPG zwraca się w 1-2 lata.
            Pełen kalkulator: <Link href="/lpg/" className="underline text-purple-700 dark:text-purple-400">o LPG</Link>.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-900 rounded-xl p-4 mb-6 flex flex-wrap gap-6 items-center">
          <Info size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Średnia LPG w Polsce</div>
            <div className="text-2xl font-black text-purple-700 dark:text-purple-300">{avg ? `${avg.toFixed(2).replace('.', ',')} zł/l` : '–'}</div>
          </div>
          {avgPb95 && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Pb95 (porównanie)</div>
              <div className="text-2xl font-black text-green-700 dark:text-green-400">{avgPb95.toFixed(2).replace('.', ',')} zł/l</div>
            </div>
          )}
          {lpgVsPb95Pct && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">LPG taniej o</div>
              <div className="text-2xl font-black text-green-700 dark:text-green-400">{lpgVsPb95Pct}%</div>
            </div>
          )}
          <Link href="/lpg/" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors inline-flex items-center gap-2">
            <Calculator size={16} /> Kalkulator opłacalności
          </Link>
        </div>

        <CheapestTable stations={stations} fuelType="lpg" />

        {/* Regionalne średnie */}
        {regionAvgs.length > 0 && (
          <section className="mt-10 mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Średnia cena LPG według województw
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {regionAvgs.map(({ region, avg: rAvg }) => (
                <div key={region} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                  <div className="text-xs text-gray-500 truncate mb-1">{region}</div>
                  <div className="text-lg font-black text-purple-700 dark:text-purple-400">
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
        <section className="mt-6 bg-purple-50 dark:bg-gray-800 rounded-2xl p-6 border border-purple-100 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Dlaczego LPG jest tak tani?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            <strong>LPG (autogaz)</strong> to mieszanka propanu i butanu - produkt uboczny rafinacji ropy i wydobycia gazu.
            W Polsce akcyza LPG wynosi tylko <strong>0,387 zł/l</strong> (vs 1,529 zł benzyny 95 - <strong>4× mniej</strong>).
            Stąd dramatyczna różnica cenowa.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Polska jest <strong>europejskim liderem w popularności LPG</strong> – mamy ponad 3 miliony aut z instalacją gazową,
            więcej niż jakikolwiek inny kraj UE. LPG dostępne na ~6 000 stacjach (~70% wszystkich).
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Pełen przewodnik o LPG: <Link href="/lpg/" className="text-purple-700 dark:text-purple-400 hover:underline">LPG autogaz – cena, opłacalność, instalacja</Link>.
            Kalkulator zwrotu inwestycji: <Link href="/aktualnosci/lpg-oplacalnosc-kalkulator-2026/" className="text-purple-700 dark:text-purple-400 hover:underline">LPG kalkulator 2026</Link>.
          </p>
        </section>

        {/* Srovnání značek */}
        {brandStats.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Porównanie cen LPG według sieci stacji
            </h2>
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
            Najtańszy LPG według miast:
          </p>
          {CITIES.slice(0, 40).map(c => (
            <Link key={c.slug} href={`/miasto/${c.slug}/`}
              className="text-sm text-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-400 transition-all">
              LPG {c.name}
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Często zadawane pytania o LPG</h2>
          {FAQS.map(({ q, a }) => (
            <details key={q} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <summary className="faq-question font-semibold cursor-pointer list-none text-gray-900 dark:text-white flex justify-between items-center">
                {q}<span className="text-purple-600 ml-3 text-xs flex-shrink-0">▼</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
            </details>
          ))}
        </section>

        <div className="mt-6 flex gap-4 text-sm flex-wrap">
          <Link href="/lpg/" className="text-purple-700 dark:text-purple-400 hover:underline">→ Pełen przewodnik o LPG</Link>
          <Link href="/aktualnosci/lpg-oplacalnosc-kalkulator-2026/" className="text-purple-700 dark:text-purple-400 hover:underline">→ Kalkulator opłacalności</Link>
          <Link href="/najtansze-benzyna/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańsza benzyna 95</Link>
          <Link href="/najtansze-diesel/" className="text-gray-700 dark:text-gray-300 hover:underline">→ Najtańszy diesel</Link>
        </div>
      </div>
    </>
  );
}
