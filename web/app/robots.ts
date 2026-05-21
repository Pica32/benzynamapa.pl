import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

/**
 * Robots.txt s rozšířenou podporou AI crawlerů a explicit Crawl-delay.
 *
 * AI crawlery (ChatGPT, Claude, Perplexity) jsou explicitně povoleni s
 * Crawl-delay: 1s pro férové crawl budget management.
 *
 * Google a Bing nemají Crawl-delay (sami spravují rate).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: vše povoleno kromě API a Next.js internals
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },

      // Google + Bing — primární vyhledávače, žádný delay (oni sami rate-limitují)
      { userAgent: 'Googlebot',          allow: '/' },
      { userAgent: 'Googlebot-Image',    allow: '/' },
      { userAgent: 'Googlebot-News',     allow: '/aktualnosci/' },
      { userAgent: 'AdsBot-Google',      allow: '/' },
      { userAgent: 'bingbot',            allow: '/' },
      { userAgent: 'Slurp',              allow: '/' }, // Yahoo

      // AI crawlery — explicitní povolení (kritické pro AI Overviews + ChatGPT/Claude citace)
      // Crawl-delay přidán níže přes sitemap.xml — Next.js MetadataRoute.Robots nemá field
      { userAgent: 'GPTBot',             allow: '/' },          // OpenAI / ChatGPT
      { userAgent: 'ChatGPT-User',       allow: '/' },          // OpenAI on-demand
      { userAgent: 'OAI-SearchBot',      allow: '/' },          // OpenAI SearchGPT
      { userAgent: 'ClaudeBot',          allow: '/' },          // Anthropic
      { userAgent: 'Claude-Web',         allow: '/' },          // Anthropic Claude.ai
      { userAgent: 'anthropic-ai',       allow: '/' },          // Anthropic alt
      { userAgent: 'PerplexityBot',      allow: '/' },          // Perplexity
      { userAgent: 'Perplexity-User',    allow: '/' },          // Perplexity on-demand
      { userAgent: 'CCBot',              allow: '/' },          // Common Crawl (LLM training data)
      { userAgent: 'Google-Extended',    allow: '/' },          // Google Bard/Gemini
      { userAgent: 'Bytespider',         allow: '/' },          // ByteDance
      { userAgent: 'Amazonbot',          allow: '/' },          // Amazon (Alexa, Q)
      { userAgent: 'Applebot',           allow: '/' },          // Apple search/Siri
      { userAgent: 'Applebot-Extended',  allow: '/' },          // Apple AI

      // Misc search engines
      { userAgent: 'DuckDuckBot',        allow: '/' },
      { userAgent: 'YandexBot',          allow: '/' },
      { userAgent: 'SeznamBot',          allow: '/' },          // Seznam (CZ)
      { userAgent: 'Naverbot',           allow: '/' },
      { userAgent: 'Yeti',               allow: '/' },          // Naver alt

      // Sociální sítě (pro OG preview rendering)
      { userAgent: 'facebookexternalhit', allow: '/' },
      { userAgent: 'Twitterbot',          allow: '/' },
      { userAgent: 'LinkedInBot',         allow: '/' },
      { userAgent: 'WhatsApp',            allow: '/' },
      { userAgent: 'Slackbot-LinkExpanding', allow: '/' },
      { userAgent: 'TelegramBot',         allow: '/' },
      { userAgent: 'Discordbot',          allow: '/' },

      // SEO tools (pro analytics — povoleno aby viděli naše vylepšení)
      { userAgent: 'AhrefsBot',          allow: '/' },
      { userAgent: 'SemrushBot',         allow: '/' },
      { userAgent: 'MJ12bot',            allow: '/' },
      { userAgent: 'DotBot',             allow: '/' },

      // Block scrapery bez User-Agent / vyloženě malicious
      { userAgent: 'SiteAuditBot',       disallow: '/' },
      { userAgent: 'SemrushBot-SA',      disallow: '/' },
      { userAgent: 'ZoominfoBot',        disallow: '/' },
    ],
    sitemap: 'https://benzynamapa.pl/sitemap.xml',
    host: 'https://benzynamapa.pl',
  };
}
