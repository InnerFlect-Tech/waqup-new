# Stripe Setup — waQup Production Guide

**Last updated**: 9 March 2026  
**Stripe API version**: `2026-02-25.clover` (pinned in `packages/web/src/lib/stripe.ts`)  
**Account**: test mode until go-live, then switch to live keys

---

## Overview

waQup uses Stripe for two payment flows:

| Flow | Type | What happens |
|------|------|-------------|
| Subscription plan | Recurring | Starter (€7/week), Growth (€20/month), Devotion (€60/month) — grants Qs each billing period via webhook |
| Q credit pack | One-time | Spark (70Q / €6.99), Creator (155Q / €14.99), Flow (316Q / €29.99), Devotion (668Q / €59.99) — grants Qs immediately after payment via webhook |

**Credit pack amounts and prices are defined in** `packages/shared/src/constants/credit-packs.ts`. Create Stripe products/prices to match those values so Checkout and webhook stay in sync.

Credits (Qs) are **never granted by the frontend**. All credit changes go through `add_credits()` Supabase RPC called from `POST /api/stripe/webhook` only.

---

## Step 1 — Account Setup

### 1.1 Create your Stripe account

1. Go to [stripe.com](https://stripe.com) → Create account
2. Activate your account with business details (name, address, bank account)
3. Complete identity verification

### 1.2 Business settings

**Dashboard → Settings → Business**

| Field | Value |
|-------|-------|
| Business name | waQup |
| Business website | https://waqup.app |
| Business type | Software / SaaS |
| Support email | hello@waqup.app |
| Support phone | (add yours) |
| Statement descriptor | WAQUP |

> The statement descriptor is what appears on users' bank statements. Keep it short and recognisable.

### 1.3 Branding

**Dashboard → Settings → Branding**

- Upload your logo (PNG, min 128×128px)
- Set accent colour: `#7C3AED` (waQup purple)
- This applies to Stripe Checkout, Customer Portal, and emailed invoices

---

## Step 2 — Create Products and Prices

### 2.1 Subscription plans

Go to **Dashboard → Product Catalog → + Add product** for each plan.

#### Starter Plan

| Field | Value |
|-------|-------|
| Product name | Starter |
| Description | 11 Qs per week to power your creation practice |
| Price | €7.00 |
| Billing period | Weekly |
| Price type | Recurring |
| Tax behaviour | Exclusive (tax added on top) |

After saving, copy the **Price ID** → `price_...`  
Add to `.env.local`: `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_...`

#### Growth Plan

| Field | Value |
|-------|-------|
| Product name | Growth |
| Description | 33 Qs per month for dedicated practitioners |
| Price | €20.00 |
| Billing period | Monthly |
| Price type | Recurring |
| Trial period | 7 days |
| Tax behaviour | Exclusive |

Add to `.env.local`: `NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID=price_...`

#### Devotion Plan

| Field | Value |
|-------|-------|
| Product name | Devotion |
| Description | 99 Qs per month — a commitment, not a subscription |
| Price | €60.00 |
| Billing period | Monthly |
| Price type | Recurring |
| Trial period | 14 days |
| Tax behaviour | Exclusive |

Add to `.env.local`: `NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID=price_...`

### 2.2 One-time Q credit packs

Create each as a separate product with a **one-time price**.

#### Spark Pack

| Field | Value |
|-------|-------|
| Product name | Spark — 70 Qs |
| Description | Try your first affirmations, meditations, or rituals. Perfect for exploring. |
| Price | €6.99 |
| Price type | One-time |
| Tax behaviour | Exclusive |

Add to `.env.local`: `NEXT_PUBLIC_STRIPE_SPARK_PRICE_ID=price_...`

#### Creator Pack

| Field | Value |
|-------|-------|
| Product name | Creator — 155 Qs |
| Description | Create content regularly without running out. Most popular choice. |
| Price | €14.99 |
| Price type | One-time |
| Tax behaviour | Exclusive |

Add to `.env.local`: `NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID=price_...`

#### Flow Pack

| Field | Value |
|-------|-------|
| Product name | Flow — 316 Qs |
| Description | Deep creative sessions. Build a full library without pause. |
| Price | €29.99 |
| Price type | One-time |
| Tax behaviour | Exclusive |

Add to `.env.local`: `NEXT_PUBLIC_STRIPE_FLOW_PRICE_ID=price_...`

#### Devotion Pack

| Field | Value |
|-------|-------|
| Product name | Devotion — 668 Qs |
| Description | Maximum creative power. Never runs dry. Best per-Q value. |
| Price | €59.99 |
| Price type | One-time |
| Tax behaviour | Exclusive |

Add to `.env.local`: `NEXT_PUBLIC_STRIPE_DEVOTION_PACK_PRICE_ID=price_...`

---

## Step 3 — Webhook Endpoint

**Quick start (2026-03-10):**

- **Local:** Install [Stripe CLI](https://docs.stripe.com/stripe-cli), then from `packages/web` run `npm run stripe:webhook:listen` (or `STRIPE_API_KEY=sk_test_... stripe listen --forward-to localhost:3000/api/stripe/webhook`). Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET` in `packages/web/.env.local`. The same secret is reused across restarts. Keep the CLI running in a separate terminal while testing payments.
- **Production:** Set `NEXT_PUBLIC_APP_URL` to your live URL (e.g. `https://waqup.app`) in `.env.local` or Vercel, then from `packages/web` run `npm run stripe:webhook:create`. Add the printed secret to Vercel as `STRIPE_WEBHOOK_SECRET`. Alternatively, register the endpoint manually in Dashboard (3.1 below).

### 3.1 Register the production webhook (manual)

**Dashboard → Developers → Webhooks → + Add endpoint**

| Field | Value |
|-------|-------|
| Endpoint URL | `https://waqup.app/api/stripe/webhook` |
| Version | Your latest API version |
| Description | waQup production webhook |

**Events to listen for** (select these exactly):

```
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.payment_succeeded
invoice.payment_failed
invoice.finalized
customer.updated
```

After saving:
1. Click the webhook endpoint → **Reveal signing secret**
2. Copy `whsec_...`
3. Add to production env vars: `STRIPE_WEBHOOK_SECRET=whsec_...`

### 3.2 Local development webhook

Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) (`brew install stripe/stripe-cli/stripe` on macOS, or [download the binary](https://github.com/stripe/stripe-cli/releases) on Linux/WSL), then `stripe login`.

From `packages/web`, in a separate terminal from your dev server:
```bash
npm run stripe:webhook:listen
```
Or run the CLI directly:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI prints a `whsec_...` key. Add it to `packages/web/.env.local` as `STRIPE_WEBHOOK_SECRET=whsec_...`.

### 3.3 How the webhook works

The handler at `packages/web/app/api/stripe/webhook/route.ts` does the following:

```
Stripe sends event
  ↓
Verify stripe-signature header (HMAC SHA-256)
  ↓
Insert event.id into stripe_webhook_events (unique constraint)
  → If duplicate: return 200 immediately (idempotent)
  ↓
Route by event.type:
  
  checkout.session.completed
    type=credits  → add_credits(userId, credits, 'pack purchase')
    type=subscription → upsert subscriptions row (initial subscription)
  
  invoice.payment_succeeded
    Find subscription by stripe_subscription_id
    Check last_credited_invoice_id ≠ invoice.id (idempotent)
    add_credits(userId, plan.creditsPerPeriod, 'monthly/weekly allocation')
    Update last_credited_invoice_id
  
  customer.subscription.updated
    Upsert subscription row (status, dates, cancel_at_period_end)
  
  customer.subscription.deleted
    Update status = 'canceled'
  
  invoice.payment_failed
    Update subscription status = 'past_due'
```

---

## Step 4 — Customer Portal (Self-Service Billing)

The Customer Portal lets users manage their own subscriptions — upgrade, downgrade, cancel, update payment method — without emailing support.

### 4.1 Configure the portal

**Dashboard → Settings → Billing → Customer portal**

Enable the following:

| Feature | Setting |
|---------|---------|
| Payment methods | Allow customers to update |
| Invoice history | Show |
| Update subscriptions | Allow plan changes |
| Available plans | Add all 3 subscription products |
| Cancel subscriptions | Allow (with cancellation reason prompt) |
| Cancellation flow | "Offer to pause" or direct cancel |
| Business name | waQup |
| Privacy policy URL | https://waqup.app/privacy |
| Terms of service URL | https://waqup.app/terms |

### 4.2 Add a portal session API route

Create `packages/web/app/api/stripe/portal/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getStripeClient } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 });
  }

  const stripe = getStripeClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://waqup.app';

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${appUrl}/sanctuary/settings`,
  });

  return NextResponse.json({ url: session.url });
}
```

Then add a "Manage billing" button to `/sanctuary/settings` that POSTs to this route and redirects to the returned URL.

---

## Step 5 — Stripe Tax (EU VAT)

This is critical for European users. Stripe Tax automatically calculates and collects the correct VAT rate for each EU country.

### 5.1 Enable Stripe Tax

**Dashboard → More → Tax → Get started**

1. Enter your business address (country of incorporation)
2. Enable **Automatic tax calculation**
3. Select product tax code for digital services: `txcd_10402000` (Software as a Service)

### 5.2 Register for VAT (if needed)

If your business is in the EU and annual EU sales exceed €10,000:
- Register for VAT in your home country
- Consider the **OSS (One Stop Shop)** scheme — register once in one EU country and declare VAT for all EU sales there
- Add your VAT registration to **Dashboard → Tax → Registrations → + Add registration**

### 5.3 Enable on prices

All prices created in Step 2 should have **Tax behaviour: Exclusive** (tax is added on top and collected separately). This is already configured in the price setup above.

Stripe Tax then automatically adds the correct VAT at checkout based on the buyer's location.

> **Note**: For B2B sales, buyers with a valid VAT number get a zero-rated invoice. Stripe Checkout collects and validates VAT numbers automatically.

---

## Step 6 — Revenue Recovery (Smart Retries + Dunning)

This recovers revenue from failed payments — card expiry, insufficient funds, bank declines.

### 6.1 Enable Smart Retries

**Dashboard → Settings → Billing → Subscriptions and emails**

- **Smart Retries**: Enable (recommended: 8 retries over 2 weeks)
- Stripe's ML model predicts the optimal retry time per card/bank
- Recovers ~9x more revenue than manual retry schedules

### 6.2 Enable automated customer emails

In the same screen, enable:

| Email trigger | Purpose |
|---------------|---------|
| Payment failed | Tell user their card failed |
| Trial will end (3 days before) | Remind users trial is ending |
| Subscription cancelled | Confirm cancellation |
| Invoice sent | Receipt for each charge |

Configure the **from address**: `billing@waqup.app`  
Set a reply-to address for support queries.

### 6.3 Configure subscription lifecycle on payment failure

**Dashboard → Settings → Billing → Subscriptions and emails → Manage failed payments**

Recommended settings:
- **Retry for**: 2 weeks
- **After all retries fail**: Cancel subscription
- **Grace period before cancellation**: 3 days (subscription stays active briefly after failure, giving users time to update card)

Our webhook already handles `invoice.payment_failed` → sets `status: 'past_due'` so the app can surface a banner to the user.

---

## Step 7 — Promotional Codes and Discounts

### 7.1 Create a launch coupon

**Dashboard → Product Catalog → Coupons → + Create coupon**

| Field | Value |
|-------|-------|
| Name | Launch discount |
| ID (promo code) | `WAQUP25` |
| Discount type | Percentage |
| Percentage off | 25% |
| Duration | Once (first invoice only) |
| Applies to | All subscription products |
| Max redemptions | 500 |
| Expires | Set a date 3 months after launch |

The checkout sessions we create already have `allow_promotion_codes: true`, so users can enter `WAQUP25` at the Stripe Checkout page automatically.

### 7.2 Referral discounts (future)

When you build referral functionality:
- Create a unique coupon per referrer via Stripe API
- Apply it to the referred user's first checkout
- Stripe tracks redemption automatically

---

## Step 8 — Test Mode Checklist

Before going live, test every flow end-to-end using Stripe's test card numbers.

### Test cards

| Scenario | Card number | Expiry | CVC |
|----------|-------------|--------|-----|
| Successful payment | `4242 4242 4242 4242` | Any future | Any |
| Payment requires 3DS | `4000 0025 0000 3155` | Any future | Any |
| Card declined | `4000 0000 0000 9995` | Any future | Any |
| Insufficient funds | `4000 0000 0000 9995` | Any future | Any |
| Expired card | `4000 0000 0000 0069` | Past date | Any |

### Flows to test

- [ ] Subscribe to Starter (weekly) — webhook fires, Qs credited
- [ ] Subscribe to Growth (7-day trial) — no charge for 7 days, Qs credited on trial start
- [ ] Subscribe to Devotion (14-day trial) — same as above
- [ ] Buy Spark pack — immediate Q credit
- [ ] Buy Creator pack — immediate Q credit
- [ ] Buy Flow pack — immediate Q credit
- [ ] Buy Devotion Pack — immediate Q credit
- [ ] Cancel subscription via Customer Portal — `subscription.deleted` webhook fires
- [ ] Failed payment (`4000 0000 0000 9995`) — status becomes `past_due`
- [ ] Smart Retry fires after failure — check Stripe event log
- [ ] Invoice sent email — check email delivery
- [ ] Duplicate webhook event (replay) — idempotency check returns 200, no double credit

### Stripe CLI replay command

Test a specific webhook event:
```bash
stripe events resend evt_1234... --webhook-endpoint we_...
```

---

## Step 9 — Go Live Checklist

When ready to accept real payments:

- [ ] Complete Stripe account activation (bank details, identity)
- [ ] Enable Live mode in Dashboard (top-left toggle)
- [ ] Create all 7 products/prices in **Live mode** (they don't copy from test)
- [ ] Register production webhook with live endpoint + `whsec_` key
- [ ] Replace test keys in Vercel environment variables with live keys:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `pk_live_...`
  - `STRIPE_SECRET_KEY` → `sk_live_...`
  - `STRIPE_WEBHOOK_SECRET` → new `whsec_...` from live webhook
  - All 7 price IDs → live `price_...` values
- [ ] Enable Stripe Tax for your country
- [ ] Register on Stripe Radar (fraud detection) — set custom rules if needed
- [ ] Set up Stripe notifications (Dashboard → Settings → Notifications) — email alerts for disputes, large payments, etc.
- [ ] Test one real €1 payment and refund it
- [ ] Check the Dashboard → Overview for your first MRR metrics

---

## Step 10 — Useful Stripe Features to Activate

### Stripe Radar (Fraud Prevention)

**Dashboard → Radar → Rules**

Add a rule to block known high-risk cards in your target markets. Default Radar is already active and handles most fraud.

Recommended rule:
```
Block if :risk_level: = 'highest'
```

### Stripe Sigma (Analytics SQL)

Available on paid plans. Lets you write SQL against your Stripe data — useful for:
- Calculating MRR, churn, LTV
- Identifying top-spending users
- Tracking subscription conversion rates

### Stripe Reporting

**Dashboard → Reports**

Useful reports:
- **Revenue recognition** — accrual-based revenue for accounting
- **Monthly recurring revenue** — MRR breakdown
- **Subscription metrics** — churn, new, upgrades, downgrades
- **Payout reconciliation** — matches payouts to charges

---

## Environment Variables Summary

### `.env.local` (development — already set)

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SHzdP...  # ✅ already set
STRIPE_SECRET_KEY=sk_test_51SHzdP...                   # ✅ already set
STRIPE_WEBHOOK_SECRET=whsec_...                        # ⬜ get from: stripe listen
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...                    # ✅ now added

# Subscription price IDs (create in Stripe Dashboard → test mode)
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_...          # ⬜ create in step 2
NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID=price_...           # ⬜ create in step 2
NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID=price_...         # ⬜ create in step 2

# Credit pack price IDs (create in Stripe Dashboard → test mode)
NEXT_PUBLIC_STRIPE_SPARK_PRICE_ID=price_...            # ⬜ create in step 2
NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID=price_...          # ⬜ create in step 2
NEXT_PUBLIC_STRIPE_FLOW_PRICE_ID=price_...             # ⬜ create in step 2
NEXT_PUBLIC_STRIPE_DEVOTION_PACK_PRICE_ID=price_...    # ⬜ create in step 2
```

