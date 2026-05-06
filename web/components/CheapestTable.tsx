import { StationWithPrice, FuelType, FUEL_LABELS } from '@/types';
import Link from 'next/link';

interface CheapestTableProps {
  stations: StationWithPrice[];
  fuelType: FuelType;
}

const FUEL_COLORS: Record<FuelType, string> = {
  pb95: 'text-green-700 dark:text-green-400',
  pb98: 'text-blue-700 dark:text-blue-400',
  on: 'text-gray-700 dark:text-gray-300',
  lpg: 'text-purple-700 dark:text-purple-400',
};

export default function CheapestTable({ stations, fuelType }: CheapestTableProps) {
  if (!stations.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="font-bold text-gray-900 dark:text-white text-lg">
          Najtańszy {FUEL_LABELS[fuelType]}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Top {stations.length} stacji w Polsce
        </p>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-700">
        {stations.map((s, i) => {
          const price = s.price?.[fuelType];
          return (
            <Link key={s.id} href={`/stacja/${s.id}/`} className="flex items-center gap-3 px-5 py-3 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors group">
              <span className="text-lg font-black text-gray-300 dark:text-gray-600 w-6 text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-green-700 dark:group-hover:text-green-400">
                  {s.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.city}</div>
              </div>
              <div className={`font-black text-base ${FUEL_COLORS[fuelType]}`}>
                {price != null ? price.toFixed(2).replace('.', ',') + ' zł' : '—'}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
