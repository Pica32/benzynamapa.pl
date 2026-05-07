import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Benzyna vs diesel – co wybrać? Porównanie kosztów 2026',
  description: 'Benzyna 95 czy diesel (olej napędowy)? Porównanie kosztów, spalania, podatków i ekologii. Kalkulator opłacalności dla kierowców w Polsce 2026.',
  alternates: { canonical: 'https://benzynamapa.pl/benzyna-vs-diesel/' },
  openGraph: {
    title: 'Benzyna vs diesel – co wybrać? | BenzynaMAPA',
    description: 'Kompleksowe porównanie benzyny 95 i diesla. Koszty, spalanie, serwis, ekologia.',
    url: 'https://benzynamapa.pl/benzyna-vs-diesel/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'article',
  },
};

const FAQS = [
  { q: 'Co jest tańsze – benzyna czy diesel?', a: 'Diesel (olej napędowy) jest zazwyczaj o 0,10–0,30 zł/l droższy od benzyny 95. Jednak silniki diesla zużywają o 20–30% mniej paliwa na 100 km, więc przy dużych przebiegach diesel jest tańszy w eksploatacji.' },
  { q: 'Kiedy opłaca się diesel?', a: 'Diesel opłaca się przy rocznym przebiegu powyżej 25 000 km. Przy mniejszych przebiegach wyższe koszty zakupu i serwisu silnika Diesla sprawiają, że benzyna jest bardziej ekonomiczna.' },
  { q: 'Czy benzyna jest lepsza dla środowiska?', a: 'Benzyna emituje mniej cząstek stałych (PM2.5) niż diesel. Jednak nowoczesne silniki Diesla z filtrami DPF mają zbliżone emisje. Oba typy emitują podobne ilości CO₂.' },
  { q: 'Jakie jest zużycie benzyny vs diesel?', a: 'Typowy samochód benzynowy zużywa 6–10 l/100km, a diesel 5–7 l/100km w cyklu mieszanym. Silniki diesla są bardziej efektywne przy jeździe pozamiejskiej.' },
  { q: 'Czy mogę zatankować dieslem auto benzynowe?', a: 'Absolutnie nie. Pomyłkowe zatankowanie dieslem samochodu benzynowego (lub odwrotnie) może spowodować poważne uszkodzenie silnika wymagające kosztownej naprawy.' },
];

export default function BenzynaVsDieselPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Mapa</Link>
        <span className="mx-2">›</span>
        <span>Benzyna vs diesel</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
        Benzyna vs diesel – co wybrać w 2026?
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Kompleksowe porównanie kosztów eksploatacji, spalania i ekologii.
      </p>

      {/* Tabela porównawcza */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Porównanie benzyna vs diesel</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="text-left px-5 py-3 font-bold text-gray-700 dark:text-gray-300">Kryterium</th>
                <th className="text-center px-4 py-3 font-bold text-green-700 dark:text-green-400">Benzyna 95</th>
                <th className="text-center px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Diesel (ON)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[
                ['Cena paliwa (2026)', '~6,40 zł/l', '~6,20 zł/l'],
                ['Zużycie miasto', '9–12 l/100km', '6–9 l/100km'],
                ['Zużycie trasa', '6–8 l/100km', '5–6 l/100km'],
                ['Koszt/100km (miasto)', '~60–77 zł', '~37–56 zł'],
                ['Koszt/100km (trasa)', '~38–51 zł', '~31–37 zł'],
                ['Cena auta', 'niższa', 'wyższa o 3 000–8 000 zł'],
                ['Koszt serwisu', 'niższy', 'wyższy (DPF, wtryskiwacze)'],
                ['Emisja CO₂', '~160 g/km', '~140 g/km'],
                ['Emisja cząstek PM', 'niższa', 'wyższa (bez DPF)'],
                ['Trwałość silnika', '200 000–350 000 km', '300 000–500 000 km'],
                ['Opłacalność przy', 'do 20 000 km/rok', 'powyżej 25 000 km/rok'],
              ].map(([k, b, d]) => (
                <tr key={k} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300">{k}</td>
                  <td className="px-4 py-3 text-center text-green-700 dark:text-green-400 font-semibold">{b}</td>
                  <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Często zadawane pytania</h2>
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

      <div className="flex flex-wrap gap-3 mt-8">
        <Link href="/najtansze-benzyna/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Najtańsza benzyna 95</Link>
        <Link href="/najtansze-diesel/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Najtańszy diesel w Polsce</Link>
        <Link href="/kalkulator/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Kalkulator zużycia paliwa</Link>
      </div>
    </div>
  );
}
