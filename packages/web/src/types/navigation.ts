/**
 * Navigation Type Definitions for Web App
 * Defines route paths and navigation structure for Next.js App Router
 */

export type AuthRoutes = {
  '/login': undefined;
  '/signup': undefined;
  '/forgot-password': undefined;
  '/confirm-email': undefined;
  '/auth/beta-signup': undefined;
};

export type MainRoutes = {
  '/home': undefined;
  '/library': undefined;
  '/create': undefined;
  '/profile': undefined;
};

export type SanctuaryRoutes = {
  '/sanctuary': undefined;
  '/sanctuary/settings': undefined;
  '/sanctuary/credits': undefined;
  '/sanctuary/progress': undefined;
  '/sanctuary/referral': undefined;
  '/sanctuary/reminders': undefined;
  '/sanctuary/learn': undefined;
  '/sanctuary/affirmations': undefined;
  '/sanctuary/affirmations/create': undefined;
  '/sanctuary/affirmations/record': undefined;
  '/sanctuary/rituals': undefined;
  '/sanctuary/rituals/create': undefined;
  '/sanctuary/rituals/recordings': undefined;
};

export type OnboardingRoutes = {
  '/onboarding': undefined;
  '/onboarding/profile': undefined;
  '/onboarding/preferences': undefined;
  '/onboarding/guide': undefined;
};

export type AppRoutes = AuthRoutes & MainRoutes & SanctuaryRoutes & OnboardingRoutes;

// Route path constants
export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  CONFIRM_EMAIL: '/confirm-email',
  BETA_SIGNUP: '/auth/beta-signup',
} as const;

export const MAIN_ROUTES = {
  HOME: '/home',
  LIBRARY: '/library',
  CREATE: '/create',
  PROFILE: '/profile',
} as const;

export const SANCTUARY_ROUTES = {
  HOME: '/sanctuary',
  SETTINGS: '/sanctuary/settings',
  CREDITS: '/sanctuary/credits',
  PROGRESS: '/sanctuary/progress',
  REFERRAL: '/sanctuary/referral',
  REMINDERS: '/sanctuary/reminders',
  LEARN: '/sanctuary/learn',
  AFFIRMATIONS: '/sanctuary/affirmations',
  AFFIRMATIONS_CREATE: '/sanctuary/affirmations/create',
  AFFIRMATIONS_RECORD: '/sanctuary/affirmations/record',
  RITUALS: '/sanctuary/rituals',
  RITUALS_CREATE: '/sanctuary/rituals/create',
  RITUALS_RECORDINGS: '/sanctuary/rituals/recordings',
} as const;

export const ONBOARDING_ROUTES = {
  HOME: '/onboarding',
  PROFILE: '/onboarding/profile',
  PREFERENCES: '/onboarding/preferences',
  GUIDE: '/onboarding/guide',
} as const;

export type AuthRoutePath = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type MainRoutePath = (typeof MAIN_ROUTES)[keyof typeof MAIN_ROUTES];
export type SanctuaryRoutePath = (typeof SANCTUARY_ROUTES)[keyof typeof SANCTUARY_ROUTES];
export type OnboardingRoutePath = (typeof ONBOARDING_ROUTES)[keyof typeof ONBOARDING_ROUTES];
export type AppRoutePath =
  | AuthRoutePath
  | MainRoutePath
  | SanctuaryRoutePath
  | OnboardingRoutePath;
