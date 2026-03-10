/**
 * Test user config for E2E — driven by env vars.
 * Used when override login is available (OVERRIDE_LOGIN_EMAIL, OVERRIDE_LOGIN_PASSWORD).
 */
export const testUser = {
  email: process.env.OVERRIDE_LOGIN_EMAIL ?? process.env.NEXT_PUBLIC_OVERRIDE_LOGIN_EMAIL ?? 'test@waqup.app',
  password: process.env.OVERRIDE_LOGIN_PASSWORD ?? process.env.NEXT_PUBLIC_OVERRIDE_LOGIN_PASSWORD ?? 'testpass123',
};

export const canUseOverrideLogin = Boolean(
  (process.env.OVERRIDE_LOGIN_EMAIL || process.env.NEXT_PUBLIC_OVERRIDE_LOGIN_EMAIL) &&
  (process.env.OVERRIDE_LOGIN_PASSWORD || process.env.NEXT_PUBLIC_OVERRIDE_LOGIN_PASSWORD)
);
