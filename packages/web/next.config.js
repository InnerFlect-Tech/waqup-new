const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@waqup/shared'],
  turbopack: {
    // Monorepo: root must include where next/package.json is resolvable
    root: path.join(__dirname, '../..'),
  },
  // Production optimizations
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    // Fix ChunkLoadError 404 with Turbopack + dynamic imports (Next.js 16.1)
    turbopackClientSideNestedAsyncChunking: true,
  },
};

module.exports = nextConfig;
