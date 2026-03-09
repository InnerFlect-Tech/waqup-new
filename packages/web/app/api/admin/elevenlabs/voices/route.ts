import { NextResponse } from 'next/server';
import { ELEVENLABS_BASE_URL } from '@waqup/shared/services';

export const dynamic = 'force-dynamic';

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  preview_url: string | null;
}

interface ElevenLabsVoicesResponse {
  voices: ElevenLabsVoice[];
}

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 503 });
    }

    const res = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
      headers: { 'xi-api-key': apiKey },
      next: { revalidate: 300 }, // cache 5 min
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[admin/elevenlabs/voices]', res.status, err);
      return NextResponse.json({ error: `ElevenLabs error: ${res.status}` }, { status: 502 });
    }

    const data = (await res.json()) as ElevenLabsVoicesResponse;

    const voices = data.voices.map((v) => ({
      voice_id:    v.voice_id,
      name:        v.name,
      category:    v.category,
      labels:      v.labels ?? {},
      preview_url: v.preview_url ?? null,
    }));

    return NextResponse.json({ voices });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[admin/elevenlabs/voices]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
