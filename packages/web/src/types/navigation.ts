/**
 * Navigation Type Definitions for Web App
 * Defines route paths and navigation structure for Next.js App Router
 */

export type AuthRoutes = {
  '/login': undefined;
  '/signup': undefined;
  '/forgot-password': undefined;
};

export type MainRoutes = {
  '/home': undefined;
  '/library': undefined;
  '/create': undefined;
  '/profile': undefined;
};

export type AppRoutes = AuthRoutes & MainRoutes;

// Route path constants
export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

export const MAIN_ROUTES = {
  HOME: '/home',
  LIBRARY: '/library',
  CREATE: '/create',
  PROFILE: '/profile',
} as const;

export type AuthRoutePath = typeof AUTH_ROUTES[keyof typeof AUTH_ROUTES];
export type MainRoutePath = typeof MAIN_ROUTES[keyof typeof MAIN_ROUTES];
export type AppRoutePath = AuthRoutePath | MainRoutePath;
