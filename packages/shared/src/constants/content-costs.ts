/**
 * Content creation credit costs - single source of truth.
 * Base = own voice (recorded or ElevenLabs cloned). With AI = AI-generated voice (2x).
 */

import type { ContentItemType } from '../types/content';

export type { ContentItemType };

export const CONTENT_CREDIT_COSTS = {
  affirmation: { base: 1, withAi: 2 },
  meditation: { base: 2, withAi: 4 },
  ritual: { base: 5, withAi: 10 },
} as const;

export function getCreditCost(type: ContentItemType, useAiVoice: boolean): number {
  const costs = CONTENT_CREDIT_COSTS[type];
  return useAiVoice ? costs.withAi : costs.base;
}
