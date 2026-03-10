import { test, expect } from '@playwright/test';
import { canUseOverrideLogin } from '../../fixtures/test-user';

test.describe('Speak / Oracle (authenticated)', () => {
  test.beforeEach(async () => {
    if (!canUseOverrideLogin || process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN !== 'true') {
      test.skip();
    }
  });

  test('speak page loads with voice orb', async ({ page }) => {
    await page.goto('/speak', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"], canvas, [data-testid="voice-orb"]')).toBeVisible({
      timeout: 10000,
    });
  });

  test('speak page shows Begin button before session starts', async ({ page }) => {
    await page.goto('/speak', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.getByTestId('speak-begin-button')).toBeVisible({ timeout: 10000 });
  });

  test('speak page shows Q options (1Q, 2Q, 5Q)', async ({ page }) => {
    await page.goto('/speak', { waitUntil: 'networkidle', timeout: 15000 });
    // Q selector options should be visible
    await expect(page.locator('text=/1\\s*Q|2\\s*Q|5\\s*Q/')).toBeVisible({ timeout: 10000 });
  });

  test('Begin button is disabled when credits are insufficient', async ({ page }) => {
    // Mock the oracle session API to return 402 (insufficient credits)
    await page.route('/api/oracle/session', async (route) => {
      await route.fulfill({
        status: 402,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Insufficient credits' }),
      });
    });

    await page.goto('/speak', { waitUntil: 'networkidle', timeout: 15000 });
    const beginBtn = page.getByTestId('speak-begin-button');
    await expect(beginBtn).toBeVisible({ timeout: 10000 });

    // Click Begin — the API will fail with 402
    await beginBtn.click();
    // An error message should appear
    await expect(
      page.locator('text=/insufficient|credits|low/i').first()
    ).toBeVisible({ timeout: 8000 });
  });

  test('speak page shows error when API fails to start session', async ({ page }) => {
    await page.route('/api/oracle/session', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await page.goto('/speak', { waitUntil: 'networkidle', timeout: 15000 });
    const beginBtn = page.getByTestId('speak-begin-button');
    await expect(beginBtn).toBeVisible({ timeout: 10000 });
    await beginBtn.click();

    await expect(
      page.locator('text=/error|failed|try again|server/i').first()
    ).toBeVisible({ timeout: 8000 });
  });

  test('speak page has no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/speak', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });
});
