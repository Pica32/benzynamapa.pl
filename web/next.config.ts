import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  async redirects() {
    return [
      // www → non-www 301 redirect
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.benzynamapa.pl' }],
        destination: 'https://benzynamapa.pl/:path*',
        permanent: true,
      },
      { source: '/blog', destination: '/aktualnosci/', permanent: true },
      { source: '/blog/:slug', destination: '/aktualnosci/:slug/', permanent: true },
      { source: '/news', destination: '/aktualnosci/', permanent: true },
      { source: '/artykuly', destination: '/aktualnosci/', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/data/:file*.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=7200' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Security + trust headers (E-E-A-T signál + SEO best practice)
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(self), camera=(), microphone=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      {
        // CORS pro JSON data + AI well-known files (umožní AI scrapers číst data)
        source: '/(data|.well-known)/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
