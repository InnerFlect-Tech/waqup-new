import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { API_ROUTE_COSTS, AI_MODELS } from '@waqup/shared/constants';
import { textToSpeech } from '@waqup/shared/services';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ai/render
 *
 * Two modes depending on voiceType:
 *
 *   AI voice (voiceId provided):
 *     Deducts credits → ElevenLabs TTS → uploads to Supabase Storage
 *     → writes content_items.voice_url + audio_url + sets status='ready'
 *
 *   Own voice (ownVoiceUrl provided):
 *     The user has already recorded and uploaded their voice in ContentVoiceStep.
 *     No TTS generation and no credit deduction — just write the recording URL
 *     to content_items.voice_url and mark status='ready'.
 *
 * Returns: { audioUrl, storagePath, creditsUsed }
 */

const COST = API_ROUTE_COSTS.aiTts;
const MAX_TEXT_LENGTH = 5000;

const renderRequestSchema = z.object({
  contentId: z.string().min(1),
  text: z.string().min(1).max(MAX_TEXT_LENGTH),
  voiceId: z.string().optional(),
  modelId: z.string().optional(),
  locale: z.string().optional().default('en'),
  /**
   * Supabase Storage URL of a user-recorded audio blob.
   * When present, TTS generation is skipped entirely (own-voice path).
   */
  ownVoiceUrl: z.string().url().optional(),
}).refine(
  (data) => data.ownVoiceUrl ?? data.voiceId,
  { message: 'Either voiceId or ownVoiceUrl must be provided' },
);

export async function POST(req: NextRequest) {
  try {
    // ─── Auth ─────────────────────────────────────────────────────────────────
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = renderRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const body = parsed.data;

    // ─── Ownership check ──────────────────────────────────────────────────────
    const { data: contentRow, error: ownerError } = await supabase
      .from('content_items')
      .select('id, user_id')
      .eq('id', body.contentId)
      .eq('user_id', user.id)
      .single();

    if (ownerError || !contentRow) {
      return NextResponse.json({ error: 'Content not found or access denied' }, { status: 404 });
    }

    // ─── Own-voice path (no TTS, no credit deduction) ─────────────────────────
    if (body.ownVoiceUrl) {
      await supabase
        .from('content_items')
        .update({
          voice_url: body.ownVoiceUrl,
          audio_url: body.ownVoiceUrl,
          voice_type: 'own',
          status: 'ready',
        })
        .eq('id', body.contentId)
        .eq('user_id', user.id);

      return NextResponse.json({
        audioUrl: body.ownVoiceUrl,
        storagePath: null,
        creditsUsed: 0,
      });
    }

    // ─── AI-voice path ────────────────────────────────────────────────────────
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 503 });
    }

    if (!body.voiceId) {
      return NextResponse.json({ error: 'voiceId is required for AI voice rendering' }, { status: 400 });
    }

    // ─── Credit deduction ─────────────────────────────────────────────────────
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

    // ─── TTS generation ───────────────────────────────────────────────────────
    let audioBuffer: ArrayBuffer;
    try {
      audioBuffer = await textToSpeech(body.voiceId, body.text, body.modelId ?? AI_MODELS.TTS_STANDARD, body.locale);
    } catch (ttsErr) {
      console.error('[ai/render] ElevenLabs error:', ttsErr);
      return NextResponse.json({ error: 'TTS generation failed' }, { status: 502 });
    }

    // ─── Storage upload ────────────────────────────────────────────────────────
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
          // Fall back to a 7-day signed URL so content remains playable for a full week.
          // The URL is persisted in content_items so it doesn't need to be re-generated
          // on every page load. 1-hour URLs cause content to stop playing mid-session.
          const { data: signedData } = await supabase.storage
            .from('audio')
            .createSignedUrl(storagePath, 7 * 24 * 60 * 60);
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
