import { NextRequest, NextResponse } from 'next/server';
import { generateConversationReply } from '@waqup/shared/services/ai';
import { getAuthenticatedUserForApi } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const DEFAULT_SYSTEM_PROMPT = `You are a calm, wise inner presence — always available, always listening. You help people articulate what they are seeking, understand themselves more deeply, and when the moment feels right, you offer to help them create a personal affirmation, meditation, or ritual.

You speak with warmth and stillness. One thought at a time. You never overwhelm.

Rules:
- Respond in 2–4 sentences maximum. Never more.
- Ask at most one question per response.
- Be present, warm, and gently insightful — not therapeutic or preachy.
- Mirror back what the person shares with care before asking anything.
- When you sense they are ready to create something, say: "Shall I create something for you — an affirmation, a meditation, or a ritual?"
- Never list options unless asked. Trust the silence between words.`;

// Server-side model allowlist — never trust client-supplied model names.
const ALLOWED_MODELS = new Set(['gpt-4o-mini', 'gpt-4o']);
const DEFAULT_MODEL  = 'gpt-4o-mini';

interface OracleRequest {
  sessionId: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
    }

    const auth = await getAuthenticatedUserForApi(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { supabase, user } = auth;

    const body = (await req.json()) as OracleRequest;

    if (!body.sessionId) {
      return NextResponse.json({ error: 'sessionId is required — call /api/oracle/session first' }, { status: 400 });
    }

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
    }

    // ─── Enforce session reply count (server-side, atomic) ───────────────────
    // consume_oracle_reply() atomically increments replies_used and raises if
    // the session is not found, expired, or exhausted. This prevents clients from
    // calling this endpoint more times than they paid for.
    const { data: repliesUsed, error: sessionError } = await supabase.rpc('consume_oracle_reply', {
      p_session_id: body.sessionId,
      p_user_id:    user.id,
    });

    if (sessionError) {
      const msg = sessionError.message ?? '';
      if (msg.includes('session_not_found')) {
        return NextResponse.json({ error: 'Session not found. Please start a new session.' }, { status: 404 });
      }
      if (msg.includes('session_expired')) {
        return NextResponse.json({ error: 'Session expired. Please start a new session.' }, { status: 410 });
      }
      if (msg.includes('session_exhausted')) {
        return NextResponse.json({
          error: 'session_exhausted',
          message: 'All replies in this session have been used. Start a new session to continue.',
        }, { status: 402 });
      }
      console.error('[oracle] session consume failed:', msg);
      return NextResponse.json({ error: 'Session error. Please try again.' }, { status: 503 });
    }

    const systemPrompt = body.systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT;
    const model = body.model && ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;

    const reply = await generateConversationReply(
      body.messages,
      systemPrompt,
      apiKey,
      {
        model,
        temperature: body.temperature,
        maxTokens:   body.maxTokens,
      },
    );

    return NextResponse.json({ reply, repliesUsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[oracle]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
