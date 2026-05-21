import { ImageResponse } from 'next/og';
import { getStats, formatPrice } from '@/lib/data';

export const runtime = 'nodejs';
export const alt = 'BenzynaMAPA – mapa najtańszych stacji paliw w Polsce';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  const stats = getStats();
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
          color: 'white', padding: 80, fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div style={{
            width: 80, height: 80, background: 'white', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, color: '#16a34a',
          }}>⛽</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }}>BenzynaMAPA</div>
            <div style={{ fontSize: 20, opacity: 0.85, marginTop: 4 }}>najtańsze paliwa w Polsce</div>
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 64, fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
          Ceny paliw w Polsce
        </div>
        <div style={{ display: 'flex', fontSize: 32, opacity: 0.9, marginBottom: 40 }}>
          {`${today} · ${stats?.total_stations.toLocaleString('pl') ?? '8 600'}+ stacji`}
        </div>

        {stats && (
          <div style={{ display: 'flex', gap: 40, marginTop: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, opacity: 0.8 }}>Benzyna 95</div>
              <div style={{ fontSize: 56, fontWeight: 900 }}>{formatPrice(stats.averages.pb95)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, opacity: 0.8 }}>Diesel</div>
              <div style={{ fontSize: 56, fontWeight: 900 }}>{formatPrice(stats.averages.on)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, opacity: 0.8 }}>LPG</div>
              <div style={{ fontSize: 56, fontWeight: 900 }}>{formatPrice(stats.averages.lpg)}</div>
            </div>
          </div>
        )}
      </div>
    ),
    size,
  );
}
