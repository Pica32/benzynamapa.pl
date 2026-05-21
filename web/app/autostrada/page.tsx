import type { Metadata } from 'next';
import Link from 'next/link';
import { HIGHWAYS } from '@/types';
import { Map } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Autostrady i drogi ekspresowe Polski – ceny paliw na trasie 2026',
  description: 'Najtańsze stacje paliw na polskich autostradach (A1, A2, A4) i drogach ekspresowych (S1, S3, S5, S7, S8, S10, S11). Ranking, mapa, porównanie cen.',
  alternates: { canonical: 'https://benzynamapa.pl/autostrada/' },
  openGraph: {
    title: 'Autostrady Polski – ceny paliw na trasie',
    description: 'Najtańsze stacje na A1, A2, A4, S7 i pozostałych trasach.',
    url: 'https://benzynamapa.pl/autostrada/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'website',
  },
  keywords: [
    'najtańsza stacja na autostradzie', 'ceny paliw A1', 'ceny paliw A2', 'ceny paliw A4',
    'stacje na S7', 'tankowanie autostrada', 'najtańszy diesel autostrada',
    'opłaty autostrada Polska', 'mapa stacji autostrada',
  ],
};

export default function AutostradyIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Autostrady', item: 'https://benzynamapa.pl/autostrada/' },
            ],
          },
          {
            '@type': 'ItemList',
            name: 'Polskie autostrady i drogi ekspresowe',
            description: 'Lista polskich autostrad i dróg ekspresowych z cenami paliw na trasie',
            numberOfItems: HIGHWAYS.length,
            itemListElement: HIGHWAYS.map((h, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://benzynamapa.pl/autostrada/${h.slug}/`,
              name: h.name,
            })),
          },
        ],
      }) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Strona główna</Link>
        <span className="mx-2">›</span>
        <span>Autostrady</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <Map className="text-green-600" size={28} />
        Autostrady Polski – ceny paliw na trasie
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        Najtańsze stacje paliw na polskich autostradach (A1, A2, A4, A6) i drogach ekspresowych (S1, S3, S5, S7, S8, S10, S11).
        Ranking stacji wzdłuż każdej trasy, średnie ceny i przegląd głównych miast.
      </p>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-8">
        <h2 className="font-bold text-gray-900 dark:text-white mb-2">⚠ Stacje przy autostradach są zazwyczaj droższe</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Stacje paliw zlokalizowane bezpośrednio przy zjazdach autostradowych mają zazwyczaj o
          <strong> 0,20-0,50 zł/l wyższe ceny</strong> niż średnia w okolicy. Powodem są wyższe koszty operacyjne,
          długie godziny pracy i zachwytywanie przejezdnych z silnym popytem nieelastycznym.
          Często warto zatankować w mieście przed wjazdem na autostradę.
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Wybierz autostradę / drogę ekspresową</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {HIGHWAYS.map(h => (
          <Link key={h.slug} href={`/autostrada/${h.slug}/`}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-green-500 hover:shadow-md transition-all group">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-black text-2xl text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400">
                {h.code}
              </h3>
              <span className="text-xs text-gray-400">{h.lengthKm} km</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              <strong>{h.from}</strong> → <strong>{h.to}</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{h.description}</p>
            <p className="text-xs text-gray-400">
              Główne miasta: {h.cities.slice(0, 4).join(', ')}{h.cities.length > 4 && ` +${h.cities.length - 4}`}
            </p>
          </Link>
        ))}
      </div>

      <section className="bg-green-50 dark:bg-gray-800 rounded-2xl p-6 border border-green-100 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Jak zaoszczędzić na paliwie podczas dłuższej podróży</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
          <li><strong>Zatankuj przed wjazdem na autostradę.</strong> Stacje w miastach przed zjazdem są zwykle 0,20-0,50 zł/l tańsze.</li>
          <li><strong>Pierwsza stacja po zjeździe.</strong> W większych miastach możesz odjechać 1-2 km od zjazdu i znaleźć stację o 0,30 zł/l taniej.</li>
          <li><strong>Sprawdzaj BenzynaMAPA.pl.</strong> Mapa pokazuje ceny w czasie rzeczywistym wzdłuż całej trasy z kolorowymi markerami.</li>
          <li><strong>Karty lojalnościowe.</strong> Orlen Vitay, BP BonusMania, Shell ClubSmart - 0,05-0,15 zł/l rabat na każdym tankowaniu.</li>
          <li><strong>Tempomat na autostradzie.</strong> Stała prędkość 110-120 km/h zamiast 130-140 km/h obniża spalanie o 10-15%.</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Mapa wszystkich stacji</Link>
        <Link href="/najtansze-benzyna/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańsza Pb95</Link>
        <Link href="/najtansze-diesel/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańszy diesel</Link>
        <Link href="/aktualnosci/jak-oszczedzac-na-paliwie-10-sposobow/" className="text-green-700 dark:text-green-400 hover:underline">→ Jak oszczędzać na paliwie</Link>
      </div>
    </div>
  );
}
