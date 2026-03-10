import { test, expect } from '@playwright/test';
import { skipIfNoAuth } from '../../helpers/auth.helper';
import { assertCreateHubLoaded, clickContentTypeCard } from '../../helpers/content.helper';

test.describe('Create Hub (authenticated)', () => {
  test.beforeEach(() => {
    skipIfNoAuth(test);
  });

  test('create hub loads with all three content type cards', async ({ page }) => {
    await assertCreateHubLoaded(page);
  });

  test('affirmation card links to affirmation create init', async ({ page }) => {
    await assertCreateHubLoaded(page);
    await clickContentTypeCard(page, 'affirmation');
    await expect(page).toHaveURL(/\/sanctuary\/affirmations\/create/, { timeout: 10000 });
  });

  test('meditation card links to meditation create init', async ({ page }) => {
    await assertCreateHubLoaded(page);
    await clickContentTypeCard(page, 'meditation');
    await expect(page).toHaveURL(/\/sanctuary\/meditations\/create/, { timeout: 10000 });
  });

  test('ritual card links to ritual create init', async ({ page }) => {
    await assertCreateHubLoaded(page);
    await clickContentTypeCard(page, 'ritual');
    await expect(page).toHaveURL(/\/sanctuary\/rituals\/create/, { timeout: 10000 });
  });

  test('create hub shows credit costs on each card', async ({ page }) => {
    await assertCreateHubLoaded(page);
    // Credit costs (Qs) should be visible on each card
    const qsLabels = page.locator('text=/\\d+\\s*Q/');
    await expect(qsLabels.first()).toBeVisible({ timeout: 8000 });
  });

  test('"Let\'s talk" CTA links to /create/conversation', async ({ page }) => {
    await assertCreateHubLoaded(page);
    const talkLink = page.locator('a[href="/create/conversation"]');
    await expect(talkLink).toBeVisible({ timeout: 8000 });
  });

  test('"Voice mode" CTA links to /speak', async ({ page }) => {
    await assertCreateHubLoaded(page);
    const voiceLink = page.locator('a[href="/speak"]');
    await expect(voiceLink).toBeVisible({ timeout: 8000 });
  });

  test('no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/create', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });
});
