import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEV_ONLY_PATHS = ['/showcase', '/pages', '/sitemap-view', '/system']

const PROTECTED_PREFIXES = [
  '/home',
  '/library',
  '/create',
  '/profile',
  '/speak',
  '/marketplace',
  '/sanctuary',
  '/onboarding',
]

const PUBLIC_PREFIXES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/confirm-email',
  '/auth',
  '/how-it-works',
  '/pricing',
  '/funnels',
  '/investors',
  '/terms',
  '/privacy',
  '/_next',
  '/favicon',
  '/api',
]

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}

function isPublic(pathname: string): boolean {
  if (pathname === '/') return true
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block dev-only utility pages in production (unless test session)
  if (process.env.NODE_ENV === 'production') {
    const isDevPath = DEV_ONLY_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + '/')
    )
    if (isDevPath) {
      const testLoginEnabled =
        process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true'
      const testSessionCookie = request.cookies.get('waqup_test_session')?.value
      if (!(testLoginEnabled && testSessionCookie === '1')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  // Pass through public routes and anything not in the protected list
  if (isPublic(pathname) || !isProtected(pathname)) {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured (local dev without .env), pass through —
  // AuthProvider will handle client-side redirects
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next()
  }

  // Test login: when enabled, allow access if test session cookie is present.
  // Cookie is set client-side on test login; AuthProvider restores from localStorage.
  const testLoginEnabled = process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true'
  const testSessionCookie = request.cookies.get('waqup_test_session')?.value
  if (testLoginEnabled && testSessionCookie === '1') {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        response.cookies.set({ name, value, ...(options as object) })
      },
      remove(name: string, options: Record<string, unknown>) {
        response.cookies.set({ name, value: '', ...(options as object) })
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - image files
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)',
  ],
}
