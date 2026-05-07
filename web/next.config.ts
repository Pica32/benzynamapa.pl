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
        // Security headers
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
