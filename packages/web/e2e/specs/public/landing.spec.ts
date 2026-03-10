import { test, expect } from '@playwright/test';
import { assertNoHorizontalOverflow } from '../../helpers/navigation.helper';

test.describe('Landing page', () => {
  test('loads and shows primary content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 15000 });
  });

  test('has a primary CTA that links to a sign-up or waitlist destination', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 15000 });

    // Primary CTA should be a link pointing to /join, /waitlist, /signup, or /get-qs
    const primaryCTA = page
      .locator('a[href*="join"], a[href*="waitlist"], a[href*="signup"], a[href*="get-qs"]')
      .first();
    await expect(primaryCTA).toBeVisible({ timeout: 10000 });
  });

  test('navigation links to key marketing pages exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 15000 });

    // At least one auth link (login or sign up) should be in the header/nav
    const authLink = page.locator('a[href="/login"], a[href="/signup"]').first();
    await expect(authLink).toBeVisible({ timeout: 10000 });
  });

  test('no horizontal overflow at 375px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 15000 });
    await assertNoHorizontalOverflow(page);
  });

  test('no horizontal overflow at 390px (iPhone 14)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 15000 });
    await assertNoHorizontalOverflow(page);
  });

  test('waitlist / join page loads from CTA', async ({ page }) => {
    await page.goto('/join');
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 15000 });
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 15000 });
  });

  test('how-it-works page loads with heading', async ({ page }) => {
    await page.goto('/how-it-works');
    await expect(page.locator('h1, h2')).toBeVisible({ timeout: 15000 });
  });
});
