import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * DELETE /api/voices/[id]
 * Removes a voice from the user's library (DB only — ElevenLabs quota is not freed automatically).
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

    // Verify ownership
    const { data: voice, error: fetchError } = await supabase
      .from('user_voices')
      .select('id, elevenlabs_voice_id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !voice) {
      return NextResponse.json({ error: { message: 'Voice not found' } }, { status: 404 });
    }

    if ((voice as { user_id: string }).user_id !== user.id) {
      return NextResponse.json({ error: { message: 'Forbidden' } }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from('user_voices')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: { message: deleteError.message } }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/voices/[id]]', err);
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : 'Failed to delete voice' } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/voices/[id]
 * Update voice name or description.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const body = await request.json() as { name?: string; description?: string };

    const { data, error } = await supabase
      .from('user_voices')
      .update({
        ...(body.name ? { name: body.name } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }

    return NextResponse.json({ voice: data });
  } catch (err) {
    console.error('[PATCH /api/voices/[id]]', err);
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : 'Failed to update voice' } },
      { status: 500 }
    );
  }
}
