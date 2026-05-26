import type { Metadata } from 'next';
import Link from 'next/link';
import { getStats, formatPrice } from '@/lib/data';
import { TrendingDown, Beaker, Snowflake, Truck } from 'lucide-react';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Olej napędowy (Diesel, ON) – cena, parametry, ON Arktic 2026',
  description: 'Olej napędowy (diesel, ON) – aktualna cena w Polsce, parametry techniczne, normy PN-EN 590, ON Arktic na zimę, AdBlue, do jakich silników, vs benzyna.',
  alternates: { canonical: 'https://benzynamapa.pl/olej-napedowy/' },
  keywords: [
    'olej napędowy', 'diesel cena', 'ON cena', 'paliwo do diesla', 'ON Arktic',
    'olej napędowy zimowy', 'B7 diesel', 'PN-EN 590', 'AdBlue diesel',
    'diesel czy benzyna',
  ],
  openGraph: {
    title: 'Olej napędowy (Diesel, ON) – cena, parametry, jakość',
    description: 'Wszystko o oleju napędowym: cena, parametry, ON Arktic, AdBlue.',
    url: 'https://benzynamapa.pl/olej-napedowy/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'article',
  },
};

const FAQS = [
  { q: 'Co to jest olej napędowy?', a: 'Olej napędowy (potocznie "diesel", "ON" - od "olej napędowy") to ciężkie paliwo silnikowe do silników wysokoprężnych. Spełnia normę PN-EN 590. W Polsce standardowo zawiera do 7% biokomponentów (B7). Liczba cetanowa min. 51.' },
  { q: 'Ile kosztuje diesel w Polsce dziś?', a: 'Aktualna średnia cena diesla w Polsce zmienia się dziennie. Sprawdź na BenzynaMAPA.pl - dane aktualizowane 3× dziennie. Cena obejmuje akcyzę 1,176 zł/l (niższą niż benzyna), opłatę paliwową 0,2978 zł/l, opłatę emisyjną 0,08 zł/l i VAT 23%.' },
  { q: 'Diesel vs benzyna - co wybrać?', a: 'Diesel ma niższe spalanie (5-7 l/100km vs 7-10 dla benzyny) i jest tańszy w eksploatacji przy rocznym przebiegu powyżej 25 000 km. Wadą jest wyższy koszt zakupu auta, droższy serwis (DPF, wtryskiwacze) i konieczność tankowania AdBlue (Euro 5+).' },
  { q: 'Co to jest ON Arktic / diesel zimowy?', a: 'ON Arktic to wersja oleju napędowego o niższej temperaturze blokowania filtra (CFPP) — do -32°C (vs standardowy -20°C). W Polsce sprzedawany od 1 listopada do końca lutego (wymóg prawny). Przy mrozach poniżej -20°C standardowy diesel może "żelować" i blokować filtry.' },
  { q: 'Co to jest AdBlue i czy potrzebuję?', a: 'AdBlue to wodny roztwór mocznika (32,5%) wstrzykiwany do układu wydechowego silników diesla z systemem SCR (selective catalytic reduction). Wymagany w pojazdach Euro 5+ (od 2014). Zużycie: ok. 1-2 l/1000 km (5-10% zużycia paliwa). Cena: 1,50-3,00 zł/l. Pełen artykuł: https://benzynamapa.pl/aktualnosci/adblue-co-to-jest-cena-gdzie-kupic-2026/' },
  { q: 'Czemu diesel jest droższy od benzyny w Polsce?', a: 'Historycznie diesel był tańszy (niższa akcyza), jednak od 2020 ceny diesla i benzyny są zbliżone lub diesel bywa nawet droższy. Powodem jest niższa podaż globalnie (mniej rafinerii) i wyższy popyt z transportu drogowego/kolejowego.' },
  { q: 'Co to jest premium diesel (Verva ON, V-Power Diesel)?', a: 'Premium diesle (Shell V-Power Diesel, BP Ultimate Diesel, Orlen Verva ON, Circle K miles+ Diesel) zawierają dodatki detergentowe, modyfikatory tarcia i podwyższoną liczbę cetanową (53-55). Korzyść: czystsze wtryskiwacze, lepsze starty na zimno, mniejsze osady. Cena: +0,30-0,60 zł/l. Sensowne przy starszych autach z osadami.' },
];

