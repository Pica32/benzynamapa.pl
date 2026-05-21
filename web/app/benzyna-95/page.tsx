import type { Metadata } from 'next';
import Link from 'next/link';
import { getStats, formatPrice } from '@/lib/data';
import { TrendingDown, Info, Fuel, Beaker } from 'lucide-react';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Benzyna 95 (PB95, EuroSuper 95) – cena, parametry, jakość 2026',
  description: 'Benzyna 95 (PB95) – aktualna cena w Polsce, parametry techniczne (RON 95, E5/E10), normy PN-EN 228, do jakich silników, porównanie z Pb98 i LPG.',
  alternates: { canonical: 'https://benzynamapa.pl/benzyna-95/' },
  keywords: [
    'benzyna 95', 'PB95 cena', 'EuroSuper 95', 'RON 95', 'E10 benzyna',
    'PN-EN 228', 'benzyna bezołowiowa 95', 'benzyna 95 oktanowa',
    'benzyna 95 vs 98', 'jaka benzyna do mojego auta',
  ],
  openGraph: {
    title: 'Benzyna 95 (PB95) – cena, parametry, do jakich silników',
    description: 'Wszystko o benzynie 95: cena, oktanowa, E10, normy, do jakich aut.',
    url: 'https://benzynamapa.pl/benzyna-95/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'article',
  },
};

const FAQS = [
  { q: 'Co to jest benzyna 95?', a: 'Benzyna 95 (Pb95, EuroSuper 95) to bezołowiowy benzynowy paliwo silnikowe o liczbie oktanowej RON 95. Spełnia normę PN-EN 228 i jest najpopularniejszą benzyną w Polsce — używaną w 90% silników benzynowych. Skrótowo "Pb" = bezołowiowy, "95" = liczba oktanowa.' },
  { q: 'Ile kosztuje benzyna 95 w Polsce dziś?', a: 'Aktualna średnia cena benzyny 95 w Polsce zmienia się dziennie. Sprawdź na BenzynaMAPA.pl - dane aktualizowane 3× dziennie z 8 600+ stacji. Cena obejmuje akcyzę 1,529 zł/l, opłatę paliwową 0,2978 zł/l, opłatę emisyjną 0,08 zł/l i VAT 23%.' },
  { q: 'E10 a E5 - jaka różnica w benzynie 95?', a: 'E10 zawiera do 10% bioetanolu, E5 do 5%. W Polsce od 2024 standard to E10 (na większości stacji). Większość aut z lat 2000+ jest zgodna z E10. Starsze auta lub silniki z bezpośrednim wtryskiem mogą wymagać E5 (sprawdź instrukcję).' },
  { q: 'Czy benzyna 95 nadaje się do mojego auta?', a: 'Tak, jeśli producent nie wymaga wyższej oktanowej (RON 98 lub wyższej). Większość aut benzynowych zaprojektowano na 95. Sprawdź instrukcję obsługi lub wkład wlewu paliwa. Tankowanie 95 do auta wymagającego 98 może spowodować "stukanie" silnika.' },
  { q: 'Benzyna 95 czy 98 - co wybrać?', a: '95 wystarczy dla większości aut. 98 jest droższa o 0,30-0,60 zł/l i daje korzyść tylko w silnikach które tego wymagają (turbodoładowane, sportowe, premium - BMW, Audi, Porsche, niektóre Mercedes). Tankowanie 98 do silnika zaprojektowanego na 95 nie da żadnej korzyści.' },
  { q: 'Z czego składa się cena benzyny 95?', a: 'Z ceny ropy + rafinacji ~40%, akcyzy 1,529 zł/l, opłaty paliwowej 0,298 zł/l, opłaty emisyjnej 0,08 zł/l, marży hurtowej i detalicznej ~7%, oraz VAT 23% od całości. Łącznie podatki >50% ceny detalicznej. Pełen rozkład: https://benzynamapa.pl/maksymalne-ceny-paliw/' },
  { q: 'Jakie są normy jakościowe benzyny 95?', a: 'PN-EN 228 (norma europejska) określa: liczba oktanowa min. 95 RON, zawartość siarki max. 10 mg/kg, zawartość biokomponentów (etanolu) max. 10% (E10), prężność par 35-90 kPa (lato/zima). Badanie jakości: NIK, UOKiK, Inspekcja Handlowa.' },
];

