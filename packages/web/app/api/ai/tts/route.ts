import { NextRequest, NextResponse } from 'next/server';
import { API_ROUTE_COSTS, AI_MODELS } from '@waqup/shared/constants';
import { textToSpeech } from '@waqup/shared/services';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * ElevenLabs TTS proxy — converts a script to audio using the user's cloned voice.
 * Costs 1Q per render. API key never reaches the client.
 * Returns audio/mpeg binary.
 */

const COST = API_ROUTE_COSTS.aiTts;
const MAX_TEXT_LENGTH = 5000;

interface TtsRequest {
  text: string;
  voiceId: string;
  modelId?: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 503 });
    }

    // ─── Auth ───────────────────────────────────────────────────────────────
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as TtsRequest;

    if (!body.text || !body.voiceId) {
      return NextResponse.json({ error: 'text and voiceId are required' }, { status: 400 });
    }

    if (body.text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `text must be ${MAX_TEXT_LENGTH} characters or fewer` },
        { status: 400 },
      );
    }

    // ─── Atomic credit deduction (before calling ElevenLabs) ─────────────────
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
            message: `Rendering audio with your voice costs ${COST} Q but you have ${(balance as number) ?? 0}. Get more Qs to continue.`,
            required: COST,
            balance: (balance as number) ?? 0,
          },
          { status: 402 },
        );
      }
      console.error('[ai/tts] credit deduction failed:', deductError.message);
      return NextResponse.json({ error: 'Credit service error. Please try again.' }, { status: 503 });
    }

    try {
      const audioBuffer = await textToSpeech(body.voiceId, body.text, body.modelId ?? AI_MODELS.TTS_STANDARD);

      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type':    'audio/mpeg',
          'Content-Length':  String(audioBuffer.byteLength),
          'Cache-Control':   'no-store',
          'X-Credits-Used':  String(COST),
        },
      });
    } catch (ttsErr) {
      console.error('[ai/tts] ElevenLabs error after credit deduction:', ttsErr);
      return NextResponse.json({ error: 'TTS generation failed' }, { status: 502 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[ai/tts]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
