import type { ContentItemType } from '../../types/content';
import { AI_MODELS } from '../../constants/ai-models';

export interface ScriptGenerationInput {
  type: ContentItemType;
  intent: string;
  context?: string;
  personalization?: {
    coreValues?: string[];
    name?: string;
    whyThisMatters?: string;
  };
}

const SYSTEM_PROMPTS: Record<ContentItemType, string> = {
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

function buildUserPrompt(input: ScriptGenerationInput): string {
  const { type, intent, context, personalization } = input;
  const parts: string[] = [`Intent: ${intent}`];

  if (context) parts.push(`Context: ${context}`);

  if (personalization) {
    if (personalization.name) parts.push(`Name: ${personalization.name}`);
    if (personalization.coreValues?.length) parts.push(`Core values: ${personalization.coreValues.join(', ')}`);
    if (personalization.whyThisMatters) parts.push(`Why this matters: ${personalization.whyThisMatters}`);
  }

  return `Please write a ${type} script for someone with the following details:\n\n${parts.join('\n')}`;
}

export async function generateScript(
  input: ScriptGenerationInput,
  apiKey: string,
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: AI_MODELS.SCRIPT_GENERATION,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[input.type] },
        { role: 'user', content: buildUserPrompt(input) },
      ],
      temperature: 0.75,
      max_completion_tokens: 800,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error('No content returned from OpenAI');
  return content.trim();
}

export interface ConversationReplyOptions {
  model?:            string;
  temperature?:      number;
  maxTokens?:        number;
  topP?:             number;
  presencePenalty?:  number;
  frequencyPenalty?: number;
  seed?:             number | null;
  stop?:             string[];
}

export async function generateConversationReply(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string,
  apiKey: string,
  options: ConversationReplyOptions = {},
): Promise<string> {
  const {
    model            = AI_MODELS.CONVERSATION,
    temperature      = 0.7,
    maxTokens        = 400,
    topP,
    presencePenalty,
    frequencyPenalty,
    seed,
    stop,
  } = options;

  const body: Record<string, unknown> = {
    model,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    temperature,
    max_completion_tokens: maxTokens,
  };

  if (topP             !== undefined) body.top_p              = topP;
  if (presencePenalty  !== undefined) body.presence_penalty   = presencePenalty;
  if (frequencyPenalty !== undefined) body.frequency_penalty  = frequencyPenalty;
  if (seed             !== null && seed !== undefined) body.seed = seed;
  if (stop             && stop.length > 0)            body.stop = stop.slice(0, 4);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error('No content returned from OpenAI');
  return content.trim();
}
