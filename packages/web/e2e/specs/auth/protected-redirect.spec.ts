import { test, expect } from '@playwright/test';

const PROTECTED_ROUTES = [
  '/sanctuary',
  '/library',
  '/create',
  '/speak',
  '/profile',
  '/marketplace',
  '/sanctuary/credits',
  '/sanctuary/settings',
];

test.describe('Route protection (unauthenticated)', () => {
  for (const route of PROTECTED_ROUTES) {
    test(`${route} redirects unauthenticated users away`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle', timeout: 15000 });

      // Should not stay on the protected route
      await expect(page).not.toHaveURL(new RegExp(`^${route.replace(/\//g, '\\/')}$`), {
        timeout: 8000,
      });

      // Should land on a public page
      const url = page.url();
      const isPublic =
        url.includes('localhost:3000/') &&
        !PROTECTED_ROUTES.some((r) => url.endsWith(r) || url.includes(r + '/'));
      expect(isPublic).toBeTruthy();
    });
  }

  test('public pages remain accessible without auth', async ({ page }) => {
    const publicRoutes = ['/', '/login', '/signup', '/how-it-works', '/pricing', '/join'];
    for (const route of publicRoutes) {
      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await expect(page).toHaveURL(new RegExp(route === '/' ? '^http.*/$' : route), {
        timeout: 10000,
      });
    }
  });
});
