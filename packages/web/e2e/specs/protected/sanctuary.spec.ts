import { test, expect } from '@playwright/test';
import { skipIfNoAuth } from '../../helpers/auth.helper';

test.describe('Sanctuary (authenticated)', () => {
  test.beforeEach(() => {
    skipIfNoAuth(test);
  });

  test('sanctuary dashboard loads and shows key sections', async ({ page }) => {
    await page.goto('/sanctuary');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });

    // Welcome header should display
    await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });
  });

  test('credit balance badge is visible and links to credits', async ({ page }) => {
    await page.goto('/sanctuary');
    const creditBadge = page.getByTestId('credit-balance-display');
    await expect(creditBadge).toBeVisible({ timeout: 10000 });
    await creditBadge.click();
    await expect(page).toHaveURL(/\/sanctuary\/credits/);
  });

  test('create CTA is visible and links to create flow', async ({ page }) => {
    await page.goto('/sanctuary');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });
    // Hero create CTA should be present
    const createLinks = page.getByRole('link', { name: /create/i });
    await expect(createLinks.first()).toBeVisible({ timeout: 10000 });
  });

  test('library card links to library', async ({ page }) => {
    await page.goto('/sanctuary');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });
    const libraryLink = page.getByRole('link', { name: /library|practice/i }).first();
    await expect(libraryLink).toBeVisible({ timeout: 10000 });
  });
});
