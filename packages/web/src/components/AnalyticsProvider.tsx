'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@waqup/shared/utils';

/**
 * Wires the shared analytics transport to window.gtag (GA4).
 *
 * This is a headless provider — it renders nothing but must mount early
 * (it lives in the root layout before any route-specific components).
 *
 * Transport behaviour:
 *  - Development: logs to console.debug AND forwards to gtag if loaded
 *  - Production: forwards to gtag only (silent failures, analytics never breaks the app)
 *
 * Consent: GA4 Consent Mode v2 (set in layout.tsx inline script) ensures
 * no data is sent until the user accepts via CookieConsentBanner.
 */
export function AnalyticsProvider() {
  useEffect(() => {
    initAnalytics((event) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[analytics]', event.name, event.properties ?? '');
      }

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', event.name, {
          ...event.properties,
          // GA4 reserved user_id field for cross-device tracking
          ...(event.userId ? { user_id: event.userId } : {}),
        });
      }
    });
  }, []);

  return null;
}
