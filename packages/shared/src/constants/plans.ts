/**
 * Subscription plans - single source of truth for pricing and credits.
 * Used by pricing page, credits page, and Stripe checkout.
 */

export type PlanId = 'starter' | 'growth' | 'devotion';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  currency: 'EUR';
  billingCycle: 'week' | 'month';
  creditsPerPeriod: number;
  description: string;
  features: string[];
  badge?: string;
  ctaLabel: string;
  trialDays?: number;
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 7,
    currency: 'EUR',
    billingCycle: 'week',
    creditsPerPeriod: 11,
    description: 'Begin your practice with a weekly commitment.',
    features: [
      '11 Qs per week',
      'All content types',
      'Voice recording',
      'Audio mixing',
    ],
    ctaLabel: 'Choose Starter',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 20,
    currency: 'EUR',
    billingCycle: 'month',
    creditsPerPeriod: 33,
    description: 'A monthly rhythm for dedicated practitioners.',
    features: [
      '33 Qs per month',
      'All content types',
      'Priority support',
    ],
    badge: 'Most Popular',
    ctaLabel: 'Start free trial',
    trialDays: 7,
  },
  {
    id: 'devotion',
    name: 'Devotion',
    price: 60,
    currency: 'EUR',
    billingCycle: 'month',
    creditsPerPeriod: 99,
    description:
      'Devotion is not a plan. It is a statement. Built for practitioners who show up every day with intention — and expect depth, precision, and priority in return.',
    features: [
      '99 Qs per month',
      'Priority AI processing',
      'Premium voice models',
      'Early access to new features',
      'Dedicated support',
    ],
    ctaLabel: 'Choose Devotion',
    trialDays: 14,
  },
];

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function formatPlanPrice(plan: Plan): string {
  const suffix = plan.billingCycle === 'week' ? '/week' : '/month';
  return `€${plan.price}${suffix}`;
}
