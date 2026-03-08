import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { addSamplesToPvc } from '@waqup/shared/services';

export const dynamic = 'force-dynamic';

/** POST - Upload audio samples to user's PVC voice */
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
        { error: { message: 'Create a voice first before adding samples' } },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const rawFiles = formData.getAll('files');
    const files = rawFiles.filter((f) => f instanceof Blob) as Blob[];
    const removeBg = (formData as unknown as { get: (n: string) => unknown }).get('remove_background_noise');
    const removeBackgroundNoise = String(removeBg) === 'true';

    if (!files.length) {
      return NextResponse.json(
        { error: { message: 'At least one audio file is required' } },
        { status: 400 }
      );
    }

    const { sample_ids } = await addSamplesToPvc(
      profile.elevenlabs_voice_id,
      files,
      removeBackgroundNoise
    );

    return NextResponse.json({ sample_ids });
  } catch (err) {
    console.error('Voice samples error:', err);
    return NextResponse.json(
      {
        error: {
          message:
            err instanceof Error ? err.message : 'Failed to add samples',
        },
      },
      { status: 500 }
    );
  }
}
