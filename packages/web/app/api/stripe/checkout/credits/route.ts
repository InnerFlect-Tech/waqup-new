import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserForApi } from '@/lib/supabase-server';
import { getStripeClient } from '@/lib/stripe';
import { getCreditPackById, type CreditPackId } from '@waqup/shared/constants';

export const dynamic = 'force-dynamic';

interface CheckoutCreditsBody {
  packId: CreditPackId;
}

const PACK_PRICE_IDS: Record<CreditPackId, string | undefined> = {
  spark: process.env.NEXT_PUBLIC_STRIPE_SPARK_PRICE_ID,
  creator: process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID,
  flow: process.env.NEXT_PUBLIC_STRIPE_FLOW_PRICE_ID,
  devotion: process.env.NEXT_PUBLIC_STRIPE_DEVOTION_PACK_PRICE_ID,
};

/**
 * Creates a Stripe Checkout Session for a one-time Q credit pack purchase.
 *
 * Flow:
 *  1. Verify user is authenticated (cookies for web, Bearer token for mobile)
 *  2. Validate packId exists in shared constants
 *  3. Resolve the Stripe price ID for this pack
 *  4. Create a one-time Checkout Session
 *  5. Return the session URL — client does a full redirect
 *
 * Credits are granted by the webhook handler on checkout.session.completed,
 * NOT here — the frontend must never be trusted to grant credits.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const auth = await getAuthenticatedUserForApi(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { supabase, user } = auth;

    const body: CheckoutCreditsBody = await req.json();
    const { packId } = body;

    if (!packId) {
      return NextResponse.json({ error: 'packId is required' }, { status: 400 });
    }

    const pack = getCreditPackById(packId);
    if (!pack) {
      return NextResponse.json({ error: 'Invalid packId' }, { status: 400 });
    }

    const priceId = PACK_PRICE_IDS[packId];
    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe price not configured for pack: ${packId}` },
        { status: 503 },
      );
    }

    const stripe = getStripeClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Fetch or create Stripe Customer for idempotent lookups
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

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        userId: user.id,
        packId,
        credits: pack.credits.toString(),
        type: 'credits',
      },
      success_url: `${appUrl}/sanctuary/credits?checkout=success&pack=${packId}&credits=${pack.credits}`,
      cancel_url: `${appUrl}/get-qs?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/checkout/credits] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
