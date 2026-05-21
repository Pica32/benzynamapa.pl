import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap, Plug, MapPin, AlertCircle } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Stacje ładowania samochodów elektrycznych w Polsce 2026 | BenzynaMAPA',
  description: 'Aktualne ceny ładowania EV w Polsce - GreenWay, Orlen Charge, Tauron, Ionity. Mapa 4 000+ stacji ładowania, ceny kWh, AC vs DC, koszt ładowania samochodu elektrycznego.',
  alternates: { canonical: 'https://benzynamapa.pl/stacje-ladowania-ev/' },
  keywords: [
    'stacje ładowania samochodów elektrycznych', 'EV ładowanie Polska',
    'ile kosztuje ładowanie EV', 'GreenWay cennik', 'Orlen Charge cena',
    'Tauron eMobility', 'Ionity Polska', 'koszt ładowania samochodu elektrycznego',
    'mapa stacji ładowania', 'AC vs DC ładowanie',
  ],
  openGraph: {
    title: 'Stacje ładowania samochodów elektrycznych w Polsce',
    description: 'Ceny, sieci, mapa - przewodnik po ładowaniu EV w Polsce 2026.',
    url: 'https://benzynamapa.pl/stacje-ladowania-ev/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'article',
  },
};

const NETWORKS = [
  { name: 'GreenWay Polska', acPrice: '1,89-2,29', dcPrice: '2,29-3,49', count: '~700', notes: 'Największa sieć szybkiego ładowania' },
  { name: 'Orlen Charge', acPrice: '1,79-2,19', dcPrice: '2,29-3,29', count: '~250', notes: 'Sieć Orlen, integracja z Vitay' },
  { name: 'Tauron eMobility', acPrice: '1,69-1,99', dcPrice: '2,19-2,99', count: '~400', notes: 'Najtańsze ładowanie AC w PL' },
  { name: 'Ionity', acPrice: '—', dcPrice: '3,19-3,99', count: '~50', notes: 'Premium DC 350 kW, głównie autostrady' },
  { name: 'GO+EAuto (Eleport)', acPrice: '1,99', dcPrice: '2,49-3,29', count: '~500', notes: 'Niemiecka sieć, dobrze rozwinięta' },
  { name: 'Powerdot', acPrice: '1,89', dcPrice: '2,29-2,89', count: '~150', notes: 'Portugalska sieć, rosnąca' },
  { name: 'PGE eMobility', acPrice: '1,89-2,19', dcPrice: '2,49', count: '~100', notes: 'Polski operator państwowy' },
  { name: 'Lidl/Auchan/Carrefour', acPrice: '1,69-1,99', dcPrice: '2,19', count: '~200', notes: 'Przy hipermarketach, często rabaty' },
];

