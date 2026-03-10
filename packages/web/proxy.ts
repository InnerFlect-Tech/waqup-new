import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

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

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (isProtected) {
    // Build a mutable response so Supabase can refresh and set auth cookies.
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

    // getUser() validates the JWT against the Supabase server — safer than
    // getSession() which only decodes the local token without network verification.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // No valid Supabase session — redirect to the landing page.
      // The override login used for E2E testing stores its user in localStorage,
      // which proxy cannot read. Override sessions fall through to the
      // client-side AuthProvider redirect (acceptable: it's test-only).
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.search = '';
      return NextResponse.redirect(redirectUrl);
    }

    // User is authenticated — let next-intl handle locale routing.
    // Forward any refreshed auth cookies from supabaseResponse into the
    // intl response so the client receives them.
    const intlResponse = intlMiddleware(request);
    supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
      intlResponse.cookies.set(name, value);
    });
    return intlResponse;
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all request paths EXCEPT:
  // - /api/* (API routes stay locale-free and auth-check-free)
  // - /_next/* (Next.js internal routes)
  // - /.*\..* (files with extensions: images, fonts, manifests, etc.)
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Always run proxy for root
    '/',
  ],
};
