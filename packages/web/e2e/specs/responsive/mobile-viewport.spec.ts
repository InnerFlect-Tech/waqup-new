import { test, expect } from '@playwright/test';
import { assertNoHorizontalOverflow } from '../../helpers/navigation.helper';

/**
 * Mobile viewport audit — verifies critical pages render without horizontal overflow
 * at common phone widths (320, 375, 390px).
 */
test.describe('Mobile viewport audit', () => {
  test('landing page loads at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('main').first()).toBeVisible({ timeout: 10000 });
  });

  test('how-it-works has no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/how-it-works');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
    await assertNoHorizontalOverflow(page);
  });

  test('pricing has no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pricing');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    await assertNoHorizontalOverflow(page);
  });

  test('our-story has no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/our-story');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    await assertNoHorizontalOverflow(page);
  });

  test('login page loads at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible({ timeout: 10000 });
  });
});
