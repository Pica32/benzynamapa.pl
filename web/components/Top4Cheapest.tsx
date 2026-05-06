import { StationWithPrice, FuelType } from '@/types';
import Link from 'next/link';

const SECTIONS: { fuel: FuelType; label: string; color: string }[] = [
  { fuel: 'pb95', label: 'Benzyna 95', color: 'bg-green-600' },
  { fuel: 'on', label: 'Diesel', color: 'bg-gray-700' },
  { fuel: 'lpg', label: 'LPG', color: 'bg-purple-600' },
  { fuel: 'pb98', label: 'Benzyna 98', color: 'bg-blue-600' },
];

export default function Top4Cheapest({ stations }: { stations: StationWithPrice[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SECTIONS.map(({ fuel, label, color }) => {
            const best = stations
              .filter(s => s.price?.[fuel] != null)
              .sort((a, b) => (a.price![fuel] ?? 999) - (b.price![fuel] ?? 999))[0];
            if (!best) return null;
            return (
              <Link
                key={fuel}
                href={`/stacja/${best.id}/`}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-green-400 hover:bg-green-50 dark:hover:bg-gray-700 transition-all group"
              >
                <div className={`${color} text-white rounded-lg px-2 py-1 text-xs font-black whitespace-nowrap`}>
                  {best.price![fuel]!.toFixed(2).replace('.', ',')} zł
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 truncate group-hover:text-green-700 dark:group-hover:text-green-400">
                    {best.city}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
