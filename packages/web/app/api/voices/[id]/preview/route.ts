import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { textToSpeech } from '@waqup/shared/services';

export const dynamic = 'force-dynamic';

type RouteParams = { params: Promise<{ id: string }> };

const DEFAULT_PREVIEW_TEXT =
  'Hello. This is a preview of this voice. Your personalized meditations and affirmations will be spoken in this voice.';

/**
 * POST /api/voices/[id]/preview
 * Generate a TTS preview for a library voice (no Q credits charged).
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

    const body = await request.json().catch(() => ({})) as { text?: string };
    const text = (body.text ?? DEFAULT_PREVIEW_TEXT).slice(0, 500);

    const audioBuffer = await textToSpeech(
      (voice as { elevenlabs_voice_id: string }).elevenlabs_voice_id,
      text
    );

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.byteLength),
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (err) {
    console.error('[POST /api/voices/[id]/preview]', err);
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : 'Failed to generate preview' } },
      { status: 500 }
    );
  }
}
