import { NextRequest, NextResponse } from 'next/server';

/**
 * ElevenLabs TTS proxy — converts a script to audio using the user's cloned voice.
 * API key never reaches the client.
 * Returns audio/mpeg binary.
 */

interface TtsRequest {
  text: string;
  voiceId: string;
  modelId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 503 });
    }

    const body = await req.json() as TtsRequest;

    if (!body.text || !body.voiceId) {
      return NextResponse.json({ error: 'text and voiceId are required' }, { status: 400 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${body.voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: body.text,
          model_id: body.modelId ?? 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('[ai/tts] ElevenLabs error:', response.status, err);
      return NextResponse.json({ error: `TTS failed: ${response.status}` }, { status: 502 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.byteLength),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[ai/tts]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
