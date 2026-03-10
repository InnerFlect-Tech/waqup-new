/**
 * Lightweight analytics hook.
 *
 * Events are sent to a configurable backend (GA4 / PostHog / etc.)
 * via a platform-provided transport. The default no-op transport makes the
 * shared utility safe to import on any platform without side-effects.
 *
 * Usage:
 *   import { Analytics } from '@waqup/shared/utils/analytics';
 *   Analytics.signupCompleted('google', undefined, userId);
 *
 * Event naming: snake_case, < 40 characters, starting with a letter.
 * All helpers here are the single source of truth — do not call window.gtag directly.
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

// ── Typed event helpers ──────────────────────────────────────────────────────
// All events follow GA4 naming conventions (snake_case, < 40 chars).
// Add new events here before using them in platform code.

export const Analytics = {
  // ── Authentication ────────────────────────────────────────────────────────

  /** User completed signup. method: 'email' | 'google' | 'apple' */
  signupCompleted: (method: string, referralCode?: string, userId?: string) =>
    trackEvent('sign_up', { method, referral_code: referralCode ?? null }, userId),

  /** User signed in. method: 'email' | 'google' | 'apple' */
  loginCompleted: (method: string, userId?: string) =>
    trackEvent('login', { method }, userId),

  /** User signed out. */
  logoutCompleted: (userId?: string) =>
    trackEvent('logout', undefined, userId),

  // ── Onboarding ────────────────────────────────────────────────────────────

  /**
   * User completed an onboarding step.
   * step: 'guide' | 'preferences' | 'profile' | 'complete'
   */
  onboardingStepCompleted: (step: string, userId?: string) =>
    trackEvent('onboarding_step_completed', { step }, userId),

  // ── Content lifecycle ─────────────────────────────────────────────────────

  /** User created content (affirmation, meditation, ritual). */
  contentCreated: (type: string, mode: string, userId?: string) =>
    trackEvent('content_created', { content_type: type, mode }, userId),

  /** User started playing a piece of content. */
  contentPlayed: (contentId: string, type: string, userId?: string) =>
    trackEvent('content_played', { content_id: contentId, content_type: type }, userId),

  /**
   * User completed listening to content.
   * durationSeconds: how long the content ran before completion.
   */
  contentCompleted: (contentId: string, type: string, durationSeconds: number, userId?: string) =>
    trackEvent(
      'content_completed',
      { content_id: contentId, content_type: type, duration_seconds: durationSeconds },
      userId,
    ),

  /** User shared content externally. platform: 'link' | 'instagram' | etc. */
  contentShared: (contentId: string, platform: string, userId?: string) =>
    trackEvent('share', { content_id: contentId, method: platform, content_type: 'content' }, userId),

  // ── Payments & subscriptions ──────────────────────────────────────────────

  /**
   * User initiated a payment (credit pack or subscription).
   * Maps to GA4 recommended ecommerce event begin_checkout.
   */
  paymentStarted: (type: 'credits' | 'subscription', amount: number, currency: string, userId?: string) =>
    trackEvent('begin_checkout', { payment_type: type, value: amount, currency }, userId),

  /**
   * User purchased a credit pack.
   * Maps to GA4 recommended ecommerce event purchase.
   */
  creditsPurchased: (packId: string, amount: number, currency: string, userId?: string) =>
    trackEvent('purchase', {
      transaction_id: `credits_${Date.now()}`,
      value: amount,
      currency,
      item_id: packId,
      item_category: 'credits',
    }, userId),

  /** User started a subscription plan. */
  subscriptionStarted: (planId: string, amount: number, currency: string, userId?: string) =>
    trackEvent('purchase', {
      transaction_id: `sub_${Date.now()}`,
      value: amount,
      currency,
      item_id: planId,
      item_category: 'subscription',
    }, userId),

  /** Credits were spent on content creation. */
  creditsSpent: (amount: number, contentType: string, userId?: string) =>
    trackEvent('credits_spent', { amount, content_type: contentType }, userId),

  /** User's credit balance fell below threshold (e.g. 5). */
  creditsLow: (balance: number, threshold: number, userId?: string) =>
    trackEvent('credits_low', { balance, threshold }, userId),

  // ── Referral ──────────────────────────────────────────────────────────────

  /** User shared their referral link. platform: 'link' | 'instagram' | etc. */
  referralShared: (platform: string, userId?: string) =>
    trackEvent('referral_shared', { platform }, userId),

  // ── Marketplace ───────────────────────────────────────────────────────────

  /** User viewed a marketplace item detail page. */
  marketplaceItemViewed: (itemId: string, userId?: string) =>
    trackEvent('view_item', { item_id: itemId, item_category: 'marketplace' }, userId),

  // ── Product creation flow ──────────────────────────────────────────────────

  /** User started ritual creation flow. */
  ritualStarted: (userId?: string) =>
    trackEvent('ritual_started', undefined, userId),

  /** User recorded voice (finished recording step). */
  voiceRecorded: (contentType: string, userId?: string) =>
    trackEvent('voice_recorded', { content_type: contentType }, userId),

  /** AI/TTS voice was generated for content. */
  aiVoiceGenerated: (contentType: string, userId?: string) =>
    trackEvent('ai_voice_generated', { content_type: contentType }, userId),

  // ── Marketing ──────────────────────────────────────────────────────────────

  /** User clicked a CTA. ctaId: e.g. 'hero-signup', 'pricing-upgrade'. */
  ctaClicked: (ctaId: string, page: string, userId?: string) =>
    trackEvent('cta_clicked', { cta_id: ctaId, page }, userId),

  /** User joined the waitlist. */
  waitlistJoined: (userId?: string) =>
    trackEvent('waitlist_joined', undefined, userId),

  // ── Admin ──────────────────────────────────────────────────────────────────

  /** Authorized user accessed an admin page. */
  adminPageAccessed: (page: string, userId?: string) =>
    trackEvent('admin_page_accessed', { page }, userId),

  // ── Session ───────────────────────────────────────────────────────────────

  /** Called when a user session begins (post-auth). */
  sessionStarted: (userId?: string) =>
    trackEvent('session_start', undefined, userId),

  // ── Errors ────────────────────────────────────────────────────────────────

  /**
   * A notable error occurred that the user saw.
   * errorCode: short identifier ('auth_failed', 'payment_failed', etc.)
   */
  errorOccurred: (errorCode: string, page: string) =>
    trackEvent('app_error', { error_code: errorCode, page }),

  // ── Funnel events ────────────────────────────────────────────────────────

  /** User started signup flow (landed on /signup or clicked Get started). */
  funnelSignupStarted: (userId?: string) =>
    trackEvent('funnel_signup_started', undefined, userId),

  /** User completed signup. Fire alongside sign_up for funnel visualization. */
  funnelSignupCompleted: (method: string, userId?: string) =>
    trackEvent('funnel_signup_completed', { method }, userId),

  /** User created their first ritual. */
  funnelFirstRitual: (contentId: string, userId?: string) =>
    trackEvent('funnel_first_ritual', { content_id: contentId }, userId),

  /** User made first paid conversion (credits or subscription). */
  funnelPaidConversion: (type: 'credits' | 'subscription', value?: number, userId?: string) =>
    trackEvent('funnel_paid_conversion', { conversion_type: type, ...(value != null && { value }) }, userId),
};
