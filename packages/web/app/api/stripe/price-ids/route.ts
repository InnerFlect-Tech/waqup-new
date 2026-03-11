import { NextResponse } from 'next/server';
import type { PlanId } from '@waqup/shared/constants';

export const dynamic = 'force-dynamic';

/**
 * Returns Stripe price IDs for subscription plans from server env at runtime.
 * Use this instead of NEXT_PUBLIC_* at build time so production always uses
 * the env vars configured in Vercel (no stale build cache).
 */
export async function GET(): Promise<NextResponse> {
  const subscription: Record<PlanId, string> = {
    starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
    growth: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID || '',
    devotion: process.env.NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID || '',
  };
  return NextResponse.json(subscription);
}
