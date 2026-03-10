# Meta App Submission — waQup

Quick reference for Meta (Facebook) developer app submission.

## Required Fields

| Field | Value |
|-------|-------|
| **App icon (1024 x 1024)** | `packages/web/public/app-icon-1024.png` — Upload this file in Meta's form |
| **Privacy policy URL** | `https://waqup.com/privacy` (or your production domain) |
| **User data deletion** | `https://waqup.com/data-deletion` |
| **Category** | **Health & Fitness** (or "Lifestyle" if preferred) |

## URLs

- **Production**: Replace `waqup.com` with your actual domain (from `NEXT_PUBLIC_APP_URL`)
- **Local**: `http://localhost:3000/privacy`, `http://localhost:3000/data-deletion` (Meta requires public URLs for submission — deploy first or use a staging URL)

---

## Webhooks Setup

### 1. Env vars

Add to `.env.local` (and Vercel for production):

```
META_WEBHOOK_VERIFY_TOKEN=<pick-a-secret-string>
META_APP_SECRET=<from Meta Dashboard → Settings → Basic>
```

### 2. Configure in Meta

1. Go to [developers.facebook.com](https://developers.facebook.com) → **My Apps** → **waQup**
2. Open the use case you want (e.g. **Manage messaging & content on Instagram**)
3. Find **Webhooks** → **Set up** or **Configure**
4. Enter:
   - **Callback URL**: `https://waqup.com/api/webhooks/meta` (or your domain)
   - **Verify Token**: same value as `META_WEBHOOK_VERIFY_TOKEN`
5. Click **Verify and save**
6. Subscribe to fields (e.g. `comments`, `mentions`, `story_insights` for Instagram)

### 3. Endpoint

- **URL**: `https://waqup.com/api/webhooks/meta`
- **GET**: Handles Meta verification (echoes `hub.challenge` when token matches)
- **POST**: Receives event payloads; validates `X-Hub-Signature-256` using `META_APP_SECRET`; logs events

### 4. Local testing

Use [ngrok](https://ngrok.com) to expose localhost:

```bash
ngrok http 3000
# Use https://xxxx.ngrok.io/api/webhooks/meta as Callback URL in Meta
```

---

## Files Created

- `packages/web/public/app-icon-1024.png` — 1024×1024 app icon for Meta
- `packages/web/app/data-deletion/page.tsx` — User data deletion page (required for Meta)
- `packages/web/app/api/webhooks/meta/route.ts` — Meta webhook handler (GET verify, POST events)

---

## ChatGPT Prompts for Launch Assets

Use these prompts to generate copy and image briefs for socials, ads, and marketing.

### Social Post Copy (Instagram, X, LinkedIn)

```
waQup is a voice-first wellness app. Users create personalised affirmations, meditations, and rituals through conversation, then practice them in their own cloned voice (or a professional voice). Practice is always free — credits are only used for creation. Key differentiator: "Your voice. Your words. Free to practice forever."

Create 3 short social posts (under 150 chars each) for [Instagram / X / LinkedIn]. Tone: warm, grounded, not woo-woo. Include one hook about hearing yourself say what you need to hear. No emoji overload. UK English.
```

### Carousel / Long-Form Copy

```
waQup helps people create affirmations, meditations, and rituals in their own voice. Write 5 carousel slide headlines + 1–2 sentence body for each. Topics: (1) Why your voice matters for subconscious rewiring, (2) Practice is free forever, (3) Three content types explained simply, (4) Create in 5 minutes, (5) CTA to join waitlist. Tone: clear, benefit-first, no hype.
```

### Image / Asset Brief for Designers or AI Image Tools

```
Generate a mood board description for waQup app marketing visuals. Keywords: voice-first wellness, personal practice, calm, glass morphism, soft gradients (purple/blue/teal), minimal, modern, not generic stock meditation. Avoid: lotus flowers, generic yoga poses, clichéd "zen" imagery. Prefer: abstract waveforms, orb shapes, intimate listening, headphones, morning light.
```

### Ad Creative Brief

```
Write 3 ad copy variants for waQup (voice-first affirmations/meditations in your own voice). Formats: (1) 25-char headline + 90-char body, (2) 35-char headline + 125-char body, (3) 50-char headline + 150-char body. CTA: "Create your first practice free". Audience: people interested in self-improvement, mindfulness, habit formation. No superlatives. Benefit-led.
```

### Bali / In-Person QR Landing Copy

```
waQup: create affirmations and meditations in your own voice. Scan this QR to try a practice free. If you love it, create your own in 5 minutes — first one's on us. No card required. [Venue name] x waQup.
```

### Meta / App Store Description Snippets

```
Write a 80-char and a 170-char app store description for waQup. Focus: your voice, your practice, free forever. Include: affirmations, meditations, rituals, voice cloning, AI-assisted creation. No buzzwords like "transform your life". UK English.
```

---

## Environment Variables Checklist

All values must be set in **Vercel** (production) and optionally in **`.env.local`** (local dev). Master reference: `.env.example`.

### Required (app won't work without)

| Variable | Where to get |
|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same |
| `SUPABASE_SERVICE_ROLE_KEY` | Same (server-only) |
| `NEXT_PUBLIC_APP_URL` | Your domain, e.g. `https://waqup.com` |
| `OPENAI_API_KEY` | platform.openai.com |
| `ELEVENLABS_API_KEY` | elevenlabs.io |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard |
| `STRIPE_SECRET_KEY` | Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → Add endpoint → Signing secret |

### Stripe Products (create in Dashboard first)

| Variable | Stripe product |
|----------|----------------|
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | Starter subscription (€7 weekly) |
| `NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID` | Growth subscription (€20 monthly) |
| `NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID` | Devotion subscription (€60 monthly) |
| `NEXT_PUBLIC_STRIPE_SPARK_PRICE_ID` | Spark credit pack (70 Qs) |
| `NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID` | Creator pack (155 Qs) |
| `NEXT_PUBLIC_STRIPE_FLOW_PRICE_ID` | Flow pack (316 Qs) |
| `NEXT_PUBLIC_STRIPE_DEVOTION_PACK_PRICE_ID` | Devotion pack (668 Qs) |

### Meta / Instagram (optional for webhooks, follower count)

| Variable | Where to get |
|----------|--------------|
| `META_WEBHOOK_VERIFY_TOKEN` | Pick any secret string; must match Meta config |
| `META_APP_SECRET` | Meta Developers → App → Settings → Basic |
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived token via Graph API |
| `INSTAGRAM_USER_ID` | From `GET /me?fields=id` with token |

### Optional

| Variable | Purpose |
|----------|---------|
| `CLICKUP_API_KEY` + `CLICKUP_FEEDBACK_LIST_ID` | Sync feedback to ClickUp |
| `DEFAULT_ORACLE_VOICE_ID` | Override default TTS voice for Speak/Oracle |

---

## External Tasks (Pre-Launch)

Things to do outside the codebase before / during launch:

| Task | Notes |
|------|-------|
| **Domain** | Configure DNS for waqup.com (or chosen domain) → Vercel |
| **SSL** | Vercel provisions automatically |
| **Supabase** | Run migrations; ensure RLS policies; check Auth redirect URLs |
| **Stripe** | Create products, prices, webhook endpoint; switch to live keys for prod |
| **Meta app** | Create app at developers.facebook.com; add privacy policy URL, data deletion URL; configure webhooks if needed |
| **App Store / Play Store** | Prepare metadata, screenshots, privacy policy URL; submit for review |
| **Email** | Transactional email (Supabase Auth, Stripe) — ensure From address is verified |
| **Analytics** | GA4 property, consent banner wired; mark conversion events |
| **Bali QR** | Print QR codes, test landing URL; track with `?ref=bali-[venue]` |
| **Founding members** | Configure `founding_members` table / waitlist logic if using |
