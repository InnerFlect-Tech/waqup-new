import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createInstantVoice } from '@waqup/shared/services';
import { API_ROUTE_COSTS } from '@waqup/shared/constants';
import type { VoiceRelationship } from '@waqup/shared/types';

export const dynamic = 'force-dynamic';

const COST = API_ROUTE_COSTS.voiceSlot;

/**
 * GET — List all voice library entries for the authenticated user.
 */
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

    const { data, error } = await supabase
      .from('user_voices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }

    return NextResponse.json({ voices: data ?? [] });
  } catch (err) {
    console.error('[GET /api/voices]', err);
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : 'Failed to list voices' } },
      { status: 500 }
    );
  }
}

/**
 * POST — Create a new voice slot (costs 50 Q).
 * Accepts multipart/form-data: name, relationship, description?, avatar_color?, files[], remove_background_noise?
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

    // ─── Credit check ────────────────────────────────────────────────────────
    let balance = 0;
    try {
      const { data } = await supabase.rpc('get_credit_balance');
      balance = (data as number) ?? 0;
    } catch {
      return NextResponse.json({ error: { message: 'Credit service unavailable' } }, { status: 503 });
    }

    if (balance < COST) {
      return NextResponse.json(
        {
          error: 'insufficient_credits',
          message: `Adding a new voice costs ${COST} Q but you only have ${balance} Q. Get more Qs to continue.`,
          required: COST,
          balance,
        },
        { status: 402 }
      );
    }

    // ─── Parse form data ─────────────────────────────────────────────────────
    type CompatFormData = { get(k: string): string | File | null; getAll(k: string): (string | File)[] };
    const formData = (await request.formData()) as unknown as CompatFormData;
    const name = (formData.get('name') as string | null)?.trim() ?? '';
    const relationship = ((formData.get('relationship') as string | null) ?? 'other') as VoiceRelationship;
    const description = (formData.get('description') as string | null)?.trim() || undefined;
    const avatar_color = (formData.get('avatar_color') as string | null) || undefined;
    const rawFiles = formData.getAll('files');
    const files = rawFiles.filter((f) => f instanceof Blob) as Blob[];
    const removeBackgroundNoise = String(formData.get('remove_background_noise')) === 'true';

    if (!name) {
      return NextResponse.json({ error: { message: 'Voice name is required' } }, { status: 400 });
    }
    if (!files.length) {
      return NextResponse.json(
        { error: { message: 'At least one audio sample is required' } },
        { status: 400 }
      );
    }

    // ─── Create ElevenLabs IVC ────────────────────────────────────────────────
    const voiceId = await createInstantVoice({ name, files, description, removeBackgroundNoise });

    // ─── Insert into DB ───────────────────────────────────────────────────────
    const { data: voice, error: insertError } = await supabase
      .from('user_voices')
      .insert({
        user_id: user.id,
        elevenlabs_voice_id: voiceId,
        name,
        relationship,
        description: description ?? null,
        avatar_color: avatar_color ?? null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[POST /api/voices] DB insert failed:', insertError);
      return NextResponse.json({ error: { message: 'Failed to save voice' } }, { status: 500 });
    }

    // ─── Deduct credits ───────────────────────────────────────────────────────
    try {
      await supabase.from('credit_transactions').insert({
        user_id: user.id,
        amount: -COST,
        description: 'voice_slot',
      });
    } catch {
      // Non-fatal — voice already created, log and continue
      console.warn('[POST /api/voices] Credit deduction failed silently');
    }

    return NextResponse.json({ voice }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/voices]', err);
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : 'Failed to create voice' } },
      { status: 500 }
    );
  }
}
