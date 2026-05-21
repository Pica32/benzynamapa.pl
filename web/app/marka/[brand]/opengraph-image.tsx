import { ImageResponse } from 'next/og';
import { BRAND_PAGES } from '@/types';
import { getBrandAvgPrice, getStats, formatPrice } from '@/lib/data';

export const runtime = 'nodejs';
export const alt = 'Sieć stacji paliw – BenzynaMAPA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BRAND_BG: Record<string, string> = {
  orlen: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
  shell: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
  bp: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
  'circle-k': 'linear-gradient(135deg, #be123c 0%, #881337 100%)',
  moya: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
  huzar: 'linear-gradient(135deg, #ea580c 0%, #9a3412 100%)',
};

export default async function OG({ params }: { params: { brand: string } }) {
  const brand = BRAND_PAGES.find(b => b.slug === params.brand);
  if (!brand) return new ImageResponse(<div>404</div>, size);

  const stats = getStats();
  const pb95Avg = getBrandAvgPrice(brand.brandKeys, 'pb95');
  const onAvg = getBrandAvgPrice(brand.brandKeys, 'on');

  const bg = BRAND_BG[brand.slug] ?? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)';
  const textColor = brand.slug === 'shell' ? '#1f2937' : 'white';

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: bg, color: textColor, padding: 70, fontFamily: 'system-ui',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, background: textColor, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: textColor === 'white' ? '#1f2937' : 'white',
          }}>⛽</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>BenzynaMAPA</div>
            <div style={{ fontSize: 16, opacity: 0.85, marginTop: 2 }}>benzynamapa.pl</div>
          </div>
        </div>

        <div style={{ fontSize: 28, opacity: 0.8 }}>Sieć stacji paliw</div>
        <div style={{ fontSize: 100, fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>{brand.name}</div>
        <div style={{ fontSize: 22, opacity: 0.85 }}>
          {brand.stationsCount ? `${brand.stationsCount.toLocaleString('pl')} stacji w Polsce` : ''}
          {' · '}{brand.priceOffset} od średniej krajowej
        </div>

        <div style={{ display: 'flex', gap: 30, marginTop: 'auto' }}>
          {pb95Avg && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: '20px 30px',
            }}>
              <div style={{ fontSize: 16, opacity: 0.85 }}>Pb95 średnia</div>
              <div style={{ fontSize: 48, fontWeight: 900 }}>{formatPrice(pb95Avg.avg)}</div>
            </div>
          )}
          {onAvg && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: '20px 30px',
            }}>
              <div style={{ fontSize: 16, opacity: 0.85 }}>Diesel średnia</div>
              <div style={{ fontSize: 48, fontWeight: 900 }}>{formatPrice(onAvg.avg)}</div>
            </div>
          )}
          {stats && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: '20px 30px',
            }}>
              <div style={{ fontSize: 16, opacity: 0.85 }}>Krajowa średnia Pb95</div>
              <div style={{ fontSize: 48, fontWeight: 900 }}>{formatPrice(stats.averages.pb95)}</div>
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
