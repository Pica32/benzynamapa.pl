'use client';

import { Stats } from '@/types';
import { TrendingDown, TrendingUp, Minus, Clock } from 'lucide-react';

function TrendIcon({ value }: { value: number }) {
  if (value < 0) return <TrendingDown size={14} className="text-green-500" />;
  if (value > 0) return <TrendingUp size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
}

export default function StatsBar({ stats }: { stats: Stats }) {
  const updated = new Date(stats.last_updated).toLocaleString('pl-PL', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit',
  });

  return (
    <div className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-4 sm:gap-8">
            {[
              { label: 'Benzyna 95', price: stats.averages.pb95, trend: stats.trend_7d.pb95, key: 'pb95' },
              { label: 'Diesel', price: stats.averages.on, trend: stats.trend_7d.on, key: 'on' },
              { label: 'LPG', price: stats.averages.lpg, trend: stats.trend_7d.lpg, key: 'lpg' },
            ].map(item => (
              <div key={item.key} className="flex flex-col">
                <span className="text-green-300 text-xs font-medium uppercase tracking-wide">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold text-lg leading-tight">
                    {item.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-green-200 text-xs">zł</span>
                  <TrendIcon value={item.trend} />
                  <span className={`text-xs ${item.trend < 0 ? 'text-green-400' : item.trend > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {item.trend > 0 ? '+' : ''}{item.trend.toFixed(2)} zł/7d
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-green-300 text-xs">
            <Clock size={12} />
            <span>Aktualizacja: {updated}</span>
            <span className="text-green-400 font-medium ml-2">
              {stats.stations_updated_today} stacji
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
