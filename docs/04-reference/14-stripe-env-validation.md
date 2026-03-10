# Stripe & Webhook — Environment Validation (2026-03-10)

This doc validates required env vars against the codebase. Source: grep + read of `packages/web` and `.env.example`.

---

## 1. Webhook handler requirements

**File:** `packages/web/app/api/stripe/webhook/route.ts`

| Env var | Used in | Code reference |
|--------|---------|----------------|
| `STRIPE_WEBHOOK_SECRET` | Signature verification | Line 30: `process.env.STRIPE_WEBHOOK_SECRET` — 400 if missing |
| `STRIPE_SECRET_KEY` | `getStripeClient()` | `packages/web/src/lib/stripe.ts` L13 — throws if unset |
| `NEXT_PUBLIC_SUPABASE_URL` | `createSupabaseAdminClient()` | `packages/web/src/lib/stripe.ts` L32 |
| `SUPABASE_SERVICE_ROLE_KEY` | `createSupabaseAdminClient()` | `packages/web/src/lib/stripe.ts` L33 — throws "Missing Supabase admin env vars" if unset |

**Conclusion:** Webhook needs all four. Without `SUPABASE_SERVICE_ROLE_KEY`, the handler throws when processing any event (idempotency insert, add_credits, subscription upsert all use the admin client).

---

## 2. Checkout — credit packs

**File:** `packages/web/app/api/stripe/checkout/credits/route.ts`

| Env var | Usage |
|--------|--------|
| `NEXT_PUBLIC_STRIPE_SPARK_PRICE_ID` | PACK_PRICE_IDS.spark |
| `NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID` | PACK_PRICE_IDS.creator |
| `NEXT_PUBLIC_STRIPE_FLOW_PRICE_ID` | PACK_PRICE_IDS.flow |
| `NEXT_PUBLIC_STRIPE_DEVOTION_PACK_PRICE_ID` | PACK_PRICE_IDS.devotion |

If `priceId` is missing for a pack: **503** with message `Stripe price not configured for pack: ${packId}` (L54–58).

---

## 3. Checkout — subscriptions

**File:** `packages/web/app/[locale]/(marketing)/pricing/page.tsx`

| Env var | Usage |
|--------|--------|
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | STRIPE_PRICE_IDS.starter |
| `NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID` | STRIPE_PRICE_IDS.growth |
| `NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID` | STRIPE_PRICE_IDS.devotion |

If `priceId` is empty: frontend shows "Checkout is not yet configured for this plan" and does not call the API (L334–338). The API route accepts `priceId` in the body and does not re-validate against env.

---

## 4. Alignment with docs

- **`docs/04-reference/13-stripe-setup.md`** — Overview table and Step 2 list the same 7 price IDs and describe webhook + Supabase. Environment Variables Summary section (L358–378) lists `SUPABASE_SERVICE_ROLE_KEY` and all Stripe vars; matches `.env.example`.
- **`.env.example`** — Contains `SUPABASE_SERVICE_ROLE_KEY`, all Stripe keys, webhook secret, and 7 price ID placeholders. Matches code usage.

---

## 5. Validated checklist

| Requirement | Validated against |
|-------------|-------------------|
| Webhook needs `SUPABASE_SERVICE_ROLE_KEY` | `stripe.ts` L30–36, webhook route L48 |
| Webhook needs `STRIPE_WEBHOOK_SECRET` | webhook route L30–34 |
| Webhook needs `STRIPE_SECRET_KEY` | `stripe.ts` L13–15 |
| Webhook needs `NEXT_PUBLIC_SUPABASE_URL` | `stripe.ts` L32 |
| Credits checkout needs 4 pack price IDs | credits route L12–16, L53–58 |
| Subscriptions need 3 plan price IDs | pricing page L13–16, L334–338 |
| Doc and .env.example list same vars | 13-stripe-setup.md + .env.example |

All stated requirements are correct and traceable to the codebase and docs.
