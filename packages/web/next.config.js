const path = require('path');
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose Vercel env to client so VercelAnalytics only loads when deployed (avoids 404 on /_vercel/insights/script.js locally)
  env: {
    NEXT_PUBLIC_IS_VERCEL: process.env.VERCEL ?? '0',
  },
  reactStrictMode: true,
  devIndicators: false, // Hide circular N dev indicator in bottom-left
  // Dev: keep more compiled pages in memory so navigation feels faster (default: 2 pages, 25s)
  onDemandEntries: {
    maxInactiveAge: 15 * 60 * 1000, // 15 minutes
    pagesBufferLength: 48, // keep up to 48 pages compiled (matches warmup scope)
  },
  async redirects() {
    return [
      { source: '/home', destination: '/sanctuary', permanent: true },
      { source: '/auth/beta-signup', destination: '/waitlist', permanent: true },
    ];
  },
  // Rewrite unprefixed routes to /en/... so they use [locale] layout (AppProviders).
  // Root / rewrites to /en so content shows at / (no redirect, cleaner UX).
  async rewrites() {
    return [
      { source: '/', destination: '/en' },
      { source: '/sanctuary', destination: '/en/sanctuary' },
      { source: '/sanctuary/:path*', destination: '/en/sanctuary/:path*' },
      { source: '/speak', destination: '/en/speak' },
      { source: '/speak/:path*', destination: '/en/speak/:path*' },
      { source: '/auth/callback', destination: '/en/auth/callback' },
      { source: '/auth/callback-mobile', destination: '/en/auth/callback-mobile' },
      { source: '/login', destination: '/en/login' },
      { source: '/signup', destination: '/en/signup' },
      { source: '/forgot-password', destination: '/en/forgot-password' },
      { source: '/reset-password', destination: '/en/reset-password' },
      { source: '/confirm-email', destination: '/en/confirm-email' },
      { source: '/coming-soon', destination: '/en/coming-soon' },
      { source: '/join', destination: '/en/join' },
      { source: '/waitlist', destination: '/en/waitlist' },
      { source: '/explanation', destination: '/en/explanation' },
      { source: '/our-story', destination: '/en/our-story' },
      { source: '/privacy', destination: '/en/privacy' },
      { source: '/terms', destination: '/en/terms' },
      { source: '/data-deletion', destination: '/en/data-deletion' },
      { source: '/how-it-works', destination: '/en/how-it-works' },
      { source: '/pricing', destination: '/en/pricing' },
      { source: '/get-qs', destination: '/en/get-qs' },
      { source: '/for-teachers', destination: '/en/for-teachers' },
      { source: '/for-coaches', destination: '/en/for-coaches' },
      { source: '/for-studios', destination: '/en/for-studios' },
      { source: '/for-creators', destination: '/en/for-creators' },
      { source: '/library', destination: '/en/library' },
      { source: '/create', destination: '/en/create' },
      { source: '/profile', destination: '/en/profile' },
      { source: '/marketplace', destination: '/en/marketplace' },
      { source: '/marketplace/:path*', destination: '/en/marketplace/:path*' },
      { source: '/onboarding', destination: '/en/onboarding' },
      { source: '/onboarding/:path*', destination: '/en/onboarding/:path*' },
      { source: '/play/:path*', destination: '/en/play/:path*' },
      { source: '/updates', destination: '/en/updates' },
      { source: '/updates/:path*', destination: '/en/updates/:path*' },
      { source: '/admin', destination: '/en/admin' },
      { source: '/admin/:path*', destination: '/en/admin/:path*' },
      { source: '/system', destination: '/en/system' },
      { source: '/system/:path*', destination: '/en/system/:path*' },
    ];
  },
  transpilePackages: ['@waqup/shared'],
  // Keep native/binary packages out of the Turbopack bundle so Node resolves them at runtime
  serverExternalPackages: ['@ffmpeg-installer/ffmpeg'],
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
  // Use cache in /tmp to avoid iCloud Drive ENOENT races (project in ~/Library/Mobile Documents/...)
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      const os = require('os');
      config.cache = {
        type: 'filesystem',
        cacheDirectory: path.join(os.tmpdir(), 'waqup-next-webpack'),
      };
    } else {
      config.cache = false; // Production builds: keep disabled for iCloud safety
    }
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
