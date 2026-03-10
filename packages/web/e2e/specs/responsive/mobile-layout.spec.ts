import { test, expect } from '@playwright/test';

test.describe('Mobile layout', () => {
  test('no horizontal overflow on landing at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 5);
    expect(noOverflow).toBeTruthy();
  });

  test('key CTAs visible at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('link', { name: /get started|join|start|transform|waitlist/i }).first()).toBeVisible({ timeout: 10000 });
  });
});
