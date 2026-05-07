import { StationWithPrice } from '@/types';
import { formatPrice } from '@/lib/data';
import Link from 'next/link';
import { TrendingDown, MapPin } from 'lucide-react';

interface Props {
  stationsOn: StationWithPrice[];
  stationsPb95: StationWithPrice[];
}

const MEDAL_COLORS = [
  'bg-yellow-400 text-yellow-900',
  'bg-gray-300 text-gray-700',
  'bg-amber-600 text-amber-100',
  'bg-green-100 text-green-800',
];

function StationRow({ s, i, fuel }: { s: StationWithPrice; i: number; fuel: 'on' | 'pb95' }) {
  const price = s.price?.[fuel];
  const isReal = s.price?.source === 'cenapaliw.pl';
  return (
    <Link
      href={`/stacja/${s.id}/`}
      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2.5 transition-colors group"
    >
      <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0 ${MEDAL_COLORS[i]}`}>
        {i + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-sm truncate group-hover:text-green-300 transition-colors">
          {s.name}
        </div>
        <div className="flex items-center gap-1 text-green-300 text-xs">
          <MapPin size={10} />
          {s.city}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <span className={`font-black text-xl tabular-nums ${i === 0 ? 'text-yellow-300' : 'text-white'}`}>
          {price != null ? price.toFixed(2).replace('.', ',') : '—'}
          <span className="text-xs font-normal text-green-300 ml-0.5">zł</span>
        </span>
        <div className={`text-[9px] text-right ${isReal ? 'text-green-400' : 'text-green-700'}`}>
          {isReal ? '✓ zweryfikowane' : '~ szacunek'}
        </div>
      </div>
    </Link>
  );
}

export default function Top4Cheapest({ stationsOn, stationsPb95 }: Props) {
  const top4on   = stationsOn.slice(0, 4);
  const top4pb95 = stationsPb95.slice(0, 4);

  if (!top4on.length && !top4pb95.length) return null;

  return (
    <section className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown size={20} className="text-green-300" />
          <h2 className="text-white font-bold text-lg">Najtańsze stacje paliw w Polsce – dziś</h2>
          <span className="ml-auto text-green-300 text-xs">Aktualizacja 3× dziennie</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-2">Diesel (olej napędowy)</p>
            <div className="space-y-2">
              {top4on.map((s, i) => <StationRow key={s.id} s={s} i={i} fuel="on" />)}
            </div>
          </div>

          <div>
            <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-2">Benzyna 95 (PB95)</p>
            <div className="space-y-2">
              {top4pb95.map((s, i) => <StationRow key={s.id} s={s} i={i} fuel="pb95" />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