export default function OlejNapedowyPage() {
  const stats = getStats();
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Olej napędowy (Diesel)' },
            ],
          },
          {
            '@type': 'Article',
            headline: 'Olej napędowy (Diesel, ON) – cena, parametry, jakość',
            datePublished: '2026-05-15',
            dateModified: new Date().toISOString(),
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: 'https://benzynamapa.pl/olej-napedowy/',
            inLanguage: 'pl',
          },
          {
            '@type': 'Product',
            name: 'Olej napędowy (Diesel, ON)',
            category: 'Paliwo silnikowe',
            description: 'Paliwo do silników wysokoprężnych zgodne z normą PN-EN 590. Liczba cetanowa min. 51. Standardowo z 7% biokomponentami (B7).',
            ...(stats?.averages.on ? {
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'PLN',
                lowPrice: (stats.averages.on - 0.5).toFixed(2),
                highPrice: (stats.averages.on + 0.5).toFixed(2),
                priceSpecification: { '@type': 'UnitPriceSpecification', price: stats.averages.on, priceCurrency: 'PLN', unitCode: 'LTR', unitText: 'litr' },
                offerCount: stats.total_stations,
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
          <span>Olej napędowy</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Truck className="text-gray-700 dark:text-gray-300" size={28} />
          Olej napędowy (Diesel, ON) – cena, parametry, jakość
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Wszystko o oleju napędowym: cena {today}, normy PN-EN 590, ON Arktic, AdBlue, premium warianty.
        </p>

        <div className="fuel-answer bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-700 dark:border-gray-400 rounded-r-xl p-5 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Olej napędowy (diesel, ON)</strong> to paliwo do silników wysokoprężnych, zgodne z PN-EN 590.
            {stats?.averages.on && <> Średnia cena dziś: <strong className="text-gray-900 dark:text-white text-lg">{formatPrice(stats.averages.on)}/l</strong></>}.
            {' '}Liczba cetanowa min. 51, standardowo zawiera do 7% biokomponentów (B7). Auta Euro 5+ wymagają tankowania AdBlue.
          </p>
        </div>

        {stats?.averages.on && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Średnia ON dziś</div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">{formatPrice(stats.averages.on)} <span className="text-sm font-normal text-gray-400">zł/l</span></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Stacji w bazie</div>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-400">{stats.total_stations.toLocaleString('pl')}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Trend 7 dni</div>
              <div className={`text-2xl font-black ${(stats.trend_7d?.on ?? 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {(stats.trend_7d?.on ?? 0) >= 0 ? '▲' : '▼'} {Math.abs(stats.trend_7d?.on ?? 0).toFixed(2).replace('.', ',')} zł
              </div>
            </div>
            <Link href="/najtansze-diesel/" className="bg-gray-700 hover:bg-gray-800 text-white rounded-xl p-4 transition-colors text-center flex flex-col justify-center">
              <TrendingDown size={20} className="mx-auto mb-1" />
              <div className="text-sm font-bold">Najtańszy diesel</div>
              <div className="text-xs text-gray-300">Ranking dziś →</div>
            </Link>
          </section>
        )}

        {/* Parametry */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Beaker size={24} className="text-gray-700 dark:text-gray-300" />
            Parametry techniczne diesla
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3 font-semibold">Parametr</th>
                  <th className="text-left p-3 font-semibold">Wartość</th>
                  <th className="text-left p-3 font-semibold">Norma</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  ['Liczba cetanowa', 'min. 51', 'PN-EN 590'],
                  ['Indeks cetanowy', 'min. 46', 'PN-EN 590'],
                  ['Zawartość siarki', 'max. 10 mg/kg', 'PN-EN 590'],
                  ['Zawartość FAME (biokomponentów)', 'max. 7% (B7)', 'PN-EN 590'],
                  ['Gęstość w 15°C', '820-845 kg/m³', 'PN-EN 590'],
                  ['Lepkość w 40°C', '2.0-4.5 mm²/s', 'PN-EN 590'],
                  ['CFPP letni (kwiecień-wrzesień)', 'max. 0°C', 'PN-EN 590'],
                  ['CFPP przejściowy (marzec, październik)', 'max. -10°C', 'PN-EN 590'],
                  ['CFPP zimowy (listopad-luty)', 'max. -20°C', 'PN-EN 590'],
                  ['CFPP arktyczny (ON Arktic)', 'max. -32°C', 'PN-EN 590'],
                  ['Temp. zapłonu', 'min. 55°C', 'PN-EN 590'],
                ].map(([name, val, norm]) => (
                  <tr key={name}>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{name}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{val}</td>
                    <td className="p-3 text-gray-500 text-xs">{norm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ON Arktic */}
        <section className="mb-10 bg-blue-50 dark:bg-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Snowflake size={20} className="text-blue-600" />
            ON Arktic — diesel na ostre mrozy
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            Standardowy zimowy diesel w Polsce ma CFPP -20°C (od listopada do lutego — wymóg prawny PN-EN 590).
            Przy <strong>silnych mrozach poniżej -20°C</strong> (regularnie w Bieszczadach, Tatrach, Suwałkach) diesel może "żelować"
            — parafiny krystalizują, zatykają filtr paliwa i silnik nie startuje.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>ON Arktic</strong> ma CFPP do -32°C — bezpieczny nawet w największych mrozach.
            Sprzedawany na stacjach w regionach górskich i północno-wschodnich. Cena: +0,10-0,30 zł/l vs standardowy zimowy ON.
            Warto tankować od grudnia jadąc w góry lub na Mazury.
          </p>
        </section>

        {/* Diesel vs Benzyna */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Diesel vs benzyna — kiedy się opłaca diesel?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Pełne porównanie: <Link href="/benzyna-vs-diesel/" className="text-green-700 dark:text-green-400 hover:underline">Benzyna vs Diesel</Link>
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3">Cecha</th>
                  <th className="text-center p-3 font-bold text-green-700 dark:text-green-400">Benzyna 95</th>
                  <th className="text-center p-3 font-bold text-gray-700 dark:text-gray-300">Diesel</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                <tr><td className="p-3 font-semibold">Cena ~2026</td><td className="p-3 text-center">{stats?.averages.pb95 ? formatPrice(stats.averages.pb95) : '~6,40'} zł/l</td><td className="p-3 text-center">{stats?.averages.on ? formatPrice(stats.averages.on) : '~6,20'} zł/l</td></tr>
                <tr><td className="p-3 font-semibold">Spalanie miasto</td><td className="p-3 text-center">9-12 l/100km</td><td className="p-3 text-center text-green-600">6-9 l/100km</td></tr>
                <tr><td className="p-3 font-semibold">Spalanie trasa</td><td className="p-3 text-center">6-8 l/100km</td><td className="p-3 text-center text-green-600">5-6 l/100km</td></tr>
                <tr><td className="p-3 font-semibold">Cena auta</td><td className="p-3 text-center text-green-600">niższa</td><td className="p-3 text-center">+3-8 tys. zł</td></tr>
                <tr><td className="p-3 font-semibold">Serwis</td><td className="p-3 text-center text-green-600">tańszy</td><td className="p-3 text-center">DPF, EGR, wtryskiwacze</td></tr>
                <tr><td className="p-3 font-semibold">AdBlue (Euro 5+)</td><td className="p-3 text-center text-green-600">nie</td><td className="p-3 text-center">tak (1-2 l/1000 km)</td></tr>
                <tr><td className="p-3 font-semibold">Opłaca się przy</td><td className="p-3 text-center">do 20 tys. km/rok</td><td className="p-3 text-center">powyżej 25 tys. km/rok</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">FAQ — olej napędowy</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <summary className="faq-question font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-gray-700 group-open:rotate-180 transition-transform ml-3 flex-shrink-0">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/najtansze-diesel/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańszy diesel dziś</Link>
          <Link href="/aktualnosci/adblue-co-to-jest-cena-gdzie-kupic-2026/" className="text-green-700 dark:text-green-400 hover:underline">→ AdBlue – cena, gdzie kupić</Link>
          <Link href="/benzyna-vs-diesel/" className="text-green-700 dark:text-green-400 hover:underline">→ Diesel vs benzyna</Link>
          <Link href="/benzyna-95/" className="text-green-700 dark:text-green-400 hover:underline">→ Benzyna 95</Link>
          <Link href="/lpg/" className="text-green-700 dark:text-green-400 hover:underline">→ LPG Autogaz</Link>
        </div>
      </div>
    </>
  );
}
