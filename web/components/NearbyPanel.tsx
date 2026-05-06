'use client';
import { StationWithPrice, FuelType, FUEL_LABELS } from '@/types';
import Link from 'next/link';

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

interface NearbyPanelProps {
  stations: StationWithPrice[];
  userLat: number;
  userLng: number;
  fuelType: FuelType;
  locationSource: 'ip' | 'gps';
  onRequestGps: () => void;
}

export default function NearbyPanel({ stations, userLat, userLng, fuelType, locationSource, onRequestGps }: NearbyPanelProps) {
  const nearby = stations
    .filter(s => s.price?.[fuelType] != null)
    .map(s => ({ ...s, distKm: haversineKm(userLat, userLng, s.lat, s.lng) }))
    .filter(s => s.distKm < 20)
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, 5);

  if (!nearby.length) return null;

  return (
    <div className="bg-amber-50 dark:bg-gray-800 border-b border-amber-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-amber-800 dark:text-amber-400">
            📍 Stacje w pobliżu — {FUEL_LABELS[fuelType]}
          </span>
          {locationSource === 'ip' && (
            <button onClick={onRequestGps} className="text-xs text-amber-600 underline hover:text-amber-800">
              Popraw lokalizację GPS
            </button>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {nearby.map(s => (
            <Link key={s.id} href={`/stacja/${s.id}/`} className="flex-shrink-0 bg-white dark:bg-gray-700 rounded-xl border border-amber-200 dark:border-gray-600 p-3 hover:border-green-500 transition-colors min-w-[140px]">
              <div className="font-black text-green-700 dark:text-green-400 text-lg">
                {s.price![fuelType]!.toFixed(2).replace('.', ',')} zł
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{s.name}</div>
              <div className="text-xs text-gray-400">{s.distKm.toFixed(1)} km</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
