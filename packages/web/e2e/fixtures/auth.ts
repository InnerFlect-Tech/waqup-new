import { test as base } from '@playwright/test';
import path from 'path';
import { testUser, canUseOverrideLogin } from './test-user';

export const authStoragePath = path.join(__dirname, '../.auth/user.json');

/**
 * Authenticated test fixture.
 *
 * storageState is injected at the project level in playwright.config.ts for the
 * `desktop-chromium-authenticated` project. This fixture re-exports helpers
 * and the path so individual specs can reference them if needed.
 *
 * NOTE: Do NOT call `use(undefined)` here — that would override the project-level
 * storageState and break all authenticated tests. The `base` test already picks
 * up storageState from the project config automatically.
 */
export const test = base;

export { testUser, canUseOverrideLogin };
