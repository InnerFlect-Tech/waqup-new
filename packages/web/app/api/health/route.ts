import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * Health check endpoint for debugging.
 * GET /api/health — returns Supabase connection status.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        ok: false,
        supabase: 'not_configured',
        message: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      },
      { status: 503 }
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('content_items').select('id').limit(1);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          supabase: 'error',
          message: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      supabase: 'connected',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        supabase: 'error',
        message,
      },
      { status: 503 }
    );
  }
}
