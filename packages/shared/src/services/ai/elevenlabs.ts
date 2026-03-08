/**
 * ElevenLabs Professional Voice Cloning API integration.
 * Used for voice setup: create PVC voice, add samples, TTS preview.
 */

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1';

function getApiKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    throw new Error('ELEVENLABS_API_KEY is not set');
  }
  return key;
}

async function elevenLabsFetch(
  path: string,
  options: RequestInit & { body?: unknown } = {}
): Promise<Response> {
  const { body, ...rest } = options;
  const url = `${ELEVENLABS_BASE}${path}`;
  const headers: Record<string, string> = {
    'xi-api-key': getApiKey(),
    ...(rest.headers as Record<string, string>),
  };
  let bodyInit: FormData | string | undefined;
  if (body instanceof FormData) {
    bodyInit = body;
  } else if (typeof body === 'string') {
    headers['Content-Type'] = 'application/json';
    bodyInit = body;
  }
  return fetch(url, {
    ...rest,
    headers,
    body: bodyInit,
  });
}

export interface CreatePvcVoiceInput {
  name: string;
  language: string;
  description?: string;
  labels?: Record<string, string>;
}

export interface CreatePvcVoiceResponse {
  voice_id: string;
}

/** Create a new PVC voice with metadata (no samples yet). */
export async function createPvcVoice(input: CreatePvcVoiceInput): Promise<string> {
  const payload = JSON.stringify({
    name: input.name,
    language: input.language,
    ...(input.description && { description: input.description }),
    ...(input.labels && { labels: input.labels }),
  });
  const res = await elevenLabsFetch('/voices/pvc', {
    method: 'POST',
    body: payload,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs create PVC failed: ${res.status} ${err}`);
  }
  const data = (await res.json()) as CreatePvcVoiceResponse;
  return data.voice_id;
}

/** Add audio samples to a PVC voice. */
export async function addSamplesToPvc(
  voiceId: string,
  files: Blob[],
  removeBackgroundNoise = false
): Promise<{ sample_ids: string[] }> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  if (removeBackgroundNoise) {
    formData.append('remove_background_noise', 'true');
  }
  const res = await elevenLabsFetch(`/voices/pvc/${voiceId}/samples`, {
    method: 'POST',
    body: formData,
    headers: {}, // FormData sets Content-Type with boundary
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs add samples failed: ${res.status} ${err}`);
  }
  const data = (await res.json()) as Array<{ sample_id?: string }>;
  const sample_ids = Array.isArray(data)
    ? data.map((s) => s.sample_id).filter((id): id is string => !!id)
    : [];
  return { sample_ids };
}

/** Get voice metadata. */
export async function getVoice(voiceId: string): Promise<{
  voice_id: string;
  name: string;
  labels?: Record<string, string>;
}> {
  const res = await elevenLabsFetch(`/voices/${voiceId}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs get voice failed: ${res.status} ${err}`);
  }
  return res.json() as Promise<{ voice_id: string; name: string; labels?: Record<string, string> }>;
}

/** Generate TTS for preview/verification. */
export async function textToSpeech(voiceId: string, text: string): Promise<ArrayBuffer> {
  const payload = JSON.stringify({ text, model_id: 'eleven_multilingual_v2' });
  const res = await elevenLabsFetch(`/text-to-speech/${voiceId}`, {
    method: 'POST',
    body: payload,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs TTS failed: ${res.status} ${err}`);
  }
  return res.arrayBuffer();
}
