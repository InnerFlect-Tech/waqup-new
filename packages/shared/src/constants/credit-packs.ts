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
    credits: 25,
    price: 7,
    currency: 'EUR',
    pricePerQ: 0.28,
    description: 'A handful of Qs to get you started.',
    ctaLabel: 'Get 25 Qs',
  },
  {
    id: 'creator',
    name: 'Creator',
    credits: 60,
    price: 15,
    currency: 'EUR',
    pricePerQ: 0.25,
    badge: 'Best Value',
    description: 'The sweet spot for regular creators.',
    ctaLabel: 'Get 60 Qs',
  },
  {
    id: 'flow',
    name: 'Flow',
    credits: 120,
    price: 28,
    currency: 'EUR',
    pricePerQ: 0.23,
    description: 'For those in full creative flow.',
    ctaLabel: 'Get 120 Qs',
  },
  {
    id: 'devotion',
    name: 'Devotion Pack',
    credits: 300,
    price: 60,
    currency: 'EUR',
    pricePerQ: 0.20,
    description: 'Maximum creative power. Never runs dry.',
    ctaLabel: 'Get 300 Qs',
  },
];

export function getCreditPackById(id: CreditPackId): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id);
}

export function formatPackPrice(pack: CreditPack): string {
  return `€${pack.price}`;
}
