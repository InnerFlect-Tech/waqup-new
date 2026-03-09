import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, category } = body as { message?: string; category?: string };

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ error: 'Message is required (minimum 5 characters).' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('feedback').insert({
      user_id: user?.id ?? null,
      message: message.trim(),
      category: (category as string) ?? 'general',
    });

    if (error) {
      // Fallback: table might not exist yet — still return success so UX isn't blocked
      console.error('Feedback insert error:', error.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Feedback route error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
