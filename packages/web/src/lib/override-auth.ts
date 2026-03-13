/**
 * Override auth (no Supabase) — for E2E and local dev.
 * Used by TestLoginButton and AuthProvider.
 *
 * OVERRIDE_COOKIE_NAME: Set by client when override login succeeds.
 * Middleware reads this to allow protected routes without Supabase session.
 */
export const OVERRIDE_STORAGE_KEY = 'waqup_override_user';
export const OVERRIDE_COOKIE_NAME = 'waqup-override-auth';
