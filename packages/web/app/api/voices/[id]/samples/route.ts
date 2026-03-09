import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { editVoice } from '@waqup/shared/services';

export const dynamic = 'force-dynamic';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * POST /api/voices/[id]/samples
 * Add more audio samples to an existing library voice (no Q credits charged).
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { data: voice, error: fetchError } = await supabase
      .from('user_voices')
      .select('elevenlabs_voice_id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !voice) {
      return NextResponse.json({ error: { message: 'Voice not found' } }, { status: 404 });
    }

    if ((voice as { user_id: string }).user_id !== user.id) {
      return NextResponse.json({ error: { message: 'Forbidden' } }, { status: 403 });
    }

    type CompatFormData = { get(k: string): string | File | null; getAll(k: string): (string | File)[] };
    const formData = (await request.formData()) as unknown as CompatFormData;
    const rawFiles = formData.getAll('files');
    const files = rawFiles.filter((f) => f instanceof Blob) as Blob[];
    const removeBackgroundNoise = String(formData.get('remove_background_noise')) === 'true';

    if (!files.length) {
      return NextResponse.json({ error: { message: 'At least one audio file is required' } }, { status: 400 });
    }

    await editVoice((voice as { elevenlabs_voice_id: string }).elevenlabs_voice_id, files, removeBackgroundNoise);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/voices/[id]/samples]', err);
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : 'Failed to add samples' } },
      { status: 500 }
    );
  }
}
