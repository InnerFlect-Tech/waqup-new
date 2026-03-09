import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

type ServiceStatus = 'ok' | 'error' | 'not_configured';

interface ServiceResult {
  status: ServiceStatus;
  latency?: number;
  message?: string;
}

async function checkSupabase(): Promise<ServiceResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return { status: 'not_configured', message: 'Missing SUPABASE_URL or SUPABASE_KEY' };
  }

  const t0 = Date.now();
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('content_items').select('id').limit(1);
    const latency = Date.now() - t0;
    if (error) return { status: 'error', latency, message: error.message };
    return { status: 'ok', latency };
  } catch (err) {
    return {
      status: 'error',
      latency: Date.now() - t0,
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

async function checkOpenAI(): Promise<ServiceResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return { status: 'not_configured', message: 'Missing OPENAI_API_KEY' };

  const t0 = Date.now();
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    const latency = Date.now() - t0;
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        status: 'error',
        latency,
        message: (body as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`,
      };
    }
    return { status: 'ok', latency };
  } catch (err) {
    return {
      status: 'error',
      latency: Date.now() - t0,
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

async function checkElevenLabs(): Promise<ServiceResult> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return { status: 'not_configured', message: 'Missing ELEVENLABS_API_KEY' };

  const t0 = Date.now();
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': key },
      signal: AbortSignal.timeout(8000),
    });
    const latency = Date.now() - t0;
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        status: 'error',
        latency,
        message:
          (body as { detail?: { message?: string } | string })?.detail?.toString() ??
          `HTTP ${res.status}`,
      };
    }
    return { status: 'ok', latency };
  } catch (err) {
    return {
      status: 'error',
      latency: Date.now() - t0,
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

async function checkStripe(): Promise<ServiceResult> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { status: 'not_configured', message: 'Missing STRIPE_SECRET_KEY' };

  const t0 = Date.now();
  try {
    const res = await fetch('https://api.stripe.com/v1/account', {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    const latency = Date.now() - t0;
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        status: 'error',
        latency,
        message: (body as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`,
      };
    }
    return { status: 'ok', latency };
  } catch (err) {
    return {
      status: 'error',
      latency: Date.now() - t0,
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function GET() {
  const [supabase, openai, elevenlabs, stripe] = await Promise.all([
    checkSupabase(),
    checkOpenAI(),
    checkElevenLabs(),
    checkStripe(),
  ]);

  const services = { supabase, openai, elevenlabs, stripe };

  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      !!(
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ),
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    ELEVENLABS_API_KEY: !!process.env.ELEVENLABS_API_KEY,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
  };

  const allOk = Object.values(services).every((s) => s.status === 'ok');

  return NextResponse.json(
    { ok: allOk, timestamp: new Date().toISOString(), services, env },
    { status: allOk ? 200 : 207 }
  );
}
