import type { Metadata } from 'next';
import Link from 'next/link';
import { getStats, formatPrice } from '@/lib/data';
import { Info, AlertTriangle, TrendingUp } from 'lucide-react';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Maksymalne ceny paliw w Polsce 2026 – regulacja, akcyza, VAT | BenzynaMAPA',
  description: 'Czy w Polsce obowiązują maksymalne ceny paliw? Jak składa się cena benzyny i diesla – akcyza, VAT, marża, opłata paliwowa, opłata emisyjna. Porównanie z Czechami i Niemcami.',
  alternates: { canonical: 'https://benzynamapa.pl/maksymalne-ceny-paliw/' },
  keywords: [
    'maksymalna cena benzyny Polska', 'maksymalna cena diesla', 'akcyza paliwa',
    'VAT na paliwo Polska', 'opłata paliwowa', 'opłata emisyjna', 'składowe ceny paliwa',
    'regulacja cen paliw', 'UOKiK ceny paliw', 'NIK kontrola cen paliw',
  ],
  openGraph: {
    title: 'Maksymalne ceny paliw w Polsce – regulacja i składniki ceny',
    description: 'Z czego składa się cena benzyny i diesla w Polsce. Akcyza, VAT, opłata paliwowa, marża.',
    url: 'https://benzynamapa.pl/maksymalne-ceny-paliw/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'article',
  },
};

const FAQS = [
  {
    q: 'Czy w Polsce obowiązują maksymalne ceny paliw?',
    a: 'Nie. W Polsce ceny paliw nie są regulowane administracyjnie. Każdy operator stacji ustala własną cenę detaliczną. Rynek jest jednak monitorowany przez UOKiK pod kątem zmów cenowych oraz przez Ministerstwo Klimatu i Środowiska w kontekście opłaty emisyjnej.',
  },
  {
    q: 'Z czego składa się cena benzyny w Polsce?',
    a: 'Cena benzyny 95 składa się z: (1) ceny ropy i kosztu rafinacji ~40%, (2) akcyzy ~24% (1,529 zł/l w 2026), (3) VAT 23% (od całości), (4) opłaty paliwowej ~5% (0,2978 zł/l w 2026), (5) opłaty emisyjnej (0,08 zł/l), (6) marży hurtowej i detalicznej ~7%. Razem podatki stanowią ponad 50% ceny detalicznej.',
  },
  {
    q: 'Ile wynosi akcyza na paliwo w 2026 roku?',
    a: 'Stawki akcyzy w Polsce w 2026: benzyna bezołowiowa (Pb95, Pb98) – 1,529 zł/l, olej napędowy (Diesel) – 1,176 zł/l, LPG (autogaz) – 0,387 zł/l. Stawki ustala Ministerstwo Finansów RP.',
  },
  {
    q: 'Jaki jest VAT na paliwo?',
    a: 'VAT na paliwa w Polsce wynosi 23% i jest naliczany od ceny netto + akcyzy + opłat. Odliczenie VAT z paliwa do firm: 50% (samochody osobowe) lub 100% (auta ciężarowe / wykorzystywane wyłącznie do działalności).',
  },
  {
    q: 'Co to jest opłata paliwowa i emisyjna?',
    a: 'Opłata paliwowa (~0,2978 zł/l benzyny i diesla, 0,1798 zł/l LPG w 2026) jest przeznaczana na Krajowy Fundusz Drogowy i finansuje budowę dróg. Opłata emisyjna (0,08 zł/l) zasila Narodowy Fundusz Ochrony Środowiska.',
  },
  {
    q: 'Czy UOKiK kontroluje ceny paliw?',
    a: 'Tak. Urząd Ochrony Konkurencji i Konsumentów (UOKiK) monitoruje rynek paliw pod kątem ewentualnych zmów cenowych. W ostatnich latach UOKiK kilkukrotnie wszczynał postępowania wobec głównych sieci stacji. Reguły dotyczące cen reguluje też Ustawa o przeciwdziałaniu nieuczciwym praktykom rynkowym.',
  },
  {
    q: 'Dlaczego polskie paliwo jest tańsze niż niemieckie?',
    a: 'Polska ma niższą akcyzę niż Niemcy (1,529 zł/l vs ~3,00 zł/l). Niemcy dodatkowo nakładają opłatę CO2. Łącznie podatki w Niemczech stanowią około 60% ceny paliwa, w Polsce około 50%. Stąd różnica 0,80–1,20 zł/l na korzyść polskich stacji, szczególnie przy granicy.',
  },
  {
    q: 'Czy ceny paliw mogą wzrosnąć w 2026?',
    a: 'Możliwe są dwie podwyżki: (1) ETS2 – nowy system handlu emisjami UE od 2027, ale obciążenia mogą wcześniej wpłynąć na hurt; (2) waloryzacja akcyzy zgodnie z inflacją. Szczegółowe prognozy znajdziesz w naszym artykule ',
  },
];

