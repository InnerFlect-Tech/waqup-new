import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getVoice } from '@waqup/shared/services';

export const dynamic = 'force-dynamic';

/** GET - Fetch user's voice status */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('elevenlabs_voice_id, elevenlabs_voice_name, elevenlabs_voice_language')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.elevenlabs_voice_id) {
      return NextResponse.json({
        voice_id: null,
        name: null,
        language: null,
        status: 'not_setup',
      });
    }

    try {
      const voice = await getVoice(profile.elevenlabs_voice_id);
      return NextResponse.json({
        voice_id: voice.voice_id,
        name: profile.elevenlabs_voice_name ?? voice.name,
        language: profile.elevenlabs_voice_language ?? 'en',
        status: 'ready',
      });
    } catch {
      return NextResponse.json({
        voice_id: profile.elevenlabs_voice_id,
        name: profile.elevenlabs_voice_name,
        language: profile.elevenlabs_voice_language,
        status: 'processing',
      });
    }
  } catch (err) {
    console.error('Voice GET error:', err);
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : 'Failed to fetch voice' } },
      { status: 500 }
    );
  }
}

/** PATCH - Update voice metadata */
export async function PATCH(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('elevenlabs_voice_id')
      .eq('id', user.id)
      .single();

    if (!profile?.elevenlabs_voice_id) {
      return NextResponse.json(
        { error: { message: 'No voice setup yet' } },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updates: Record<string, string> = {};
    if (typeof body?.name === 'string' && body.name.trim()) {
      updates.elevenlabs_voice_name = body.name.trim();
    }
    if (typeof body?.language === 'string' && body.language.trim()) {
      updates.elevenlabs_voice_language = body.language.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      return NextResponse.json(
        { error: { message: 'Failed to update voice' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Voice PATCH error:', err);
    return NextResponse.json(
      { error: { message: 'Failed to update voice' } },
      { status: 500 }
    );
  }
}
