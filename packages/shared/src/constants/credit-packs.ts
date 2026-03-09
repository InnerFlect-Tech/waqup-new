/**
 * One-time Q credit pack constants — single source of truth.
 *
 * Packs differ from subscriptions: credits are permanent (never expire)
 * and are purchased once rather than on a recurring schedule.
 * Price per Q is intentionally higher than subscriptions to incentivise
 * the monthly rhythm while remaining accessible for casual creators.
 */

export type CreditPackId = 'spark' | 'creator' | 'flow' | 'devotion';

export interface CreditPack {
  id: CreditPackId;
  name: string;
  credits: number;
  price: number;
  currency: 'EUR';
  /** Rounded price per Q in euros */
  pricePerQ: number;
  badge?: string;
  description: string;
  ctaLabel: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'spark',
    name: 'Spark',
    credits: 70,
    price: 6.99,
    currency: 'EUR',
    pricePerQ: 0.10,
    description: 'Try your first affirmations, meditations, or rituals. Perfect for exploring.',
    ctaLabel: 'Get 70 Qs',
  },
  {
    id: 'creator',
    name: 'Creator',
    credits: 155,
    price: 14.99,
    currency: 'EUR',
    pricePerQ: 0.097,
    badge: 'Best Value',
    description: 'Create content regularly without running out. Most popular choice.',
    ctaLabel: 'Get 155 Qs',
  },
  {
    id: 'flow',
    name: 'Flow',
    credits: 316,
    price: 29.99,
    currency: 'EUR',
    pricePerQ: 0.095,
    description: 'Deep creative sessions. Build a full library without pause.',
    ctaLabel: 'Get 316 Qs',
  },
  {
    id: 'devotion',
    name: 'Devotion',
    credits: 668,
    price: 59.99,
    currency: 'EUR',
    pricePerQ: 0.09,
    description: 'Maximum creative power. Never runs dry. Best per-Q value.',
    ctaLabel: 'Get 668 Qs',
  },
];

export function getCreditPackById(id: CreditPackId): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id);
}

export function formatPackPrice(pack: CreditPack): string {
  return `€${pack.price.toFixed(2)}`;
}

/** Baseline pack (Spark) — used to compute discount and savings. */
const BASELINE_PACK = CREDIT_PACKS[0]!;

/** Price per Q at baseline (first pack) rate. */
const BASELINE_PRICE_PER_Q = BASELINE_PACK.price / BASELINE_PACK.credits;

/**
 * Returns discount % and € saved vs baseline pack (Spark).
 * First pack returns null (no discount).
 */
export function getPackSavings(pack: CreditPack): { discountPercent: number; savedEuros: number } | null {
  if (pack.id === BASELINE_PACK.id) return null;
  const wouldCostAtBaseline = pack.credits * BASELINE_PRICE_PER_Q;
  const savedEuros = wouldCostAtBaseline - pack.price;
  const discountPercent = Math.round((savedEuros / wouldCostAtBaseline) * 100);
  return { discountPercent, savedEuros: Math.round(savedEuros * 100) / 100 };
}
