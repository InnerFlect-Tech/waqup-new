import { test, expect } from '@playwright/test';
import { skipIfNoAuth } from '../../helpers/auth.helper';

test.describe('Navigation (authenticated)', () => {
  test.beforeEach(() => {
    skipIfNoAuth(test);
  });

  test('desktop nav links are visible on authenticated pages', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name.includes('mobile'),
      'Desktop nav is hidden on mobile viewport (hamburger menu)',
    );
    await page.goto('/sanctuary');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });

    // Desktop nav should show Sanctuary, Speak, and Marketplace links
    await expect(page.getByTestId('nav-sanctuary')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('nav-speak')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('nav-marketplace')).toBeVisible({ timeout: 10000 });
  });

  test('Speak nav link navigates to /speak', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop nav hidden on mobile');
    await page.goto('/sanctuary');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });

    await page.getByTestId('nav-speak').click();
    await expect(page).toHaveURL(/\/speak/, { timeout: 10000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible();
  });

  test('Sanctuary nav link navigates to /sanctuary', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop nav hidden on mobile');
    await page.goto('/speak');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });

    await page.getByTestId('nav-sanctuary').click();
    await expect(page).toHaveURL(/\/sanctuary/, { timeout: 10000 });
  });

  test('Marketplace nav link navigates to /marketplace', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop nav hidden on mobile');
    await page.goto('/sanctuary');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });

    await page.getByTestId('nav-marketplace').click();
    await expect(page).toHaveURL(/\/marketplace/, { timeout: 10000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible();
  });

  test('library is accessible via profile menu or direct URL', async ({ page }) => {
    await page.goto('/library');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });
    // Should not redirect to login or home
    await expect(page).toHaveURL(/\/library/);
  });

  test('create page is accessible via direct URL', async ({ page }) => {
    await page.goto('/create');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/create/);
  });

  test('back navigation returns to previous page', async ({ page }) => {
    await page.goto('/sanctuary');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });

    await page.goto('/library');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });

    await page.goBack();
    await expect(page).toHaveURL(/\/sanctuary/);
  });

  test('refresh during authenticated session preserves auth', async ({ page }) => {
    await page.goto('/sanctuary');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });

    await page.reload({ waitUntil: 'networkidle' });

    // Should still be on sanctuary, not redirected to /
    await expect(page).toHaveURL(/\/sanctuary/);
    await expect(page.locator('main, [role="main"]').first()).toBeVisible();
  });
});
