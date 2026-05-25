import { buildLlmsTxt } from '@/lib/llmsContent';

export const dynamic = 'force-static';
export const revalidate = 21600;

/**
 * Dynamický llms.txt s aktuálními cenami paliv.
 * AI crawlery (GPTBot, ClaudeBot, PerplexityBot) dostávají čerstvá data.
 * Obsah generuje shared buildLlmsTxt() — sdílí s /.well-known/llms.txt.
 */
export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=21600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
