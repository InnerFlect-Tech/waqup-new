import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateConversationReply } from '@waqup/shared/services/ai';
import { API_ROUTE_COSTS } from '@waqup/shared/constants';
import { contentTypeSchema } from '@waqup/shared/schemas';
import type { ContentItemType } from '@waqup/shared/types';
import { getAuthenticatedUserForApi } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const COST = API_ROUTE_COSTS.conversation;

const CONVERSATION_SYSTEM_PROMPTS: Record<ContentItemType, string> = {
  affirmation: `You are a supportive creation guide helping someone craft short identity affirmations. Draw out their intent — one question at a time.

Flow:
1. If no intent yet: ask what identity or behavior they want to strengthen
2. Once intent clear: ask how they want to feel or what kind of self they want to become
3. After 2 exchanges: say "I have what I need — generating your affirmations now." and include [GENERATE_SCRIPT] on its own line

Rules:
- One question at a time
- Warm, concise
- Extract: identity to strengthen, desired feeling, desired self
- Keep responses under 60 words`,

  meditation: `You are a calm creation guide helping someone design a short state-regulation meditation — breath, body, attention. Draw out their intent through precise, gentle questions — one at a time.

Flow:
1. If no intent yet: ask what state they want to regulate (calm, focus, sleep, reset, etc.)
2. Once intent clear: ask when they'll practice (morning, evening, before sleep, etc.) or how they're arriving (tired, wired, scattered, calm)
3. After 2 exchanges: say "Perfect — generating your meditation now." and include [GENERATE_SCRIPT] on its own line

Rules:
- One question at a time
- Calm, unhurried tone
- Focus on regulation, not belief change
- Keep responses under 60 words`,

  ritual: `You are a thoughtful creation guide helping someone build a daily conditioning ritual — a repeatable sequence for identity encoding. Draw out their transformation focus, values, and context through grounded questions — one at a time.

Flow:
1. If no intent yet: ask what transformation or identity shift they are working toward
2. Once intent clear: ask what core values drive this work
3. After values shared: ask why this matters to them deeply
4. After 3 exchanges: say "I have what I need — creating your daily conditioning ritual now." and include [GENERATE_SCRIPT] on its own line

Rules:
- One question at a time
- Grounded, purposeful tone
- Keep responses under 70 words`,
};

/** Language instructions prepended to system prompts for non-English locales */
const LANGUAGE_INSTRUCTION: Record<string, string> = {
  en: '',
  pt: 'Responda sempre em Português de Portugal. ',
  es: 'Responde siempre en español. ',
  fr: 'Réponds toujours en français. ',
  de: 'Antworte immer auf Deutsch. ',
};

const conversationRequestSchema = z.object({
  type: contentTypeSchema,
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    }),
  ).min(1),
  locale: z.string().optional().default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
    }

    // ─── Auth ───────────────────────────────────────────────────────────────
    const auth = await getAuthenticatedUserForApi(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { supabase, user } = auth;

    const parsed = conversationRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const body = parsed.data;

    // ─── Atomic credit deduction (before calling OpenAI) ─────────────────────
    const { error: deductError } = await supabase.rpc('deduct_credits', {
      p_user_id:     user.id,
      p_amount:      COST,
      p_description: 'conversation_reply',
    });

    if (deductError) {
      if (deductError.message?.includes('insufficient_credits')) {
        const { data: balance } = await supabase.rpc('get_credit_balance');
        return NextResponse.json(
          {
            error: 'insufficient_credits',
            message: `You need ${COST} Q to continue the conversation but have ${(balance as number) ?? 0}. Get more Qs to keep going.`,
            required: COST,
            balance: (balance as number) ?? 0,
          },
          { status: 402 },
        );
      }
      console.error('[conversation] credit deduction failed:', deductError.message);
      return NextResponse.json({ error: 'Credit service error. Please try again.' }, { status: 503 });
    }

    const langInstruction = LANGUAGE_INSTRUCTION[body.locale] ?? '';
    const systemPrompt = langInstruction + CONVERSATION_SYSTEM_PROMPTS[body.type];

    try {
      const reply = await generateConversationReply(body.messages, systemPrompt, apiKey);
      const shouldGenerateScript = reply.includes('[GENERATE_SCRIPT]');
      const cleanReply = reply.replace('[GENERATE_SCRIPT]', '').trim();
      return NextResponse.json({ reply: cleanReply, shouldGenerateScript, creditsUsed: COST });
    } catch (genErr) {
      console.error('[conversation] generation failed after credit deduction:', genErr);
      const message = genErr instanceof Error ? genErr.message : 'Generation failed';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[conversation]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
