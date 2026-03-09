/**
 * Lightweight analytics hook.
 *
 * Events are sent to a configurable backend (Supabase function / PostHog / etc.)
 * via a platform-provided transport. The default no-op transport makes the
 * shared utility safe to import on any platform without side-effects.
 *
 * Usage:
 *   import { trackEvent } from '@waqup/shared/utils/analytics';
 *   trackEvent('content_created', { type: 'affirmation', mode: 'chat' });
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
  userId?: string;
  timestamp?: number;
}

export type AnalyticsTransport = (event: AnalyticsEvent) => void | Promise<void>;

let _transport: AnalyticsTransport = () => {};

/** Platform bootstrappers call this once with their preferred transport. */
export function initAnalytics(transport: AnalyticsTransport) {
  _transport = transport;
}

/**
 * Track an analytics event.
 * Fire-and-forget — errors are swallowed so analytics never breaks the app.
 */
export function trackEvent(
  name: string,
  properties?: AnalyticsEvent['properties'],
  userId?: string,
) {
  try {
    const event: AnalyticsEvent = {
      name,
      properties,
      userId,
      timestamp: Date.now(),
    };
    void Promise.resolve(_transport(event));
  } catch {
    // Non-critical — never throw from analytics
  }
}

// ── Typed event helpers ─────────────────────────────────────────────────────

export const Analytics = {
  contentCreated: (type: string, mode: string, userId?: string) =>
    trackEvent('content_created', { content_type: type, mode }, userId),

  contentPlayed: (contentId: string, type: string, userId?: string) =>
    trackEvent('content_played', { content_id: contentId, content_type: type }, userId),

  creditsPurchased: (packId: string, amount: number, userId?: string) =>
    trackEvent('credits_purchased', { pack_id: packId, amount }, userId),

  subscriptionStarted: (planId: string, userId?: string) =>
    trackEvent('subscription_started', { plan_id: planId }, userId),

  referralShared: (platform: string, userId?: string) =>
    trackEvent('referral_shared', { platform }, userId),

  contentShared: (contentId: string, platform: string, userId?: string) =>
    trackEvent('content_shared', { content_id: contentId, platform }, userId),

  signupCompleted: (method: string, referralCode?: string) =>
    trackEvent('signup_completed', { method, referral_code: referralCode }),

  sessionStarted: (userId?: string) =>
    trackEvent('session_started', undefined, userId),
};