const FAQS = [
  {
    q: 'Ile kosztuje ładowanie samochodu elektrycznego w Polsce?',
    a: 'AC (wolne, do 22 kW): 1,69-2,29 zł/kWh. DC (szybkie, 50-350 kW): 2,19-3,99 zł/kWh. Pełne ładowanie typowego EV (60 kWh batteria): ~100-200 zł. Najtaniej w domu (taryfa nocna): 0,40-0,80 zł/kWh.',
  },
  {
    q: 'Ile stacji ładowania EV jest w Polsce?',
    a: 'W 2026 ok. 4 000-5 000 stacji ładowania (vs 8 600 stacji paliw tradycyjnych). Sieć rośnie szybko - ok. 30-40% rok do roku. Największe sieci: GreenWay, Orlen Charge, Tauron eMobility, GO+EAuto.',
  },
  {
    q: 'AC czy DC - jaką ładowarkę wybrać?',
    a: 'AC (do 22 kW): wolne ładowanie, pełna bateria w 3-8h. Idealne na noc, w pracy, w domu. Tańsze. DC (50-350 kW): szybkie ładowanie, 80% w 20-40 min. Droższe. Używaj DC tylko gdy potrzebujesz dojechać dalej.',
  },
  {
    q: 'Czy EV jest tańszy niż auto spalinowe?',
    a: 'W eksploatacji: tak, znacznie. 100 km EV: ~15-25 zł (ładowanie publiczne) lub ~5-10 zł (dom). 100 km benzyna: ~45-60 zł. Wadą jest wyższa cena zakupu auta i bateria.',
  },
  {
    q: 'Czy są dotacje na zakup EV?',
    a: 'W 2026 program "Mój Elektryk 2.0" - do 27 000 zł dotacji dla osób fizycznych na nowy EV (cena do 225 000 zł). Dla firm: ulga inwestycyjna 50% kosztu. Sprawdź aktualne warunki na gov.pl/web/klimat.',
  },
  {
    q: 'Jak ładować EV w trasie?',
    a: 'Aplikacje: Plugshare (mapa wszystkich sieci), GreenWay (własna sieć), eMobiPay (multi-network). Planuj trasę przez aplikację - autostrady mają stacje co 60-100 km. Karta MultiCharger lub mobilna płatność.',
  },
  {
    q: 'Czy BenzynaMAPA pokazuje stacje EV?',
    a: 'Aktualnie monitorujemy głównie stacje paliw tradycyjnych. EV jest na naszej roadmapie - planujemy integrację z OpenChargeMap w 2026. Tymczasem polecamy: plugshare.com / chargemap.com / własne aplikacje sieci.',
  },
];

