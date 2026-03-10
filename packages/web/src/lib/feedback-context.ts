import {
  buildFeedbackContext,
  type FeedbackContext,
  type FeedbackEnv,
} from '@waqup/shared/utils';

/**
 * Get feedback context in the browser.
 * Auto-detects platform, browser, OS, viewport, URL from navigator/window.
 */
export function getFeedbackContext(overrides?: Partial<FeedbackContext>): FeedbackContext {
  const env: FeedbackEnv | null =
    typeof window !== 'undefined' && typeof navigator !== 'undefined'
      ? {
          userAgent: navigator.userAgent,
          vendor: navigator.vendor,
          href: window.location?.href,
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
        }
      : null;

  return buildFeedbackContext(env, overrides);
}
