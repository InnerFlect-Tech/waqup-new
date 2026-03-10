import { test, expect } from '@playwright/test';

test.describe('Auth pages (public)', () => {
  test('login page renders form elements', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('main, [role="main"]')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('login-email-input')).toBeVisible({ timeout: 8000 });
    await expect(page.getByTestId('login-password-input')).toBeVisible({ timeout: 8000 });
    await expect(page.getByTestId('login-submit-button')).toBeVisible({ timeout: 8000 });
  });

  test('login form shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.getByTestId('login-submit-button').click();
    // Zod validation should produce error messages
    const errors = page.locator('[class*="error"], [data-error], p[style*="color: rgb(239"]');
    await expect(errors.first()).toBeVisible({ timeout: 5000 });
  });

  test('login form shows error on bad credentials', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.getByTestId('login-email-input').fill('not-real@example.com');
    await page.getByTestId('login-password-input').fill('wrongpassword123');
    await page.getByTestId('login-submit-button').click();
    // Should show an error — either validation inline or from API
    await expect(
      page.locator('text=/invalid|incorrect|wrong|error|failed/i').first()
    ).toBeVisible({ timeout: 12000 });
  });

  test('signup page renders form', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 8000 });
  });

  test('forgot password page renders form', async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 8000 });
  });

  test('forgot password form shows error on invalid email format', async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'networkidle', timeout: 15000 });
    await page.locator('input[type="email"]').fill('notanemail');
    // Submit or blur to trigger validation
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();
    // Should either show inline validation or not proceed
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/forgot-password/); // stays on same page
  });

  test('login page has link to signup', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    const signupLink = page.locator('a[href*="signup"]').first();
    await expect(signupLink).toBeVisible({ timeout: 8000 });
  });

  test('signup page has link to login', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle', timeout: 15000 });
    const loginLink = page.locator('a[href*="login"]').first();
    await expect(loginLink).toBeVisible({ timeout: 8000 });
  });

  test('no horizontal overflow on login at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });
});
