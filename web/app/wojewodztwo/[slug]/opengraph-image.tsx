import { ImageResponse } from 'next/og';
import { REGIONS } from '@/types';
import { getStats, formatPrice } from '@/lib/data';

export const runtime = 'nodejs';
export const alt = 'Ceny paliw w województwie – BenzynaMAPA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG({ params }: { params: { slug: string } }) {
  const region = REGIONS.find(r => r.slug === params.slug);
  if (!region) return new ImageResponse(<div>404</div>, size);

  const stats = getStats();

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #16a34a 100%)',
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

        <div style={{ fontSize: 28, opacity: 0.8 }}>Województwo</div>
        <div style={{ fontSize: 90, fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>{region.name}</div>
        <div style={{ fontSize: 24, opacity: 0.85 }}>
          Stolica: {region.capital} · {(region.population / 1000000).toFixed(1)} mln mieszkańców
        </div>

        <div style={{ display: 'flex', gap: 30, marginTop: 'auto' }}>
          {stats && (
            <>
              <div style={{
                display: 'flex', flexDirection: 'column',
                background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '20px 30px',
              }}>
                <div style={{ fontSize: 16, opacity: 0.85 }}>Średnia Pb95 (PL)</div>
                <div style={{ fontSize: 48, fontWeight: 900 }}>{formatPrice(stats.averages.pb95)}</div>
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column',
                background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '20px 30px',
              }}>
                <div style={{ fontSize: 16, opacity: 0.85 }}>Średnia Diesel (PL)</div>
                <div style={{ fontSize: 48, fontWeight: 900 }}>{formatPrice(stats.averages.on)}</div>
              </div>
            </>
          )}
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: 'white', color: '#16a34a', borderRadius: 16, padding: '20px 30px',
          }}>
            <div style={{ fontSize: 16, opacity: 0.85 }}>Aktualizacja</div>
            <div style={{ fontSize: 36, fontWeight: 900 }}>3× dziennie</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
