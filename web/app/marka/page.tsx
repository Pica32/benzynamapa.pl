import { BRAND_PAGES } from '@/types';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sieci stacji paliw w Polsce – porównanie cen',
  description: 'Porównaj ceny paliw na Orlen, Shell, BP, Circle K, Moya i innych sieciach stacji paliw w Polsce. Sprawdź, która sieć jest najtańsza.',
  alternates: { canonical: 'https://benzynamapa.pl/marka/' },
};

export default function MarkaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Sieci stacji paliw w Polsce</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Porównanie cen paliw według sieci stacji. Sprawdź, która sieć oferuje najtańsze paliwo.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {BRAND_PAGES.map(brand => (
          <Link key={brand.slug} href={`/marka/${brand.slug}/`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-green-500 hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${brand.color} text-white rounded-lg px-3 py-1.5 text-sm font-black`}>{brand.name}</div>
              <div className={`font-bold text-lg ${brand.priceOffsetNum > 0 ? 'text-red-600 dark:text-red-400' : brand.priceOffsetNum < 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                {brand.priceOffset}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{brand.description}</p>
            {brand.stationsCount && (
              <div className="mt-3 text-xs text-gray-400">{brand.stationsCount.toLocaleString('pl')} stacji w Polsce</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
