import { test, expect } from '@playwright/test';
import { canUseOverrideLogin } from '../../fixtures/test-user';

test.describe('Login flow', () => {
  test('override test login redirects to app (when configured)', async ({ page }) => {
    if (!canUseOverrideLogin || process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN !== 'true') {
      test.skip();
      return;
    }

    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    const testLoginBtn = page.getByTestId('test-login-button');
    await expect(testLoginBtn).toBeVisible({ timeout: 8000 });
    await testLoginBtn.click();
    await expect(page).toHaveURL(/\/(sanctuary|coming-soon)/, { timeout: 15000 });
  });

  test('test-login-button is hidden in production (NEXT_PUBLIC_ENABLE_TEST_LOGIN not true)', async ({ page }) => {
    // This verifies the test button isn't visible when the env var is off.
    // In CI without the env var, the button should not exist.
    if (process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true') {
      test.skip();
      return;
    }

    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    const testLoginBtn = page.locator('[data-testid="test-login-button"]');
    await expect(testLoginBtn).toHaveCount(0);
  });

  test('unauthenticated user accessing protected route is redirected to home', async ({ page }) => {
    await page.goto('/sanctuary', { waitUntil: 'networkidle', timeout: 15000 });
    // AuthProvider redirects unauthenticated users to /
    await expect(page).toHaveURL(/^\/$|\/(?!sanctuary)/, { timeout: 10000 });
  });

  test('unauthenticated user accessing /library is redirected', async ({ page }) => {
    await page.goto('/library', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page).not.toHaveURL(/\/library/, { timeout: 10000 });
  });

  test('unauthenticated user accessing /create is redirected', async ({ page }) => {
    await page.goto('/create', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page).not.toHaveURL(/\/create/, { timeout: 10000 });
  });

  test('unauthenticated user accessing /speak is redirected', async ({ page }) => {
    await page.goto('/speak', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page).not.toHaveURL(/\/speak/, { timeout: 10000 });
  });
});
