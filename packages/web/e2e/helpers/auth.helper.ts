import type { Page } from '@playwright/test';
import { canUseOverrideLogin } from '../fixtures/test-user';

/**
 * Performs override login using the test login button.
 * Requires NEXT_PUBLIC_ENABLE_TEST_LOGIN=true and valid override credentials.
 */
export async function loginViaOverride(page: Page): Promise<void> {
  await page.goto('/login', { waitUntil: 'networkidle', timeout: 20000 });
  const btn = page.getByTestId('test-login-button');
  await btn.waitFor({ state: 'visible', timeout: 8000 });
  await btn.click();
  await page.waitForURL(/\/(sanctuary|coming-soon)/, { timeout: 15000 });
}

/**
 * Logs in via email/password form. Use for testing the actual login flow.
 */
export async function loginViaForm(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login', { waitUntil: 'networkidle', timeout: 20000 });
  await page.getByTestId('login-email-input').fill(email);
  await page.getByTestId('login-password-input').fill(password);
  await page.getByTestId('login-submit-button').click();
  await page.waitForURL(/\/(sanctuary|coming-soon|onboarding)/, { timeout: 15000 });
}

/**
 * Signs out by navigating to sanctuary and triggering the logout flow.
 */
export async function logout(page: Page): Promise<void> {
  // Navigate to sanctuary where the logout option is accessible
  await page.goto('/sanctuary');
  // Override mode: clear localStorage
  await page.evaluate(() => {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('waqup-'));
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  });
}

/**
 * Returns true if override login is available and authenticated tests can run.
 * In CI (placeholder Supabase), profile fetch fails so hasAccess is false and users
 * land on /coming-soon — protected routes are unreachable. Skip auth tests in CI.
 */
export function canRunAuthTests(): boolean {
  if (process.env.CI === 'true') return false;
  return canUseOverrideLogin && process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true';
}

/**
 * Skip the current test if override login is not configured.
 * Call at the top of authenticated test.beforeEach blocks.
 */
export function skipIfNoAuth(test: { skip: () => void }): void {
  if (!canRunAuthTests()) {
    test.skip();
  }
}
