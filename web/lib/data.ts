import { Station, StationPrice, StationWithPrice, Stats, FuelType, BrandPage } from '@/types';
import fs from 'fs';
import path from 'path';

function readJson<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'public', 'data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function getStations(): Station[] {
  try {
    const data = readJson<{ stations: Station[] }>('stations_latest.json');
    return data.stations;
  } catch {
    return [];
  }
}

export function getPrices(): StationPrice[] {
  try {
    const data = readJson<{ prices: StationPrice[] }>('prices_latest.json');
    return data.prices;
  } catch {
    return [];
  }
}

export function getStats(): Stats | null {
  try {
    return readJson<Stats>('stats_latest.json');
  } catch {
    return null;
  }
}

export function getStationsWithPrices(): StationWithPrice[] {
  const stations = getStations();
  const prices = getPrices();
  const priceMap = new Map<string, StationPrice>();
  prices.forEach(p => priceMap.set(p.station_id, p));
  return stations.map(s => ({ ...s, price: priceMap.get(s.id) ?? null }));
}

export function getStationById(id: string): StationWithPrice | null {
  return getStationsWithPrices().find(s => s.id === id) ?? null;
}

export function getStationsByCity(city: string): StationWithPrice[] {
  const normalized = city.toLowerCase();
  return getStationsWithPrices().filter(s =>
    s.city.toLowerCase().includes(normalized) ||
    slugify(s.city) === normalized
  );
}

export function getStationsByBrand(brand: BrandPage): StationWithPrice[] {
  const keys = brand.brandKeys.map(k => k.toLowerCase());
  return getStationsWithPrices().filter(s =>
    keys.some(k => s.brand.toLowerCase().includes(k))
  );
}

export function getStationsByRegion(region: string): StationWithPrice[] {
  const normalized = region.toLowerCase();
  return getStationsWithPrices().filter(s =>
    slugify(s.region) === normalized
  );
}

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export function isPriceStale(reportedAt: string): boolean {
  return Date.now() - new Date(reportedAt).getTime() > TWO_DAYS_MS;
}

const PRICE_MIN: Record<FuelType, number> = {
  pb95: 5.0,
  pb98: 5.5,
  on: 5.0,
  lpg: 2.0,
};

function adaptiveMin(prices: number[], preferred: number): number {
  if (!prices.length) return preferred;
  const aboveMin = prices.filter(p => p >= preferred).length;
  if (aboveMin / prices.length >= 0.20) return preferred;
  const sorted = [...prices].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.10)];
}

export function getCheapestStations(fuelType: FuelType, limit = 10): StationWithPrice[] {
  const cutoff = Date.now() - TWO_DAYS_MS;
  const all = getStationsWithPrices().filter(s => s.price?.[fuelType] != null);

  // Reálné ceny (cenapaliw.pl) — zobrazit prioritně
  const real = all.filter(s =>
    s.price?.source === 'cenapaliw.pl' &&
    new Date(s.price.reported_at).getTime() > cutoff
  );

  // Pokud máme dost reálných, vrátíme jen ty
  if (real.length >= limit) {
    const prices = real.map(s => s.price![fuelType] as number);
    const min = adaptiveMin(prices, PRICE_MIN[fuelType]);
    return real
      .filter(s => (s.price![fuelType] as number) >= min)
      .sort((a, b) => (a.price![fuelType] ?? 999) - (b.price![fuelType] ?? 999))
      .slice(0, limit);
  }

  // Doplníme odhadovanými cenami (estimate) aby byl seznam vždy plný
  const realIds = new Set(real.map(s => s.id));
  const estimates = all
    .filter(s => !realIds.has(s.id) && s.price?.source === 'estimate')
    .filter(s => (s.price![fuelType] as number) >= PRICE_MIN[fuelType])
    .sort((a, b) => (a.price![fuelType] ?? 999) - (b.price![fuelType] ?? 999));

  const combined = [
    ...real.sort((a, b) => (a.price![fuelType] ?? 999) - (b.price![fuelType] ?? 999)),
    ...estimates,
  ];

  return combined.slice(0, limit);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/ą/g, 'a')
    .replace(/ę/g, 'e')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z')
    .replace(/ć/g, 'c')
    .replace(/ń/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getPriceCategory(price: number, allPrices: number[]): 'cheap' | 'mid' | 'expensive' {
  const sorted = [...allPrices].sort((a, b) => a - b);
  const p20 = sorted[Math.floor(sorted.length * 0.2)];
  const p80 = sorted[Math.floor(sorted.length * 0.8)];
  if (price <= p20) return 'cheap';
  if (price >= p80) return 'expensive';
  return 'mid';
}

export function formatPrice(price: number | null): string {
  if (price == null) return 'N/D';
  return price.toFixed(2).replace('.', ',') + ' zł';
}

export function getBrandAvgPrice(brandKeys: string[], fuel: FuelType = 'pb95'): { avg: number; n: number } | null {
  const stations = getStationsWithPrices();
  const keys = brandKeys.map(k => k.toLowerCase());
  const prices = stations
    .filter(s => keys.some(k => s.brand.toLowerCase().includes(k)))
    .map(s => s.price?.[fuel])
    .filter((p): p is number => p != null);
  if (prices.length === 0) return null;
  return { avg: prices.reduce((x, y) => x + y, 0) / prices.length, n: prices.length };
}

export function getBrandOffset(brandKeys: string[], fuel: FuelType = 'pb95'): number | null {
  const stats = getStats();
  const data = getBrandAvgPrice(brandKeys, fuel);
  if (!stats || !data) return null;
  return data.avg - stats.averages[fuel];
}

export function formatOffset(offset: number): string {
  if (Math.abs(offset) < 0.025) return '±0 zł';
  const sign = offset > 0 ? '+' : '−';
  return `${sign}${Math.abs(offset).toFixed(2).replace('.', ',')} zł`;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 5) return 'przed chwilą';
  if (mins < 60) return `${mins} min temu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} godz. temu`;
  return `${Math.floor(hours / 24)} dni temu`;
}
