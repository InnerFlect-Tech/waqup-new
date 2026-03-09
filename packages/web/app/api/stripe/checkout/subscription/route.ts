import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getStripeClient } from '@/lib/stripe';
import { getPlanById, type PlanId } from '@waqup/shared/constants';

export const dynamic = 'force-dynamic';

interface CheckoutSubscriptionBody {
  priceId: string;
  planId: PlanId;
}

/**
 * Creates a Stripe Checkout Session for a subscription plan.
 *
 * Flow:
 *  1. Verify user is authenticated
 *  2. Validate planId exists in shared constants
 *  3. Upsert a Stripe Customer linked to this user (store on profiles)
 *  4. Create a Checkout Session with trial period (if plan has one)
 *  5. Return the session URL — client does a full redirect, no iframe
 *
 * Stripe is source of truth; Supabase state is updated by the webhook handler.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CheckoutSubscriptionBody = await req.json();
    const { priceId, planId } = body;

    if (!priceId || !planId) {
      return NextResponse.json({ error: 'priceId and planId are required' }, { status: 400 });
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid planId' }, { status: 400 });
    }

    const stripe = getStripeClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Fetch or create Stripe Customer linked to this user
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let stripeCustomerId: string | undefined = profile?.stripe_customer_id ?? undefined;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabaseUserId: user.id },
      });
      stripeCustomerId = customer.id;

      // Persist customer ID — non-fatal if it fails (webhook will retry)
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id);
    }

    const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
      metadata: { userId: user.id, planId },
      ...(plan.trialDays ? { trial_period_days: plan.trialDays } : {}),
    };

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        userId: user.id,
        planId,
        type: 'subscription',
      },
      subscription_data: subscriptionData,
      success_url: `${appUrl}/sanctuary?checkout=success&plan=${planId}`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/checkout/subscription] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
