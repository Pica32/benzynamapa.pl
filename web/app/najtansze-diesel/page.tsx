import { getCheapestStations, formatPrice } from '@/lib/data';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Najtańszy diesel (olej napędowy) w Polsce dziś – ranking',
  description: 'Gdzie kupić najtańszy diesel w Polsce dziś? Aktualny ranking najtańszych stacji z olejem napędowym ON. Ceny aktualizowane 3× dziennie.',
  alternates: { canonical: 'https://benzynamapa.pl/najtansze-diesel/' },
  openGraph: {
    title: 'Najtańszy diesel w Polsce – BenzynaMAPA',
    description: 'Ranking najtańszych stacji z dieslem. Aktualne ceny oleju napędowego.',
    url: 'https://benzynamapa.pl/najtansze-diesel/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function NajtanszeDieselPage() {
  const stations = getCheapestStations('on', 50);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Najtańszy diesel w Polsce
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Ranking {stations.length} najtańszych stacji paliw z olejem napędowym. Aktualizacja 3× dziennie.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {stations.map((s, i) => (
            <Link key={s.id} href={`/stacja/${s.id}/`} className="flex items-center gap-4 px-5 py-4 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors group">
              <span className="text-2xl font-black text-gray-200 dark:text-gray-600 w-8 text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400">{s.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{s.address}, {s.city}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-xl text-gray-800 dark:text-gray-200">
                  {formatPrice(s.price?.on ?? null)}
                </div>
                <div className="text-xs text-gray-400">{s.brand}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/najtansze-benzyna/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Najtańsza benzyna 95</Link>
        <Link href="/najtansze-lpg/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Najtańszy LPG</Link>
        <Link href="/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Mapa stacji</Link>
      </div>
    </div>
  );
}
