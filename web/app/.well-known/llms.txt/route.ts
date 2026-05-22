/**
 * Alternativní cesta pro AI crawlery — /.well-known/llms.txt
 *
 * Některé AI klienty (Perplexity, ChatGPT, novější crawlery) preferují
 * `.well-known/` prefix (RFC 8615), podobně jako security.txt, openid-configuration.
 *
 * Vrací stejný obsah jako /llms.txt přes interní fetch.
 */
export const dynamic = 'force-static';
export const revalidate = 21600;

export async function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  const r = await fetch(`${baseUrl}/llms.txt`, { next: { revalidate: 21600 } });
  const text = await r.text();
  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=21600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
