import { ImageResponse } from 'next/og';
import { HIGHWAYS } from '@/types';
import { getStats, formatPrice } from '@/lib/data';

export const runtime = 'nodejs';
export const alt = 'Stacje paliw na autostradzie – BenzynaMAPA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG({ params }: { params: { slug: string } }) {
  const hwy = HIGHWAYS.find(h => h.slug === params.slug);
  if (!hwy) return new ImageResponse(<div>404</div>, size);

  const stats = getStats();

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white', padding: 70, fontFamily: 'system-ui',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, background: '#16a34a', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36,
          }}>🛣️</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>BenzynaMAPA</div>
            <div style={{ fontSize: 16, opacity: 0.85, marginTop: 2 }}>benzynamapa.pl</div>
          </div>
        </div>

        <div style={{
          background: '#dc2626', color: 'white', display: 'inline-flex',
          padding: '12px 32px', borderRadius: 14, fontSize: 80, fontWeight: 900,
          marginBottom: 16, alignSelf: 'flex-start', letterSpacing: 2,
        }}>{hwy.code}</div>

        <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.1, marginBottom: 8 }}>{hwy.name}</div>
        <div style={{ fontSize: 22, opacity: 0.8 }}>
          {hwy.from} → {hwy.to}
        </div>
        <div style={{ fontSize: 20, opacity: 0.7, marginTop: 4 }}>
          {hwy.lengthKm} km · {hwy.cities.slice(0, 4).join(' · ')}
        </div>

        <div style={{ display: 'flex', gap: 30, marginTop: 'auto' }}>
          {stats && (
            <>
              <div style={{
                display: 'flex', flexDirection: 'column',
                background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 30px',
              }}>
                <div style={{ fontSize: 16, opacity: 0.85 }}>Średnia Pb95 (PL)</div>
                <div style={{ fontSize: 44, fontWeight: 900 }}>{formatPrice(stats.averages.pb95)}</div>
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column',
                background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 30px',
              }}>
                <div style={{ fontSize: 16, opacity: 0.85 }}>Średnia ON (PL)</div>
                <div style={{ fontSize: 44, fontWeight: 900 }}>{formatPrice(stats.averages.on)}</div>
              </div>
            </>
          )}
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: '#16a34a', borderRadius: 16, padding: '20px 30px',
          }}>
            <div style={{ fontSize: 16, opacity: 0.95 }}>Najtańsze stacje</div>
            <div style={{ fontSize: 36, fontWeight: 900 }}>na trasie {hwy.code}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
