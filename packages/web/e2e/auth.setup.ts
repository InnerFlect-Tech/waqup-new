import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { canUseOverrideLogin } from './fixtures/test-user';

const authStoragePath = path.join(__dirname, '.auth/user.json');

setup('authenticate via override login', async ({ page }) => {
  const authDir = path.dirname(authStoragePath);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  if (!canUseOverrideLogin || process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN !== 'true') {
    fs.writeFileSync(authStoragePath, JSON.stringify({ cookies: [], origins: [] }), 'utf-8');
    setup.skip();
    return;
  }

  await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
  const testLoginBtn = page.getByTestId('test-login-button');
  await testLoginBtn.waitFor({ state: 'visible', timeout: 5000 });
  await testLoginBtn.click();
  await page.waitForURL(/\/coming-soon/, { timeout: 10000 });
  await page.context().storageState({ path: authStoragePath });
});
