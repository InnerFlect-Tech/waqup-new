export const APP_NAME = 'waQup';

/**
 * Base URL for the waQup web API.
 * In development: set EXPO_PUBLIC_API_URL in .env
 * In production: set to the deployed Next.js URL
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
