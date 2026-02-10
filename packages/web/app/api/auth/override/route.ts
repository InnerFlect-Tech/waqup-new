import { NextResponse } from 'next/server';

/**
 * Override login: validate credentials against env and allow bypassing Supabase.
 * Use only for dev/admin access. Set OVERRIDE_LOGIN_EMAIL and OVERRIDE_LOGIN_PASSWORD in env.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    const envEmail = process.env.OVERRIDE_LOGIN_EMAIL?.trim();
    const envPassword = process.env.OVERRIDE_LOGIN_PASSWORD;

    if (!envEmail || !envPassword) {
      return NextResponse.json(
        { error: 'Override login not configured' },
        { status: 501 }
      );
    }

    if (email === envEmail && password === envPassword) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Bad request' },
      { status: 400 }
    );
  }
}
