import { test, expect } from '@playwright/test';

const FOR_PROFESSIONALS_PAGES = [
  { path: '/for-teachers', name: 'For Teachers' },
  { path: '/for-coaches', name: 'For Coaches' },
  { path: '/for-creators', name: 'For Creators' },
  { path: '/for-studios', name: 'For Studios' },
  { path: '/investors', name: 'Investors' },
];

for (const { path, name } of FOR_PROFESSIONALS_PAGES) {
  test(`${name} page (${path}) loads successfully`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });
    const title = await page.title();
    expect(title.toLowerCase()).not.toContain('404');
    expect(title.toLowerCase()).not.toContain('not found');
  });
}
