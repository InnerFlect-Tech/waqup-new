import { test, expect } from '@playwright/test';
import { skipIfNoAuth } from '../../helpers/auth.helper';

/**
 * Onboarding flow tests.
 * 5-step flow: Why → Intention → Voice → Profile → Guide → /sanctuary
 * Role and Preferences redirect to Guide.
 */
test.describe('Onboarding flow (authenticated)', () => {
  test.beforeEach(() => {
    skipIfNoAuth(test);
  });

  test('onboarding Why screen loads, then intention screen', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    // Why screen: click "I'm ready" to reach intention
    const whyContinue = page.getByTestId('onboarding-continue-button');
    await expect(whyContinue).toBeVisible({ timeout: 8000 });
    await whyContinue.click();
    // Should show intention choices (at least 3 options)
    const options = page.locator('button').filter({ hasText: /confidence|abundance|peace|love|purpose|health/i });
    await expect(options.first()).toBeVisible({ timeout: 8000 });
    expect(await options.count()).toBeGreaterThanOrEqual(3);
  });

  test('onboarding intention — continue button enabled after selecting', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    // Go from Why to Intention
    await page.getByTestId('onboarding-continue-button').click();
    await expect(page.locator('button').filter({ hasText: /confidence/i }).first()).toBeVisible({ timeout: 5000 });

    // Continue button on intention screen (initially disabled until selection)
    const continueBtn = page.getByTestId('onboarding-continue-button');
    await expect(continueBtn).toBeVisible({ timeout: 5000 });

    // Select an intention
    const firstOption = page.locator('button').filter({ hasText: /confidence/i }).first();
    await firstOption.click();

    await expect(continueBtn).toBeEnabled({ timeout: 5000 });
  });

  test('onboarding intention → voice navigation', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    // Why → Intention
    await page.getByTestId('onboarding-continue-button').click();
    const firstOption = page.locator('button').filter({ hasText: /confidence/i }).first();
    await firstOption.click();

    const continueBtn = page.getByTestId('onboarding-continue-button');
    await expect(continueBtn).toBeEnabled({ timeout: 5000 });
    await continueBtn.click();

    await expect(page).toHaveURL(/\/onboarding\/voice/, { timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('onboarding voice step loads', async ({ page }) => {
    await page.goto('/onboarding/voice?intention=confidence', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    // Voice page has upload / skip
    await expect(page.locator('input[type="file"], [href*="/onboarding/profile"]').first()).toBeVisible({ timeout: 8000 });
  });

  test('onboarding profile step loads', async ({ page }) => {
    await page.goto('/onboarding/profile', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('onboarding-continue-button')).toBeVisible({ timeout: 8000 });
  });

  test('onboarding preferences redirects to guide', async ({ page }) => {
    await page.goto('/onboarding/preferences', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page).toHaveURL(/\/onboarding\/guide/, { timeout: 10000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('onboarding guide step loads with content type cards', async ({ page }) => {
    await page.goto('/onboarding/guide', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    // Should show quick start options
    await expect(page.locator('button').filter({ hasText: /affirmation|meditation|ritual/i }).first()).toBeVisible({
      timeout: 8000,
    });
    await expect(page.getByTestId('onboarding-continue-button')).toBeVisible({ timeout: 8000 });
  });

  test('onboarding guide — skip to sanctuary button navigates to /sanctuary', async ({ page }) => {
    await page.goto('/onboarding/guide', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });

    const skipBtn = page.getByTestId('onboarding-continue-button');
    await expect(skipBtn).toBeVisible({ timeout: 8000 });
    await skipBtn.click();

    await expect(page).toHaveURL(/\/sanctuary/, { timeout: 15000 });
  });

  test('onboarding guide — progress dots show correct step count', async ({ page }) => {
    await page.goto('/onboarding/guide', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    // 5 progress dots should be visible
    const dots = page.locator('[style*="width: 32px"][style*="height: 3px"]');
    expect(await dots.count()).toBe(5);
  });

  test('onboarding pages have no horizontal overflow at 375px', async ({ page }) => {
    for (const route of ['/onboarding', '/onboarding/voice', '/onboarding/profile', '/onboarding/guide']) {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(route, { waitUntil: 'networkidle', timeout: 15000 });
      await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow, `Horizontal overflow found on ${route} at 375px`).toBe(false);
    }
  });
});
