'use client';
import { FuelType, FUEL_LABELS } from '@/types';
import { MapPin, Loader2, Search } from 'lucide-react';
import { useState } from 'react';

interface FilterBarProps {
  fuelType: FuelType;
  onFuelChange: (f: FuelType) => void;
  maxPrice: number;
  onMaxPriceChange: (p: number) => void;
  selectedBrands: string[];
  onBrandsChange: (b: string[]) => void;
  onLocate: () => void;
  search: string;
  onSearchChange: (s: string) => void;
  onMapPan: (lat: number, lng: number, zoom?: number) => void;
  locating: boolean;
  locationSource: 'ip' | 'gps' | null;
}

const FUELS: FuelType[] = ['pb95', 'pb98', 'on', 'lpg'];

const CITIES_QUICK = [
  { name: 'Warszawa', lat: 52.2297, lng: 21.0122 },
  { name: 'Kraków', lat: 50.0647, lng: 19.9450 },
  { name: 'Wrocław', lat: 51.1079, lng: 17.0385 },
  { name: 'Gdańsk', lat: 54.3520, lng: 18.6466 },
  { name: 'Poznań', lat: 52.4064, lng: 16.9252 },
  { name: 'Katowice', lat: 50.2649, lng: 19.0238 },
];

export default function FilterBar({
  fuelType, onFuelChange,
  maxPrice, onMaxPriceChange,
  onLocate,
  search, onSearchChange,
  onMapPan,
  locating,
  locationSource,
}: FilterBarProps) {
  const [showCities, setShowCities] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Fuel selector */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
            {FUELS.map(f => (
              <button
                key={f}
                onClick={() => onFuelChange(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  fuelType === f
                    ? 'bg-green-600 text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {FUEL_LABELS[f]}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[160px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Szukaj stacji lub miasta…"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Locate */}
          <button
            onClick={onLocate}
            disabled={locating}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {locating ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
            {locationSource === 'gps' ? 'Moja lokalizacja' : 'Znajdź mnie'}
          </button>
        </div>

        {/* Price slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 whitespace-nowrap">Max cena:</span>
          <input
            type="range"
            min={4}
            max={12}
            step={0.1}
            value={maxPrice}
            onChange={e => onMaxPriceChange(Number(e.target.value))}
            className="flex-1 h-1.5 accent-green-600"
          />
          <span className="text-xs font-bold text-green-700 w-16 text-right">{maxPrice.toFixed(2).replace('.', ',')} zł</span>

          {/* Quick city nav */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowCities(!showCities)}
              className="text-xs text-gray-500 hover:text-green-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
            >
              Szybka nawigacja ▾
            </button>
            {showCities && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 min-w-[160px]">
                {CITIES_QUICK.map(c => (
                  <button
                    key={c.name}
                    onClick={() => { onMapPan(c.lat, c.lng, 13); setShowCities(false); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
