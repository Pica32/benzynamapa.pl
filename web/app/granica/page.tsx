import type { Metadata } from 'next';
import Link from 'next/link';
import { BORDERS } from '@/types';
import { getStats, formatPrice } from '@/lib/data';
import { Globe } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Turystyka paliwowa – ceny przy granicach Polski 2026 | BenzynaMAPA',
  description: 'Czy opłaca się tankować za granicą? Porównanie cen paliw przy granicach Polski (Niemcy, Czechy, Słowacja, Litwa, Ukraina, Białoruś). Najbliższe stacje, limit celny, opłacalność.',
  alternates: { canonical: 'https://benzynamapa.pl/granica/' },
  keywords: [
    'tankowanie za granicą', 'turystyka paliwowa', 'ceny paliw Niemcy',
    'ceny paliw Czechy', 'tankowanie Ukraina', 'paliwo Białoruś',
    'limit celny paliwa', 'czy opłaca się tankować w Polsce',
  ],
  openGraph: {
    title: 'Turystyka paliwowa – ceny przy granicach Polski',
    description: 'Porównanie cen paliw przy 6 granicach Polski.',
    url: 'https://benzynamapa.pl/granica/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'website',
  },
};

const WORTH_COLOR = {
  yes:   'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  mixed: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  no:    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
} as const;

const WORTH_LABEL = {
  yes:   'Opłaca się',
  mixed: 'Sytuacja mieszana',
  no:    'Nie opłaca się',
} as const;

export default function GranicaIndexPage() {
  const stats = getStats();
  const plPb95 = stats?.averages.pb95;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Granice / Turystyka paliwowa', item: 'https://benzynamapa.pl/granica/' },
            ],
          },
          {
            '@type': 'ItemList',
            name: 'Granice Polski - turystyka paliwowa',
            numberOfItems: BORDERS.length,
            itemListElement: BORDERS.map((b, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://benzynamapa.pl/granica/${b.slug}/`,
              name: `Granica z ${b.country}`,
            })),
          },
        ],
      }) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Strona główna</Link>
        <span className="mx-2">›</span>
        <span>Granica / Turystyka paliwowa</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <Globe className="text-green-600" size={28} />
        Turystyka paliwowa — ceny przy granicach Polski
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        Czy opłaca się tankować za granicą? Porównanie aktualnych cen paliw w sąsiednich krajach
        z polskimi cenami {plPb95 && <>(średnia Pb95: <strong>{formatPrice(plPb95)}/l</strong>)</>}.
      </p>

      <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-900 rounded-2xl p-5 mb-8">
        <h2 className="font-bold text-gray-900 dark:text-white mb-2">Polska — jedna z najtańszych w UE</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Polska należy do TOP 5 najtańszych krajów UE pod względem cen benzyny i diesla.
          {plPb95 && <> Średnia Pb95 w Polsce: <strong>{formatPrice(plPb95)}/l</strong></>}.
          {' '}Niemcy: ~7,80 zł/l (+1,40 zł vs PL), Czechy: ~6,90 zł/l (+0,50 zł), Ukraina: ~5,50 zł/l (-0,90 zł).
          {' '}Dla większości kierunków tankowanie <strong>w Polsce przed wyjazdem</strong> jest najkorzystniejszą strategią.
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Wybierz granicę</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {BORDERS.map(b => {
          const diff = plPb95 ? b.avgPb95Foreign - plPb95 : null;
          return (
            <Link key={b.slug} href={`/granica/${b.slug}/`}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-green-500 hover:shadow-md transition-all group">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 flex items-center gap-2">
                  <span className="text-2xl">{b.flag}</span>
                  Granica z {b.country}
                </h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${WORTH_COLOR[b.worthIt]}`}>
                  {WORTH_LABEL[b.worthIt]}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
                <div>
                  <div className="text-gray-500">Pb95 tam</div>
                  <div className="font-bold text-gray-900 dark:text-white">{formatPrice(b.avgPb95Foreign)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Pb95 PL</div>
                  <div className="font-bold text-green-700 dark:text-green-400">{plPb95 ? formatPrice(plPb95) : '—'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Różnica</div>
                  <div className={`font-bold ${diff != null && diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {diff != null ? `${diff > 0 ? '+' : ''}${diff.toFixed(2).replace('.', ',')}` : '—'} zł
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{b.description}</p>
            </Link>
          );
        })}
      </div>

      <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Limity celne — tankowanie za granicą</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          Tankowanie poza UE (Ukraina, Białoruś, Rosja) jest ograniczone limitami celnymi:
        </p>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5">
          <li><strong>Bak samochodu:</strong> bez limitu (cła nie pobiera się od paliwa w fabrycznym baku).</li>
          <li><strong>Kanister:</strong> do 10 litrów bez cła. Powyżej — akcyza i VAT.</li>
          <li><strong>Wielokrotne przekraczanie:</strong> US może zakwestionować częste wjazdy z pełnym bakiem jako działalność handlową.</li>
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          Wewnątrz UE (Niemcy, Czechy, Słowacja, Litwa) brak ograniczeń — można tankować bez limitu.
        </p>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/aktualnosci/turystyka-paliwowa-polska-niemcy-czechy-2026/" className="text-green-700 dark:text-green-400 hover:underline">→ Pełen artykuł: turystyka paliwowa 2026</Link>
        <Link href="/maksymalne-ceny-paliw/" className="text-green-700 dark:text-green-400 hover:underline">→ Polska vs UE — akcyza i VAT</Link>
        <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">→ Mapa stacji paliw</Link>
        <a href="https://benzinmapa.cz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">🇨🇿 Ceny paliw w Czechach</a>
      </div>
    </div>
  );
}
