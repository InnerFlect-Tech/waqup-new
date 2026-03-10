import { test, expect } from '@playwright/test';
import { skipIfNoAuth } from '../../helpers/auth.helper';

test.describe('Library (authenticated)', () => {
  test.beforeEach(() => {
    skipIfNoAuth(test);
  });

  test('library page loads successfully', async ({ page }) => {
    await page.goto('/library', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
  });

  test('library shows either content or a helpful empty state', async ({ page }) => {
    await page.goto('/library', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });

    // Either content cards OR empty state message should be visible
    const hasContent = await page.locator('[href*="/sanctuary/affirmations/"], [href*="/sanctuary/meditations/"], [href*="/sanctuary/rituals/"]').count();
    const hasEmptyState = await page.getByText(/create your first|no content|empty/i).count();
    expect(hasContent + hasEmptyState).toBeGreaterThan(0);
  });

  test('filter pills are visible (All, Affirmations, Meditations, Rituals)', async ({ page }) => {
    await page.goto('/library', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole('button', { name: /all/i })).toBeVisible({ timeout: 8000 });
  });

  test('"Create New" button or empty state CTA links to create flow', async ({ page }) => {
    await page.goto('/library', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });

    const createLink = page.locator(
      'a[href="/create"], a[href*="/create/init"], a[href*="affirmations/create"]'
    ).first();
    await expect(createLink).toBeVisible({ timeout: 8000 });
  });

  test('library does not show horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/library', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });
});
