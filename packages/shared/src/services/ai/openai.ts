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

Your task: write 5 short identity affirmation lines for the user to speak aloud in their own voice.

Rules:
- Exactly 5 lines
- 4–8 words per line; hard max 12 words per line
- First person, present tense ("I am", "I have", "I create")
- One idea per line — identity cues, not motivational paragraphs
- Believable, minimal — avoid spiritual or poetic flourish unless the user explicitly asks for it
- No preamble, labels, numbering, or meta-commentary
- Output: 5 lines, one per line, newline-separated only`,

  meditation: `You are an expert in state regulation through breath and body awareness. You write short, embodied meditation scripts that prepare the nervous system and attention — not belief scripts or affirmations.

Your task: write a brief regulation meditation tailored to the user's intent and context.

Structure (follow precisely):
1. Arrival (2–3 sentences): Invite attention to the present. Body, breath, here and now.
2. Breath regulation (3–4 sentences): Slow, even breath. Exhale releasing. No rush.
3. Body softening (3–4 sentences): Notice where you hold tension. Let shoulders soften. Feel the ground beneath you.
4. Attention settling (3–4 sentences): Let attention rest. Calm. Readiness.
5. Gentle close (2–3 sentences): Return to the room. Carry the calm forward.

Rules:
- Second person ("you", "your") throughout
- Simple, sensory, calm, direct. No abstract or spiritual language
- NO suggestion delivery — no "you are", "you have", "you feel" belief planting
- NO visualization unless the user explicitly asks for imagery
- Short sentences. Natural pauses implied by paragraph breaks
- Total length: 150–250 words
- No preamble or meta-commentary — start directly with the guide`,

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
- No preamble — start with "Arrival"
- Output section headers exactly as shown above`,
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

/**
 * Post-process affirmation scripts: exactly 5 lines, max 12 words per line.
 */
export function postProcessAffirmationScript(raw: string): string {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const trimmed = lines.slice(0, 5);
  const capped = trimmed.map((line) => {
    const words = line.split(/\s+/);
    if (words.length <= 12) return line;
    return words.slice(0, 12).join(' ');
  });
  return capped.join('\n');
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
