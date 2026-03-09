import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { editVoice } from '@waqup/shared/services';

export const dynamic = 'force-dynamic';

/** POST - Add more audio samples to an existing IVC voice */
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

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('elevenlabs_voice_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.elevenlabs_voice_id) {
      return NextResponse.json(
        { error: { message: 'Create a voice first before adding samples' } },
        { status: 400 }
      );
    }

    type CompatFormData = { get(k: string): string | File | null; getAll(k: string): (string | File)[] };
    const formData = (await request.formData()) as unknown as CompatFormData;
    const rawFiles = formData.getAll('files');
    const files = rawFiles.filter((f) => f instanceof Blob) as Blob[];
    const removeBg = formData.get('remove_background_noise');
    const removeBackgroundNoise = String(removeBg) === 'true';

    if (!files.length) {
      return NextResponse.json(
        { error: { message: 'At least one audio file is required' } },
        { status: 400 }
      );
    }

    await editVoice(profile.elevenlabs_voice_id, files, removeBackgroundNoise);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Voice samples error:', err);
    return NextResponse.json(
      {
        error: {
          message: err instanceof Error ? err.message : 'Failed to add samples',
        },
      },
      { status: 500 }
    );
  }
}
