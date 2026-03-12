# Vercel Environment Variables — Stripe & Full Checklist

Set these in **Vercel** → **Your Project** → **Settings** → **Environment Variables**.  
Apply to **Production** (and optionally Preview) so Stripe, Supabase, and the app work after deploy.

**Important:** `NEXT_PUBLIC_APP_URL` must be your **production URL** in Vercel (e.g. `https://waqup.app`). Never set it to `http://localhost:3000` in Production. The script `push-env-to-vercel.sh` does not push this variable so that local .env.local (localhost) cannot overwrite production.

---

## 1. Where to set them

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → select the **waqup-new** (or your web) project.
2. Go to **Settings** → **Environment Variables**.
3. Add each variable below. Use **Production** (and **Preview** if you want Stripe on preview URLs).
4. **Redeploy** after adding or changing variables (env vars apply only to new deployments).

---

## 2. Required for Stripe + app

Copy the **names** below; get the **values** from your `packages/web/.env.local` (or from Stripe/Supabase dashboards for production).

| Variable | Where to get value | Notes |
|----------|--------------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | .env.local or Supabase Dashboard | Same for dev/prod if same project |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | .env.local or Supabase Dashboard | Anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | .env.local or Supabase → Settings → API | **Secret** — needed for webhook |
| `NEXT_PUBLIC_APP_URL` | **Set only in Vercel** (not from .env.local) | Your production URL, e.g. `https://waqup.app`. Do **not** use `push-env-to-vercel.sh` for this — the script skips it so localhost is never pushed to production. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | .env.local (test) or Stripe Dashboard (live) | Use test keys for preview; live for production |
| `STRIPE_SECRET_KEY` | .env.local (test) or Stripe Dashboard (live) | **Secret** |
| `STRIPE_WEBHOOK_SECRET` | **Production only:** see step 3 below | **Secret** — different from local |
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | .env.local or Stripe Dashboard | `price_...` |
| `NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID` | .env.local or Stripe Dashboard | `price_...` |
| `NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID` | .env.local or Stripe Dashboard | `price_...` |
| `NEXT_PUBLIC_STRIPE_SPARK_PRICE_ID` | .env.local or Stripe Dashboard | `price_...` |
| `NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID` | .env.local or Stripe Dashboard | `price_...` |
| `NEXT_PUBLIC_STRIPE_FLOW_PRICE_ID` | .env.local or Stripe Dashboard | `price_...` |
| `NEXT_PUBLIC_STRIPE_DEVOTION_PACK_PRICE_ID` | .env.local or Stripe Dashboard | `price_...` |

---

## 3. Production webhook secret (Stripe)

For **production**, Stripe must send events to your **live** URL. The webhook secret you use locally (`stripe listen`) does **not** work for production.

### Option A: Create endpoint via script (recommended)

1. Set `NEXT_PUBLIC_APP_URL` in Vercel to your production URL (e.g. `https://waqup.app`).
2. Locally, in `.env.local`, set `NEXT_PUBLIC_APP_URL` to that same production URL (temporarily).
3. From `packages/web` run:
   ```bash
   npm run stripe:webhook:create
   ```
4. Copy the printed **`whsec_...`** into Vercel as `STRIPE_WEBHOOK_SECRET` for **Production**.
5. Restore `NEXT_PUBLIC_APP_URL` in `.env.local` to `http://localhost:3000` if you use it for local dev.

### Option B: Create endpoint in Stripe Dashboard

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → **Add endpoint**.
2. **Endpoint URL:** `https://<your-production-domain>/api/stripe/webhook` (e.g. `https://waqup.app/api/stripe/webhook`).
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`.
4. **Reveal signing secret** → copy `whsec_...` into Vercel as `STRIPE_WEBHOOK_SECRET` (Production).

---

## 4. Other variables (optional but recommended)

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | AI routes (conversation, oracle, scripts) |
| `ELEVENLABS_API_KEY` | Voice / TTS |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 (production only) |
| `CLICKUP_API_KEY`, `CLICKUP_FEEDBACK_LIST_ID` | Feedback sync from Sanctuary |
| `META_WEBHOOK_VERIFY_TOKEN`, `META_APP_SECRET` | Meta webhooks (if used) |

Do **not** set override login or test login vars in production: omit `OVERRIDE_LOGIN_*` and set `NEXT_PUBLIC_ENABLE_TEST_LOGIN=false` (or leave unset).

---

## 5. Quick copy from local (same project)

If your production app uses the **same** Supabase project and **same** Stripe account (test or live) as local:

1. Open `packages/web/.env.local`.
2. In Vercel, add each variable that appears there (except `OVERRIDE_LOGIN_*`, `VERCEL_OIDC_TOKEN`, **`NEXT_PUBLIC_APP_URL`**, and any local-only keys).
3. **In Vercel only**, set `NEXT_PUBLIC_APP_URL` to your **production** URL (e.g. `https://waqup.app`). Never copy this from .env.local (it is usually `http://localhost:3000`). The script `push-env-to-vercel.sh` skips this variable on purpose.
4. For **production** Stripe, set `STRIPE_WEBHOOK_SECRET` to the **production** webhook signing secret (from step 3 above), not the local `stripe listen` secret.