### Vercel production environment variables

Set these in **Vercel → Project → Settings → Environment Variables**:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  (from live webhook registration)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  (same value as dev — same DB)
NEXT_PUBLIC_APP_URL=https://waqup.app
# ... all 7 price IDs (live mode values)
```

---

## Architecture Diagram

```
User
 ├── /pricing → POST /api/stripe/checkout/subscription
 │                    ↓
 │              Stripe Checkout (hosted)
 │                    ↓
 └── /get-qs  → POST /api/stripe/checkout/credits
                      ↓
               Stripe Checkout (hosted)
                      ↓
               POST /api/stripe/webhook ← Stripe sends event
                      ↓
               Verify stripe-signature
                      ↓
               Insert into stripe_webhook_events (idempotency)
                      ↓
               ┌──────────────────────────────────┐
               │ invoice.payment_succeeded         │ → add_credits() RPC → credit_transactions
               │ checkout.session.completed(pack)  │ → add_credits() RPC → credit_transactions
               │ subscription.updated              │ → upsert subscriptions table
               │ subscription.deleted              │ → update status = 'canceled'
               │ invoice.payment_failed            │ → update status = 'past_due'
               └──────────────────────────────────┘
```

---

## Security Notes

1. **Never expose `STRIPE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` to the browser** — they are server-side only, never prefixed with `NEXT_PUBLIC_`
2. **Webhook signature verification is non-negotiable** — our handler verifies every request before processing
3. **Credits are granted only by the webhook** — no frontend route can grant positive credits (enforced by Supabase RLS policy in migration 000009)
4. **Idempotency prevents double-crediting** — `stripe_webhook_events` table blocks duplicate event processing
5. **`add_credits()` is `security definer`** — bypasses RLS but only callable server-side with service role

---

*For questions about this setup, contact india@waqup.app*
