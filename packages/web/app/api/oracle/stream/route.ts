import { NextRequest } from 'next/server';
import { AI_MODELS } from '@waqup/shared/constants';
import { ELEVENLABS_BASE_URL } from '@waqup/shared/services';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/oracle/stream
 *
 * Streaming oracle response pipeline:
 *  1. Validate session (atomic reply consume via DB)
 *  2. Stream OpenAI response as text deltas via SSE
 *  3. Once text is complete, stream ElevenLabs TTS audio as base64 SSE chunks
 *
 * SSE event types:
 *  {"type":"session_info","repliesUsed":N,"repliesTotal":M}
 *  {"type":"text_delta","content":"..."}   — one or more as OpenAI streams
 *  {"type":"text_done","content":"<full>"} — full reply text (for transcript)
 *  {"type":"audio_chunk","data":"<base64>","done":false}
 *  {"type":"audio_done"}
 *  {"type":"error","message":"..."}
 *
 * Client renders text deltas live, feeds audio chunks to Web Audio API for
 * real-time orb visualization and playback.
 */

const DEFAULT_SYSTEM_PROMPT = `You are a calm, wise inner presence — always available, always listening. You help people articulate what they are seeking, understand themselves more deeply, and when the moment feels right, you offer to help them create a personal affirmation, meditation, or ritual.

You speak with warmth and stillness. One thought at a time. You never overwhelm.

Rules:
- Respond in 2–4 sentences maximum. Never more.
- Ask at most one question per response.
- Be present, warm, and gently insightful — not therapeutic or preachy.
- Mirror back what the person shares with care before asking anything.
- When you sense they are ready to create something, say: "Shall I create something for you — an affirmation, a meditation, or a ritual?"
- Never list options unless asked. Trust the silence between words.`;

const ALLOWED_MODELS  = new Set(['gpt-4o-mini', 'gpt-4o']);
const DEFAULT_MODEL   = 'gpt-4o-mini';
const MAX_TEXT_LENGTH = 2000;

const DEFAULT_VOICE_SETTINGS = {
  stability:         0.5,
  similarity_boost:  0.75,
  style:             0.0,
  use_speaker_boost: true,
  speed:             1.0,
};

/** ElevenLabs Rachel — calm, premade voice; used when client has no voice configured */
const FALLBACK_ORACLE_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

/** Language instructions for the Oracle (Speak) session */
const LANGUAGE_INSTRUCTION: Record<string, string> = {
  en: '',
  pt: 'Responda sempre em Português do Brasil. ',
  es: 'Responde siempre en español. ',
  fr: 'Réponds toujours en français. ',
  de: 'Antworte immer auf Deutsch. ',
};

interface StreamRequest {
  sessionId: string;
  messages:  Array<{ role: 'user' | 'assistant'; content: string }>;
  voiceId:   string;
  systemPrompt?:    string;
  model?:           string;
  temperature?:     number;
  maxTokens?:       number;
  locale?:          string;
  voiceSettings?: {
    stability?:        number;
    similarity_boost?: number;
    style?:            number;
    use_speaker_boost?: boolean;
    speed?:            number;
  };
}