---

## 6. Using Vercel MCP (when available)

If you add the [Vercel MCP server](https://vercel.com/docs/agent-resources/vercel-mcp), you can manage environment variables via tools instead of the dashboard. In Cursor, connect the Vercel MCP and use its env tools to list/set variables for the project.

---

---

## 7. Troubleshooting

**"Stripe price not configured for pack: spark"** (or creator / flow / devotion)

This means the **credit pack** Stripe price IDs are missing or empty in the environment where the request runs (e.g. Vercel Production). The API returns **503** and this message when `NEXT_PUBLIC_STRIPE_*_PRICE_ID` for that pack is not set.

**Fix:** In Vercel → Settings → Environment Variables, add (or correct) all four credit pack price IDs:

- `NEXT_PUBLIC_STRIPE_SPARK_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_FLOW_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_DEVOTION_PACK_PRICE_ID`

Use the same `price_...` values as in your `packages/web/.env.local` (from the same Stripe account). Then **redeploy** (env vars are applied at build time for `NEXT_PUBLIC_*`).

---

**"No such price: 'price_...'"** (on pricing or checkout)

Stripe returns this when the **price ID** does not exist in the Stripe account (or mode) that your **secret key** uses. Test and live are separate: test price IDs only work with `sk_test_...`, and live price IDs only with `sk_live_...`. **Using Stripe in test mode (sandbox) on production is valid** — checkout works; you just process test payments. The issue is only if you mix test keys with live price IDs or the opposite.

**Pricing page shows "Checkout is not yet configured" or buttons stay disabled**

Usually **`GET /api/stripe/price-ids` is 404** — the route was never deployed (e.g. file not committed). Check that `packages/web/app/api/stripe/price-ids/route.ts` is committed and that the latest production deployment includes it. The pricing page falls back to build-time env if the API fails, but if the route is missing and build-time env was empty, checkout stays broken until you deploy the route.

**Fix:**

1. In [Stripe Dashboard](https://dashboard.stripe.com), switch to **Test** or **Live** (toggle top-left) and stay in one mode.
2. In that same mode, open **Product catalog** and create the 7 products/prices (or note the existing price IDs). Copy the **Price ID** for each (e.g. `price_1T9O7g...` for live, `price_1ABC...` for test).
3. In Vercel, set **all** of these from that **same** Stripe account and **same** mode:
   - `STRIPE_SECRET_KEY` → `sk_test_...` **or** `sk_live_...` (not mixed).
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → same mode (`pk_test_...` or `pk_live_...`).
   - All 7 price ID env vars → the `price_...` values from step 2.
4. **Redeploy** so the new env vars are used. **Note:** Subscription plan price IDs (Starter, Growth, Devotion) are now loaded at **runtime** by the pricing page via `GET /api/stripe/price-ids`, so the server’s current env is used and you don’t rely on build-time `NEXT_PUBLIC_*` for those three IDs. Redeploy is still required for the API route to see the new vars.

---

---

## 8. Build warnings (expected)

When deploying, you may see:

- **npm deprecated** (during `npm ci`): Transitive deps such as `whatwg-encoding`, `inflight`, `domexception`, `abab`, `node-domexception` may still appear; they come from the dependency tree (e.g. Playwright/Jest). The repo pins `glob` to `13.0.6` at root and has removed `fluent-ffmpeg`; safe to ignore remaining transitive deprecation warnings.
- **npm audit**: A few low-severity issues may remain (e.g. in `jest-expo` / `jest-environment-jsdom`). Fixing them would require a major upgrade of the test stack; acceptable to leave for now.
- **Next.js**: *"Using edge runtime on a page currently disables static generation for that page"* — emitted for `/api/og` (Open Graph image generation). That route intentionally uses `runtime = 'edge'` for `@vercel/og`; the warning is expected and can be ignored.

---

**See also:** `docs/04-reference/13-stripe-setup.md` (full Stripe setup), `docs/05-deployment/01-github-vercel-setup.md` (CI and deploy).
