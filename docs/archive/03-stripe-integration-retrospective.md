# Why the Stripe Integration Works Now — Retrospective

**Date:** 2026-03-11  
**Scope:** Subscription checkout on production (www.waqup.space).  
**Sources:** Codebase, Stripe MCP, Vercel MCP, Context7 (Next.js/Vercel docs), deployment docs, changelog.

---

## 0. Visual test finding (2026-03-11): real cause

**Stripe was not working because `GET /api/stripe/price-ids` returned 404 on production.**  
The pricing page loads subscription price IDs from that API. When it got 404, it had no IDs, so the buttons stayed disabled or showed “Checkout is not yet configured.”

- **Root cause:** The file `packages/web/app/api/stripe/price-ids/route.ts` had **never been committed**, so the deployed app never contained that route.
- **Not a sandbox issue:** Stripe **test mode** (test keys + test price IDs) is valid for checkout. You can use it on production; you just process test payments. The problem was the missing API route, not “sandbox vs live.”
- **Fix applied:** (1) Committed the price-ids route and pricing changes. (2) Added fallback: if the API returns 404 or errors, the pricing page uses build-time `NEXT_PUBLIC_*` so older deploys still work. (3) Redeployed to production; `/api/stripe/price-ids` now returns the three price IDs and checkout works.

---

## 1. What “working” means

- User visits **Pricing** → clicks **Choose Starter** (or Growth / Devotion).
- If not logged in → redirect to **Login** with `?next=/pricing`.
- If logged in → **Stripe Checkout** opens; user can complete payment.
- No **“No such price”** or **“Checkout is not yet configured”** errors.

---

## 2. Root cause of the earlier failure

- **Symptom:** “No such price: 'price_...'” on production.
- **Cause:** Subscription **price IDs** were taken from **build-time** `NEXT_PUBLIC_*` env in the client bundle.
  - In Next.js, `NEXT_PUBLIC_*` is **inlined at build time** (Context7 / Next.js env docs).
  - If the build used cached output or an older/env-less deployment, the client could send **wrong or empty** price IDs.
  - Stripe then returned “No such price” because the ID didn’t exist in the account (or was for the wrong mode: test vs live).

---

## 3. What was changed (fix chain)

### 3.1 Runtime price IDs (main fix)

- **New API:** `GET /api/stripe/price-ids`
  - **File:** `packages/web/app/api/stripe/price-ids/route.ts`
  - Reads `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`, `_GROWTH_`, `_DEVOTION_` from **server** `process.env` at **request time**.
  - Returns JSON: `{ starter, growth, devotion }` (price IDs).
  - Route uses `export const dynamic = 'force-dynamic'`, so it’s **never** statically optimized; env is read at **runtime** on the server.

- **Pricing page**
  - **File:** `packages/web/app/[locale]/(marketing)/pricing/page.tsx`
  - On mount: `useEffect` → `fetch('/api/stripe/price-ids')` → stores result in `priceIds` state.
  - **Checkout:** `handleCheckout(planId)` uses `priceIds?.[planId]` (from the API), **not** build-time `process.env.NEXT_PUBLIC_*`.
  - Plan CTAs are **disabled** until `priceIds !== null` (`checkoutDisabled={priceIds === null}`), so the client never sends an empty price ID.

**Why this works:** Production always uses whatever is in **Vercel’s environment** for that deployment. No dependence on build-time inlining for the three subscription price IDs; a single redeploy is enough for the API route to see updated env.

### 3.2 Env and deployment alignment

- **Vercel Production** has all 7 Stripe price IDs and keys set (confirmed via `vercel env ls production` and earlier MCP checks).
- **Stripe account (test mode):** Same account as local; prices exist (Stripe MCP `list_prices` shows e.g. `price_1T9O7gAWvTfSfBQsXy3vjsAo` for Starter weekly, etc.).
- **Deployment:** Production deploy with `--force` (no build cache) was run so the new code and env are what’s live at www.waqup.space.

### 3.3 Checkout flow (unchanged, but now fed correctly)

- **Subscription checkout:** `POST /api/stripe/checkout/subscription`
  - Expects `{ priceId, planId }` in body.
  - Uses **server** `STRIPE_SECRET_KEY` (runtime env) and `getStripeClient()` from `packages/web/src/lib/stripe.ts` (Stripe SDK `2026-02-25.clover`).
  - Creates or reuses Stripe Customer (linked to Supabase user via `profiles.stripe_customer_id`), then creates a Checkout Session with `mode: 'subscription'`, `line_items: [{ price: priceId, quantity: 1 }]`.
  - Returns `{ url }`; client redirects with `window.location.href = url`.
- **Auth:** 401 if not logged in → client redirects to `/login?next=/pricing`.

---

## 4. Verification (how we know it works)

| Check | Result |
|-------|--------|
| **Stripe MCP** `list_prices` | 7 prices in account (3 recurring: starter weekly, growth, devotion; 4 one-time credit packs). IDs match `.env.local` / Vercel. |
| **Vercel MCP** `get_project` | Production deployment READY; domains include www.waqup.space. |
| **Context7** (Next.js env) | Confirmed: `NEXT_PUBLIC_*` inlined at build; server/dynamic routes read env at runtime. Our price-ids route is dynamic → runtime env. |
| **Code path** | Pricing page → fetch `/api/stripe/price-ids` → use returned IDs in `handleCheckout` → POST `/api/stripe/checkout/subscription` with that `priceId` → Stripe creates session. |
| **Stripe best practices (skill)** | Using Checkout Sessions for subscriptions; server-side secret key; no Charges API. |

---

## 5. One-sentence summary

**Subscription checkout works because subscription price IDs are no longer taken from build-time `NEXT_PUBLIC_*` in the client; they are loaded at runtime from the server via `GET /api/stripe/price-ids`, so production always uses the current Vercel env and the correct Stripe account/mode.**

---

## 6. Related docs

- **Env & troubleshooting:** `docs/05-deployment/01-github-vercel-setup.md` (Section 7: “No such price”, runtime price-ids note).
- **Stripe setup:** `docs/04-reference/13-stripe-setup.md`, `docs/04-reference/14-stripe-env-validation.md`.
- **Changelog:** `rebuild-roadmap/03-tracking/01-changelog.md` (Stripe webhook automation, Web Stripe integration, Phase 10).

---

## 7. Reusable prompt for future retrospectives

Use this (or a variant) when you want to re-examine why the Stripe integration is working:

> **Stripe integration retrospective:** Use Context7 (Next.js/Vercel env and build behavior), Stripe MCP (account, prices), Vercel MCP (project, deployment, env), and the codebase (pricing page, `/api/stripe/price-ids`, `/api/stripe/checkout/subscription`, `src/lib/stripe.ts`) to trace the end-to-end subscription checkout flow and document (1) what was fixed, (2) why it works now, and (3) how runtime vs build-time env explains the fix. Reference Stripe best-practices skill and deployment docs where relevant. Output: update or confirm `docs/05-deployment/03-stripe-integration-retrospective.md`.
