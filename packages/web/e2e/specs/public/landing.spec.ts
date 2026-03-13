import { test, expect } from '@playwright/test';
import { assertNoHorizontalOverflow } from '../../helpers/navigation.helper';

test.describe('Landing page', () => {
  test('loads and shows primary content', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 20000 });
  });

  test('has a primary CTA that links to a sign-up or waitlist destination', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 20000 });

    // Primary CTA: join, waitlist, signup, get-qs, or create (locale-prefixed hrefs use * match)
    const primaryCTA = page
      .locator('a[href*="join"], a[href*="waitlist"], a[href*="signup"], a[href*="get-qs"], a[href*="create"]')
      .first();
    await expect(primaryCTA).toBeVisible({ timeout: 15000 });
  });

  test('navigation links to key marketing pages exist', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 20000 });

    // Auth link: resilient to locale prefix (href may be /en/login)
    const authLink = page.locator('a[href*="/login"], a[href*="/signup"]').first();
    await expect(authLink).toBeVisible({ timeout: 15000 });
  });

  test('no horizontal overflow at 375px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 20000 });
    await assertNoHorizontalOverflow(page);
  });

  test('no horizontal overflow at 390px (iPhone 14)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 20000 });
    await assertNoHorizontalOverflow(page);
  });

  test('no horizontal overflow at 320px (iPhone SE) — hero logo visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 20000 });
    await expect(page.locator('.landing-hero')).toBeVisible({ timeout: 8000 });
    await assertNoHorizontalOverflow(page);
  });

  test('waitlist / join page loads from CTA', async ({ page }) => {
    await page.goto('/join', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 20000 });
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 20000 });
  });

  test('how-it-works page loads with heading', async ({ page }) => {
    await page.goto('/how-it-works', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 20000 });
  });
});
