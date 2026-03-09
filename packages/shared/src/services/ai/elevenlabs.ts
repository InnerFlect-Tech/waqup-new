/**
 * ElevenLabs API integration.
 * Uses Instant Voice Cloning (IVC) — available on all tiers including free.
 * PVC (Professional Voice Cloning) is NOT used as it requires a paid Creator plan.
 */
import { AI_MODELS } from '../../constants/ai-models';

export const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';
const ELEVENLABS_BASE = ELEVENLABS_BASE_URL;

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

export interface CreateInstantVoiceInput {
  name: string;
  files: Blob[];
  description?: string;
  removeBackgroundNoise?: boolean;
}

export interface CreateInstantVoiceResponse {
  voice_id: string;
}

/**
 * Create a new Instant Voice Clone (IVC) by uploading audio samples.
 * Available on all ElevenLabs tiers including free (up to 3 custom voices).
 * Combines voice creation + sample upload in a single API call.
 */
export async function createInstantVoice(input: CreateInstantVoiceInput): Promise<string> {
  const formData = new FormData();
  formData.append('name', input.name);
  input.files.forEach((file) => formData.append('files', file));
  if (input.description) {
    formData.append('description', input.description);
  }
  if (input.removeBackgroundNoise) {
    formData.append('remove_background_noise', 'true');
  }

  const res = await elevenLabsFetch('/voices/add', {
    method: 'POST',
    body: formData,
    headers: {},
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs create voice failed: ${res.status} ${err}`);
  }

  const data = (await res.json()) as CreateInstantVoiceResponse;
  return data.voice_id;
}

/**
 * Edit an existing IVC voice — replaces samples and/or updates name.
 * Use this to add more samples after the initial creation.
 */
export async function editVoice(
  voiceId: string,
  files: Blob[],
  removeBackgroundNoise = false
): Promise<void> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  if (removeBackgroundNoise) {
    formData.append('remove_background_noise', 'true');
  }

  const res = await elevenLabsFetch(`/voices/${voiceId}/edit`, {
    method: 'POST',
    body: formData,
    headers: {},
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs edit voice failed: ${res.status} ${err}`);
  }
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

/** Generate TTS audio for preview or content. */
export async function textToSpeech(voiceId: string, text: string, modelId?: string): Promise<ArrayBuffer> {
  const payload = JSON.stringify({ text, model_id: modelId ?? AI_MODELS.TTS_STANDARD });
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
