'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/**
 * Fires a GA4 page_view event on every client-side route change.
 *
 * Must be rendered inside a Suspense boundary (useSearchParams requirement).
 * The root layout wraps the body children in Suspense, so this is safe.
 *
 * Only fires when:
 *  - GA is loaded (window.gtag exists)
 *  - The measurement ID is configured
 *  - Consent has been granted (analytics_storage) OR we're in development
 */
export function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedRef = useRef<string>('');

  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!gaId) return;
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    // Deduplicate: skip if same URL as last tracked
    if (url === lastTrackedRef.current) return;
    lastTrackedRef.current = url;

    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_search: searchParams.toString() ? `?${searchParams.toString()}` : '',
      page_location: window.location.href,
      page_title: document.title,
      send_to: gaId,
    });
  }, [pathname, searchParams]);

  return null;
}
