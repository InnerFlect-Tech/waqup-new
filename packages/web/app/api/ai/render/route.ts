import { NextRequest, NextResponse } from 'next/server';
import { API_ROUTE_COSTS, AI_MODELS } from '@waqup/shared/constants';
import { textToSpeech } from '@waqup/shared/services';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ai/render
 * Validates credits, calls ElevenLabs TTS, uploads to Supabase Storage,
 * writes content_items.voice_url (three-layer arch) + audio_url (legacy compat),
 * sets status to 'ready', and returns the audioUrl.
 *
 * Deducts 1Q for TTS rendering. Only callable for content the user owns.
 */

const COST = API_ROUTE_COSTS.aiTts;
const MAX_TEXT_LENGTH = 5000;

interface RenderRequest {
  contentId: string;
  text: string;
  voiceId: string;
  modelId?: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 503 });
    }

    // ─── Auth ────────────────────────────────────────────────────────────────
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as RenderRequest;

    if (!body.contentId || !body.text || !body.voiceId) {
      return NextResponse.json({ error: 'contentId, text, and voiceId are required' }, { status: 400 });
    }

    if (body.text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: `text must be ${MAX_TEXT_LENGTH} characters or fewer` }, { status: 400 });
    }

    // ─── Ownership check ─────────────────────────────────────────────────────
    const { data: contentRow, error: ownerError } = await supabase
      .from('content_items')
      .select('id, user_id')
      .eq('id', body.contentId)
      .eq('user_id', user.id)
      .single();

    if (ownerError || !contentRow) {
      return NextResponse.json({ error: 'Content not found or access denied' }, { status: 404 });
    }

    // ─── Credit deduction ────────────────────────────────────────────────────
    const { error: deductError } = await supabase.rpc('deduct_credits', {
      p_user_id:     user.id,
      p_amount:      COST,
      p_description: 'tts_render',
    });

    if (deductError) {
      if (deductError.message?.includes('insufficient_credits')) {
        const { data: balance } = await supabase.rpc('get_credit_balance');
        return NextResponse.json(
          {
            error: 'insufficient_credits',
            message: `Rendering audio costs ${COST}Q but you have ${(balance as number) ?? 0}. Get more Qs to continue.`,
            required: COST,
            balance: (balance as number) ?? 0,
          },
          { status: 402 },
        );
      }
      console.error('[ai/render] credit deduction failed:', deductError.message);
      return NextResponse.json({ error: 'Credit service error. Please try again.' }, { status: 503 });
    }

    // ─── TTS generation ──────────────────────────────────────────────────────
    let audioBuffer: ArrayBuffer;
    try {
      audioBuffer = await textToSpeech(body.voiceId, body.text, body.modelId ?? AI_MODELS.TTS_STANDARD);
    } catch (ttsErr) {
      console.error('[ai/render] ElevenLabs error:', ttsErr);
      return NextResponse.json({ error: 'TTS generation failed' }, { status: 502 });
    }

    // ─── Storage upload ──────────────────────────────────────────────────────
    let audioUrl: string | null = null;
    const storagePath = `${user.id}/${body.contentId}.mp3`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(storagePath, audioBuffer, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      if (!uploadError) {
        // Try public URL first (works if bucket is public or marketplace-enabled)
        const { data: urlData } = supabase.storage.from('audio').getPublicUrl(storagePath);
        if (urlData?.publicUrl) {
          audioUrl = urlData.publicUrl;
        } else {
          // Fall back to signed URL (1 hour)
          const { data: signedData } = await supabase.storage
            .from('audio')
            .createSignedUrl(storagePath, 3600);
          audioUrl = signedData?.signedUrl ?? null;
        }
      } else {
        // Bucket may not exist yet — log but don't fail the request
        console.warn('[ai/render] storage upload skipped:', uploadError.message);
      }
    } catch (storageErr) {
      console.warn('[ai/render] storage error (non-fatal):', storageErr);
    }

    // ─── Update content_items ─────────────────────────────────────────────────
    // Write to voice_url (three-layer arch) and keep audio_url as legacy fallback.
    if (audioUrl) {
      await supabase
        .from('content_items')
        .update({ voice_url: audioUrl, audio_url: audioUrl, voice_type: 'ai', status: 'ready' })
        .eq('id', body.contentId)
        .eq('user_id', user.id);
    }

    return NextResponse.json({
      audioUrl,
      storagePath: audioUrl ? storagePath : null,
      creditsUsed: COST,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[ai/render]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
