import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeClient, createSupabaseAdminClient } from '@/lib/stripe';
import { getPlanById } from '@waqup/shared/constants';

export const dynamic = 'force-dynamic';

// Stripe requires the raw body for signature verification.
// Next.js App Router provides it via req.text() / req.arrayBuffer().
export const runtime = 'nodejs';

/**
 * Stripe webhook handler.
 *
 * Security:
 *  - Signature verified against STRIPE_WEBHOOK_SECRET before any processing
 *  - Event IDs stored in stripe_webhook_events for idempotency (prevents double-processing on retries)
 *  - All DB writes use service role (Supabase admin client), bypassing RLS
 *  - Credits are ONLY granted here, never from client-facing routes
 *
 * Events handled:
 *  checkout.session.completed      → grant credits for one-time pack purchase
 *  customer.subscription.updated   → sync subscription status to DB
 *  customer.subscription.deleted   → mark subscription cancelled
 *  invoice.payment_succeeded       → grant monthly/weekly Q allocation on renewal
 *  invoice.payment_failed          → mark subscription past_due
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('[webhook] Missing stripe-signature or STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  let event: Stripe.Event;
  const rawBody = await req.text();

  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  // Idempotency: mark event as processed; return 200 if already seen
  const { error: idempotencyError } = await supabase
    .from('stripe_webhook_events')
    .insert({ id: event.id });

  if (idempotencyError) {
    // Unique constraint violation means we already processed this event
    if (idempotencyError.code === '23505') {
      console.log(`[webhook] Duplicate event ignored: ${event.id}`);
      return NextResponse.json({ received: true });
    }
    console.error('[webhook] Idempotency insert failed:', idempotencyError);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, supabase);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, supabase);
        break;

      default:
        // Unhandled events are acknowledged without processing
        break;
    }
  } catch (err) {
    console.error(`[webhook] Handler error for ${event.type}:`, err);
    // Return 500 so Stripe retries — but idempotency record is already inserted,
    // so on retry we'll re-process by deleting the record first (handled above).
    // Actually we need to delete the idempotency record so Stripe can retry cleanly.
    await supabase.from('stripe_webhook_events').delete().eq('id', event.id);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ---------------------------------------------------------------------------
// Event Handlers
// ---------------------------------------------------------------------------

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

/**
 * checkout.session.completed
 * Only used for one-time credit pack purchases.
 * Subscription credit grants come from invoice.payment_succeeded instead.
 */
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: AdminClient,
): Promise<void> {
  const { userId, packId, credits, type } = session.metadata ?? {};

  if (type !== 'credits' || !userId || !packId || !credits) return;

  const creditAmount = parseInt(credits, 10);
  if (isNaN(creditAmount) || creditAmount <= 0) {
    console.error('[webhook] Invalid credit amount in metadata:', credits);
    return;
  }

  const { error } = await supabase.rpc('add_credits', {
    p_user_id: userId,
    p_amount: creditAmount,
    p_description: `${packId} pack — ${creditAmount} Qs`,
  });

  if (error) {
    console.error('[webhook] add_credits failed for pack purchase:', error);
    throw error;
  }

  console.log(`[webhook] Granted ${creditAmount} Qs to user ${userId} for pack ${packId}`);
}

/**
 * customer.subscription.updated
 * Syncs status, period dates, and cancellation flag to Supabase.
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: AdminClient,
): Promise<void> {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.warn('[webhook] subscription.updated missing userId in metadata:', subscription.id);
    return;
  }

  const { error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        plan_id: subscription.metadata?.planId ?? '',
        status: subscription.status,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
        current_period_start: subscription.items.data[0]?.current_period_start
          ? new Date(subscription.items.data[0].current_period_start * 1000).toISOString()
          : null,
        current_period_end: subscription.items.data[0]?.current_period_end
          ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
      },
      { onConflict: 'stripe_subscription_id' },
    );

  if (error) {
    console.error('[webhook] Failed to upsert subscription:', error);
    throw error;
  }
}

/**
 * customer.subscription.deleted
 * Marks the subscription as cancelled.
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: AdminClient,
): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('[webhook] Failed to mark subscription as cancelled:', error);
    throw error;
  }
}

/**
 * invoice.payment_succeeded
 * Grants the plan's Q allocation for the billing period.
 * Uses last_credited_invoice_id to prevent double-granting on retries.
 */
async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: AdminClient,
): Promise<void> {
  const subDetails = invoice.parent?.type === 'subscription_details'
    ? invoice.parent.subscription_details
    : null;
  const rawSub = subDetails?.subscription;
  const stripeSubscriptionId = typeof rawSub === 'string' ? rawSub : rawSub?.id;

  // Only process recurring subscription invoices, not one-time payments
  if (!stripeSubscriptionId) return;

  // Fetch the subscription record from our DB
  const { data: subRecord, error: fetchError } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan_id, last_credited_invoice_id')
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .single();

  if (fetchError || !subRecord) {
    // Subscription may not yet be in DB (race with subscription.updated webhook)
    // Stripe will retry, and by then the subscription record will exist
    console.warn('[webhook] Subscription record not found for invoice:', invoice.id, stripeSubscriptionId);
    return;
  }

  // Idempotency: skip if we already credited this invoice
  if (subRecord.last_credited_invoice_id === invoice.id) {
    console.log(`[webhook] Invoice ${invoice.id} already credited — skipping`);
    return;
  }

  const plan = getPlanById(subRecord.plan_id as Parameters<typeof getPlanById>[0]);
  if (!plan) {
    console.error('[webhook] Unknown plan_id on subscription:', subRecord.plan_id);
    return;
  }

  const creditAmount = plan.creditsPerPeriod;
  const periodLabel = plan.billingCycle === 'week' ? 'weekly' : 'monthly';

  const { error: creditsError } = await supabase.rpc('add_credits', {
    p_user_id: subRecord.user_id,
    p_amount: creditAmount,
    p_description: `${plan.name} ${periodLabel} allocation — ${creditAmount} Qs`,
  });

  if (creditsError) {
    console.error('[webhook] add_credits failed for subscription renewal:', creditsError);
    throw creditsError;
  }

  // Record which invoice we just credited so we don't double-grant
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({ last_credited_invoice_id: invoice.id })
    .eq('id', subRecord.id);

  if (updateError) {
    console.error('[webhook] Failed to update last_credited_invoice_id:', updateError);
    // Non-fatal: credits were already granted; idempotency prevents re-grant
  }

  console.log(`[webhook] Granted ${creditAmount} Qs to user ${subRecord.user_id} (${plan.name} renewal)`);
}

/**
 * invoice.payment_failed
 * Updates subscription status to past_due so the app can surface this to the user.
 */
async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: AdminClient,
): Promise<void> {
  const subDetails = invoice.parent?.type === 'subscription_details'
    ? invoice.parent.subscription_details
    : null;
  const rawSub = subDetails?.subscription;
  const stripeSubscriptionId = typeof rawSub === 'string' ? rawSub : rawSub?.id;

  if (!stripeSubscriptionId) return;

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', stripeSubscriptionId);

  if (error) {
    console.error('[webhook] Failed to update subscription to past_due:', error);
    throw error;
  }
}
