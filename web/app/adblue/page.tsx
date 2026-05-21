import type { Metadata } from 'next';
import Link from 'next/link';
import { Beaker, AlertCircle, Truck, ShoppingCart } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'AdBlue – co to jest, ile kosztuje, gdzie kupić w Polsce 2026',
  description: 'AdBlue – płyn do diesli Euro 5/6 z systemem SCR. Aktualne ceny w Polsce, gdzie kupić najtaniej (kanister vs dystrybutor), zużycie, co się stanie gdy się skończy.',
  alternates: { canonical: 'https://benzynamapa.pl/adblue/' },
  keywords: [
    'AdBlue cena', 'AdBlue gdzie kupić', 'AdBlue Polska', 'AdBlue do diesla',
    'AdBlue kanister', 'AdBlue dystrybutor', 'co to AdBlue', 'AdBlue Euro 6',
    'kiedy uzupełnić AdBlue', 'AdBlue zużycie',
  ],
  openGraph: {
    title: 'AdBlue – cena, gdzie kupić, zużycie 2026',
    description: 'Kompletny przewodnik po AdBlue w Polsce.',
    url: 'https://benzynamapa.pl/adblue/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'article',
  },
};

const FAQS = [
  { q: 'Co to jest AdBlue?', a: 'AdBlue to wodny roztwór mocznika (32,5% mocznika + 67,5% wody demineralizowanej) zgodny z normą ISO 22241. Wstrzykiwany do układu wydechowego silników diesla z systemem SCR (Selective Catalytic Reduction) gdzie redukuje tlenki azotu (NOx) do nieszkodliwego azotu i wody.' },
  { q: 'Jakie auta wymagają AdBlue?', a: 'Wszystkie nowoczesne diesle Euro 5b+ (od 2014) i Euro 6 (od 2015) z systemem SCR. Praktycznie wszystkie nowe auta diesel od 2017 mają SCR i wymagają AdBlue. Sprawdź czy auto ma drugi mały korek wlewu (zwykle pod korkiem paliwa lub w bagażniku) - to wlew AdBlue.' },
  { q: 'Ile kosztuje AdBlue w Polsce?', a: 'W kanistrach 5L: ok. 35-50 zł (7-10 zł/l). W kanistrach 10L: ok. 50-80 zł (5-8 zł/l). Na dystrybutorze (najtaniej!): 1,80-3,00 zł/l. W AdBlue Box (mniejsze stacje): ok. 4-6 zł/l. Najlepsza cena dla flot - zbiorniki IBC 1000L: 1,50-2,50 zł/l.' },
  { q: 'Gdzie kupić AdBlue najtaniej w Polsce?', a: 'Najtańsze - dystrybutor AdBlue na większych stacjach: Orlen, Lotos, Shell, BP, Circle K, MOL przy autostradach (1,80-3,00 zł/l). Drożej w kanistrach: Castorama, Leroy Merlin, OBI, Amazon, sklepy motoryzacyjne (Inter Cars, Norauto). Najdrożej - małe stacje i AdBlue Box.' },
  { q: 'Ile AdBlue zużywa samochód?', a: 'Typowo 1-2 litry na 1000 km - czyli ok. 5-10% zużycia paliwa. Auto pali 7l/100km diesla = ok. 0,3-0,7 l AdBlue na 100 km. Typowy zbiornik 13-19 litrów = wystarcza na 10 000-20 000 km. Auto samo informuje gdy poziom spada (~2 400 km do końca).' },
  { q: 'Co się stanie gdy AdBlue się skończy?', a: 'Auto najpierw ostrzega (komunikat "AdBlue za 2400 km"), potem ogranicza moc, na końcu blokuje uruchomienie silnika. To wymóg prawny - bez AdBlue silnik nie może spełnić norm Euro 6. Po dotankowaniu i jednym uruchomieniu silnik odblokuje się sam. NIGDY nie używaj wody zamiast AdBlue - uszkodzi katalizator (~10 000 zł naprawy).' },
  { q: 'Czy AdBlue zamarza w mrozie?', a: 'Tak - AdBlue zamarza w -11°C. Auto ma jednak ogrzewacz zbiornika i przewodów, więc problemem jest głównie magazynowanie kanistrów na zewnątrz. Po rozmrożeniu AdBlue zachowuje właściwości - można go używać. NIGDY nie rozcieńczać wodą - zniszczy SCR.' },
  { q: 'Czy mogę używać AdBlue z kanistra?', a: 'Tak. Kup kanister 5-10L z lejkiem (kanistry mają zwykle dołączony elastyczny wąż). Nalej AdBlue do oddzielnego korka (zwykle niebieskiego, mniejszego od korka paliwa). UWAGA: nie pomyl się z wlewem paliwa! AdBlue do baku diesla = poważne uszkodzenie układu paliwowego (~5000-10000 zł).' },
];

