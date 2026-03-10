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
});
