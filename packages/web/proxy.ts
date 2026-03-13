import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import type { Locale } from './i18n/routing';
import { OVERRIDE_COOKIE_NAME } from '@/lib/override-auth';

// Routes that require an authenticated Supabase session.
// Matches AuthProvider.tsx protected route list.
const PROTECTED_PREFIXES = [
  '/library',
  '/create',
  '/profile',
  '/sanctuary',
  '/speak',
  '/marketplace',
];

const intlMiddleware = createIntlMiddleware(routing);

function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && routing.locales.includes(first as Locale)) {
    return '/' + segments.slice(1).join('/') || '/';
  }
  return pathname;
}

function isProtectedPath(pathname: string): boolean {
  const path = getPathWithoutLocale(pathname);
  return PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix + '/')
  );
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedPath(pathname)) {
    // E2E / dev: override auth cookie allows protected routes without Supabase session
    const overrideAuth = request.cookies.get(OVERRIDE_COOKIE_NAME)?.value === '1';
    if (overrideAuth && process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true') {
      return intlMiddleware(request);
    }

    const supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'placeholder-anon-key',
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.search = '';
      return NextResponse.redirect(redirectUrl);
    }

    const intlResponse = intlMiddleware(request);
    supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
      intlResponse.cookies.set(name, value);
    });
    return intlResponse;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/',
  ],
};
