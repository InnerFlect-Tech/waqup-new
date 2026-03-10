/**
 * Provider coverage verification — ensures /sanctuary and /speak (unprefixed)
 * receive QueryClientProvider via rewrites to /en/*.
 * These routes use useContent, useCreditBalance; without the provider they throw
 * "No QueryClient set, use QueryClientProvider to set one".
 */
import { test, expect } from '@playwright/test';
import { skipIfNoAuth } from '../../helpers/auth.helper';

const PROVIDER_ERROR_PATTERNS = [
  /No QueryClient set/i,
  /QueryClientProvider/i,
  /useQuery.*QueryClient/,
];

function hasProviderError(text: string): boolean {
  return PROVIDER_ERROR_PATTERNS.some((p) => p.test(text));
}

test.describe('Provider coverage (authenticated)', () => {
  test.beforeEach(() => {
    skipIfNoAuth(test);
  });

  test('sanctuary page loads without QueryClient errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' && hasProviderError(text)) {
        consoleErrors.push(text);
      }
    });

    await page.goto('/sanctuary', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });

    expect(
      consoleErrors,
      `Expected no QueryClient errors. Got: ${consoleErrors.join(' | ')}`
    ).toHaveLength(0);
  });

  test('speak page loads without QueryClient errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' && hasProviderError(text)) {
        consoleErrors.push(text);
      }
    });

    await page.goto('/speak', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"], canvas').first()).toBeVisible({ timeout: 10000 });

    expect(
      consoleErrors,
      `Expected no QueryClient errors. Got: ${consoleErrors.join(' | ')}`
    ).toHaveLength(0);
  });

  test('sanctuary/credits loads without QueryClient errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' && hasProviderError(text)) {
        consoleErrors.push(text);
      }
    });

    await page.goto('/sanctuary/credits', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });

    expect(
      consoleErrors,
      `Expected no QueryClient errors. Got: ${consoleErrors.join(' | ')}`
    ).toHaveLength(0);
  });

  test('sanctuary/series loads without QueryClient errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' && hasProviderError(text)) {
        consoleErrors.push(text);
      }
    });

    await page.goto('/sanctuary/series', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });

    expect(
      consoleErrors,
      `Expected no QueryClient errors. Got: ${consoleErrors.join(' | ')}`
    ).toHaveLength(0);
  });
});
