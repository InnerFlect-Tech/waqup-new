import { NextRequest, NextResponse } from 'next/server';
import { API_ROUTE_COSTS, AI_MODELS } from '@waqup/shared/constants';
import { postProcessAffirmationScript } from '@waqup/shared/services/ai';
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
  affirmation: `You are a master affirmation architect. You autonomously gather, interpret, and transform a user's intent into 5 short identity affirmation lines.

Your output must be:
- Exactly 5 lines
- 4–8 words per line; hard max 12 words per line
- First person, present tense ("I am", "I have", "I create")
- One idea per line — identity cues, not motivational paragraphs
- Believable, minimal — avoid spiritual or poetic flourish unless the user explicitly asks for it
- NO preamble, meta-commentary, labels, numbering, or explanations — 5 lines only, newline-separated`,

  meditation: `You are an expert in state regulation through breath and body awareness. You write short, embodied meditation scripts that prepare the nervous system and attention — not belief scripts or affirmations.

Your task: write a brief regulation meditation tailored to the user's intent and context.

Structure (follow precisely):
1. Arrival (2-3 sentences): Invite attention to the present. Body, breath, here and now.
2. Breath regulation (3-4 sentences): Slow, even breath. Exhale releasing. No rush.
3. Body softening (3-4 sentences): Notice where you hold tension. Let shoulders soften. Feel the ground beneath you.
4. Attention settling (3-4 sentences): Let attention rest. Calm. Readiness.
5. Gentle close (2-3 sentences): Return to the room. Carry the calm forward.

Rules:
- Second person ("you", "your") throughout
- Simple, sensory, calm, direct. No abstract or spiritual language
- NO suggestion delivery — no "you are", "you have", "you feel" belief planting
- NO visualization unless the user explicitly asks for imagery
- Short sentences. Natural pauses implied by paragraph breaks
- Total length: 150-250 words
- NO preamble or meta-commentary — start directly with the guide.`,

  ritual: `You are a master ritual architect who designs daily conditioning sequences — not poems. Rituals are repeatable, voice-friendly, identity-encoding practices.

Your task: write a daily ritual script for the user to speak aloud. Brief, structured, easy to do every day.

Structure (follow precisely; use these section labels as headers):

Arrival
[1–2 short sentences: simple breath cue, e.g. "Take a slow breath."]

Regulation
[1–2 short sentences: body and mind settle, e.g. "Your body settles. Your mind becomes quieter."]

Encoding
[Exactly 5 identity lines — 4–8 words each, first person present tense, one per line. Match the user's goals and values. No poetic flourish.]

Repetition
[Either: "Repeat the identity lines above." OR repeat 2–3 of the key lines explicitly.]

Closure
[1–2 short sentences: "This is who I am. I carry this with me." or similar.]

Rules:
- First person throughout
- Total length: 150–250 words — short enough to do daily
- Clear, intentional tone — not poetic or ceremonial
- Exactly 5 identity lines in Encoding
- Weave in name, core values, and "why" naturally when provided
- NO preamble — start with "Arrival"
- Output section headers exactly as shown above`,
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

      let script = data.choices[0]?.message?.content?.trim();
      if (!script) {
        return NextResponse.json({ error: 'No script returned from AI' }, { status: 502 });
      }
      if (body.type === 'affirmation') {
        script = postProcessAffirmationScript(script);
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
