import { ImageResponse } from 'next/og';
import { CITIES } from '@/types';
import { getStationsByCity, getStats, formatPrice } from '@/lib/data';

export const runtime = 'nodejs';
export const alt = 'Ceny paliw w mieście – BenzynaMAPA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateImageMetadata({ params }: { params: { nazev: string } }) {
  const city = CITIES.find(c => c.slug === params.nazev);
  return [{
    id: 'main',
    alt: city ? `Ceny paliw ${city.name} – BenzynaMAPA` : alt,
    contentType: 'image/png',
    size,
  }];
}

export default async function OG({ params }: { params: { nazev: string } }) {
  const city = CITIES.find(c => c.slug === params.nazev);
  if (!city) return new ImageResponse(<div>404</div>, size);

  const stats = getStats();
  const stations = getStationsByCity(city.name);
  const pb95Prices = stations.map(s => s.price?.pb95).filter((p): p is number => p != null);
  const cityAvgPb95 = pb95Prices.length ? pb95Prices.reduce((a, b) => a + b, 0) / pb95Prices.length : null;
  const minPb95 = pb95Prices.length ? Math.min(...pb95Prices) : null;

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
        color: 'white', padding: 70, fontFamily: 'system-ui',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, background: 'white', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: '#16a34a',
          }}>📍</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>BenzynaMAPA</div>
            <div style={{ fontSize: 16, opacity: 0.85, marginTop: 2 }}>benzynamapa.pl</div>
          </div>
        </div>

        <div style={{ fontSize: 28, opacity: 0.8 }}>Najtańsza benzyna</div>
        <div style={{ fontSize: 90, fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>{city.name}</div>
        <div style={{ fontSize: 24, opacity: 0.85 }}>
          {stations.length} stacji paliw {city.region && `· ${city.region}`}
        </div>

        <div style={{ display: 'flex', gap: 30, marginTop: 'auto' }}>
          {cityAvgPb95 && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '20px 30px',
            }}>
              <div style={{ fontSize: 16, opacity: 0.85 }}>Średnia Pb95</div>
              <div style={{ fontSize: 48, fontWeight: 900 }}>{formatPrice(cityAvgPb95)}</div>
            </div>
          )}
          {minPb95 && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: 'white', color: '#16a34a', borderRadius: 16, padding: '20px 30px',
            }}>
              <div style={{ fontSize: 16, opacity: 0.85 }}>Najtańsza Pb95</div>
              <div style={{ fontSize: 48, fontWeight: 900 }}>{formatPrice(minPb95)}</div>
            </div>
          )}
          {stats?.averages.on && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '20px 30px',
            }}>
              <div style={{ fontSize: 16, opacity: 0.85 }}>Diesel (Polska)</div>
              <div style={{ fontSize: 48, fontWeight: 900 }}>{formatPrice(stats.averages.on)}</div>
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
