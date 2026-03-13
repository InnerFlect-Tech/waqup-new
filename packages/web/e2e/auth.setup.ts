import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { canUseOverrideLogin } from './fixtures/test-user';

const authStoragePath = path.join(__dirname, '.auth/user.json');

setup('authenticate via override login', async ({ page }) => {
  setup.setTimeout(90000); // Cold compile can take 15s+; login + redirect + API need headroom

  const authDir = path.dirname(authStoragePath);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  if (!canUseOverrideLogin || process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN !== 'true') {
    fs.writeFileSync(authStoragePath, JSON.stringify({ cookies: [], origins: [] }), 'utf-8');
    setup.skip();
    return;
  }

  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 25000 });
  const testLoginBtn = page.getByTestId('test-login-button');
  await testLoginBtn.waitFor({ state: 'visible', timeout: 10000 });
  await testLoginBtn.click();
  // Allow time for API cold compile + redirect chain (coming-soon → sanctuary)
  await page.waitForURL(/\/(sanctuary|coming-soon)(\/|$)/, { timeout: 30000 });
  await page.context().storageState({ path: authStoragePath });
});
