'use client';

import dynamic from 'next/dynamic';

/**
 * Vercel Web Analytics — loaded only when deployed to Vercel.
 * Locally (including prod:web:standalone), NEXT_PUBLIC_IS_VERCEL is '0',
 * so we never import @vercel/analytics, avoiding 404 on /_vercel/insights/script.js.
 */
const VercelAnalyticsInner = dynamic(
  () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
  { ssr: false }
);

export function VercelAnalytics() {
  if (process.env.NEXT_PUBLIC_IS_VERCEL !== '1') {
    return null;
  }
  return <VercelAnalyticsInner />;
}
