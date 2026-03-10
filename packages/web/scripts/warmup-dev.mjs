#!/usr/bin/env node
/**
 * Precompile key routes so Next.js dev server compiles them in parallel.
 * Run after `npm run dev:web` is ready — compilation happens on first request.
 *
 * Usage:
 *   node scripts/warmup-dev.mjs
 *   BASE_URL=http://192.168.110.223:3000 node scripts/warmup-dev.mjs
 *
 * Context7/Next.js: dev compiles on-demand; no built-in precompile. This script
 * triggers requests to warm the cache. Stack Overflow + Next.js docs.
 */

const base = process.env.BASE_URL || 'http://localhost:3000';

const routes = [
  // Core
  '/',
  '/login',
  '/signup',
  '/library',
  '/create',
  '/create/conversation',
  '/create/orb',
  '/profile',
  '/pricing',
  '/speak',
  '/speak/test',
  // Marketing
  '/how-it-works',
  '/our-story',
  '/explanation',
  '/privacy',
  '/terms',
  '/data-deletion',
  '/get-qs',
  '/for-teachers',
  '/for-coaches',
  '/for-studios',
  '/for-creators',
  '/join',
  '/waitlist',
  '/coming-soon',
  '/launch',
  '/investors',
  '/funnels',
  '/showcase',
  '/pages',
  '/sitemap-view',
  '/health',
  // Sanctuary
  '/sanctuary',
  '/sanctuary/progress',
  '/sanctuary/affirmations',
  '/sanctuary/meditations',
  '/sanctuary/rituals',
  '/sanctuary/series',
  '/sanctuary/voice',
  '/sanctuary/voices',
  '/sanctuary/credits',
  '/sanctuary/credits/buy',
  '/sanctuary/credits/transactions',
  '/sanctuary/plan',
  '/sanctuary/learn',
  '/sanctuary/referral',
  '/sanctuary/reminders',
  '/sanctuary/help',
  '/sanctuary/settings',
  '/sanctuary/affirmations/create',
  '/sanctuary/affirmations/record',
  '/sanctuary/affirmations/create/init',
  '/sanctuary/affirmations/create/intent',
  '/sanctuary/affirmations/create/script',
  '/sanctuary/affirmations/create/voice',
  '/sanctuary/affirmations/create/audio',
  '/sanctuary/affirmations/create/review',
  '/sanctuary/affirmations/create/complete',
  '/sanctuary/meditations/create',
  '/sanctuary/meditations/create/init',
  '/sanctuary/meditations/create/intent',
  '/sanctuary/meditations/create/context',
  '/sanctuary/meditations/create/script',
  '/sanctuary/meditations/create/voice',
  '/sanctuary/meditations/create/audio',
  '/sanctuary/meditations/create/review',
  '/sanctuary/meditations/create/complete',
  '/sanctuary/rituals/create',
  '/sanctuary/rituals/recordings',
  '/sanctuary/rituals/create/init',
  '/sanctuary/rituals/create/context',
  '/sanctuary/rituals/create/goals',
  '/sanctuary/rituals/create/personalization',
  '/sanctuary/rituals/create/script',
  '/sanctuary/rituals/create/voice',
  '/sanctuary/rituals/create/audio',
  '/sanctuary/rituals/create/review',
  '/sanctuary/rituals/create/complete',
  // Auth
  '/forgot-password',
  '/reset-password',
  '/confirm-email',
  // Marketplace
  '/marketplace',
  '/marketplace/creator',
  '/marketplace/test-id',
  '/play/test-id',
  // Onboarding
  '/onboarding',
  '/onboarding/guide',
  '/onboarding/role',
  '/onboarding/profile',
  '/onboarding/preferences',
  // Updates
  '/updates',
  '/updates/open-items',
  '/updates/beta-readiness-implementation',
  '/updates/beta-tester-recruitment',
  '/updates/audio-system-implementation',
  '/updates/multilingual-i18n-implementation',
  // Admin
  '/admin',
  '/admin/content',
  '/admin/users',
  '/admin/waitlist',
  '/admin/ios-release',
  '/admin/oracle',
  // System
  '/system',
  '/system/audio',
  '/system/conversation',
  '/system/creation-steps',
  '/system/pipelines',
  '/system/schema',
];

const BATCH_SIZE = 12;

async function warm(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    return { url, ok: res.ok, status: res.status };
  } catch (e) {
    return { url, ok: false, error: e.message };
  }
}

async function main() {
  const batches = [];
  for (let i = 0; i < routes.length; i += BATCH_SIZE) {
    batches.push(routes.slice(i, i + BATCH_SIZE));
  }
  console.log(`Warming ${routes.length} routes at ${base} in ${batches.length} batches of ${BATCH_SIZE}...\n`);
  const start = Date.now();
  let totalOk = 0;
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const results = await Promise.all(batch.map((r) => warm(base + r)));
    const ok = results.filter((r) => r.ok).length;
    totalOk += ok;
    const failed = results.filter((r) => !r.ok);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`Batch ${i + 1}/${batches.length} — ${ok}/${batch.length} ok (${totalOk}/${routes.length} total, ${elapsed}s)`);
    if (failed.length) {
      failed.forEach((r) => console.warn(`  ${r.url}: ${r.error || r.status}`));
    }
  }
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nWarmup complete — ${totalOk}/${routes.length} compiled in ${elapsed}s`);
}

main();
