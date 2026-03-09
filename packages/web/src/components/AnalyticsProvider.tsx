'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@waqup/shared/utils';

/**
 * Initialises the shared analytics transport for the web platform.
 * Currently uses a console.log stub; swap for PostHog/Segment/etc. in production.
 */
export function AnalyticsProvider() {
  useEffect(() => {
    initAnalytics((event) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[analytics]', event.name, event.properties ?? '');
      }
      // TODO: wire to PostHog / Segment / custom Supabase function
      // Example with PostHog:
      // if (typeof window !== 'undefined' && (window as any).posthog) {
      //   (window as any).posthog.capture(event.name, event.properties);
      // }
    });
  }, []);

  return null;
}
