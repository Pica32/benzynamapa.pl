/**
 * RFC 9116 — security.txt
 * Standard pro security researchers + AI crawlery (E-E-A-T signál).
 */
export const dynamic = 'force-static';

export function GET() {
  const now = new Date();
  // Expires za rok
  const expires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const text = `Contact: mailto:kontakt@benzynamapa.pl
Expires: ${expires}
Preferred-Languages: pl, en
Canonical: https://benzynamapa.pl/.well-known/security.txt
`;
  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
