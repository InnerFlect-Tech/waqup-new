import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createInstantVoice } from '@waqup/shared/services';

export const dynamic = 'force-dynamic';

/**
 * POST - Create an Instant Voice Clone (IVC) from audio samples.
 * Accepts multipart/form-data with: name (string), files[] (audio), remove_background_noise (optional).
 * IVC is available on all ElevenLabs tiers including free.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    // Cast needed: @types/node v24 + dom lib both declare FormData with incompatible
    // shapes, causing the merged type to drop .get()/.getAll().
    type CompatFormData = { get(k: string): string | File | null; getAll(k: string): (string | File)[] };
    const formData = (await request.formData()) as unknown as CompatFormData;
    const name = typeof formData.get('name') === 'string' ? (formData.get('name') as string).trim() : '';
    const rawFiles = formData.getAll('files');
    const files = rawFiles.filter((f) => f instanceof Blob) as Blob[];
    const removeBg = formData.get('remove_background_noise');
    const removeBackgroundNoise = String(removeBg) === 'true';

    if (!name) {
      return NextResponse.json(
        { error: { message: 'Voice name is required' } },
        { status: 400 }
      );
    }

    if (!files.length) {
      return NextResponse.json(
        { error: { message: 'At least one audio sample is required to create a voice' } },
        { status: 400 }
      );
    }

    const voiceId = await createInstantVoice({ name, files, removeBackgroundNoise });

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          elevenlabs_voice_id: voiceId,
          elevenlabs_voice_name: name,
          elevenlabs_voice_language: 'en',
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
