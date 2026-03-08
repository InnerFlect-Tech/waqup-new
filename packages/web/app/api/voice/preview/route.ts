import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { textToSpeech } from '@waqup/shared/services';

export const dynamic = 'force-dynamic';

/** POST - Generate TTS preview for verification */
export async function POST(request: Request) {
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
      .select('elevenlabs_voice_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.elevenlabs_voice_id) {
      return NextResponse.json(
        { error: { message: 'No voice setup yet' } },
        { status: 400 }
      );
    }

    const body = await request.json();
    const text =
      typeof body?.text === 'string' && body.text.trim()
        ? body.text.trim()
        : 'Hello, this is a preview of your cloned voice.';

    const audioBuffer = await textToSpeech(profile.elevenlabs_voice_id, text);

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (err) {
    console.error('Voice preview error:', err);
    return NextResponse.json(
      {
        error: {
          message:
            err instanceof Error ? err.message : 'Failed to generate preview',
        },
      },
      { status: 500 }
    );
  }
}
