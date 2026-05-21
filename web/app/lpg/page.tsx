import type { Metadata } from 'next';
import Link from 'next/link';
import { getStats, formatPrice } from '@/lib/data';
import { TrendingDown, Beaker, Calculator, Zap } from 'lucide-react';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'LPG Autogaz – cena, opłacalność, instalacja, kalkulator 2026',
  description: 'LPG (autogaz) w Polsce – aktualna cena, czy się opłaca, koszt instalacji 2 500-5 000 zł, parametry techniczne, do jakich aut, kalkulator zwrotu inwestycji.',
  alternates: { canonical: 'https://benzynamapa.pl/lpg/' },
  keywords: [
    'LPG cena', 'autogaz Polska', 'LPG opłacalność', 'instalacja LPG koszt',
    'LPG kalkulator', 'LPG vs benzyna', 'LPG autogaz cena dziś',
    'butla LPG', 'gaz do auta', 'najtańsze LPG',
  ],
  openGraph: {
    title: 'LPG Autogaz – cena, czy warto, kalkulator opłacalności',
    description: 'Wszystko o LPG: cena, opłacalność, instalacja, do jakich aut.',
    url: 'https://benzynamapa.pl/lpg/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'article',
  },
};

const FAQS = [
  { q: 'Co to jest LPG (autogaz)?', a: 'LPG (Liquefied Petroleum Gas, autogaz) to skroplony gaz płynny — mieszanka propanu i butanu w proporcji 60:40 (lato) lub 40:60 (zima). Trzymany w butlach pod ciśnieniem 6-12 bar. W Polsce sprzedawany na ~6 000 stacjach paliw (~70% wszystkich stacji).' },
  { q: 'Ile kosztuje LPG dziś w Polsce?', a: 'Aktualna cena LPG w Polsce zmienia się dziennie. Sprawdź na BenzynaMAPA.pl - dane aktualizowane 3× dziennie. LPG jest historycznie ok. 2-3× tańsze od benzyny 95. Niska akcyza (0,387 zł/l vs 1,529 zł/l dla benzyny) i niższa cena hurtowa = dramatyczna oszczędność.' },
  { q: 'Czy warto przerobić auto na LPG?', a: 'Przy rocznym przebiegu powyżej 20 000 km — tak, zwrot w 1-2 lata. Przy 10 000 km — 2-3 lata. Przy <10 000 km nie opłaca się. Koszt instalacji: 2 500 zł (proste silniki wolnossące) do 5 000 zł (turbo, bezpośredni wtrysk). Pełen kalkulator: https://benzynamapa.pl/aktualnosci/lpg-oplacalnosc-kalkulator-2026/' },
  { q: 'Ile kosztuje instalacja LPG?', a: 'Najprostsza sekwencyjna instalacja LPG do silnika wolnossącego: 2 500-3 500 zł. Do silnika turbo: 3 500-4 500 zł. Do silników z bezpośrednim wtryskiem (FSI, TSI, EcoBoost): 4 500-6 000 zł (system z dodatkowym smarowaniem zaworów). Cena obejmuje montaż, butlę i homologację.' },
  { q: 'Które samochody nadają się na LPG?', a: 'Najlepiej silniki wolnossące do 2015 (proste, tanie instalacje, niskie ryzyko). Z bezpośrednim wtryskiem (FSI, TSI, EcoBoost) wymagają droższych instalacji "z chłodzeniem zaworów". Niektóre auta tracą gwarancję po przeróbce — sprawdź u producenta. Hybryda i auta z DPF/SCR są zwykle nieopłacalne.' },
  { q: 'Ile LPG zużywa auto vs benzyna?', a: 'Silnik na LPG zużywa o 15-25% więcej paliwa w litrach (LPG ma niższą wartość opałową). Auto które na benzynie pali 7 l/100km, na LPG pali ok. 8-9 l/100km. Mimo to koszt na km jest o 40-50% niższy bo LPG jest 2-3× tańsze.' },
  { q: 'Czy LPG jest dostępne wszędzie w Polsce?', a: 'LPG dostępne na ~6 000 stacjach (70% wszystkich). Sieć dobrze rozwinięta, choć gorsza w górach i mniejszych miejscowościach. Mapa stacji z LPG: BenzynaMAPA.pl (filtr LPG). Za granicą: dobra dostępność w Niemczech, Czechach, na Słowacji.' },
  { q: 'Czy LPG jest bezpieczne?', a: 'Tak. Butle LPG mają wytrzymałość 60+ bar (ciśnienie robocze 6-12 bar), są wyposażone w zawory bezpieczeństwa. Są zaprojektowane na 25 lat. Wymagają jednak corocznego przeglądu (badanie szczelności) - koszt ok. 100-150 zł.' },
];

