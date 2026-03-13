/**
 * App version — single source of truth for web display.
 * Keep in sync with root package.json version.
 * For pre-release / beta: use 0.x.x until general availability.
 */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.9.0';

export const IS_BETA = true;
