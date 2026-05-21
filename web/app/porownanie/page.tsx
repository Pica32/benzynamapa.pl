import type { Metadata } from 'next';
import Link from 'next/link';
import { GitCompare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Porównania paliw, sieci i samochodów – BenzynaMAPA 2026',
  description: 'Wszystkie porównania na BenzynaMAPA.pl: Orlen vs Shell, PB95 vs PB98, diesel vs benzyna, LPG vs benzyna, EV vs ICE, Polska vs Niemcy.',
  alternates: { canonical: 'https://benzynamapa.pl/porownanie/' },
  openGraph: {
    title: 'Porównania na BenzynaMAPA.pl',
    description: 'Praktyczne porównania paliw, sieci stacji i typów aut.',
    url: 'https://benzynamapa.pl/porownanie/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'website',
  },
};

const COMPARES = [
  // Paliwa
  { slug: 'pb95-vs-pb98', title: 'Benzyna 95 vs Benzyna 98', desc: 'Która oktanowa do mojego auta? Kiedy 98 daje korzyść.', tag: 'Paliwa' },
  { slug: 'diesel-vs-benzyna', title: 'Diesel vs Benzyna', desc: 'Co tańsze w eksploatacji - przy jakim przebiegu opłaca się diesel.', tag: 'Paliwa' },
  { slug: 'lpg-vs-benzyna', title: 'LPG vs Benzyna 95', desc: 'Oszczędność z autogazu - kalkulator zwrotu inwestycji.', tag: 'Paliwa' },
  { slug: 'ev-vs-spalinowe', title: 'EV vs auto spalinowe', desc: 'Koszt 100 km - elektryk vs benzyna vs diesel vs LPG.', tag: 'Paliwa' },
  // Sieci
  { slug: 'orlen-vs-shell', title: 'Orlen vs Shell', desc: 'Polska firma vs holenderski premium - ceny, jakość, lokalizacje.', tag: 'Sieci' },
  { slug: 'orlen-vs-bp', title: 'Orlen vs BP', desc: 'Lider rynku vs program BonusMania - co wybrać.', tag: 'Sieci' },
  { slug: 'shell-vs-bp', title: 'Shell vs BP', desc: 'Dwa premium koncerny - V-Power vs Ultimate.', tag: 'Sieci' },
  { slug: 'moya-vs-huzar', title: 'Moya vs Huzar', desc: 'Dwie polskie niezależne sieci - dla kierowców szukających taniej.', tag: 'Sieci' },
  { slug: 'orlen-vs-lotos', title: 'Orlen vs Lotos (po fuzji)', desc: 'Co się zmieniło po przejęciu Lotosu w 2022.', tag: 'Sieci' },
  { slug: 'shell-vpower-vs-orlen-verva', title: 'Shell V-Power vs Orlen Verva', desc: 'Premium 98 - który lepszy?', tag: 'Sieci' },
  // Geograficzne
  { slug: 'polska-vs-niemcy', title: 'Ceny paliw: Polska vs Niemcy', desc: 'Dlaczego u nas taniej. Akcyza, VAT, polityka.', tag: 'Geografia' },
  { slug: 'polska-vs-czechy', title: 'Polska vs Czechy', desc: 'Sąsiednia różnica - turystyka paliwowa.', tag: 'Geografia' },
  { slug: 'polska-vs-ukraina', title: 'Polska vs Ukraina', desc: 'Najtańsze tankowanie po wschodniej granicy.', tag: 'Geografia' },
  // Karty
  { slug: 'orlen-vitay-vs-bp-bonusmania', title: 'Orlen Vitay vs BP BonusMania', desc: 'Dwa największe programy lojalnościowe.', tag: 'Karty' },
];

const TAG_COLOR: Record<string, string> = {
  'Paliwa':    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  'Sieci':     'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'Geografia': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'Karty':     'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
};

export default function PorownaniaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Porównania', item: 'https://benzynamapa.pl/porownanie/' },
            ],
          },
          {
            '@type': 'CollectionPage',
            name: 'Porównania paliw, sieci i samochodów',
            description: 'Zbiór praktycznych porównań na BenzynaMAPA.pl',
            url: 'https://benzynamapa.pl/porownanie/',
          },
        ],
      }) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Strona główna</Link>
        <span className="mx-2">›</span>
        <span>Porównania</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <GitCompare className="text-green-600" size={28} />
        Porównania - paliwa, sieci, samochody
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        Praktyczne porównania - PB95 vs PB98, diesel vs benzyna, Orlen vs Shell, Polska vs Niemcy.
        Konkretne liczby, kalkulatory, FAQ.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {COMPARES.map(c => (
          <Link key={c.slug} href={`/porownanie/${c.slug}/`}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-green-500 hover:shadow-md transition-all group">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400">
                {c.title}
              </h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TAG_COLOR[c.tag]}`}>
                {c.tag}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{c.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Mapa stacji</Link>
        <Link href="/marka/" className="text-green-700 dark:text-green-400 hover:underline">→ Wszystkie sieci</Link>
        <Link href="/aktualnosci/" className="text-green-700 dark:text-green-400 hover:underline">→ Aktualności</Link>
      </div>
    </div>
  );
}

export { COMPARES };
