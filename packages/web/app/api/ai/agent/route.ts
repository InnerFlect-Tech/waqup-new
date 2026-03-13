import { NextRequest, NextResponse } from 'next/server';
import { API_ROUTE_COSTS, AI_MODELS } from '@waqup/shared/constants';
import { getAuthenticatedUserForApi } from '@/lib/supabase-server';
import type { ContentItemType } from '@waqup/shared/types';

export const dynamic = 'force-dynamic';

/**
 * Agent mode: GPT-4o autonomously generates a complete content draft.
 * Costs 7 Qs (flat fee regardless of content type).
 * Used server-side only — API key never reaches the client.
 */

const COST = API_ROUTE_COSTS.aiAgent;
const MAX_INTENT_LENGTH = 2000;

interface AgentRequest {
  type: ContentItemType;
  intent: string;
  context?: string;
  name?: string;
  coreValues?: string[];
  whyThisMatters?: string;
}

const AGENT_SYSTEM_PROMPTS: Record<ContentItemType, string> = {
  affirmation: `You are a master affirmation writer grounded in cognitive behavioural science and positive psychology.

Your task: write a personal affirmation script for the user to speak aloud in their own voice.

Rules:
- Positive framing only — describe what IS, never what isn't
- Present tense only — "I am", "I have", never "I will"
- Believable and gradual — statements must feel true or just-out-of-reach, never delusional
- Personal and specific — reference the user's intent precisely
- Emotionally resonant — each statement should land with feeling
- Format: 6–8 statements, each on its own line, written in first person
- Length: 100–200 words
- No preamble, no meta-commentary — just the statements`,

  meditation: `You are an expert meditation guide skilled in hypnotherapy-adjacent language, visualization, and state induction.

Your task: write a guided meditation script tailored to the user's intent and context.

Structure (follow this precisely):
1. Grounding (2–3 sentences): Bring awareness to the body, breath, sensations. Present-tense, sensory language.
2. Relaxation induction (3–5 sentences): Progressive release — each exhale releasing tension. Use second person ("you", "your").
3. Visualization (4–6 sentences): Vivid, emotionally charged imagery aligned with the user's intent.
4. Suggestion delivery (4–6 sentences): Softly planted beliefs and feelings as if already true — "you are", "you have", "you feel".
5. Return and close (2–3 sentences): Gently return to awareness, carry the feeling forward.

Rules:
- Second person ("you", "your") throughout
- Slow pacing — short sentences, natural pauses implied by paragraph breaks
- Language should feel warm, authoritative, and safe
- Total length: 300–500 words
- No preamble or meta-commentary — start directly with the guide`,

  ritual: `You are a master ritual architect who understands identity-level behaviour change, habit formation, and the power of personal ceremony.

Your task: write a daily ritual script for the user to speak aloud — a practice that combines grounding, affirmation, and emotional anchoring.

Structure (follow this precisely):
1. Opening invocation (2–3 sentences): Set the space. The user addresses themselves by name if provided. Statement of intention.
2. Grounding (2–3 sentences): Body and breath. Arrive fully.
3. Values declaration (3–4 sentences): Name and claim the core values provided. "I am someone who…", "I stand for…"
4. Identity affirmations (4–6 sentences): Who this person IS and is becoming — referenced to their goals and why. Present tense, first person.
5. Emotional anchor (2–3 sentences): Evoke the feeling of already living this reality. Visceral and real.
6. Closing commitment (2–3 sentences): A brief daily commitment. End with a clear signal that the ritual is complete.

Rules:
- First person ("I", "my") throughout
- Weave in the user's name, core values, and "why" naturally — don't just list them
- Ritualistic, poetic tone — this is ceremony, not a to-do list
- Total length: 350–550 words
- No preamble or meta-commentary — begin directly`,
};

const ALLOWED_MODELS = new Set([AI_MODELS.AGENT, 'gpt-4o', 'gpt-4o-mini']);

function buildAgentUserPrompt(req: AgentRequest): string {
  const lines = [`Intent: ${req.intent}`];
  if (req.context) lines.push(`Context: ${req.context}`);
  if (req.name) lines.push(`Name: ${req.name}`);
  if (req.coreValues?.length) lines.push(`Core values: ${req.coreValues.join(', ')}`);
  if (req.whyThisMatters) lines.push(`Why this matters: ${req.whyThisMatters}`);
  return lines.join('\n');
}

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

    const body = await req.json() as AgentRequest;

    if (!body.type || !body.intent) {
      return NextResponse.json({ error: 'type and intent are required' }, { status: 400 });
    }

    if (body.intent.length > MAX_INTENT_LENGTH) {
      return NextResponse.json(
        { error: `intent must be ${MAX_INTENT_LENGTH} characters or fewer` },
        { status: 400 },
      );
    }

    // ─── Atomic credit deduction (before calling GPT-4o) ─────────────────────
    const { error: deductError } = await supabase.rpc('deduct_credits', {
      p_user_id:     user.id,
      p_amount:      COST,
      p_description: 'ai_agent_generation',
    });

    if (deductError) {
      if (deductError.message?.includes('insufficient_credits')) {
        const { data: balance } = await supabase.rpc('get_credit_balance');
        return NextResponse.json(
          {
            error: 'insufficient_credits',
            message: `AI Agent (GPT-4o) costs ${COST} Qs but you have ${(balance as number) ?? 0}. Get more Qs to continue.`,
            required: COST,
            balance: (balance as number) ?? 0,
          },
          { status: 402 },
        );
      }
      console.error('[ai/agent] credit deduction failed:', deductError.message);
      return NextResponse.json({ error: 'Credit service error. Please try again.' }, { status: 503 });
    }

    // Use canonical model; ignore any client-supplied model override to prevent
    // cost inflation from a malicious client requesting gpt-4 instead of gpt-4o-mini.
    const model = ALLOWED_MODELS.has(body.type) ? AI_MODELS.AGENT : AI_MODELS.AGENT;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: AGENT_SYSTEM_PROMPTS[body.type] },
            { role: 'user', content: buildAgentUserPrompt(body) },
          ],
          temperature: 0.8,
          max_completion_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('[ai/agent] OpenAI error:', response.status, err);
        return NextResponse.json({ error: `AI generation failed: ${response.status}` }, { status: 502 });
      }

      const data = await response.json() as {
        choices: Array<{ message: { content: string } }>;
      };

      const script = data.choices[0]?.message?.content?.trim();
      if (!script) {
        return NextResponse.json({ error: 'No script returned from AI' }, { status: 502 });
      }

      return NextResponse.json({ script, creditsUsed: COST });
    } catch (genErr) {
      console.error('[ai/agent] generation failed after credit deduction:', genErr);
      const message = genErr instanceof Error ? genErr.message : 'Generation failed';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[ai/agent]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
