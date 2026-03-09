import type { OrbMessage, OrbAddonKey, ConversationStep } from '../../types/orb.types';
import { AI_MODELS } from '../../constants/ai-models';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// ─── System prompt assembly ───────────────────────────────────────────────────

const ORB_BASE_PROMPT = `You are the Orb — the soul of waQup, a voice-first personal transformation app.
You guide users through creating deeply personal audio content: Affirmations, Guided Meditations, and Rituals.

Core principles:
- Conversation over forms: never ask multiple questions at once
- Be warm, present, and grounded — not corporate or generic
- Use positive, present-tense language in all content you generate
- Scripts must be believable and deeply personal to the user
- Keep responses concise unless generating a full script

Content depth:
- Affirmations: cognitive re-patterning (repetition, present tense, believability, own voice)
- Meditations: state induction (relaxed states, visualisation, hypnosis-like principles)
- Rituals: identity encoding (value alignment, emotional anchoring, ritual structure, RAS priming)

When generating a script: output ONLY the script text, no meta-commentary.
When in conversation: ask one focused question to gather what you need.`;

function buildOrbSystemPrompt(opts: {
  contentType: 'affirmation' | 'meditation' | 'ritual' | null;
  step: ConversationStep;
  userContext?: string;
  collectiveContext?: string;
}): string {
  const parts: string[] = [ORB_BASE_PROMPT];

  if (opts.contentType) {
    parts.push(`\nCurrent task: creating a ${opts.contentType}.`);
  }

  if (opts.step === 'script') {
    parts.push(
      '\nYou are now generating the final script. Output only the script — no preamble or explanation.'
    );
  }

  if (opts.userContext) {
    parts.push(
      `\n--- User's personal context (use to personalise) ---\n${opts.userContext}\n---`
    );
  }

  if (opts.collectiveContext) {
    parts.push(
      `\n--- Collective wisdom (patterns from the waQup community) ---\n${opts.collectiveContext}\n---`
    );
  }

  return parts.join('\n');
}

// ─── Main service function ────────────────────────────────────────────────────

export interface OrbChatOptions {
  messages: OrbMessage[];
  contentType: 'affirmation' | 'meditation' | 'ritual' | null;
  step: ConversationStep;
  activeAddons: OrbAddonKey[];
  userContext?: string;
  collectiveContext?: string;
  apiKey: string;
}

export interface OrbChatResult {
  reply: string;
  tokensUsed: number;
}

export async function sendOrbMessage(opts: OrbChatOptions): Promise<OrbChatResult> {
  const systemPrompt = buildOrbSystemPrompt({
    contentType: opts.contentType,
    step: opts.step,
    userContext: opts.activeAddons.includes('user_context') ? opts.userContext : undefined,
    collectiveContext: opts.activeAddons.includes('collective_wisdom')
      ? opts.collectiveContext
      : undefined,
  });

  const requestMessages = [
    { role: 'system', content: systemPrompt },
    ...opts.messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: AI_MODELS.ORB_CHAT,
      messages: requestMessages,
      temperature: 0.8,
      max_completion_tokens: opts.step === 'script' ? 800 : 300,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
    usage: { total_tokens: number };
  };

  const reply = data.choices[0]?.message?.content?.trim() ?? '';
  const tokensUsed = data.usage?.total_tokens ?? 0;

  return { reply, tokensUsed };
}
