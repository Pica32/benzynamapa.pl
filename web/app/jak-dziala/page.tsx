import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, RefreshCw, CheckCircle2, AlertCircle, Filter, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Jak działa BenzynaMAPA.pl – instrukcja, FAQ, źródła danych',
  description: 'Dowiedz się jak działa BenzynaMAPA.pl: skąd pochodzą ceny paliw, jak je weryfikujemy, jak korzystać z mapy i filtrów, jak zgłosić cenę.',
  alternates: { canonical: 'https://benzynamapa.pl/jak-dziala/' },
  openGraph: {
    title: 'Jak działa BenzynaMAPA.pl',
    description: 'Instrukcja korzystania z porównywarki cen paliw w Polsce.',
    url: 'https://benzynamapa.pl/jak-dziala/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'article',
  },
};

const FAQS = [
  { q: 'Skąd pobieracie ceny paliw?', a: 'Ceny pobieramy automatycznie z polskich serwisów agregujących dane o paliwach (m.in. cenapaliw.pl) oraz ze zgłoszeń użytkowników. Bazę stacji budujemy z OpenStreetMap (8 600+ stacji w Polsce).' },
  { q: 'Jak często aktualizujecie ceny?', a: 'GitHub Actions pobiera dane o cenach 3 razy dziennie: o 6:00, 10:00 i 15:00 CET. Każda cena ma znacznik czasu pochodzenia.' },
  { q: 'Co oznacza znak ✓ zweryfikowane przy cenie?', a: 'Cena oznaczona ✓ pochodzi ze zweryfikowanego źródła (agregator z znacznikiem czasu lub potwierdzenie 3 użytkowników). Cena z znakiem ~ to szacunek na podstawie krajowej średniej + typowego odchylenia sieci.' },
  { q: 'Jak wygląda kolorowanie stacji na mapie?', a: 'Zielony = najtańsze 20% stacji. Pomarańczowy = średnia. Czerwony = najdroższe 20%. Kolory zmieniają się w zależności od wybranego paliwa (Pb95, ON, LPG).' },
  { q: 'Jak skorzystać z funkcji „znajdź mnie"?', a: 'Kliknij przycisk lokalizacji na mapie. Po wyrażeniu zgody przeglądarka udostępni nam Twoją lokalizację (nie zapisujemy jej). Mapa wyśrodkuje się i pokaże najbliższe stacje posortowane według odległości.' },
  { q: 'Jak zgłosić cenę z konkretnej stacji?', a: 'Wejdź na stronę stacji (klik na marker mapy → „Szczegóły"), zjedź do sekcji „Zgłoś cenę", wprowadź aktualne ceny i potwierdź. Po potwierdzeniu przez 3 innych użytkowników cena pojawi się jako zweryfikowana.' },
  { q: 'Czy aplikacja działa na telefonie?', a: 'Tak. Strona jest w pełni responsywna i optymalizowana pod urządzenia mobilne. W tle działają oszczędności CPU i danych — mapa ładuje tylko widoczne stacje.' },
  { q: 'Czy macie API do cen paliw?', a: 'Tak, JSON endpointy są publicznie dostępne: /data/stats_latest.json (średnie), /data/prices_latest.json (wszystkie ceny), /data/stations_latest.json (stacje), /data/history_90d.json (90-dniowy trend). Do użytku komercyjnego prosimy o kontakt.' },
];

export default function JakDzialaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Jak działa' },
            ],
          },
          {
            '@type': 'HowTo',
            name: 'Jak korzystać z BenzynaMAPA.pl',
            description: 'Instrukcja krok po kroku jak znaleźć najtańszą stację paliw w okolicy',
            step: [
              { '@type': 'HowToStep', name: 'Wejdź na stronę główną', text: 'Otwórz benzynamapa.pl w przeglądarce – mapa Polski załaduje się automatycznie.' },
              { '@type': 'HowToStep', name: 'Wybierz rodzaj paliwa', text: 'Z filtra wybierz Pb95, Pb98, Diesel lub LPG. Mapa zmieni kolory stacji według cen tego paliwa.' },
              { '@type': 'HowToStep', name: 'Kliknij „Znajdź mnie"', text: 'Po udostępnieniu lokalizacji mapa wyśrodkuje się na Twoim położeniu i pokaże najbliższe tanie stacje.' },
              { '@type': 'HowToStep', name: 'Kliknij stację na mapie', text: 'Zobacz aktualne ceny, godziny otwarcia, GPS i nawigację (Google Maps, Waze, Apple Maps).' },
            ],
          },
          {
            '@type': 'FAQPage',
            mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question'] },
          },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <span>Jak działa</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Jak działa BenzynaMAPA.pl</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Krótki przewodnik – skąd pochodzą ceny paliw, jak je weryfikujemy, jak korzystać z mapy.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">4 kroki do znalezienia najtańszej stacji</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: MapPin, title: '1. Otwórz mapę Polski', text: 'Strona główna pokazuje całą Polskę – 8 600+ stacji oznaczonych kolorami według ceny.' },
              { icon: Filter, title: '2. Wybierz paliwo', text: 'Filtr na górze: Pb95 / Pb98 / Diesel / LPG. Mapa przeliczy kolory pod konkretne paliwo.' },
              { icon: Smartphone, title: '3. Znajdź mnie', text: 'Po udostępnieniu lokalizacji widzisz najbliższe tanie stacje na mapie + listę.' },
              { icon: CheckCircle2, title: '4. Sprawdź szczegóły', text: 'Klik na marker → ceny, GPS, nawigacja jednym kliknięciem (Google Maps / Waze).' },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <s.icon size={28} className="text-green-600 mb-2" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 bg-blue-50 dark:bg-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
          <div className="flex items-start gap-3 mb-3">
            <RefreshCw size={24} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Skąd pochodzą ceny paliw</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Bazę stacji budujemy z <strong>OpenStreetMap</strong> (open-source dane mapowe).
                Ceny pobieramy z polskich serwisów agregujących dane o paliwach (np. cenapaliw.pl)
                oraz ze zgłoszeń użytkowników.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Aktualizacja danych: <strong>3 razy dziennie</strong> przez GitHub Actions
                (6:00, 10:00, 15:00 CET). Każda cena ma znacznik czasu źródła.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10 grid sm:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">
            <CheckCircle2 size={28} className="text-green-600 mb-2" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Ceny zweryfikowane (✓)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Ceny pochodzące ze zweryfikowanych źródeł (agregator + znacznik czasu)
              lub potwierdzone przez 3 użytkowników. Wyświetlają się z znacznikiem ✓.
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
            <AlertCircle size={28} className="text-amber-600 mb-2" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Ceny szacunkowe (~)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Stacje bez zgłoszonej ceny otrzymują szacunek z krajowej średniej + typowego
              odchylenia danej sieci (np. Shell +0,35 zł, Moya −0,15 zł). Wyświetlają się z znakiem ~.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Często zadawane pytania</h2>
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
          <Link href="/o-nas/" className="text-green-700 dark:text-green-400 hover:underline">→ O BenzynaMAPA.pl</Link>
          <Link href="/regulamin/" className="text-green-700 dark:text-green-400 hover:underline">→ Regulamin</Link>
          <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Otwórz mapę stacji</Link>
        </div>
      </div>
    </>
  );
}
