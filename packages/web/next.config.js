const path = require('path');
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Root "/" → app/page.tsx redirects; config redirect as fallback
      { source: '/', destination: '/en', permanent: false },
      { source: '/home', destination: '/sanctuary', permanent: true },
      { source: '/auth/beta-signup', destination: '/waitlist', permanent: true },
    ];
  },
  // Rewrite unprefixed routes to /en/... so they use [locale] layout (AppProviders).
  // E2E and links use /login, /signup, etc. — these rewrite to default locale.
  async rewrites() {
    return [
      { source: '/sanctuary', destination: '/en/sanctuary' },
      { source: '/sanctuary/:path*', destination: '/en/sanctuary/:path*' },
      { source: '/speak', destination: '/en/speak' },
      { source: '/speak/:path*', destination: '/en/speak/:path*' },
      { source: '/login', destination: '/en/login' },
      { source: '/signup', destination: '/en/signup' },
      { source: '/forgot-password', destination: '/en/forgot-password' },
      { source: '/reset-password', destination: '/en/reset-password' },
      { source: '/confirm-email', destination: '/en/confirm-email' },
      { source: '/coming-soon', destination: '/en/coming-soon' },
      { source: '/join', destination: '/en/join' },
      { source: '/waitlist', destination: '/en/waitlist' },
      { source: '/explanation', destination: '/en/explanation' },
      { source: '/privacy', destination: '/en/privacy' },
      { source: '/terms', destination: '/en/terms' },
      { source: '/data-deletion', destination: '/en/data-deletion' },
      { source: '/how-it-works', destination: '/en/how-it-works' },
      { source: '/pricing', destination: '/en/pricing' },
      { source: '/get-qs', destination: '/en/get-qs' },
      { source: '/library', destination: '/en/library' },
      { source: '/create', destination: '/en/create' },
      { source: '/profile', destination: '/en/profile' },
      { source: '/marketplace', destination: '/en/marketplace' },
      { source: '/marketplace/:path*', destination: '/en/marketplace/:path*' },
      { source: '/onboarding', destination: '/en/onboarding' },
      { source: '/onboarding/:path*', destination: '/en/onboarding/:path*' },
      { source: '/play/:path*', destination: '/en/play/:path*' },
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
