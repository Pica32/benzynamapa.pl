import type { Metadata } from 'next';
import Link from 'next/link';
import { getStats, formatPrice } from '@/lib/data';
import { TrendingDown, Beaker, Award } from 'lucide-react';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Benzyna 98 (PB98, Premium) – cena, do jakich aut, czy warto 2026',
  description: 'Benzyna 98 (PB98) – aktualna cena, parametry RON 98, do jakich silników (turbo, premium), czy warto przepłacać. Shell V-Power, BP Ultimate, Orlen Verva.',
  alternates: { canonical: 'https://benzynamapa.pl/benzyna-98/' },
  keywords: [
    'benzyna 98', 'PB98 cena', 'Premium 98', 'RON 98', 'Shell V-Power',
    'BP Ultimate', 'Orlen Verva', 'benzyna premium', 'benzyna do turbo',
    'czy warto tankować 98',
  ],
  openGraph: {
    title: 'Benzyna 98 (PB98) – do jakich aut, czy warto przepłacać',
    description: 'Wszystko o benzynie 98 premium – parametry, cena, do jakich silników.',
    url: 'https://benzynamapa.pl/benzyna-98/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'article',
  },
};

const FAQS = [
  { q: 'Co to jest benzyna 98?', a: 'Benzyna 98 (Pb98) to bezołowiowe paliwo silnikowe o liczbie oktanowej RON 98 — wyższe niż standardowa Pb95. Spełnia normę PN-EN 228. Marketingowe nazwy: Shell V-Power 98, BP Ultimate 98, Orlen Verva 98, Circle K miles 98.' },
  { q: 'Ile kosztuje benzyna 98 w Polsce?', a: 'Benzyna 98 jest droższa od Pb95 średnio o 0,30-0,60 zł/l. Premium warianty (Shell V-Power, Verva, Ultimate) bywają droższe o 0,50-0,80 zł/l. Aktualne ceny: BenzynaMAPA.pl - aktualizacja 3× dziennie.' },
  { q: 'Do jakich aut benzyna 98?', a: 'Do silników wymagających lub zalecających RON 98+ — głównie turbodoładowane, sportowe i premium: BMW (większość M, B, sportowe), Mercedes-AMG, Porsche, Audi RS/S, Ford ST/RS, niektóre Honda Type R, Subaru WRX/STI. Sprawdź instrukcję — zazwyczaj jest naklejka w wlewie paliwa.' },
  { q: 'Czy benzyna 98 daje korzyść w aucie wymagającym 95?', a: 'Praktycznie nie. Silnik zaprojektowany na 95 nie wykorzysta wyższej oktanowej z 98. Jedyna potencjalna korzyść to dodatkowe detergenty w paliwach premium (Shell V-Power, Verva), które mogą lepiej czyścić wtryskiwacze. Cena dodatkowa 0,30-0,80 zł/l rzadko się opłaca — przy 50l baku to 15-40 zł nadpłaty.' },
  { q: 'Pomyłkowo zatankowałem 98 zamiast 95 - co zrobić?', a: 'Nic nie szkodzi! Silnik 95 zniesie 98 bez problemu (po prostu nie wykorzysta wyższej oktanowej). Odwrotnie — tankowanie 95 do silnika wymagającego 98 - może powodować "stukanie" silnika i długoterminowo uszkadzać go. Wtedy jak najszybciej dotankuj 98 lub jedź łagodnie do następnej stacji.' },
  { q: 'Czym Shell V-Power 98 różni się od zwykłej Pb98?', a: 'Pakietem dodatków detergentowych. Shell V-Power, BP Ultimate, Orlen Verva, Circle K miles to "premium" warianty Pb98 z dodatkowymi detergentami (czyszczą wtryskiwacze, zawory) i modyfikatorami tarcia. W praktyce różnica jest mierzalna głównie przy długim użytkowaniu starszych silników.' },
];

