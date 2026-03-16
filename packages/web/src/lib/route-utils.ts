/**
 * Route utilities — single source of truth for path matching.
 * Use pathWithoutLocale for route checks when pathname may include locale prefix (e.g. /pt/sanctuary).
 */

import { routing } from '@/i18n/routing';

const LOCALE_REGEX = new RegExp(
  `^/(${routing.locales.join('|')})(?=/|$)`,
  'i'
);

/** Strip locale prefix from pathname. Handles pathname from next-intl usePathname. */
export function pathWithoutLocale(pathname: string | null | undefined): string {
  if (!pathname) return '/';
  const stripped = pathname.replace(LOCALE_REGEX, '') || '/';
  return stripped.startsWith('/') ? stripped : '/' + stripped;
}

const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/confirm-email',
  '/auth/',
];

const ONBOARDING_ROUTES = [
  '/onboarding',
  '/onboarding/voice',
  '/onboarding/profile',
  '/onboarding/preferences',
  '/onboarding/guide',
];

const PROTECTED_PREFIXES = [
  '/library',
  '/create',
  '/profile',
  '/sanctuary',
  '/speak',
  '/marketplace',
];

const NO_FOOTER_PATTERNS = [
  '/',
  '/explanation',
  '/how-it-works',
  '/for-teachers',
  '/for-creators',
  '/for-coaches',
  '/for-studios',
  '/community',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/confirm-email',
  '/coming-soon',
  '/onboarding',
  '/sanctuary/affirmations/create',
  '/sanctuary/meditations/create',
  '/sanctuary/rituals/create',
];

export function isAuthRoute(pathname: string | null | undefined): boolean {
  const path = pathWithoutLocale(pathname);
  return AUTH_ROUTES.some(
    (r) => path === r || (r !== '/auth/' && path.startsWith(r)) || path.startsWith('/auth/')
  );
}

export function isOnboardingRoute(pathname: string | null | undefined): boolean {
  const path = pathWithoutLocale(pathname);
  return ONBOARDING_ROUTES.some((route) => path.startsWith(route));
}

export function isProtectedRoute(pathname: string | null | undefined): boolean {
  const path = pathWithoutLocale(pathname);
  return PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix + '/')
  );
}

/**
 * Footer hidden on: landing, marketing pages with own footer, auth pages, coming-soon,
 * onboarding, sanctuary create flows.
 */
export function shouldShowPublicFooter(pathname: string | null | undefined): boolean {
  const path = pathWithoutLocale(pathname);
  if (path === '/') return false;
  return !NO_FOOTER_PATTERNS.some((pattern) => path.includes(pattern));
}

const SUPERADMIN_PREFIXES = [
  '/admin',
  '/system',
  '/updates',
  '/health',
  '/showcase',
  '/pages',
  '/sitemap-view',
];

export function isSuperadminRoute(pathname: string | null | undefined): boolean {
  const path = pathWithoutLocale(pathname);
  if (!path) return false;
  return SUPERADMIN_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix + '/')
  );
}
