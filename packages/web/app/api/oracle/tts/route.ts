import { NextRequest, NextResponse } from 'next/server';
import { AI_MODELS } from '@waqup/shared/constants';
import { ELEVENLABS_BASE_URL } from '@waqup/shared/services';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// Oracle TTS is covered by the oracle session cost (1Q per reply bundle).
// No additional credit charge here — the session pre-paid for all replies.
// This route is retained for backwards compatibility with the non-streaming oracle page.
const MAX_TEXT_LENGTH = 2000;
const ALLOWED_LATENCY_LEVELS = new Set([0, 1, 2, 3, 4]);

interface OracleTtsRequest {
  text:     string;
  voiceId:  string;
  model?:   string;
  voiceSettings?: {
    stability?:        number;
    similarity_boost?: number;
    style?:            number;
    use_speaker_boost?: boolean;
    speed?:            number;
  };
  optimizeStreamingLatency?: number;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 503 });
    }

    // ─── Auth ────────────────────────────────────────────────────────────────
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as OracleTtsRequest;

    if (!body.text || !body.voiceId) {
      return NextResponse.json({ error: 'text and voiceId are required' }, { status: 400 });
    }

    if (body.text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `text must be ${MAX_TEXT_LENGTH} characters or fewer` },
        { status: 400 },
      );
    }

    try {
      const modelId  = body.model ?? AI_MODELS.TTS_REALTIME;
      const settings = body.voiceSettings ?? {};

      // Sanitize latency optimization level (0–4 only).
      const latencyLevel = body.optimizeStreamingLatency !== undefined &&
        ALLOWED_LATENCY_LEVELS.has(body.optimizeStreamingLatency)
          ? body.optimizeStreamingLatency
          : undefined;

      const url = new URL(`${ELEVENLABS_BASE_URL}/text-to-speech/${body.voiceId}`);
      if (latencyLevel !== undefined) {
        url.searchParams.set('optimize_streaming_latency', String(latencyLevel));
      }

      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key':   apiKey,
        },
        body: JSON.stringify({
          text:     body.text,
          model_id: modelId,
          voice_settings: {
            stability:         settings.stability        ?? 0.5,
            similarity_boost:  settings.similarity_boost ?? 0.75,
            style:             settings.style            ?? 0.0,
            use_speaker_boost: settings.use_speaker_boost ?? true,
            speed:             settings.speed            ?? 1.0,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('[oracle/tts] ElevenLabs error:', res.status, err);
        return NextResponse.json({ error: `TTS failed: ${res.status}` }, { status: 502 });
      }

      const audioBuffer = await res.arrayBuffer();

      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type':   'audio/mpeg',
          'Content-Length': String(audioBuffer.byteLength),
          'Cache-Control':  'no-store',
          'X-Credits-Used': '0',
        },
      });
    } catch (ttsErr) {
      console.error('[oracle/tts] ElevenLabs error after credit deduction:', ttsErr);
      const message = ttsErr instanceof Error ? ttsErr.message : 'TTS failed';
      return NextResponse.json({ error: message }, { status: 502 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[oracle/tts]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
