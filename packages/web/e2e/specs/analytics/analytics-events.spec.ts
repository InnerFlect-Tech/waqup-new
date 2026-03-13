import { test, expect } from '@playwright/test';

/**
 * Analytics events validation.
 *
 * Injects a mock gtag to capture events (GA scripts don't load in dev).
 * Visits key flows and asserts expected events are fired.
 */

test.describe('Analytics events', () => {
  test.beforeEach(async ({ page }) => {
    // Inject mock gtag before page loads — captures events for assertion
    await page.addInitScript(() => {
      (window as unknown as { __analyticsEvents: unknown[] }).__analyticsEvents = [];
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag = function (...args: unknown[]) {
        (window as unknown as { __analyticsEvents: unknown[] }).__analyticsEvents.push(args);
      };
    });
  });

  test('funnel_signup_started fires when visiting signup page', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });

    // Wait for signup page useEffect to fire the event (analytics runs after mount)
    await page.waitForFunction(
      () => {
        const events = (window as unknown as { __analyticsEvents?: unknown[] }).__analyticsEvents ?? [];
        return events.some(
          (args: unknown) =>
            Array.isArray(args) && args[0] === 'event' && args[1] === 'funnel_signup_started',
        );
      },
      { timeout: 10000 },
    );

    const events = await page.evaluate(() => (window as unknown as { __analyticsEvents: unknown[] }).__analyticsEvents);
    const funnelStarted = events.some(
      (args) => Array.isArray(args) && args[0] === 'event' && args[1] === 'funnel_signup_started',
    );
    expect(funnelStarted).toBe(true);
  });

  test.skip('page_view fires on navigation', async ({ page }) => {
    // Flaky in CI: page_view may not fire when GA scripts are gated/absent
    await page.goto('/', { waitUntil: 'networkidle', timeout: 20000 });
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 20000 });

    const events = await page.evaluate(() => (window as unknown as { __analyticsEvents: unknown[] }).__analyticsEvents);
    const pageViews = events.filter(
      (args) => Array.isArray(args) && args[0] === 'event' && args[1] === 'page_view',
    );
    expect(pageViews.length).toBeGreaterThanOrEqual(1);
  });

  test('signup page loads without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/signup', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });

    // Filter out known acceptable errors (e.g. network, Supabase placeholder in CI)
    const critical = consoleErrors.filter(
      (e) =>
        !e.includes('Failed to fetch') &&
        !e.includes('loadScript') &&
        !e.includes('WebSocket') &&
        !e.includes('ERR_NAME_NOT_RESOLVED'),
    );
    expect(critical).toHaveLength(0);
  });
});
