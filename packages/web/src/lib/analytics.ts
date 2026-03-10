/**
 * Web analytics adapter.
 *
 * Re-exports shared Analytics and trackEvent for convenience.
 * Adds web-specific helpers for manual page views and conversions.
 *
 * Usage:
 *   import { Analytics, trackPageView, trackConversion } from '@/lib/analytics';
 */

import {
  trackEvent as sharedTrackEvent,
  Analytics,
  initAnalytics,
} from '@waqup/shared/utils';

export { Analytics, initAnalytics };

/** Re-export for direct use when a typed helper doesn't exist. */
export const trackEvent = sharedTrackEvent;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Manually fire a GA4 page_view (for SPA overrides or special pages).
 * Most page views are handled by GoogleAnalyticsTracker; use this for one-off cases.
 */
export function trackPageView(url?: string, title?: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return;

  window.gtag('event', 'page_view', {
    page_path: url ?? window.location.pathname + window.location.search,
    page_location: url ?? window.location.href,
    page_title: title ?? document.title,
    send_to: gaId,
  });
}

/**
 * Fire a GA4 conversion event for funnels and reporting.
 * Mark these events as conversions in GA4 Admin → Events.
 */
export function trackConversion(
  name: string,
  value?: number,
  currency?: string,
  userId?: string,
): void {
  trackEvent('conversion', {
    conversion_name: name,
    ...(value != null && { value }),
    ...(currency && { currency }),
  }, userId);
}