export default function EVChargingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Stacje ładowania EV' },
            ],
          },
          {
            '@type': 'Article',
            headline: 'Stacje ładowania samochodów elektrycznych w Polsce 2026',
            datePublished: '2026-05-19',
            dateModified: new Date().toISOString(),
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: 'https://benzynamapa.pl/stacje-ladowania-ev/',
            inLanguage: 'pl',
          },
          {
            '@type': 'FAQPage',
            mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question', '.ev-answer'] },
          },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <span>Stacje ładowania EV</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Zap className="text-yellow-500" size={28} />
          Stacje ładowania samochodów elektrycznych w Polsce
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Przewodnik po sieciach ładowania EV w Polsce 2026 - ceny kWh, AC vs DC, koszt ładowania,
          dotacje i porównanie z paliwami tradycyjnymi.
        </p>

        {/* Answer box */}
        <div className="ev-answer bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 border-l-4 border-yellow-500 rounded-r-xl p-5 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Ładowanie EV w Polsce 2026:</strong> AC (wolne) <strong className="text-yellow-700 dark:text-yellow-400">1,69-2,29 zł/kWh</strong>,
            DC (szybkie) <strong className="text-yellow-700 dark:text-yellow-400">2,19-3,99 zł/kWh</strong>.
            Pełne ładowanie typowego EV (60 kWh): <strong>100-200 zł</strong>.
            Najtańsze w domu na taryfie nocnej: 0,40-0,80 zł/kWh.
            Ok. <strong>4 000-5 000 stacji</strong> w Polsce, rośnie ~35%/rok.
            Główne sieci: <strong>GreenWay, Orlen Charge, Tauron eMobility, Ionity</strong>.
          </p>
        </div>

        {/* Roadmap warning */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">Stacje EV na BenzynaMAPA - w planach</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Aktualnie monitorujemy głównie stacje paliw tradycyjnych (8 600+).
                Integrację z OpenChargeMap i sieciami EV planujemy w 2026.
                Tymczasem polecamy: <a href="https://www.plugshare.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Plugshare</a>,{' '}
                <a href="https://chargemap.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Chargemap</a>{' '}
                lub aplikacje konkretnych sieci.
              </p>
            </div>
          </div>
        </div>

        {/* Tabela sítí */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plug size={24} className="text-yellow-500" />
            Sieci ładowania EV w Polsce - cennik 2026
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3 font-semibold">Sieć</th>
                  <th className="text-right p-3 font-semibold">AC zł/kWh</th>
                  <th className="text-right p-3 font-semibold">DC zł/kWh</th>
                  <th className="text-right p-3 font-semibold">Stacji</th>
                  <th className="text-left p-3 font-semibold">Notatka</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {NETWORKS.map(n => (
                  <tr key={n.name}>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{n.name}</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">{n.acPrice}</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">{n.dcPrice}</td>
                    <td className="p-3 text-right text-gray-500">{n.count}</td>
                    <td className="p-3 text-xs text-gray-600 dark:text-gray-400">{n.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Ceny orientacyjne 2026. Aktualne taryfy w aplikacjach konkretnych sieci.
            Najtaniej: subskrypcje (np. GreenWay GO) lub karty multi-network (eMobiPay).
          </p>
        </section>

        {/* EV vs ICE */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">EV vs auto spalinowe - koszt 100 km</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3 font-semibold">Sposób</th>
                  <th className="text-right p-3 font-semibold">Zużycie</th>
                  <th className="text-right p-3 font-semibold">Cena jednostkowa</th>
                  <th className="text-right p-3 font-semibold">Koszt 100 km</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                <tr className="bg-green-50 dark:bg-green-900/20"><td className="p-3 font-bold text-green-700 dark:text-green-400">EV - dom (taryfa nocna)</td><td className="p-3 text-right">15 kWh</td><td className="p-3 text-right">0,40-0,80 zł/kWh</td><td className="p-3 text-right font-bold text-green-700 dark:text-green-400">6-12 zł</td></tr>
                <tr><td className="p-3 font-semibold">EV - dom (taryfa dzienna)</td><td className="p-3 text-right">15 kWh</td><td className="p-3 text-right">~0,80 zł/kWh</td><td className="p-3 text-right">12 zł</td></tr>
                <tr><td className="p-3 font-semibold">EV - AC publiczne</td><td className="p-3 text-right">15 kWh</td><td className="p-3 text-right">1,89 zł/kWh</td><td className="p-3 text-right">28 zł</td></tr>
                <tr><td className="p-3 font-semibold">EV - DC szybkie</td><td className="p-3 text-right">15 kWh</td><td className="p-3 text-right">2,89 zł/kWh</td><td className="p-3 text-right">43 zł</td></tr>
                <tr className="bg-purple-50 dark:bg-purple-900/20"><td className="p-3 font-bold text-purple-700 dark:text-purple-400">LPG</td><td className="p-3 text-right">8,5 l</td><td className="p-3 text-right">~2,90 zł/l</td><td className="p-3 text-right font-bold text-purple-700 dark:text-purple-400">25 zł</td></tr>
                <tr><td className="p-3 font-semibold">Diesel</td><td className="p-3 text-right">6 l</td><td className="p-3 text-right">~6,20 zł/l</td><td className="p-3 text-right">37 zł</td></tr>
                <tr><td className="p-3 font-semibold">Benzyna 95</td><td className="p-3 text-right">7 l</td><td className="p-3 text-right">~6,40 zł/l</td><td className="p-3 text-right">45 zł</td></tr>
                <tr className="bg-red-50 dark:bg-red-900/20"><td className="p-3 font-bold text-red-700 dark:text-red-400">Benzyna 98 premium</td><td className="p-3 text-right">7 l</td><td className="p-3 text-right">~6,80 zł/l</td><td className="p-3 text-right font-bold text-red-700 dark:text-red-400">48 zł</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            <strong>Wniosek:</strong> EV ładowane w domu = najtańsze (6-12 zł/100km).
            EV publiczne DC ≈ LPG ≈ Diesel. Benzyna najdroższa w eksploatacji.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">FAQ - ładowanie EV w Polsce</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <summary className="faq-question font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-yellow-500 group-open:rotate-180 transition-transform ml-3 flex-shrink-0">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/benzyna-vs-diesel/" className="text-green-700 dark:text-green-400 hover:underline">→ Benzyna vs diesel</Link>
          <Link href="/lpg/" className="text-green-700 dark:text-green-400 hover:underline">→ LPG (najtańsze paliwo)</Link>
          <Link href="/kalkulator/" className="text-green-700 dark:text-green-400 hover:underline">→ Kalkulator kosztów</Link>
          <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Mapa stacji paliw</Link>
        </div>
      </div>
    </>
  );
}
