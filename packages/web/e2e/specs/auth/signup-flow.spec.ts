import { test, expect } from '@playwright/test';

test.describe('Signup flow', () => {
  test('signup page renders all form fields', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: 8000 });
  });

  test('signup form shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });
    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible({ timeout: 8000 });
    await submitBtn.click();
    // Zod validation should produce error messages
    await expect(page.locator('text=/required|invalid|must be/i').first()).toBeVisible({
      timeout: 5000,
    });
  });

  test('signup form shows error for mismatched passwords', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });
    await page.locator('input[type="email"]').fill('test@example.com');

    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.first().fill('Password123!');
    const count = await passwordInputs.count();
    if (count > 1) {
      await passwordInputs.nth(1).fill('DifferentPassword456!');
    }

    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();

    // Should show password mismatch error
    await expect(page.locator('text=/match|password/i').first()).toBeVisible({
      timeout: 5000,
    });
  });

  test('signup page has terms acceptance requirement', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });
    // Terms checkbox or accept text should be visible (use .or() — comma + text= is not valid CSS)
    const termsElement = page
      .locator('input[type="checkbox"]')
      .or(page.getByText(/terms|agree|accept/i))
      .first();
    await expect(termsElement).toBeVisible({ timeout: 8000 });
  });

  test('signup form does not navigate on duplicate email (expects error)', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });

    // Mock the Supabase auth endpoint to return "already registered" error
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'user_already_exists',
          msg: 'User already registered',
        }),
      });
    });

    await page.locator('input[type="email"]').fill('existing@example.com');
    await page.locator('input[type="password"]').first().fill('Password123!');
    const passwordInputs = page.locator('input[type="password"]');
    const count = await passwordInputs.count();
    if (count > 1) {
      await passwordInputs.nth(1).fill('Password123!');
    }

    // Accept terms if checkbox exists
    const checkbox = page.locator('input[type="checkbox"]').first();
    const hasCheckbox = await checkbox.isVisible().catch(() => false);
    if (hasCheckbox) {
      await checkbox.check();
    }

    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();

    // Should show error — not navigate away
    await expect(page).toHaveURL(/\/signup/, { timeout: 8000 });
  });

  test('no horizontal overflow on signup at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });
});

test.describe('hasAccess gate', () => {
  test('authenticated user without access_granted is sent to /coming-soon', async ({ page }) => {
    // Mock profile queries (Supabase REST: /rest/v1/profiles or /rest/v1/profiles?select=...)
    const profilesMock = async (route: { request: () => { url: () => string }; fulfill: (opts: object) => Promise<void> }) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'test-no-access-id', access_granted: false, role: 'user' }]),
      });
    };
    await page.route('**/rest/v1/profiles*', profilesMock);
    await page.route('**/profiles*', profilesMock);

    // Load a public page first so we can set cookie + localStorage before requesting /sanctuary
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.evaluate(() => {
      const fakeUser = {
        id: 'test-no-access-id',
        email: 'noaccess@example.com',
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('waqup_override_user', JSON.stringify(fakeUser));
      document.cookie = 'waqup-override-auth=1; path=/; max-age=60; SameSite=Lax';
    });

    await page.goto('/sanctuary', { waitUntil: 'domcontentloaded', timeout: 20000 });

    // Should be redirected to /coming-soon, not stay on /sanctuary
    await expect(page).toHaveURL(/\/coming-soon/, { timeout: 15000 });
  });

  test('/coming-soon page is accessible and renders content', async ({ page }) => {
    await page.goto('/coming-soon', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15000 });
  });
});
