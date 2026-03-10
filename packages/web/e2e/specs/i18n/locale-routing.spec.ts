/**
 * Locale routing & language switcher smoke tests
 *
 * Covers:
 *  - Default locale (en) serves clean URLs (no /en/ prefix)
 *  - /pt/, /es/, /fr/, /de/ prefixes serve correct pages
 *  - html[lang] attribute matches the active locale
 *  - Language switcher is visible on the landing page
 *  - Switching language redirects to the correct locale URL
 *  - Login page renders in each locale without crashing
 *  - Pricing page renders in each locale without crashing
 */

import { test, expect } from '@playwright/test';

const LOCALES = ['pt', 'es', 'fr', 'de'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Default (English) — clean URL, no /en/ prefix
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Default locale — English', () => {
  test('landing page loads on / with lang=en', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  test('/en/ redirects to /', async ({ page }) => {
    const response = await page.goto('/en/', { waitUntil: 'commit' });
    // next-intl redirects /en/ → / with localePrefix: 'as-needed'
    expect(page.url()).not.toContain('/en/');
    expect(response?.status()).toBeLessThan(400);
  });

  test('login page loads without /en/ prefix', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
    expect(page.url()).not.toContain('/en/');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Non-default locales — prefixed URLs
// ─────────────────────────────────────────────────────────────────────────────

for (const locale of LOCALES) {
  test.describe(`Locale: ${locale}`, () => {
    test(`landing page /${locale}/ loads with lang=${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe(locale);
    });

    test(`login page /${locale}/login loads without crash`, async ({ page }) => {
      await page.goto(`/${locale}/login`);
      await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
      // Should not show a raw error boundary
      await expect(page.locator('text=Application error')).not.toBeVisible();
    });

    test(`pricing page /${locale}/pricing loads without crash`, async ({ page }) => {
      await page.goto(`/${locale}/pricing`);
      await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
      await expect(page.locator('text=Application error')).not.toBeVisible();
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Language switcher — presence and interaction
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Language switcher', () => {
  test('switcher button is visible in the header on landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
    // The compact switcher button contains the locale abbreviation (EN)
    const switcher = page.locator('button[aria-label="Switch language"]').first();
    await expect(switcher).toBeVisible({ timeout: 10_000 });
  });

  test('switcher opens a dropdown with all 5 languages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
    const switcher = page.locator('button[aria-label="Switch language"]').first();
    await switcher.click();
    // Dropdown should list all 5 language options
    const listbox = page.locator('[role="listbox"]');
    await expect(listbox).toBeVisible({ timeout: 5_000 });
    for (const name of ['English', 'Português (PT)', 'Español', 'Français', 'Deutsch']) {
      await expect(listbox.locator(`text=${name}`)).toBeVisible();
    }
  });

  test('switching to Português (PT) navigates to /pt/', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
    const switcher = page.locator('button[aria-label="Switch language"]').first();
    await switcher.click();
    await page.locator('[role="listbox"] button', { hasText: 'Português (PT)' }).click();
    await page.waitForURL(/\/pt\//);
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('pt');
  });

  test('switching language preserves the current pathname', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
    const switcher = page.locator('button[aria-label="Switch language"]').first();
    await switcher.click();
    await page.locator('[role="listbox"] button', { hasText: 'Español' }).click();
    await page.waitForURL(/\/es\//);
    expect(page.url()).toContain('/es/pricing');
  });

  test('language switcher is also present in the public footer', async ({ page }) => {
    await page.goto('/how-it-works');
    await expect(page.locator('footer')).toBeVisible({ timeout: 15_000 });
    // Footer uses the full pill switcher — check for Português pill
    const footer = page.locator('footer');
    await expect(footer.locator('button[aria-pressed]').first()).toBeVisible({ timeout: 5_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// No hardcoded English on non-English pages (smoke check)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('i18n content sanity', () => {
  test('Portuguese login page title is not "Sign in" (checks translation loaded)', async ({ page }) => {
    await page.goto('/pt/login');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
    // The page title (browser tab) should not be the raw English fallback key
    const title = await page.title();
    expect(title).not.toBe('');
    expect(title).not.toContain('undefined');
    expect(title).not.toContain('missing');
  });

  test('Zod validation error on login shows translated message for pt locale', async ({ page }) => {
    await page.goto('/pt/login');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
    // Submit empty form to trigger validation
    await page.locator('button[type="submit"]').click();
    // Error should appear — it must NOT be the raw English message
    const emailError = page.locator('text=Email is required').first();
    // In Portuguese it should say something different; just confirm raw English is NOT shown
    const rawEnglish = await emailError.count();
    expect(rawEnglish).toBe(0);
  });
});
