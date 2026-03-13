import { test, expect } from '@playwright/test';

const MARKETING_PAGES = [
  { path: '/how-it-works', name: 'How It Works' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/launch', name: 'Launch' },
  { path: '/join', name: 'Join' },
  { path: '/waitlist', name: 'Waitlist' },
  { path: '/explanation', name: 'The Science' },
  { path: '/our-story', name: 'Our Story' },
  { path: '/get-qs', name: 'Get Qs' },
];

for (const { path, name } of MARKETING_PAGES) {
  test(`${name} page (${path}) loads successfully`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    // Should not be a 404
    const title = await page.title();
    expect(title.toLowerCase()).not.toContain('404');
    expect(title.toLowerCase()).not.toContain('not found');
  });
}

test('privacy page loads with content', async ({ page }) => {
  await page.goto('/privacy', { waitUntil: 'networkidle', timeout: 15000 });
  await expect(page.locator('main, [role="main"], article, section').first()).toBeVisible({ timeout: 10000 });
});

test('data-deletion page loads', async ({ page }) => {
  await page.goto('/data-deletion', { waitUntil: 'networkidle', timeout: 15000 });
  await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
});