export default function AdBluePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'AdBlue' },
            ],
          },
          {
            '@type': 'Article',
            headline: 'AdBlue – co to jest, ile kosztuje, gdzie kupić',
            datePublished: '2026-05-15',
            dateModified: new Date().toISOString(),
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: 'https://benzynamapa.pl/adblue/',
            inLanguage: 'pl',
          },
          {
            '@type': 'Product',
            name: 'AdBlue (DEF, AUS 32)',
            category: 'Płyn do silników diesla SCR',
            description: 'Wodny roztwór mocznika 32,5% zgodny z ISO 22241. Wymagany w dieslach Euro 5b+ i Euro 6 z systemem SCR.',
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'PLN',
              lowPrice: '1.80',
              highPrice: '10.00',
              priceSpecification: { '@type': 'UnitPriceSpecification', price: '2.50', priceCurrency: 'PLN', unitCode: 'LTR', unitText: 'litr (na dystrybutorze)' },
              availability: 'https://schema.org/InStock',
              areaServed: { '@type': 'Country', name: 'Polska' },
            },
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
          <span>AdBlue</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Beaker className="text-blue-600" size={28} />
          AdBlue – co to jest, ile kosztuje, gdzie kupić
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Kompletny przewodnik po AdBlue w Polsce — płyn wymagany w dieslach Euro 5/6.
          Cena w 2026, gdzie kupić najtaniej, jak długo wystarcza, co się stanie gdy się skończy.
        </p>

        <div className="fuel-answer bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-500 rounded-r-xl p-5 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>AdBlue</strong> to wodny roztwór mocznika (32,5%) wstrzykiwany do układu wydechowego diesli z SCR
            (od 2014 - Euro 5b+). <strong className="text-blue-700 dark:text-blue-400">Cena: 1,80-3,00 zł/l</strong> na dystrybutorze,
            7-10 zł/l w kanistrach. Zużycie: 1-2 l/1000 km. Bez AdBlue auto przestanie odpalać.
          </p>
        </div>

        {/* Cena overview */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingCart size={20} className="text-blue-600" />
            Gdzie kupić AdBlue najtaniej?
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3 font-semibold">Miejsce zakupu</th>
                  <th className="text-right p-3 font-semibold">Cena za litr</th>
                  <th className="text-left p-3 font-semibold">Komentarz</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                <tr className="bg-green-50 dark:bg-green-900/20"><td className="p-3 font-bold text-green-700 dark:text-green-400">Dystrybutor na stacji (Orlen, Shell, BP)</td><td className="p-3 text-right font-bold text-green-700 dark:text-green-400">1,80-3,00 zł</td><td className="p-3 text-xs text-gray-600">⭐ Najtaniej. Lepiej niż w kanistrach.</td></tr>
                <tr><td className="p-3 font-semibold">Zbiornik IBC 1000L (flota)</td><td className="p-3 text-right">1,50-2,50 zł</td><td className="p-3 text-xs text-gray-600">Dla flot, wymagana licencja ADR</td></tr>
                <tr><td className="p-3 font-semibold">AdBlue Box (małe stacje)</td><td className="p-3 text-right">4-6 zł</td><td className="p-3 text-xs text-gray-600">Mniej wygodne, drożej</td></tr>
                <tr><td className="p-3 font-semibold">Kanister 10L (Castorama, OBI)</td><td className="p-3 text-right">5-8 zł</td><td className="p-3 text-xs text-gray-600">Dobry kompromis, pod ręką</td></tr>
                <tr><td className="p-3 font-semibold">Kanister 5L (sklep mot.)</td><td className="p-3 text-right">7-10 zł</td><td className="p-3 text-xs text-gray-600">Najgorsze ceny per litr</td></tr>
                <tr><td className="p-3 font-semibold">Amazon, Allegro</td><td className="p-3 text-right">5-8 zł</td><td className="p-3 text-xs text-gray-600">Online, bez wychodzenia z domu</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            <strong>Tip:</strong> Najtaniej tankuje się AdBlue na większych stacjach z dystrybutorem (Orlen, Shell, BP, MOL przy autostradzie).
            Cena: 1,80-3,00 zł/l vs 7-10 zł/l z kanistra. Różnica na 13l zbiorniku = 65-95 zł oszczędności na jednym tankowaniu.
          </p>
        </section>

        {/* Co się stanie */}
        <section className="mb-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-600" />
            Co się stanie gdy AdBlue się skończy?
          </h2>
          <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal pl-5">
            <li><strong>~2400 km do końca:</strong> Komunikat ostrzegawczy "Brak AdBlue za 2400 km - dotankować".</li>
            <li><strong>~1000 km:</strong> Komunikat się powtarza częściej, czerwona kontrolka.</li>
            <li><strong>~0 km:</strong> Auto nie pozwoli uruchomić silnika po następnym wyłączeniu (wymóg prawny Euro 6).</li>
            <li><strong>Po dotankowaniu:</strong> Auto odblokuje się samo po 1-2 uruchomieniach (wykrycie poziomu &gt;0).</li>
          </ol>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 font-semibold">
            ⚠ NIGDY nie używaj wody, moczu zwierząt lub roztworów innych niż certyfikowany AdBlue (ISO 22241).
            Skutek: zniszczenie SCR (~10 000 zł), DPF i czujników NOx.
          </p>
        </section>

        {/* Jak tankować */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Truck size={20} className="text-blue-600" />
            Jak prawidłowo dotankować AdBlue
          </h2>
          <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex gap-3"><span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
              <div><strong>Znajdź wlew AdBlue.</strong> Zwykle obok wlewu paliwa (mniejszy korek, niebieski) lub w bagażniku/komorze silnika. Jeśli auto ma jeden wlew obok paliwa, NIE pomyl się!</div>
            </li>
            <li className="flex gap-3"><span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
              <div><strong>Otwórz korek</strong> (zwykle bagnetowy lub gwintowany). Sprawdź ile AdBlue brakuje (zwykle wskazuje wskaźnik na desce rozdzielczej).</div>
            </li>
            <li className="flex gap-3"><span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
              <div><strong>Z dystrybutora:</strong> użyj jak normalnego pistoletu paliwowego, automatycznie się wyłączy. <strong>Z kanistra:</strong> użyj elastycznego węża dołączonego do kanistra, lej powoli aby nie zalać auta (AdBlue jest agresywny dla lakieru).</div>
            </li>
            <li className="flex gap-3"><span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
              <div><strong>Po nalaniu:</strong> zakręć korek, wytrzyj rozlane krople (AdBlue ma żółte plamy na lakierze). Uruchom silnik, kontrolka zniknie po kilku km.</div>
            </li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">FAQ — AdBlue</h2>
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
          <Link href="/aktualnosci/adblue-co-to-jest-cena-gdzie-kupic-2026/" className="text-green-700 dark:text-green-400 hover:underline">→ Pełen artykuł AdBlue</Link>
          <Link href="/olej-napedowy/" className="text-green-700 dark:text-green-400 hover:underline">→ Olej napędowy</Link>
          <Link href="/najtansze-diesel/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańszy diesel</Link>
          <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Mapa stacji paliw</Link>
        </div>
      </div>
    </>
  );
}
