'use client';

import { useState, useCallback, useEffect, Suspense, lazy, useMemo, useTransition, useRef } from 'react';
import { StationWithPrice, FuelType, Stats } from '@/types';
import FilterBar from '@/components/FilterBar';
import StatsBar from '@/components/StatsBar';
import NearbyPanel from '@/components/NearbyPanel';

const MapView = lazy(() => import('@/components/MapView'));

interface HomeClientProps {
  stats: Stats;
}

export default function HomeClient({ stats }: HomeClientProps) {
  const [stations, setStations] = useState<StationWithPrice[]>([]);
  const [loading, setLoading] = useState(false);   // false = not started yet
  const [mapActivated, setMapActivated] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [, startTransition] = useTransition();
  const fetchStarted = useRef(false);

  const [fuelType, setFuelType] = useState<FuelType>('pb95');
  const [maxPrice, setMaxPrice] = useState(10);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [userLat, setUserLat] = useState<number | undefined>();
  const [userLng, setUserLng] = useState<number | undefined>();
  const [locationSource, setLocationSource] = useState<'ip' | 'gps' | null>(null);
  const [locating, setLocating] = useState(false);
  const [panTo, setPanTo] = useState<{ lat: number; lng: number; zoom?: number } | undefined>();

  // Načtení dat — spustí se AŽ po hover/klik na mapu
  const startDataLoad = useCallback(() => {
    if (fetchStarted.current) return;
    fetchStarted.current = true;
    setLoading(true);

    const parseFallback = (data: any) => {
      startTransition(() => {
        const st: StationWithPrice[] = data.stations.map((s: any) => {
          const p = s.p;
          return {
            ...s,
            price: p ? {
              station_id: s.id,
              pb95: p.n95 ?? null,
              pb98: p.n98 ?? null,
              on: p.on ?? null,
              lpg: p.lpg ?? null,
              // src: 'r'=cenapaliw.pl, 'e'=estimate (zkrácený formát)
              source: p.src === 'r' ? 'cenapaliw.pl' : 'estimate',
              reported_at: p.at ?? '',
            } : null,
          };
        });
        setStations(st);
        setLoading(false);
        setDataLoaded(true);
      });
    };

    fetch('/data/map_data.json')
      .then(r => r.json())
      .then(data => {
        // Zkus Web Worker pro parsování mimo main thread
        try {
          const worker = new Worker('/workers/station-parser.js');
          worker.onmessage = (e) => {
            if (e.data.ok) {
              startTransition(() => {
                setStations(e.data.stations);
                setLoading(false);
                setDataLoaded(true);
              });
            } else {
              parseFallback(data);
            }
            worker.terminate();
          };
          worker.onerror = () => { parseFallback(data); worker.terminate(); };
          worker.postMessage({ data });
        } catch {
          parseFallback(data);
        }
      })
      .catch(() => setLoading(false));
  }, [startTransition]);

  // Aktivace mapy — spustí fetch dat + zobrazí MapLibre
  const activateMap = useCallback(() => {
    startDataLoad();
    setMapActivated(true);
  }, [startDataLoad]);

  // Hover = začni stahovat data (prefetch), klik = zobraz mapu
  const handleHover = useCallback(() => {
    startDataLoad(); // stáhni data v pozadí
  }, [startDataLoad]);

  // IP geolokace — odložena o 5s
  useEffect(() => {
    const t = setTimeout(() => {
      fetch('https://ip-api.com/json?fields=status,lat,lon')
        .then(r => r.json())
        .then(d => {
          if (d.status === 'success' && userLat == null) {
            setUserLat(d.lat);
            setUserLng(d.lon);
            setLocationSource('ip');
          }
        })
        .catch(() => {});
    }, 5000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) { alert('Przeglądarka nie obsługuje geolokalizacji.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setLocationSource('gps');
        setLocating(false);
      },
      err => {
        setLocating(false);
        if (err.code === 1) alert('Dostęp do lokalizacji zablokowany. Włącz w ustawieniach przeglądarki.');
        else alert('Nie można uzyskać lokalizacji. Spróbuj ponownie.');
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  const filtered = useMemo(() => stations.filter(s => {
    const price = s.price?.[fuelType];
    if (price == null) return false;
    if (price > maxPrice) return false;
    if (selectedBrands.length && !selectedBrands.includes(s.brand)) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q);
    }
    return true;
  }), [stations, fuelType, maxPrice, selectedBrands, search]);

  return (
    <>
      <StatsBar stats={stats} />
      <FilterBar
        fuelType={fuelType} onFuelChange={setFuelType}
        maxPrice={maxPrice} onMaxPriceChange={setMaxPrice}
        selectedBrands={selectedBrands} onBrandsChange={setSelectedBrands}
        onLocate={handleLocate}
        search={search} onSearchChange={setSearch}
        onMapPan={(lat, lng, zoom) => {
          setPanTo({ lat, lng, zoom });
          if (!mapActivated) activateMap();
        }}
        locating={locating}
        locationSource={locationSource}
      />

      {userLat != null && userLng != null && locationSource != null && stations.length > 0 && (
        <NearbyPanel
          stations={stations}
          userLat={userLat}
          userLng={userLng}
          fuelType={fuelType}
          locationSource={locationSource}
          onRequestGps={handleLocate}
        />
      )}

      <div style={{ height: '65vh', minHeight: '420px', maxHeight: '720px' }} className="relative w-full">
        {!mapActivated ? (
          <button
            onClick={activateMap}
            onMouseEnter={handleHover}  // prefetch dat při hoveru
            aria-label="Kliknij aby załadować interaktywną mapę stacji paliw"
            className="w-full h-full relative overflow-hidden cursor-pointer border-0 group"
          >
            {/* Statický náhled mapy místo generického obrázku */}
            <div className="w-full h-full bg-[#e8f4ea]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 30 Q15 15 30 30 Q45 45 60 30' stroke='%2316a34a' stroke-width='1.5' fill='none' opacity='0.15'/%3E%3Ccircle cx='30' cy='30' r='2' fill='%2316a34a' opacity='0.2'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }} />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              {loading ? (
                <>
                  {/* Progressivní načítání */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-2xl flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-700 text-sm font-semibold">
                      Ładowanie {stats.total_stations.toLocaleString('pl')} stacji…
                    </p>
                    <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-green-600 group-hover:bg-green-500 text-white font-black px-8 py-4 rounded-2xl shadow-2xl transition-all transform group-hover:scale-105 flex items-center gap-3 text-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Pokaż mapę stacji paliw
                  </div>
                  <p className="text-white/90 text-sm font-medium drop-shadow-md">
                    {stats.total_stations.toLocaleString('pl')} stacji · kliknij lub najedź myszką
                  </p>

                  {/* Stats preview */}
                  <div className="flex gap-3 mt-1">
                    {[
                      { label: 'Benzyna 95', val: stats.averages.pb95.toFixed(2).replace('.', ',') + ' zł' },
                      { label: 'Diesel', val: stats.averages.on.toFixed(2).replace('.', ',') + ' zł' },
                      { label: 'LPG', val: stats.averages.lpg.toFixed(2).replace('.', ',') + ' zł' },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow">
                        <div className="text-[10px] text-gray-500 font-medium">{label}</div>
                        <div className="text-sm font-black text-green-700">{val}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </button>
        ) : (
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 text-sm">Ładowanie mapy…</p>
              </div>
            </div>
          }>
            {dataLoaded
              ? <MapView stations={filtered} fuelType={fuelType} userLat={userLat} userLng={userLng} panTo={panTo} />
              : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-500 text-sm font-medium">Ładowanie {stats.total_stations.toLocaleString('pl')} stacji…</p>
                    <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto">
                      <div className="h-full bg-green-600 rounded-full animate-pulse" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              )
            }
          </Suspense>
        )}

        {mapActivated && dataLoaded && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-gray-500 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-1.5">
              <span>↓</span>
              <span>Przewiń w dół po listę najtańszych stacji</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
