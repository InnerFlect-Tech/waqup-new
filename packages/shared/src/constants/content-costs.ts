/**
 * Content creation credit costs - single source of truth.
 *
 * Creation modes:
 *  - form:  User fills structured fields. Cost = base (voice cost only).
 *  - chat:  GPT-4o-mini conversation guides creation. Flat fee = 3 Qs.
 *  - agent: GPT-4o autonomous agent drafts content. Flat fee = 7 Qs.
 *
 * Voice cost is added on top when using AI voice (ElevenLabs TTS).
 */

import type { ContentItemType } from '../types/content';

export type { ContentItemType };

export type CreationMode = 'form' | 'chat' | 'agent';

export const CONTENT_CREDIT_COSTS = {
  affirmation: { base: 1, withAi: 2 },
  meditation: { base: 2, withAi: 4 },
  ritual: { base: 5, withAi: 10 },
} as const;

/** Flat AI mode fees (applied regardless of content type) */
export const AI_MODE_COSTS: Record<CreationMode, number> = {
  form: 0,
  chat: 3,
  agent: 7,
} as const;

/**
 * Total credit cost for a creation:
 *  = AI mode fee + voice cost (if AI voice used)
 */
export function getCreditCost(
  type: ContentItemType,
  mode: CreationMode,
  useAiVoice: boolean,
): number {
  const voiceCost = useAiVoice ? CONTENT_CREDIT_COSTS[type].withAi : CONTENT_CREDIT_COSTS[type].base;
  return AI_MODE_COSTS[mode] + voiceCost;
}

/** Backward-compatible overload for code that passes boolean */
export function getCreditCostLegacy(type: ContentItemType, useAiVoice: boolean): number {
  const costs = CONTENT_CREDIT_COSTS[type];
  return useAiVoice ? costs.withAi : costs.base;
}