export default function LpgPage() {
  const stats = getStats();
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const lpgVsPb95Pct = stats?.averages.pb95 && stats?.averages.lpg
    ? Math.round((1 - stats.averages.lpg / stats.averages.pb95) * 100)
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'LPG Autogaz' },
            ],
          },
          {
            '@type': 'Article',
            headline: 'LPG Autogaz – cena, opłacalność, instalacja',
            datePublished: '2026-05-15',
            dateModified: new Date().toISOString(),
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: 'https://benzynamapa.pl/lpg/',
            inLanguage: 'pl',
          },
          {
            '@type': 'Product',
            name: 'LPG Autogaz',
            category: 'Paliwo silnikowe alternatywne',
            description: 'Skroplony gaz płynny (mieszanka propanu i butanu) używany jako paliwo do silników benzynowych z instalacją gazową.',
            ...(stats?.averages.lpg ? {
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'PLN',
                lowPrice: (stats.averages.lpg - 0.3).toFixed(2),
                highPrice: (stats.averages.lpg + 0.3).toFixed(2),
                priceSpecification: { '@type': 'UnitPriceSpecification', price: stats.averages.lpg, priceCurrency: 'PLN', unitCode: 'LTR', unitText: 'litr' },
                availability: 'https://schema.org/InStock',
                areaServed: { '@type': 'Country', name: 'Polska' },
              },
            } : {}),
          },
          {
            '@type': 'FAQPage',
            mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question', '.fuel-answer'] },
          },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <span>LPG</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Zap className="text-purple-600" size={28} />
          LPG Autogaz – cena, opłacalność, instalacja
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          LPG to najtańsze paliwo silnikowe w Polsce. Cena {today}, koszt instalacji, kalkulator opłacalności, do jakich aut.
        </p>

        <div className="fuel-answer bg-purple-50 dark:bg-gray-800 border-l-4 border-purple-500 rounded-r-xl p-5 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>LPG Autogaz</strong> — najtańsze paliwo silnikowe w Polsce.
            {stats?.averages.lpg && <> Średnia cena dziś: <strong className="text-purple-700 dark:text-purple-400 text-lg">{formatPrice(stats.averages.lpg)}/l</strong></>}
            {lpgVsPb95Pct && <> ({lpgVsPb95Pct}% taniej od benzyny 95)</>}.
            {' '}Koszt instalacji: 2 500-5 000 zł. Opłaca się przy przebiegu &gt;20 tys. km/rok.
          </p>
        </div>

        {stats?.averages.lpg && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Średnia LPG dziś</div>
              <div className="text-2xl font-black text-purple-700 dark:text-purple-400">{formatPrice(stats.averages.lpg)} <span className="text-sm font-normal text-gray-400">zł/l</span></div>
            </div>
            {stats.averages.pb95 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">vs Benzyna 95</div>
                <div className="text-2xl font-black text-green-700 dark:text-green-400">−{lpgVsPb95Pct}%</div>
                <div className="text-xs text-gray-400">Pb95: {formatPrice(stats.averages.pb95)}</div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Stacji z LPG</div>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-400">~6 000</div>
              <div className="text-xs text-gray-400">~70% sieci</div>
            </div>
            <Link href="/najtansze-lpg/" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 transition-colors text-center flex flex-col justify-center">
              <TrendingDown size={20} className="mx-auto mb-1" />
              <div className="text-sm font-bold">Najtańsze LPG</div>
              <div className="text-xs text-purple-100">Ranking dziś →</div>
            </Link>
          </section>
        )}

        {/* Kalkulator opłacalności */}
        <section className="mb-10 bg-green-50 dark:bg-gray-800 rounded-2xl p-6 border border-green-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Calculator size={20} className="text-green-600" />
            Kalkulator opłacalności LPG (przykład 2026)
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Założenia:</p>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>• Przebieg roczny: <strong>20 000 km</strong></li>
                <li>• Spalanie benzyna: <strong>7 l/100km</strong></li>
                <li>• Spalanie LPG: <strong>8,5 l/100km</strong></li>
                <li>• Cena Pb95: <strong>{stats?.averages.pb95 ? formatPrice(stats.averages.pb95) : '~6,40 zł'}/l</strong></li>
                <li>• Cena LPG: <strong>{stats?.averages.lpg ? formatPrice(stats.averages.lpg) : '~2,90 zł'}/l</strong></li>
                <li>• Koszt instalacji: <strong>3 500 zł</strong></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Wynik:</p>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>Koszt benzyny rocznie: <strong>{stats?.averages.pb95 ? Math.round(20000/100*7*stats.averages.pb95).toLocaleString('pl') : '~8 960'} zł</strong></li>
                <li>Koszt LPG rocznie: <strong>{stats?.averages.lpg ? Math.round(20000/100*8.5*stats.averages.lpg).toLocaleString('pl') : '~4 930'} zł</strong></li>
                <li className="text-green-700 dark:text-green-400 font-bold">Oszczędność rocznie: ~4 000 zł</li>
                <li className="text-green-700 dark:text-green-400 font-bold">Zwrot inwestycji: ~10 miesięcy ✓</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Dokładny kalkulator z parametrami Twojego auta:{' '}
            <Link href="/aktualnosci/lpg-oplacalnosc-kalkulator-2026/" className="text-green-700 dark:text-green-400 hover:underline">LPG opłacalność – pełen kalkulator</Link>
          </p>
        </section>

        {/* Parametry */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Beaker size={20} className="text-purple-600" />
            Parametry LPG (autogaz)
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3 font-semibold">Parametr</th>
                  <th className="text-left p-3 font-semibold">Wartość</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  ['Skład', 'Propan + butan'],
                  ['Skład letni (V-IX)', 'Propan ~40-60%, butan ~40-60%'],
                  ['Skład zimowy (XII-II)', 'Propan ~70-90%, butan ~10-30% (lepsze parowanie w mrozie)'],
                  ['Liczba oktanowa motorowa MON', '90-95'],
                  ['Liczba oktanowa badawcza RON', '105-110'],
                  ['Wartość opałowa', '~46 MJ/kg (vs benzyna 43 MJ/kg)'],
                  ['Gęstość ciekła', '~0,55 kg/l (vs benzyna 0,75 kg/l)'],
                  ['Ciśnienie robocze butli', '6-12 bar'],
                  ['Wytrzymałość butli', 'min. 60 bar'],
                  ['Norma jakości', 'PN-EN 589'],
                  ['Akcyza', '0,387 zł/l (vs Pb95 1,529 zł/l)'],
                ].map(([name, val]) => (
                  <tr key={name}>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{name}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">FAQ — LPG Autogaz</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <summary className="faq-question font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-purple-600 group-open:rotate-180 transition-transform ml-3 flex-shrink-0">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/najtansze-lpg/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańsze LPG dziś</Link>
          <Link href="/aktualnosci/lpg-oplacalnosc-kalkulator-2026/" className="text-green-700 dark:text-green-400 hover:underline">→ Pełen kalkulator opłacalności</Link>
          <Link href="/benzyna-95/" className="text-green-700 dark:text-green-400 hover:underline">→ Benzyna 95</Link>
          <Link href="/olej-napedowy/" className="text-green-700 dark:text-green-400 hover:underline">→ Diesel</Link>
        </div>
      </div>
    </>
  );
}
