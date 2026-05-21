import { ImageResponse } from 'next/og';
import { BORDERS } from '@/types';
import { getStats, formatPrice } from '@/lib/data';

export const runtime = 'nodejs';
export const alt = 'Turystyka paliwowa – ceny przy granicy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const WORTH_BG = {
  yes:   'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
  mixed: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
  no:    'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
} as const;

const WORTH_LABEL = {
  yes:   '✓ Opłaca się tankować w {country}',
  mixed: '~ Sytuacja mieszana',
  no:    '✗ Taniej tankować w Polsce',
} as const;

export default async function OG({ params }: { params: { slug: string } }) {
  const border = BORDERS.find(b => b.slug === params.slug);
  if (!border) return new ImageResponse(<div>404</div>, size);

  const stats = getStats();
  const plPb95 = stats?.averages.pb95;
  const diff = plPb95 ? border.avgPb95Foreign - plPb95 : null;

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: WORTH_BG[border.worthIt], color: 'white', padding: 70, fontFamily: 'system-ui',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, background: 'white', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: '#16a34a',
          }}>🌍</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>BenzynaMAPA</div>
            <div style={{ fontSize: 16, opacity: 0.85, marginTop: 2 }}>benzynamapa.pl</div>
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 28, opacity: 0.85, marginBottom: 4 }}>Granica z</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          <span style={{ fontSize: 110 }}>{border.flag}</span>
          <span style={{ fontSize: 86, fontWeight: 900, lineHeight: 1 }}>{border.country}</span>
        </div>
        <div style={{
          display: 'flex',
          fontSize: 28, fontWeight: 700,
          background: 'rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 12,
          alignSelf: 'flex-start',
        }}>
          {WORTH_LABEL[border.worthIt].replace('{country}', border.country)}
        </div>

        <div style={{ display: 'flex', gap: 30, marginTop: 'auto' }}>
          {plPb95 && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '20px 30px',
            }}>
              <div style={{ fontSize: 16, opacity: 0.9 }}>Pb95 Polska 🇵🇱</div>
              <div style={{ fontSize: 48, fontWeight: 900 }}>{formatPrice(plPb95)}</div>
            </div>
          )}
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '20px 30px',
          }}>
            <div style={{ fontSize: 16, opacity: 0.9 }}>Pb95 {border.country} {border.flag}</div>
            <div style={{ fontSize: 48, fontWeight: 900 }}>{formatPrice(border.avgPb95Foreign)}</div>
          </div>
          {diff != null && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: diff > 0 ? '#1f2937' : 'white', color: diff > 0 ? 'white' : '#16a34a',
              borderRadius: 16, padding: '20px 30px',
            }}>
              <div style={{ fontSize: 16, opacity: 0.85 }}>Różnica</div>
              <div style={{ fontSize: 48, fontWeight: 900 }}>
                {diff > 0 ? '+' : ''}{diff.toFixed(2).replace('.', ',')} zł/l
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