export default function MaksymalneCenyPage() {
  const stats = getStats();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Maksymalne ceny paliw' },
            ],
          },
          {
            '@type': 'FAQPage',
            mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question', '.price-breakdown'] },
          },
          {
            '@type': 'Article',
            headline: 'Maksymalne ceny paliw w Polsce 2026 – regulacja, akcyza, VAT',
            datePublished: '2026-05-15',
            dateModified: new Date().toISOString(),
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl', url: 'https://benzynamapa.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: 'https://benzynamapa.pl/maksymalne-ceny-paliw/',
          },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <span>Maksymalne ceny paliw</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Maksymalne ceny paliw w Polsce 2026 – regulacja, akcyza, VAT
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Czy w Polsce obowiązują maksymalne ceny benzyny i diesla? Z czego składa się cena paliwa
          – akcyza, VAT, opłata paliwowa, opłata emisyjna i marża. Pełny przewodnik dla kierowców.
        </p>

        {/* Aktuální průměrné ceny */}
        {stats && (
          <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-900 rounded-xl p-5 mb-8 flex flex-wrap gap-6 items-center">
            <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Średnia cena Pb95 dziś</div>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{formatPrice(stats.averages.pb95)} <span className="text-sm font-normal text-gray-400">/l</span></div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Średnia cena ON dziś</div>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{formatPrice(stats.averages.on)} <span className="text-sm font-normal text-gray-400">/l</span></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex-1 min-w-[200px]">
              Aktualizacja 3× dziennie z polskich źródeł danych o cenach paliw.
            </p>
          </div>
        )}

        {/* Czy istnieje regulacja */}
        <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Brak maksymalnej ceny paliw w Polsce</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                <strong>W Polsce nie obowiązują administracyjne maksymalne ceny paliw.</strong> Każdy operator stacji
                ustala własną cenę detaliczną w oparciu o cenę hurtową, lokalizację, konkurencję i marżę.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Rynek paliw jest jednak monitorowany przez <a href="https://uokik.gov.pl/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"><strong>UOKiK</strong></a> (zmowy cenowe)
                oraz <a href="https://www.gov.pl/web/klimat" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"><strong>Ministerstwo Klimatu</strong></a> (opłata emisyjna i ETS).
                Inaczej niż w Czechach, gdzie Ministerstwo Finansów ustala maksymalne dopuszczalne ceny detaliczne.
              </p>
            </div>
          </div>
        </section>

        {/* Skladnice ceny */}
        <section className="mb-10 price-breakdown">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-green-600" />
            Z czego składa się cena benzyny 95 w Polsce 2026
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3 font-semibold">Składnik ceny</th>
                  <th className="text-right p-3 font-semibold">Pb95 (zł/l)</th>
                  <th className="text-right p-3 font-semibold">Diesel (zł/l)</th>
                  <th className="text-right p-3 font-semibold">LPG (zł/l)</th>
                  <th className="text-right p-3 font-semibold">Udział</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                <tr><td className="p-3 font-semibold">Cena hurtowa (ropa + rafinacja)</td><td className="p-3 text-right">~2,80</td><td className="p-3 text-right">~2,75</td><td className="p-3 text-right">~1,30</td><td className="p-3 text-right text-gray-500">~40%</td></tr>
                <tr><td className="p-3 font-semibold">Akcyza</td><td className="p-3 text-right text-red-600 dark:text-red-400">1,529</td><td className="p-3 text-right text-red-600 dark:text-red-400">1,176</td><td className="p-3 text-right text-red-600 dark:text-red-400">0,387</td><td className="p-3 text-right text-gray-500">~24%</td></tr>
                <tr><td className="p-3 font-semibold">Opłata paliwowa</td><td className="p-3 text-right">0,298</td><td className="p-3 text-right">0,298</td><td className="p-3 text-right">0,180</td><td className="p-3 text-right text-gray-500">~5%</td></tr>
                <tr><td className="p-3 font-semibold">Opłata emisyjna</td><td className="p-3 text-right">0,080</td><td className="p-3 text-right">0,080</td><td className="p-3 text-right">—</td><td className="p-3 text-right text-gray-500">~1%</td></tr>
                <tr><td className="p-3 font-semibold">Marża hurtowa + detaliczna</td><td className="p-3 text-right">~0,40</td><td className="p-3 text-right">~0,40</td><td className="p-3 text-right">~0,30</td><td className="p-3 text-right text-gray-500">~7%</td></tr>
                <tr className="bg-amber-50 dark:bg-amber-900/20"><td className="p-3 font-bold">VAT 23% (od całości)</td><td className="p-3 text-right text-red-600 dark:text-red-400 font-bold">~1,18</td><td className="p-3 text-right text-red-600 dark:text-red-400 font-bold">~1,15</td><td className="p-3 text-right text-red-600 dark:text-red-400 font-bold">~0,50</td><td className="p-3 text-right text-gray-500 font-semibold">~23%</td></tr>
                <tr className="bg-green-50 dark:bg-green-900/20"><td className="p-3 font-black text-green-700 dark:text-green-400">CENA DETALICZNA</td><td className="p-3 text-right font-black text-green-700 dark:text-green-400">~6,28</td><td className="p-3 text-right font-black text-green-700 dark:text-green-400">~5,86</td><td className="p-3 text-right font-black text-green-700 dark:text-green-400">~2,69</td><td className="p-3 text-right text-gray-500 font-bold">100%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Wartości orientacyjne dla 2026 r. Faktyczna cena zależy od ceny ropy Brent (USD/baryłka), kursu PLN/USD i marży lokalnej.
            Łączny udział podatków i opłat państwowych w cenie benzyny i diesla wynosi ponad 50%.
          </p>
        </section>

        {/* Międzynárodní srovnání */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Polska vs Czechy vs Niemcy – porównanie podatków paliwowych</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3 font-semibold">Kraj</th>
                  <th className="text-right p-3 font-semibold">Akcyza Pb95</th>
                  <th className="text-right p-3 font-semibold">VAT</th>
                  <th className="text-right p-3 font-semibold">Średnia cena Pb95</th>
                  <th className="text-right p-3 font-semibold">Udział podatków</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                <tr><td className="p-3 font-semibold">🇵🇱 Polska</td><td className="p-3 text-right">1,529 zł/l</td><td className="p-3 text-right">23%</td><td className="p-3 text-right text-green-600">~6,28 zł/l</td><td className="p-3 text-right">~52%</td></tr>
                <tr><td className="p-3 font-semibold">🇨🇿 Czechy</td><td className="p-3 text-right">~2,15 zł/l</td><td className="p-3 text-right">21%</td><td className="p-3 text-right">~6,90 zł/l</td><td className="p-3 text-right">~55%</td></tr>
                <tr><td className="p-3 font-semibold">🇩🇪 Niemcy</td><td className="p-3 text-right">~3,00 zł/l</td><td className="p-3 text-right">19%</td><td className="p-3 text-right text-red-600">~7,80 zł/l</td><td className="p-3 text-right">~60%</td></tr>
                <tr><td className="p-3 font-semibold">🇸🇰 Słowacja</td><td className="p-3 text-right">~2,40 zł/l</td><td className="p-3 text-right">23%</td><td className="p-3 text-right">~6,80 zł/l</td><td className="p-3 text-right">~54%</td></tr>
                <tr><td className="p-3 font-semibold">🇱🇹 Litwa</td><td className="p-3 text-right">~2,55 zł/l</td><td className="p-3 text-right">21%</td><td className="p-3 text-right">~6,90 zł/l</td><td className="p-3 text-right">~55%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Polska należy do najtańszych krajów UE pod względem cen paliw głównie dzięki niższej akcyzie.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Często zadawane pytania o cenach paliw w Polsce</h2>
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
          <Link href="/aktualnosci/prognozy-cen-paliw-polska-2026/" className="text-green-700 dark:text-green-400 hover:underline">→ Prognozy cen paliw 2026</Link>
          <Link href="/aktualnosci/ceny-paliw-polska-vs-europa-2026/" className="text-green-700 dark:text-green-400 hover:underline">→ Polska vs Europa</Link>
          <Link href="/historia-cen/" className="text-green-700 dark:text-green-400 hover:underline">→ Historia cen 90 dni</Link>
          <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Mapa stacji paliw</Link>
        </div>
      </div>
    </>
  );
}
