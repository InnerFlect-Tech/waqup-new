import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createPvcVoice } from '@waqup/shared/services';

export const dynamic = 'force-dynamic';

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

    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const language = typeof body?.language === 'string' ? body.language.trim() : 'en';

    if (!name) {
      return NextResponse.json(
        { error: { message: 'Voice name is required' } },
        { status: 400 }
      );
    }

    const voiceId = await createPvcVoice({ name, language });

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          elevenlabs_voice_id: voiceId,
          elevenlabs_voice_name: name,
          elevenlabs_voice_language: language,
        },
        { onConflict: 'id' }
      );

    if (updateError) {
      console.error('Failed to save voice to profile:', updateError);
      return NextResponse.json(
        { error: { message: 'Failed to save voice' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ voice_id: voiceId });
  } catch (err) {
    console.error('Voice create error:', err);
    return NextResponse.json(
      {
        error: {
          message: err instanceof Error ? err.message : 'Failed to create voice',
        },
      },
      { status: 500 }
    );
  }
}
