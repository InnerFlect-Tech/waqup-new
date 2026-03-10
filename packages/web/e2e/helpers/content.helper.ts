import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export type ContentType = 'affirmation' | 'meditation' | 'ritual';

/**
 * Navigates to the create hub and asserts all three content type cards are visible.
 */
export async function assertCreateHubLoaded(page: Page): Promise<void> {
  await page.goto('/create', { waitUntil: 'networkidle', timeout: 15000 });
  await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('create-content-type-card-affirmation')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('create-content-type-card-meditation')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('create-content-type-card-ritual')).toBeVisible({ timeout: 10000 });
}

/**
 * Clicks a content type card on the create hub and asserts navigation to the init step.
 */
export async function clickContentTypeCard(page: Page, type: ContentType): Promise<void> {
  const card = page.getByTestId(`create-content-type-card-${type}`);
  await expect(card).toBeVisible({ timeout: 8000 });
  await card.click();
  await expect(page).toHaveURL(new RegExp(`/sanctuary/${type}s/create`), { timeout: 10000 });
}

/**
 * Navigate to a content type creation init step directly.
 */
export async function navigateToCreateInit(page: Page, type: ContentType): Promise<void> {
  await page.goto(`/sanctuary/${type}s/create/init`, { waitUntil: 'networkidle', timeout: 15000 });
  await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
}

/**
 * Asserts that the library page is loaded and shows expected state.
 */
export async function assertLibraryLoaded(page: Page): Promise<void> {
  await page.goto('/library', { waitUntil: 'networkidle', timeout: 15000 });
  await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
  // Library should either show content cards or an empty state (both are valid)
  const hasContent = await page.locator('[data-testid^="content-card"], [href*="/sanctuary/"]').count();
  const hasEmptyState = await page.getByText(/create your first/i).count();
  expect(hasContent + hasEmptyState).toBeGreaterThan(0);
}
