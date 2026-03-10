/**
 * Critical user flow smoke tests.
 * Runs core journeys: landing → auth (optional) → sanctuary → credits → create init.
 * Protected tests skip when override login is not configured (OVERRIDE_LOGIN_* + NEXT_PUBLIC_ENABLE_TEST_LOGIN).
 *
 * Run with: npm run test:e2e:critical
 * Requires env for full coverage: OVERRIDE_LOGIN_EMAIL, OVERRIDE_LOGIN_PASSWORD, NEXT_PUBLIC_ENABLE_TEST_LOGIN=true
 */
import { test, expect } from '@playwright/test';
import { skipIfNoAuth } from '../helpers/auth.helper';
import { assertNoHorizontalOverflow } from '../helpers/navigation.helper';
import { assertCreateHubLoaded, clickContentTypeCard } from '../helpers/content.helper';
import { goToCreditsBuyPage } from '../helpers/credits.helper';

const navOpts = { waitUntil: 'domcontentloaded' as const, timeout: 15000 };

test.describe('Critical flows — public (no auth required)', () => {
  test('landing loads with CTA', async ({ page }) => {
    await page.goto('/', navOpts);
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });
    const cta = page.locator('a[href*="join"], a[href*="waitlist"], a[href*="signup"], a[href*="get-qs"]').first();
    await expect(cta).toBeVisible({ timeout: 10000 });
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing', navOpts);
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login', navOpts);
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('signup page loads', async ({ page }) => {
    await page.goto('/signup', navOpts);
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('unauthenticated user redirected from /sanctuary', async ({ page }) => {
    await page.goto('/sanctuary', navOpts);
    await expect(page).not.toHaveURL(/\/sanctuary/);
  });

  test('no horizontal overflow on landing at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', navOpts);
    await assertNoHorizontalOverflow(page);
  });
});

test.describe('Critical flows — authenticated (requires override login env)', () => {
  test.beforeEach(() => {
    skipIfNoAuth(test);
  });

  test('landing → login → sanctuary', async ({ page }) => {
    await page.goto('/login', navOpts);
    const testLoginBtn = page.getByTestId('test-login-button');
    await expect(testLoginBtn).toBeVisible({ timeout: 8000 });
    await testLoginBtn.click();
    await expect(page).toHaveURL(/\/(sanctuary|coming-soon)/, { timeout: 15000 });
  });

  test('sanctuary loads with credit badge', async ({ page }) => {
    await page.goto('/sanctuary', navOpts);
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('credit-balance-display')).toBeVisible({ timeout: 10000 });
  });

  test('credits buy page loads with pack cards', async ({ page }) => {
    await goToCreditsBuyPage(page);
    const firstBtn = page.locator('[data-testid^="pack-checkout-button-"]').first();
    await expect(firstBtn).toBeVisible({ timeout: 10000 });
  });

  test('create hub loads with content type cards', async ({ page }) => {
    await assertCreateHubLoaded(page);
  });

  test('create hub → affirmation create init', async ({ page }) => {
    await assertCreateHubLoaded(page);
    await clickContentTypeCard(page, 'affirmation');
    await expect(page).toHaveURL(/\/sanctuary\/affirmations\/create/, { timeout: 10000 });
  });

  test('library loads', async ({ page }) => {
    await page.goto('/library', navOpts);
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });
  });
});
