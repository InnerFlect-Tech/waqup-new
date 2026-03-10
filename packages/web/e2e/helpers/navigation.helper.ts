import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Navigates to a route and waits for the page to be fully interactive.
 * Waits for the main landmark and network idle.
 */
export async function navigateTo(page: Page, path: string, timeoutMs = 15000): Promise<void> {
  await page.goto(path, { waitUntil: 'networkidle', timeout: timeoutMs });
  await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: timeoutMs });
}

/**
 * Asserts the current URL matches the given pattern and main is visible.
 */
export async function assertPageLoaded(page: Page, urlPattern: RegExp, timeoutMs = 10000): Promise<void> {
  await expect(page).toHaveURL(urlPattern, { timeout: timeoutMs });
  await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: timeoutMs });
}

/**
 * Clicks a link or button and waits for navigation to complete.
 */
export async function clickAndNavigate(
  locator: Locator,
  page: Page,
  expectedUrlPattern: RegExp,
  timeoutMs = 10000,
): Promise<void> {
  await locator.click();
  await expect(page).toHaveURL(expectedUrlPattern, { timeout: timeoutMs });
}

/**
 * Asserts no horizontal overflow at the given viewport width (mobile test).
 */
export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  if (overflow) {
    throw new Error(`Page has horizontal overflow (scrollWidth > clientWidth)`);
  }
}

/**
 * Wait for any loading spinner / skeleton to disappear.
 */
export async function waitForLoadingComplete(page: Page, timeoutMs = 10000): Promise<void> {
  // Wait for any loading indicators to vanish
  const loadingLocator = page.locator('[data-testid="loading"], [aria-busy="true"], .loading-spinner');
  const count = await loadingLocator.count();
  if (count > 0) {
    await loadingLocator.first().waitFor({ state: 'hidden', timeout: timeoutMs });
  }
}
