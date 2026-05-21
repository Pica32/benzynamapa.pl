import type { Metadata } from 'next';
import Link from 'next/link';
import { REGIONS } from '@/types';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ceny paliw według województw – Polska 2026 | BenzynaMAPA',
  description: 'Aktualne ceny benzyny 95, diesla i LPG we wszystkich 16 województwach Polski. Porównaj średnie regionalne i znajdź najtańsze paliwo w Twoim województwie.',
  alternates: { canonical: 'https://benzynamapa.pl/wojewodztwo/' },
  openGraph: {
    title: 'Ceny paliw według województw w Polsce | BenzynaMAPA',
    description: 'Mapa cen paliw we wszystkich województwach Polski. Średnie regionalne, ranking najtańszych regionów.',
    url: 'https://benzynamapa.pl/wojewodztwo/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'website',
  },
  keywords: [
    'ceny paliw województwa', 'ceny benzyny mazowieckie', 'ceny diesla małopolskie',
    'paliwa śląskie', 'paliwa wielkopolskie', 'mapa cen paliw Polska województwa',
  ],
};

export default function WojewodztwoIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Województwa', item: 'https://benzynamapa.pl/wojewodztwo/' },
            ],
          },
          {
            '@type': 'ItemList',
            name: 'Województwa Polski – ceny paliw',
            numberOfItems: REGIONS.length,
            itemListElement: REGIONS.map((r, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://benzynamapa.pl/wojewodztwo/${r.slug}/`,
              name: `Ceny paliw w województwie ${r.name}`,
            })),
          },
        ],
      }) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Strona główna</Link>
        <span className="mx-2">›</span>
        <span>Województwa</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <MapPin className="text-green-600" size={28} />
        Ceny paliw według województw
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        Aktualne ceny benzyny 95, diesla i LPG we wszystkich <strong>16 województwach Polski</strong>.
        Wybierz województwo i zobacz średnie ceny, najtańsze stacje i przegląd miast w regionie.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REGIONS.sort((a, b) => b.population - a.population).map(r => (
          <Link key={r.slug} href={`/wojewodztwo/${r.slug}/`}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-green-500 hover:shadow-md transition-all group">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400">
                {r.name}
              </h2>
              <span className="text-xs text-gray-400">{(r.population / 1000000).toFixed(1)} mln</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Stolica: <strong>{r.capital}</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{r.description}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 bg-green-50 dark:bg-gray-800 rounded-2xl p-6 border border-green-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Jak różnią się ceny paliw między województwami?</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          Ceny paliw w Polsce różnią się między województwami nawet o <strong>0,30–0,50 zł/l</strong>.
          Najtańsze regiony to zwykle województwo podkarpackie, lubelskie i świętokrzyskie — głównie ze względu
          na większą obecność niezależnych stacji i mniejszą koncentrację sieci premium.
        </p>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          Najdroższe paliwo bywa w województwach mazowieckim, pomorskim i małopolskim — gdzie aglomeracje
          warszawska, trójmiejska i krakowska generują wysoki popyt, a stacje na trasach turystycznych
          (Bałtyk, Tatry) mają wyższe marże.
        </p>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Sprawdź konkretne województwo aby zobaczyć średnie ceny benzyny 95 i diesla,
          ranking najtańszych stacji w regionie oraz listę głównych miast.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/najtansze-benzyna/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańsza benzyna w Polsce</Link>
        <Link href="/najtansze-diesel/" className="text-green-700 dark:text-green-400 hover:underline">→ Najtańszy diesel w Polsce</Link>
        <Link href="/marka/" className="text-green-700 dark:text-green-400 hover:underline">→ Porównaj sieci stacji paliw</Link>
        <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Mapa stacji paliw</Link>
      </div>
    </div>
  );
}
