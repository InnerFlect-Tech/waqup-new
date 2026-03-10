import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const isCI = !!process.env.CI;
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
      testMatch: /specs\/protected\//,
      dependencies: ['setup'],
    },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] }, dependencies: ['setup'] },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] }, dependencies: ['setup'] },
  ],
  webServer: {
    command: isCI ? 'npm run start' : 'npm run dev',
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
