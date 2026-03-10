const path = require('path');
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/home', destination: '/sanctuary', permanent: true },
      { source: '/auth/beta-signup', destination: '/waitlist', permanent: true },
    ];
  },
  transpilePackages: ['@waqup/shared'],
  // Keep native/binary packages out of the Turbopack bundle so Node resolves them at runtime
  serverExternalPackages: ['@ffmpeg-installer/ffmpeg', 'fluent-ffmpeg'],
  turbopack: {
    // Monorepo: root must include where next/package.json is resolvable
    root: path.join(__dirname, '../..'),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Production optimizations
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    // Fix ChunkLoadError 404 with Turbopack + dynamic imports (Next.js 16.1)
    turbopackClientSideNestedAsyncChunking: true,
  },
};

module.exports = withNextIntl(nextConfig);
