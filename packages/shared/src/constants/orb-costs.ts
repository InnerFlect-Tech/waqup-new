import type { OrbAddonKey } from '../types/orb.types';

/**
 * Q credit costs for each Orb add-on action.
 * These mirror the seed values in 002_orb_system.sql and are used
 * client-side to show the cost preview before the user consents.
 */
export const ORB_ADDON_COSTS: Record<OrbAddonKey, number> = {
  base_llm: 1,
  user_context: 1,
  collective_wisdom: 1,
} as const;

export const ORB_ADDON_LABELS: Record<OrbAddonKey, string> = {
  base_llm: 'Orb responds',
  user_context: 'Access your personal journey',
  collective_wisdom: 'Draw from the collective',
} as const;

export const ORB_ADDON_DESCRIPTIONS: Record<OrbAddonKey, string> = {
  base_llm: 'Core LLM response — always active',
  user_context: 'Orb reads your past content and preferences to personalise its response',
  collective_wisdom: 'Orb accesses patterns across the waQup community for deeper guidance',
} as const;

/** Calculate total Q cost for a set of add-ons */
export function calcOrbCost(addons: OrbAddonKey[]): number {
  return addons.reduce((sum, key) => sum + (ORB_ADDON_COSTS[key] ?? 0), 0);
}
