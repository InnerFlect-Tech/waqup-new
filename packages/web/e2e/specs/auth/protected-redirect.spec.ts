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
      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Should not stay on the protected route (path-aware: matches /route, /route/, /en/route, etc.)
      const pathPattern = route.replace(/\//g, '\\/') + '(\\/|$|\\?)';
      await expect(page).not.toHaveURL(new RegExp(pathPattern), { timeout: 8000 });

      // Should land on a public page (handle locale-prefixed paths)
      const url = page.url();
      const pathname = new URL(url).pathname;
      const isProtectedPath = PROTECTED_ROUTES.some(
        (r) => pathname === r || pathname.endsWith(r) || pathname.includes(r + '/'),
      );
      expect(url).toContain('localhost:3000');
      expect(isProtectedPath, `Expected redirect away from ${route}, got ${url}`).toBe(false);
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