export default function Benzyna98Page() {
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
              { '@type': 'ListItem', position: 2, name: 'Benzyna 98' },
            ],
          },
          {
            '@type': 'Article',
            headline: 'Benzyna 98 (PB98) – do jakich aut, czy warto przepłacać',
            datePublished: '2026-05-15',
            dateModified: new Date().toISOString(),
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: 'https://benzynamapa.pl/benzyna-98/',
            inLanguage: 'pl',
          },
          {
            '@type': 'Product',
            name: 'Benzyna 98 (Pb98, Premium)',
            category: 'Paliwo silnikowe premium',
            description: 'Bezołowiowa benzyna premium o liczbie oktanowej RON 98. Do silników turbodoładowanych, sportowych i premium.',
            ...(stats?.averages.pb98 ? {
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'PLN',
                lowPrice: (stats.averages.pb98 - 0.5).toFixed(2),
                highPrice: (stats.averages.pb98 + 0.5).toFixed(2),
                priceSpecification: { '@type': 'UnitPriceSpecification', price: stats.averages.pb98, priceCurrency: 'PLN', unitCode: 'LTR', unitText: 'litr' },
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
          <span>Benzyna 98</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Award className="text-blue-600" size={28} />
          Benzyna 98 (PB98) – cena, do jakich aut, czy warto
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Benzyna 98 — paliwo premium o wyższej liczbie oktanowej. Komu się opłaca, ile kosztuje {today}, przegląd wariantów (Shell V-Power, BP Ultimate, Orlen Verva).
        </p>

        <div className="fuel-answer bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-500 rounded-r-xl p-5 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Benzyna 98 (Pb98)</strong> to paliwo premium o liczbie oktanowej <strong>RON 98</strong>.
            {stats?.averages.pb98 && <> Średnia cena dziś: <strong className="text-blue-700 dark:text-blue-400 text-lg">{formatPrice(stats.averages.pb98)}/l</strong></>}
            {stats?.averages.pb95 && stats?.averages.pb98 && <> ({formatPrice(stats.averages.pb98 - stats.averages.pb95)}/l droższa od Pb95)</>}.
            {' '}Korzyść daje <strong>tylko w silnikach wymagających 98+</strong> (turbo, sportowe, premium). W innych autach to wyrzucone pieniądze.
          </p>
        </div>

        {stats?.averages.pb98 && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Średnia Pb98</div>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-400">{formatPrice(stats.averages.pb98)} <span className="text-sm font-normal text-gray-400">zł/l</span></div>
            </div>
            {stats.averages.pb95 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pb95 (porównanie)</div>
                <div className="text-2xl font-black text-green-700 dark:text-green-400">{formatPrice(stats.averages.pb95)} <span className="text-sm font-normal text-gray-400">zł/l</span></div>
              </div>
            )}
            {stats.averages.pb95 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Różnica 98 vs 95</div>
                <div className="text-2xl font-black text-red-600">+{(stats.averages.pb98 - stats.averages.pb95).toFixed(2).replace('.', ',')} <span className="text-sm font-normal text-gray-400">zł/l</span></div>
              </div>
            )}
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 transition-colors text-center flex flex-col justify-center">
              <TrendingDown size={20} className="mx-auto mb-1" />
              <div className="text-sm font-bold">Mapa stacji</div>
              <div className="text-xs text-blue-100">Filtr Pb98 →</div>
            </Link>
          </section>
        )}

        {/* Komu się opłaca */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Komu się opłaca tankować Pb98?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">
              <div className="text-2xl mb-2">✓</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Tak — gdy producent wymaga</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc pl-5">
                <li>BMW M (M2, M3, M4, M5, M8)</li>
                <li>Mercedes AMG (A45, C63, E63, G63, GT)</li>
                <li>Porsche (911, Boxster, Cayman, Panamera)</li>
                <li>Audi RS, S (RS3, RS4, S5...)</li>
                <li>Ford ST/RS (Focus ST, Fiesta ST)</li>
                <li>Honda Type R (Civic Type R)</li>
                <li>Subaru WRX/STI</li>
                <li>Wybrane silniki turbodoładowane (1.4 TSI w Audi, sport package)</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5">
              <div className="text-2xl mb-2">✗</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Nie — w aucie wymagającym 95</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Silnik zaprojektowany na 95 nie wykorzysta wyższej oktanowej.
                Jedyna potencjalna korzyść to <strong>dodatkowe detergenty</strong> w wariantach premium (V-Power, Verva, Ultimate)
                — to ma sens głównie dla starszych silników z osadami.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                Przy 50l baku i różnicy 0,40 zł = <strong>20 zł nadpłaty</strong> bez korzyści.
              </p>
            </div>
          </div>
        </section>

        {/* Premium warianty */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Beaker size={20} className="text-blue-600" />
            Premium warianty Pb98 — różnice
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3 font-semibold">Sieć</th>
                  <th className="text-left p-3 font-semibold">Nazwa premium</th>
                  <th className="text-left p-3 font-semibold">Marketing</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                <tr><td className="p-3 font-semibold">Shell</td><td className="p-3">V-Power 98</td><td className="p-3 text-gray-600 text-xs">Najwięcej detergentów, modyfikatory tarcia</td></tr>
                <tr><td className="p-3 font-semibold">BP</td><td className="p-3">Ultimate 98</td><td className="p-3 text-gray-600 text-xs">ACTIVE technology — czyści wtryskiwacze</td></tr>
                <tr><td className="p-3 font-semibold">Orlen</td><td className="p-3">Verva 98</td><td className="p-3 text-gray-600 text-xs">Polski wariant z dodatkami detergentowymi</td></tr>
                <tr><td className="p-3 font-semibold">Circle K</td><td className="p-3">miles 98</td><td className="p-3 text-gray-600 text-xs">Pakiet dodatków + wyższa wydajność</td></tr>
                <tr><td className="p-3 font-semibold">Lotos</td><td className="p-3">Lotos Dynamic 98</td><td className="p-3 text-gray-600 text-xs">Po fuzji z Orlen, alternatywa Verva</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Często zadawane pytania o benzynie 98</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <summary className="faq-question font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-blue-600 group-open:rotate-180 transition-transform ml-3 flex-shrink-0">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/benzyna-95/" className="text-green-700 dark:text-green-400 hover:underline">→ Benzyna 95 (porównanie)</Link>
          <Link href="/olej-napedowy/" className="text-green-700 dark:text-green-400 hover:underline">→ Olej napędowy (Diesel)</Link>
          <Link href="/marka/shell/" className="text-green-700 dark:text-green-400 hover:underline">→ Shell V-Power stacje</Link>
          <Link href="/marka/orlen/" className="text-green-700 dark:text-green-400 hover:underline">→ Orlen Verva stacje</Link>
        </div>
      </div>
    </>
  );
}
