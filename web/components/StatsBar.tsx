'use client';
import { Stats, FuelType, FUEL_LABELS } from '@/types';

interface StatsBarProps {
  stats: Stats;
}

const FUEL_ORDER: FuelType[] = ['pb95', 'pb98', 'on', 'lpg'];

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 min-w-max">
        {FUEL_ORDER.map(fuel => {
          const avg = stats.averages[fuel];
          const trend = stats.trend_7d?.[fuel as keyof typeof stats.trend_7d];
          if (!avg) return null;
          const trendStr = trend == null ? '' : trend > 0 ? `+${trend.toFixed(2).replace('.', ',')}` : trend.toFixed(2).replace('.', ',');
          const trendColor = !trend ? 'text-gray-400' : trend > 0 ? 'text-red-500' : 'text-green-500';
          return (
            <div key={fuel} className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">{FUEL_LABELS[fuel]}</span>
              <span className="font-black text-gray-900 dark:text-white">{avg.toFixed(2).replace('.', ',')} zł</span>
              {trend != null && (
                <span className={`text-xs font-semibold ${trendColor}`}>{trendStr} zł</span>
              )}
            </div>
          );
        })}
        <div className="ml-auto text-xs text-gray-400 whitespace-nowrap">
          Śr. {new Date(stats.last_updated).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
