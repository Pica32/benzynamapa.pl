import type { Metadata } from 'next';
import Link from 'next/link';
import { getStats, formatPrice } from '@/lib/data';
import { Fuel, MapPin, TrendingDown } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Fuel prices in Poland today — BenzynaMAPA',
  description: 'Live fuel prices in Poland. Petrol 95, diesel, LPG on 8 700+ stations. Updated 3× daily from cenapaliw.pl + e-petrol.pl + OpenStreetMap.',
  alternates: {
    canonical: 'https://benzynamapa.pl/en/',
    languages: {
      'en': 'https://benzynamapa.pl/en/',
      'pl-PL': 'https://benzynamapa.pl/',
      'cs-CZ': 'https://benzinmapa.cz/',
      'x-default': 'https://benzynamapa.pl/',
    },
  },
  openGraph: {
    title: 'Fuel prices in Poland — BenzynaMAPA',
    description: 'Live fuel prices on 8 700+ stations in Poland.',
    url: 'https://benzynamapa.pl/en/',
    siteName: 'BenzynaMAPA',
    locale: 'en_US',
    type: 'website',
  },
  keywords: [
    'fuel prices Poland', 'petrol price Poland', 'diesel price Poland',
    'LPG price Poland', 'gas station map Poland', 'cheap fuel Poland',
    'where to refuel Poland', 'fuel station finder Poland',
  ],
};

export default function EnglishHomePage() {
  const stats = getStats();
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Fuel prices in Poland — BenzynaMAPA',
        inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', name: 'BenzynaMAPA', url: 'https://benzynamapa.pl' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home (PL)', item: 'https://benzynamapa.pl/' },
            { '@type': 'ListItem', position: 2, name: 'English' },
          ],
        },
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">🇵🇱 Polish</Link>
          <span className="mx-2">·</span>
          <span className="text-gray-900 dark:text-white font-semibold">🇬🇧 English</span>
          <span className="mx-2">·</span>
          <a href="https://benzinmapa.cz" className="hover:text-green-600">🇨🇿 Czech</a>
        </div>

        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Fuel className="text-green-600" size={32} />
          Fuel prices in Poland — {today}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Live fuel prices on <strong>8 700+ stations</strong> across Poland.
          Updated 3× daily from cenapaliw.pl + e-petrol.pl + OpenStreetMap.
        </p>

        {/* Answer box for AI / Google */}
        {stats && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-l-4 border-green-600 rounded-r-xl p-5 mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Average fuel prices in Poland today ({today}):</strong>{' '}
              Petrol 95: <strong>{formatPrice(stats.averages.pb95)}/L</strong>,{' '}
              {stats.averages.pb98 && <>Petrol 98: <strong>{formatPrice(stats.averages.pb98)}/L</strong>,{' '}</>}
              Diesel: <strong>{formatPrice(stats.averages.on)}/L</strong>,{' '}
              LPG: <strong>{formatPrice(stats.averages.lpg)}/L</strong>.
              Poland is one of the cheapest countries in EU for fuel — much cheaper than Germany (+30%) or Netherlands (+35%).
            </p>
          </div>
        )}

        {/* Current prices cards */}
        {stats && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-xs text-gray-500 uppercase mb-1">Petrol 95 (E10)</div>
              <div className="text-3xl font-black text-green-700 dark:text-green-400">{formatPrice(stats.averages.pb95)}</div>
              <div className="text-xs text-gray-400 mt-1">PLN/L</div>
            </div>
            {stats.averages.pb98 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                <div className="text-xs text-gray-500 uppercase mb-1">Petrol 98</div>
                <div className="text-3xl font-black text-blue-700 dark:text-blue-400">{formatPrice(stats.averages.pb98)}</div>
                <div className="text-xs text-gray-400 mt-1">PLN/L</div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-xs text-gray-500 uppercase mb-1">Diesel</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{formatPrice(stats.averages.on)}</div>
              <div className="text-xs text-gray-400 mt-1">PLN/L</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-xs text-gray-500 uppercase mb-1">LPG Autogas</div>
              <div className="text-3xl font-black text-purple-700 dark:text-purple-400">{formatPrice(stats.averages.lpg)}</div>
              <div className="text-xs text-gray-400 mt-1">PLN/L</div>
            </div>
          </section>
        )}

        {/* About Poland fuel */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why fuel is cheaper in Poland</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Poland has one of the <strong>lowest fuel excise duties in EU</strong>: 1.529 PLN/L for petrol
            (vs ~3.00 PLN/L in Germany). Combined with 23% VAT, total taxes make up ~52% of retail price
            (vs 60% in Germany).
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Result: <strong>typical 50L tank fill saves ~70-90 PLN compared to Germany</strong> and similar
            to Czech/Slovak prices. Tourists driving to/from Germany should always fill up in Poland
            before crossing the border.
          </p>
          <Link href="/maksymalne-ceny-paliw/" className="text-green-700 dark:text-green-400 hover:underline text-sm">
            → Detailed price breakdown (Polish)
          </Link>
        </section>

        {/* Cross-border tourism */}
        <section className="mb-10 bg-blue-50 dark:bg-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            Cross-border fuel tourism (Germans, Czechs, Lithuanians)
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Polish border towns (Świnoujście, Słubice, Zgorzelec, Cieszyn) attract <strong>1000s of foreign
            tourists daily</strong> filling up cheaper fuel. Stations in these towns are highly competitive.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <strong>Tip:</strong> Within EU (Germany, Czechia, Slovakia, Lithuania) — no fuel import limits.
            Outside EU (Ukraine, Belarus) — 10L in canister tax-free + full tank.
          </p>
        </section>

        {/* Main features */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Main features (Polish site)</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-green-500 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Interactive map</span>
              </div>
              <p className="text-xs text-gray-500">8 700+ stations with live prices</p>
            </Link>
            <Link href="/najtansze-benzyna/" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-green-500 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={16} className="text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Cheapest petrol ranking</span>
              </div>
              <p className="text-xs text-gray-500">Daily TOP 25 stations</p>
            </Link>
            <Link href="/historia-cen/" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-green-500 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <Fuel size={16} className="text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">90-day price history</span>
              </div>
              <p className="text-xs text-gray-500">Charts & trends</p>
            </Link>
            <Link href="/api-docs/" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-green-500 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-600">🔌</span>
                <span className="font-semibold text-gray-900 dark:text-white">API for developers</span>
              </div>
              <p className="text-xs text-gray-500">JSON, ODbL license, free</p>
            </Link>
          </div>
        </section>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-8">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>This is a stub English page.</strong> Full Polish version with all features
            (165 cities, 16 regions, 8 700 stations, blog) is available at
            <Link href="/" className="text-green-700 dark:text-green-400 hover:underline ml-1">benzynamapa.pl</Link>.
          </p>
        </div>

        <div className="text-sm text-gray-500 flex flex-wrap gap-3">
          <a href="https://benzinmapa.cz" className="hover:text-green-600">🇨🇿 Czech sister project</a>
          <Link href="/api-docs/" className="hover:text-green-600">API docs</Link>
          <a href="mailto:kontakt@benzynamapa.pl" className="hover:text-green-600">Contact</a>
        </div>
      </div>
    </>
  );
}
