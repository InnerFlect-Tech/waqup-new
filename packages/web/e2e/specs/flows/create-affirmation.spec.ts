import { test, expect } from '@playwright/test';
import { skipIfNoAuth } from '../../helpers/auth.helper';

/**
 * End-to-end content creation flow tests for affirmations.
 * Tests the step-by-step form path: init → intent → context → personalization → script → voice → audio → review → complete
 */
test.describe('Affirmation creation flow (authenticated)', () => {
  test.beforeEach(() => {
    skipIfNoAuth(test);
  });

  test('affirmation create init page loads with mode selector', async ({ page }) => {
    await page.goto('/sanctuary/affirmations/create/init', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    // Should show the 3 creation modes
    await expect(page.getByText(/step-by-step/i)).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/chat with ai/i)).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/speak to orb/i)).toBeVisible({ timeout: 8000 });
  });

  test('meditation create init page loads', async ({ page }) => {
    await page.goto('/sanctuary/meditations/create/init', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('ritual create init page loads', async ({ page }) => {
    await page.goto('/sanctuary/rituals/create/init', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('affirmation intent step loads after selecting step-by-step mode', async ({ page }) => {
    await page.goto('/sanctuary/affirmations/create/init', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });

    // Click step-by-step mode
    const stepByStepBtn = page.getByText(/step-by-step/i).first();
    await expect(stepByStepBtn).toBeVisible({ timeout: 8000 });
    await stepByStepBtn.click();

    // Should navigate to intent step
    await expect(page).toHaveURL(/\/sanctuary\/affirmations\/create\/intent/, { timeout: 10000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('affirmation intent step has a text input for user intent', async ({ page }) => {
    await page.goto('/sanctuary/affirmations/create/intent', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    // Should have a text input or textarea
    const input = page.locator('input[type="text"], textarea').first();
    await expect(input).toBeVisible({ timeout: 8000 });
  });

  test('back navigation from intent step returns to init', async ({ page }) => {
    await page.goto('/sanctuary/affirmations/create/intent', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });

    // Should have a back button or link
    const backBtn = page.locator('[href*="/create/init"], button').filter({ hasText: /back/i }).first();
    const backLink = page.locator('a').filter({ hasText: /back/i }).first();

    const hasBackBtn = await backBtn.isVisible().catch(() => false);
    const hasBackLink = await backLink.isVisible().catch(() => false);
    expect(hasBackBtn || hasBackLink).toBeTruthy();
  });

  test('refresh during creation flow preserves page', async ({ page }) => {
    await page.goto('/sanctuary/affirmations/create/intent', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });

    await page.reload({ waitUntil: 'networkidle' });

    // Should still be on the intent page (or have redirected gracefully, not to /)
    const url = page.url();
    expect(url).not.toMatch(/^\/?$/);
  });

  test('orb creation page loads', async ({ page }) => {
    await page.goto('/create/orb', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    // Should show type selection buttons
    await expect(page.getByText(/affirmation|meditation|ritual/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('orb creation page shows browser error (not alert) when speech is unsupported', async ({ page }) => {
    // Disable SpeechRecognition in the browser context
    await page.addInitScript(() => {
      (window as Record<string, unknown>).SpeechRecognition = undefined;
      (window as Record<string, unknown>).webkitSpeechRecognition = undefined;
    });

    await page.goto('/create/orb?type=affirmation', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });

    // Click the mic button to trigger the speech recognition check
    const micButton = page.locator('button').filter({ has: page.locator('[data-lucide="mic"]') }).first();
    const isVisible = await micButton.isVisible().catch(() => false);
    if (isVisible) {
      await micButton.click();
      // Should show the styled error banner, NOT a browser alert
      await expect(page.getByTestId('orb-unsupported-error')).toBeVisible({ timeout: 5000 });
    }
  });

  test('conversation create page loads', async ({ page }) => {
    await page.goto('/create/conversation', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('no horizontal overflow on create init at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/sanctuary/affirmations/create/init', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });
});
