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
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });

    const events = await page.evaluate(() => (window as unknown as { __analyticsEvents: unknown[] }).__analyticsEvents);
    const funnelStarted = events.some(
      (args) => Array.isArray(args) && args[0] === 'event' && args[1] === 'funnel_signup_started',
    );
    expect(funnelStarted).toBe(true);
  });

  test('page_view fires on navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 15000 });
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });

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

    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 8000 });

    // Filter out known acceptable errors (e.g. network, Supabase)
    const critical = consoleErrors.filter(
      (e) => !e.includes('Failed to fetch') && !e.includes('loadScript'),
    );
    expect(critical).toHaveLength(0);
  });
});
