import { buildLlmsTxt } from '@/lib/llmsContent';

/**
 * Alternativní cesta /.well-known/llms.txt (rewritten z /well-known/llms.txt).
 * RFC 8615 well-known URIs. Sdílí content přes buildLlmsTxt() — žádný
 * interní fetch (předchozí verze měla build-time race condition).
 */
export const dynamic = 'force-static';
export const revalidate = 21600;

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=21600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