function sse(event: Record<string, unknown>): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(req: NextRequest) {
  const apiKey      = process.env.OPENAI_API_KEY;
  const elApiKey    = process.env.ELEVENLABS_API_KEY;

  if (!apiKey || !elApiKey) {
    return new Response(sse({ type: 'error', message: 'AI services not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(sse({ type: 'error', message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  let body: StreamRequest;
  try {
    body = (await req.json()) as StreamRequest;
  } catch {
    return new Response(sse({ type: 'error', message: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  if (!body.sessionId || !body.messages) {
    return new Response(sse({ type: 'error', message: 'sessionId and messages are required' }), {
      status: 400,
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  // Use client voice if configured (admin/oracle); otherwise fallback to calm premade voice
  const voiceId = (body.voiceId?.trim() || process.env.DEFAULT_ORACLE_VOICE_ID || FALLBACK_ORACLE_VOICE_ID);

  const stream  = new TransformStream<Uint8Array, Uint8Array>();
  const writer  = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const write = async (event: Record<string, unknown>) => {
    try {
      await writer.write(encoder.encode(sse(event)));
    } catch {
      // Client disconnected
    }
  };

  // Run the pipeline in the background, return the SSE stream immediately.
  (async () => {
    try {
      // ─── 1. Validate session (atomic, server-enforced reply count) ───────────
      const { data: repliesUsed, error: sessionError } = await supabase.rpc('consume_oracle_reply', {
        p_session_id: body.sessionId,
        p_user_id:    user.id,
      });

      if (sessionError) {
        const msg = sessionError.message ?? '';
        if (msg.includes('session_not_found')) {
          await write({ type: 'error', message: 'Session not found. Please start a new session.', code: 'session_not_found' });
          return;
        }
        if (msg.includes('session_expired')) {
          await write({ type: 'error', message: 'Session expired. Please start a new session.', code: 'session_expired' });
          return;
        }
        if (msg.includes('session_exhausted')) {
          await write({ type: 'error', message: 'All replies used. Start a new session to continue.', code: 'session_exhausted' });
          return;
        }
        await write({ type: 'error', message: 'Session error. Please try again.', code: 'session_error' });
        return;
      }

      // Fetch session totals for UI display.
      const { data: sessionRow } = await supabase
        .from('oracle_sessions')
        .select('replies_total')
        .eq('id', body.sessionId)
        .single();

      await write({
        type:         'session_info',
        repliesUsed:  repliesUsed as number,
        repliesTotal: (sessionRow as { replies_total: number } | null)?.replies_total ?? 0,
      });

      // ─── 2. Stream OpenAI response ───────────────────────────────────────────
      const model      = body.model && ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
      const langInstruction = LANGUAGE_INSTRUCTION[body.locale ?? 'en'] ?? '';
      const baseSystemText = body.systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT;
      const systemText = langInstruction ? `${langInstruction}${baseSystemText}` : baseSystemText;

      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          stream: true,
          messages: [
            { role: 'system', content: systemText },
            ...body.messages,
          ],
          temperature:        body.temperature  ?? 0.7,
          max_completion_tokens: body.maxTokens ?? 400,
        }),
      });

      if (!openaiRes.ok || !openaiRes.body) {
        const errText = await openaiRes.text();
        console.error('[oracle/stream] OpenAI error:', openaiRes.status, errText);
        await write({ type: 'error', message: `LLM error: ${openaiRes.status}` });
        return;
      }

      let fullText   = '';
      const decoder  = new TextDecoder();
      const reader   = openaiRes.body.getReader();

      // Parse OpenAI SSE chunks and forward text deltas.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') break;

          try {
            const parsed = JSON.parse(payload) as {
              choices: Array<{ delta: { content?: string }; finish_reason?: string }>;
            };
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              await write({ type: 'text_delta', content: delta });
            }
          } catch {
            // Incomplete JSON chunk — normal at stream boundaries, skip.
          }
        }
      }

      if (!fullText.trim()) {
        await write({ type: 'error', message: 'Empty response from AI' });
        return;
      }

      await write({ type: 'text_done', content: fullText.trim() });

      // ─── 3. Stream ElevenLabs TTS audio ─────────────────────────────────────
      // Clamp text length to avoid runaway ElevenLabs costs.
      const ttsText   = fullText.trim().slice(0, MAX_TEXT_LENGTH);
      const vSettings = { ...DEFAULT_VOICE_SETTINGS, ...(body.voiceSettings ?? {}) };

      const elUrl = `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3`;

      const elRes = await fetch(elUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key':   elApiKey,
        },
        body: JSON.stringify({
          text:     ttsText,
          model_id: AI_MODELS.TTS_REALTIME,
          voice_settings: vSettings,
        }),
      });

      if (!elRes.ok || !elRes.body) {
        const errText = await elRes.text();
        console.error('[oracle/stream] ElevenLabs error:', elRes.status, errText);
        // Text was already sent; audio failure is non-fatal — let client use fallback TTS.
        await write({ type: 'audio_error', message: `TTS unavailable: ${elRes.status}` });
        await write({ type: 'audio_done' });
        return;
      }

      // Pipe ElevenLabs audio stream as base64 chunks.
      const audioReader  = elRes.body.getReader();
      const CHUNK_SIZE   = 4096; // ~5.5KB base64 per chunk — good balance of frequency vs size
      let   audioBuffer  = new Uint8Array(0);

      while (true) {
        const { done, value } = await audioReader.read();
        if (done) break;

        // Accumulate into buffer, emit when we have enough.
        const merged = new Uint8Array(audioBuffer.length + value.length);
        merged.set(audioBuffer);
        merged.set(value, audioBuffer.length);
        audioBuffer = merged;

        while (audioBuffer.length >= CHUNK_SIZE) {
          const slice = audioBuffer.slice(0, CHUNK_SIZE);
          audioBuffer = audioBuffer.slice(CHUNK_SIZE);
          await write({
            type: 'audio_chunk',
            data: Buffer.from(slice).toString('base64'),
            done: false,
          });
        }
      }

      // Flush any remaining audio bytes.
      if (audioBuffer.length > 0) {
        await write({
          type: 'audio_chunk',
          data: Buffer.from(audioBuffer).toString('base64'),
          done: false,
        });
      }

      await write({ type: 'audio_done' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Stream error';
      console.error('[oracle/stream] pipeline error:', message);
      await write({ type: 'error', message });
    } finally {
      try {
        await writer.close();
      } catch {
        // Already closed
      }
    }
  })();

  return new Response(stream.readable, {
    status: 200,
    headers: {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      Connection:          'keep-alive',
    },
  });
}
