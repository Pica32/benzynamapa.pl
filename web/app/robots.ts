import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // AI crawlers — explicit allow for better AI search indexing
      { userAgent: 'GPTBot',        allow: '/' },
      { userAgent: 'ChatGPT-User',  allow: '/' },
      { userAgent: 'ClaudeBot',     allow: '/' },
      { userAgent: 'anthropic-ai',  allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'CCBot',         allow: '/' },
      { userAgent: 'Googlebot',     allow: '/' },
      { userAgent: 'bingbot',       allow: '/' },
    ],
    sitemap: 'https://benzynamapa.pl/sitemap.xml',
    host: 'https://benzynamapa.pl',
  };
}
