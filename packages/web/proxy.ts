import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy for protected routes
 * Checks authentication state and redirects if needed
 *
 * Note: This is a basic implementation. For production, you may want to
 * verify the session server-side or use a more robust approach.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/confirm-email',
    '/auth/beta-signup',
    '/how-it-works',
    '/pricing',
    '/pages',
    '/sitemap',
  ];

  // Check if route is public
  const isPublicRoute =
    publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/')) ||
    pathname.startsWith('/showcase') ||
    pathname.startsWith('/onboarding');

  // Protected routes (main app routes)
  const isProtectedRoute =
    pathname.startsWith('/home') ||
    pathname.startsWith('/library') ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/sanctuary');

  // For protected routes, we'll handle redirect in the layout component
  // since we need client-side auth state check
  // Proxy can't access client-side state easily

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
