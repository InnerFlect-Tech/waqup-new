import { test, expect } from '@playwright/test';
import { skipIfNoAuth } from '../../helpers/auth.helper';
import { goToCreditsBuyPage } from '../../helpers/credits.helper';

test.describe('Credits & Pricing (authenticated)', () => {
  test.beforeEach(() => {
    skipIfNoAuth(test);
  });

  test('credits overview page loads', async ({ page }) => {
    await page.goto('/sanctuary/credits', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
  });

  test('credits buy page loads with pack cards', async ({ page }) => {
    await goToCreditsBuyPage(page);
    // At least one pack checkout button should be visible
    const firstBtn = page.locator('[data-testid^="pack-checkout-button-"]').first();
    await expect(firstBtn).toBeVisible({ timeout: 10000 });
  });

  test('credits buy page shows prices in correct currency', async ({ page }) => {
    await goToCreditsBuyPage(page);
    // Should show € prices
    const prices = page.locator('text=/€\\d/');
    await expect(prices.first()).toBeVisible({ timeout: 8000 });
  });

  test('clicking checkout button while another is loading disables other buttons', async ({ page }) => {
    await goToCreditsBuyPage(page);

    // Mock the checkout endpoint to hang so we can inspect the disabled state
    await page.route('/api/stripe/checkout/credits', async (route) => {
      // Delay response to allow testing the disabled state
      await new Promise((r) => setTimeout(r, 3000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://checkout.stripe.com/test' }),
      });
    });

    const buttons = page.locator('[data-testid^="pack-checkout-button-"]');
    const count = await buttons.count();
    if (count > 1) {
      // Click the first button
      await buttons.first().click();
      // The second button should become disabled
      await expect(buttons.nth(1)).toBeDisabled({ timeout: 3000 });
    }
  });

  test('checkout API error shows error message on page', async ({ page }) => {
    await goToCreditsBuyPage(page);

    // Mock the checkout endpoint to fail
    await page.route('/api/stripe/checkout/credits', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Stripe is unavailable' }),
      });
    });

    const firstBtn = page.locator('[data-testid^="pack-checkout-button-"]').first();
    await firstBtn.click();

    // Error message should appear on the page
    await expect(page.locator('text=/stripe is unavailable|something went wrong|failed/i')).toBeVisible({
      timeout: 8000,
    });
  });

  test('credits transactions page loads', async ({ page }) => {
    await page.goto('/sanctuary/credits/transactions', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
  });

  test('credits buy page has no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await goToCreditsBuyPage(page);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });
});
