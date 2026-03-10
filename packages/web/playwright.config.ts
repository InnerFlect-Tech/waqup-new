import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Load packages/web/.env.local so auth setup and override login env vars are available
import { config } from 'dotenv';
config({ path: path.join(__dirname, '.env.local') });

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const isCI = !!process.env.CI;
// Local only: set PLAYWRIGHT_REUSE_SERVER=false to force a fresh dev server (avoids port conflicts)
const reuseServer = process.env.PLAYWRIGHT_REUSE_SERVER !== undefined
  ? process.env.PLAYWRIGHT_REUSE_SERVER === 'true'
  : !isCI;
const authStoragePath = path.join(__dirname, 'e2e/.auth/user.json');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : 2,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],
  outputDir: 'test-results',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /specs\/protected\//,
      dependencies: ['setup'],
    },
    {
      name: 'i18n',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /specs\/i18n\//,
      dependencies: ['setup'],
    },
    {
      name: 'desktop-chromium-authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authStoragePath,
      },
      testMatch: /specs\/(protected\/|critical-flows\.spec)/,
      dependencies: ['setup'],
    },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] }, dependencies: ['setup'] },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] }, dependencies: ['setup'] },
  ],
  webServer: {
    // Use dev server: 'next start' is incompatible with output: standalone
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: reuseServer,
    // iCloud paths can slow cold starts; 90s covers dev server boot locally
    timeout: 90_000,
  },
});
