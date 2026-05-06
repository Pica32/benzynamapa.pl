'use client';
import { useState } from 'react';

const FUEL_OPTIONS = [
  { value: 'pb95', label: 'Benzyna 95', defaultPrice: 6.40 },
  { value: 'on', label: 'Diesel', defaultPrice: 6.20 },
  { value: 'lpg', label: 'LPG', defaultPrice: 2.90 },
];

export default function KalkulatorClient() {
  const [distance, setDistance] = useState(100);
  const [consumption, setConsumption] = useState(7);
  const [fuelType, setFuelType] = useState('pb95');
  const [price, setPrice] = useState(6.40);

  const cost = (distance / 100) * consumption * price;
  const liters = (distance / 100) * consumption;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div className="grid gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Rodzaj paliwa
          </label>
          <div className="flex gap-2 flex-wrap">
            {FUEL_OPTIONS.map(f => (
              <button
                key={f.value}
                onClick={() => { setFuelType(f.value); setPrice(f.defaultPrice); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${fuelType === f.value ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Dystans: <span className="text-green-700 dark:text-green-400">{distance} km</span>
          </label>
          <input type="range" min={5} max={2000} step={5} value={distance} onChange={e => setDistance(+e.target.value)} className="w-full accent-green-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5 km</span><span>2000 km</span></div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Zużycie: <span className="text-green-700 dark:text-green-400">{consumption} l/100 km</span>
          </label>
          <input type="range" min={3} max={25} step={0.5} value={consumption} onChange={e => setConsumption(+e.target.value)} className="w-full accent-green-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>3 l/100km</span><span>25 l/100km</span></div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Cena paliwa: <span className="text-green-700 dark:text-green-400">{price.toFixed(2).replace('.', ',')} zł/l</span>
          </label>
          <input type="range" min={2} max={12} step={0.01} value={price} onChange={e => setPrice(+e.target.value)} className="w-full accent-green-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>2,00 zł</span><span>12,00 zł</span></div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700 rounded-2xl p-6 text-center border border-green-200 dark:border-gray-600">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Koszt przejazdu {distance} km</div>
        <div className="text-5xl font-black text-green-700 dark:text-green-400 mb-2">
          {cost.toFixed(2).replace('.', ',')} zł
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {liters.toFixed(1).replace('.', ',')} litrów · {consumption} l/100km
        </div>
      </div>
    </div>
  );
}