export default function Benzyna95Page() {
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
              { '@type': 'ListItem', position: 2, name: 'Benzyna 95' },
            ],
          },
          {
            '@type': 'Article',
            headline: `Benzyna 95 (PB95) – cena, parametry, jakość ${new Date().getFullYear()}`,
            datePublished: '2026-05-15',
            dateModified: new Date().toISOString(),
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl', url: 'https://benzynamapa.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: 'https://benzynamapa.pl/benzyna-95/',
            inLanguage: 'pl',
          },
          {
            '@type': 'Product',
            name: 'Benzyna 95 (Pb95, EuroSuper 95)',
            category: 'Paliwo silnikowe',
            description: 'Bezołowiowa benzyna o liczbie oktanowej RON 95, zgodna z normą PN-EN 228. Najpopularniejsza benzyna w Polsce, do większości samochodów benzynowych.',
            brand: { '@type': 'Brand', name: 'EuroSuper 95' },
            ...(stats?.averages.pb95 ? {
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'PLN',
                lowPrice: (stats.averages.pb95 - 0.5).toFixed(2),
                highPrice: (stats.averages.pb95 + 0.5).toFixed(2),
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: stats.averages.pb95,
                  priceCurrency: 'PLN',
                  unitCode: 'LTR',
                  unitText: 'litr',
                },
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
          <span>Benzyna 95</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Fuel className="text-green-600" size={28} />
          Benzyna 95 (PB95) – cena, parametry, jakość
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Wszystko, co warto wiedzieć o benzynie 95 — najpopularniejszym paliwie silnikowym w Polsce. Cena {today}, parametry techniczne, do jakich silników i porównanie z Pb98.
        </p>

        {/* Answer box */}
        <div className="fuel-answer bg-green-50 dark:bg-gray-800 border-l-4 border-green-500 rounded-r-xl p-5 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Benzyna 95 (Pb95)</strong> to bezołowiowe paliwo o liczbie oktanowej RON 95, zgodne z normą PN-EN 228.
            {stats?.averages.pb95 && <> Średnia cena w Polsce dziś: <strong className="text-green-700 dark:text-green-400 text-lg">{formatPrice(stats.averages.pb95)}/l</strong>.</>}
            {' '}Używana w ~90% polskich silników benzynowych. Jakość kontrolują UOKiK i Inspekcja Handlowa.
          </p>
        </div>

        {/* Cena dziś */}
        {stats && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Średnia Pb95 dziś</div>
              <div className="text-2xl font-black text-green-700 dark:text-green-400">{formatPrice(stats.averages.pb95)} <span className="text-sm font-normal text-gray-400">zł/l</span></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Stacji w bazie</div>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-400">{stats.total_stations.toLocaleString('pl')}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Trend 7 dni</div>
              <div className={`text-2xl font-black ${(stats.trend_7d?.pb95 ?? 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {(stats.trend_7d?.pb95 ?? 0) >= 0 ? '▲' : '▼'} {Math.abs(stats.trend_7d?.pb95 ?? 0).toFixed(2)} zł
              </div>
            </div>
            <Link href="/najtansze-benzyna/" className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-4 transition-colors text-center flex flex-col justify-center">
              <TrendingDown size={20} className="mx-auto mb-1" />
              <div className="text-sm font-bold">Najtańsza Pb95</div>
              <div className="text-xs text-green-100">Ranking dziś →</div>
            </Link>
          </section>
        )}

        {/* Parametry */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Beaker size={24} className="text-green-600" />
            Parametry techniczne benzyny 95
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
                  ['Liczba oktanowa (RON)', 'min. 95', 'PN-EN 228'],
                  ['Liczba oktanowa motorowa (MON)', 'min. 85', 'PN-EN 228'],
                  ['Zawartość siarki', 'max. 10 mg/kg', 'PN-EN 228'],
                  ['Zawartość bioetanolu (E10)', 'max. 10% obj.', 'PN-EN 228:2012'],
                  ['Prężność par DVPE (lato)', '45-60 kPa', 'PN-EN 228'],
                  ['Prężność par DVPE (zima)', '60-90 kPa', 'PN-EN 228'],
                  ['Gęstość w 15°C', '720-775 kg/m³', 'PN-EN 228'],
                  ['Zawartość ołowiu', 'max. 5 mg/l', 'PN-EN 228'],
                  ['Korozja na płytce miedzianej', 'klasa 1', 'PN-EN ISO 2160'],
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

        {/* E5 vs E10 */}
        <section className="mb-10 bg-blue-50 dark:bg-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Info size={20} className="text-blue-600" />
            E10 vs E5 — co to znaczy?
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            <strong>E10</strong> = benzyna z dodatkiem do 10% bioetanolu (od 2024 standard w Polsce na większości stacji).<br />
            <strong>E5</strong> = benzyna z dodatkiem do 5% bioetanolu (oferowana jako "Premium" lub "Protect" na wybranych stacjach).
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Większość aut z lat 2000+ obsługuje E10. Sprawdź naklejkę w wlewie paliwa lub instrukcję obsługi.
            Listę zgodnych aut prowadzi <a href="https://www.gov.pl/web/klimat" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ministerstwo Klimatu i Środowiska</a>.
          </p>
        </section>

        {/* Pb95 vs Pb98 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Benzyna 95 vs Benzyna 98 — kiedy wybrać 98?</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3 font-semibold">Cecha</th>
                  <th className="text-center p-3 font-bold text-green-700 dark:text-green-400">Benzyna 95</th>
                  <th className="text-center p-3 font-bold text-blue-700 dark:text-blue-400">Benzyna 98</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                <tr><td className="p-3 font-semibold">Liczba oktanowa RON</td><td className="p-3 text-center">95</td><td className="p-3 text-center">98</td></tr>
                <tr><td className="p-3 font-semibold">Cena (różnica)</td><td className="p-3 text-center text-green-600">tańsza</td><td className="p-3 text-center text-red-500">+0,30 - 0,60 zł/l</td></tr>
                <tr><td className="p-3 font-semibold">Do jakich silników</td><td className="p-3 text-center">większość aut benzynowych</td><td className="p-3 text-center">turbodoładowane, premium, sportowe</td></tr>
                <tr><td className="p-3 font-semibold">Korzyść w aucie wymagającym 95</td><td className="p-3 text-center text-green-600">✓ optymalna</td><td className="p-3 text-center text-red-500">✗ żadna</td></tr>
                <tr><td className="p-3 font-semibold">Detergenty</td><td className="p-3 text-center">standardowe</td><td className="p-3 text-center text-blue-600">więcej (czystszy silnik)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            <strong>Wniosek:</strong> Tankuj 98 tylko jeśli producent wymaga (sprawdź instrukcję). W innych przypadkach to wyrzucone pieniądze.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Często zadawane pytania o benzynie 95</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <summary className="faq-question font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-green-600 group-open:rotate-180 transition-transform ml-3 flex-shrink-0">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/najtansze-benzyna/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańsza Pb95 dziś</Link>
          <Link href="/benzyna-98/" className="text-green-700 dark:text-green-400 hover:underline">→ Benzyna 98</Link>
          <Link href="/olej-napedowy/" className="text-green-700 dark:text-green-400 hover:underline">→ Olej napędowy (Diesel)</Link>
          <Link href="/lpg/" className="text-green-700 dark:text-green-400 hover:underline">→ LPG Autogaz</Link>
          <Link href="/maksymalne-ceny-paliw/" className="text-green-700 dark:text-green-400 hover:underline">→ Składowe ceny paliwa</Link>
        </div>
      </div>
    </>
  );
}
