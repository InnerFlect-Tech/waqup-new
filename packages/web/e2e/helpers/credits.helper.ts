import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Reads the current credit balance from the sanctuary credit badge.
 * Returns null if the badge is not found (e.g. unauthenticated page).
 */
export async function getCreditBalance(page: Page): Promise<number | null> {
  const badge = page.getByTestId('credit-balance-display');
  const isVisible = await badge.isVisible().catch(() => false);
  if (!isVisible) return null;

  const text = await badge.innerText();
  const match = text.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Navigates to the credits buy page and asserts pack cards are visible.
 */
export async function goToCreditsBuyPage(page: Page): Promise<void> {
  await page.goto('/sanctuary/credits/buy', { waitUntil: 'networkidle', timeout: 15000 });
  await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
}

/**
 * Asserts that a specific pack's checkout button is present and enabled.
 */
export async function assertPackButtonEnabled(page: Page, packId: string): Promise<void> {
  const btn = page.getByTestId(`pack-checkout-button-${packId}`);
  await expect(btn).toBeVisible({ timeout: 8000 });
  await expect(btn).toBeEnabled();
}

/**
 * Asserts that pack buttons other than the loading one are disabled during checkout.
 */
export async function assertOtherPacksDisabledDuringCheckout(
  page: Page,
  loadingPackId: string,
  otherPackIds: string[],
): Promise<void> {
  for (const id of otherPackIds) {
    if (id === loadingPackId) continue;
    const btn = page.getByTestId(`pack-checkout-button-${id}`);
    await expect(btn).toBeDisabled({ timeout: 5000 });
  }
}
