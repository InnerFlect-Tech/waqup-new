import { NextRequest, NextResponse } from 'next/server';
import type { ContentItemType } from '@waqup/shared/types';

/**
 * Agent mode: GPT-4o autonomously generates a complete content draft.
 * Costs 7 Qs (flat fee regardless of content type).
 * Used server-side only — API key never reaches the client.
 */

interface AgentRequest {
  type: ContentItemType;
  intent: string;
  context?: string;
  name?: string;
  coreValues?: string[];
  whyThisMatters?: string;
}

const AGENT_SYSTEM_PROMPTS: Record<ContentItemType, string> = {
  affirmation: `You are a master affirmation architect. You autonomously gather, interpret, and transform a user's intent into a complete, powerful affirmation script.

Your output must be:
- 6–8 positive, present-tense statements (one per line)
- Personally resonant and emotionally precise
- Believable — not delusional; just-out-of-reach truths
- First person ("I am", "I have", "I create")
- 100–200 words total
- NO preamble, meta-commentary, titles, or explanations — pure script only`,

  meditation: `You are an expert meditation guide and script architect. You autonomously design and write a complete guided meditation based on the user's intent.

Structure:
1. Grounding (2-3 sentences): body awareness, breath, present moment
2. Relaxation (3-4 sentences): progressive release, exhale tension
3. Visualization (4-6 sentences): vivid imagery aligned with intent
4. Suggestion (4-5 sentences): softly planted beliefs as if already true
5. Return (2-3 sentences): gentle return, carry the feeling

Voice: Second person ("you", "your"). Warm, authoritative, safe.
Length: 350-500 words.
NO preamble or meta-commentary — start directly with the guide.`,

  ritual: `You are a master ritual architect. You autonomously design and write a complete daily ritual script based on the user's transformation goals, values, and context.

Structure:
1. Opening invocation (2-3 sentences): set the space, state intention
2. Grounding (2-3 sentences): body, breath, arrive fully
3. Values declaration (3-4 sentences): "I am someone who…", "I stand for…"
4. Identity affirmations (4-6 sentences): who this person IS and is becoming
5. Emotional anchor (2-3 sentences): feel it as already real
6. Closing commitment (2-3 sentences): daily commitment, clear close signal

Voice: First person ("I", "my"). Ritualistic, poetic, ceremonial.
Weave in name, core values, and "why" naturally.
Length: 400-550 words.
NO preamble or meta-commentary — begin directly.`,
};

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

    const body = await req.json() as AgentRequest;

    if (!body.type || !body.intent) {
      return NextResponse.json({ error: 'type and intent are required' }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: AGENT_SYSTEM_PROMPTS[body.type] },
          { role: 'user', content: buildAgentUserPrompt(body) },
        ],
        temperature: 0.8,
        max_tokens: 1000,
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

    return NextResponse.json({ script });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[ai/agent]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
