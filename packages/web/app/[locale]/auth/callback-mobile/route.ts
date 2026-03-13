import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Mobile OAuth callback proxy.
 * Supabase redirects here after Google (or other OAuth) sign-in from the mobile app.
 * We return 200 with minimal HTML so the in-app browser loads this URL. Expo's
 * WebBrowser.openAuthSessionAsync receives the full URL (including ?code=) and
 * returns success. The mobile app then parses the code and exchanges it for a session.
 *
 * Add to Supabase Redirect URLs: https://waqup.app/auth/callback-mobile
 * (and http://localhost:3000/auth/callback-mobile for local dev)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=callback_failed', requestUrl.origin))
  }

  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Signing in…</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif;background:#0f0f0f;color:#fff;"><p>Signing you in… You can close this window.</p></body></html>`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  )
}
