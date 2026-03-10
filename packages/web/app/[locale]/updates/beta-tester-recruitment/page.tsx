'use client';

import React from 'react';
import { Typography, PageShell, GlassCard } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ExternalLink, Database, Image, Link2, Zap } from 'lucide-react';

function Section({ title, children, colors }: { title: string; children: React.ReactNode; colors: ReturnType<typeof useTheme>['theme']['colors'] }) {
  return (
    <section style={{ marginBottom: spacing.xl }}>
      <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.md, fontSize: '1.25rem' }}>
        {title}
      </Typography>
      {children}
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <pre
      style={{
        padding: spacing.md,
        borderRadius: borderRadius.md,
        background: colors.background.secondary,
        border: `1px solid ${colors.glass.border}`,
        overflow: 'auto',
        fontSize: '12px',
        fontFamily: 'ui-monospace, monospace',
        color: colors.text.secondary,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        margin: 0,
      }}
    >
      {children}
    </pre>
  );
}

export default function BetaTesterRecruitmentPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium" bare>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>
        <Link
          href="/updates"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.xs,
            color: colors.accent.primary,
            textDecoration: 'none',
            marginBottom: spacing.lg,
            fontSize: '14px',
          }}
        >
          <ArrowLeft size={16} />
          Back to Updates
        </Link>

        <div style={{ marginBottom: spacing.xl }}>
          <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}>
            Beta Tester Recruitment Guide
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            End-to-end guide: ChatGPT prompts for copy and images, onboarding links, database setup, and improvement ideas.
          </Typography>
        </div>

        {/* ── What Was Done ───────────────────────────────────────────────────── */}
        <Section title="What Was Done" colors={colors}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            A full beta tester recruitment flow is already in place:
          </Typography>
          <ul style={{ color: colors.text.secondary, marginLeft: spacing.lg, marginBottom: spacing.md }}>
            <li><strong>Database</strong>: <code>profiles.is_beta_tester</code> column (boolean) to mark beta users.</li>
            <li><strong>Landing pages</strong>: <code>/join</code> (Founding Member signup) and <code>/waitlist</code> (multi-step form) for acquisition.</li>
            <li><strong>Signup flow</strong>: <code>/signup</code> creates accounts; after signup you manually set <code>is_beta_tester = true</code>.</li>
            <li><strong>Persona pages</strong>: <code>/for-teachers</code>, <code>/for-coaches</code>, <code>/for-studios</code>, <code>/for-creators</code> for targeted campaigns.</li>
          </ul>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            What was <strong>not</strong> automated: auto-setting <code>is_beta_tester</code> based on signup source (e.g. <code>?ref=beta</code>). That requires code changes.
          </Typography>
        </Section>

        {/* ── Database Migration ───────────────────────────────────────────────── */}
        <Section title="Database Migration (Supabase)" colors={colors}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            The migration <code>20260314000002_add_is_beta_tester_to_profiles.sql</code> adds:
          </Typography>
          <CodeBlock>
{`-- Migration: add_is_beta_tester_to_profiles
-- Beta users are normal users (role = 'user') with is_beta_tester = true.
-- Set when promoting from waitlist or when user signs up via beta path.

alter table public.profiles
  add column if not exists is_beta_tester boolean not null default false;`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md, marginBottom: spacing.sm }}>
            <strong>What you need to do:</strong>
          </Typography>
          <ol style={{ color: colors.text.secondary, marginLeft: spacing.lg, marginBottom: spacing.md }}>
            <li>Open Supabase Dashboard → SQL Editor.</li>
            <li>Run the migration if it hasn&apos;t been applied yet (check <code>profiles</code> columns for <code>is_beta_tester</code>).</li>
            <li>If using Supabase CLI: <code>supabase db push</code> or run the migration file manually.</li>
          </ol>
        </Section>

        {/* ── ChatGPT Prompts: Copy & Creative ─────────────────────────────────── */}
        <Section title="ChatGPT Prompts — Copy & Creative for Socials" colors={colors}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg }}>
            Use these prompts in ChatGPT to generate copy and creative assets. Paste the prompt, optionally customise the bracketed parts, and iterate.
          </Typography>

          {/* Social copy prompt */}
          <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginBottom: spacing.sm, fontSize: '0.95rem' }}>
            Social media captions & copy
          </Typography>
          <CodeBlock>
{`You are a skilled copywriter for a wellness tech product. waQup is a voice-first mindfulness app where users create personalised audio affirmations, meditations, and rituals in their own AI-cloned voice. We're recruiting 100 beta testers.

Write the following for our beta recruitment campaign. Tone: warm, premium, not corporate. Avoid hype. Focus on the unique value: your own voice, not someone else's.

1. Instagram caption (150 words max) — hooks with a question or bold statement, ends with CTA to waqup.io/join
2. LinkedIn post (80 words) — professional but human, for coaches/teachers/wellness practitioners
3. Twitter/X thread opener (1–2 punchy tweets) — curiosity + urgency
4. 5 short ad headlines (under 10 words each) for paid social
5. 3 email subject lines for a waitlist → beta invite sequence
6. Hashtag set (10–15) — mix of product, wellness, creator, beta categories

Include the CTA "waqup.io/join" where relevant.`}
          </CodeBlock>

          {/* Persona-specific copy */}
          <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginTop: spacing.lg, marginBottom: spacing.sm, fontSize: '0.95rem' }}>
            Persona-specific ad copy (teachers, coaches, studios, creators)
          </Typography>
          <CodeBlock>
{`waQup is a voice-first mindfulness app. Users create affirmations, meditations, and rituals in their own AI-cloned voice. We're recruiting beta testers from specific audiences.

Write 2 ad variants (headline + 2–3 sentence body) for each persona. CTA: waqup.io/join. Tone: premium, specific to their pain, not generic.

1. Yoga/meditation teachers — pain: scaling 1:1 guidance; value: turn class scripts into take-home audio
2. Life coaches — pain: clients forget between sessions; value: daily practice in coach's voice
3. Wellness studios — pain: retention, differentiation; value: give every student a branded ritual
4. Content creators (Instagram/TikTok wellness) — pain: audience wants more; value: premium lead magnet, voice-cloned audio drop`}
          </CodeBlock>

          {/* Reels / short-form script */}
          <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginTop: spacing.lg, marginBottom: spacing.sm, fontSize: '0.95rem' }}>
            Reels / TikTok / short-form video script
          </Typography>
          <CodeBlock>
{`waQup: voice-first mindfulness app. Users create affirmations, meditations, and rituals in their own AI-cloned voice. We're recruiting 100 beta testers.

Write a 30-second Reels/TikTok script (on-screen text + voiceover). Structure:
- Hook (first 3 sec): bold claim or question
- Problem: "Calm and Headspace give you someone else's voice"
- Solution: "waQup lets you create in YOUR voice"
- CTA: "Link in bio — 100 spots for beta testers"

Include timing cues (e.g. 0–3s, 3–8s). On-screen text suggestions in brackets.`}
          </CodeBlock>

          {/* Bio / link-in-bio */}
          <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginTop: spacing.lg, marginBottom: spacing.sm, fontSize: '0.95rem' }}>
            Bio & link-in-bio text
          </Typography>
          <CodeBlock>
{`waQup is a voice-first mindfulness app. Users create affirmations, meditations, rituals in their own AI-cloned voice. Beta recruitment campaign: 100 spots.

Write:
1. Instagram bio (150 chars) — includes "beta tester" CTA
2. Link-in-bio button text (3 options: short, medium, punchy)
3. Link-in-bio headline (above the link) — 1 line that explains the offer`}
          </CodeBlock>
        </Section>

        {/* ── ChatGPT Image Prompts ───────────────────────────────────────────── */}
        <Section title="ChatGPT Image Prompts for Beta Recruitment" colors={colors}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Copy these prompts into ChatGPT (DALL·E or image generation) to create social assets:
          </Typography>
          <CodeBlock>
{`Create a set of 4 social media images for a beta tester recruitment campaign for an app called waQup — a voice-first mindfulness platform where you create personalised audio affirmations, meditations, and rituals in your own cloned voice.

Visual style: Dark, mystical, premium. Deep purple/indigo gradient background (#0f0a1e). Glassmorphism cards with frosted blur. Soft glowing orbs of purple and violet light. Clean sans-serif typography (bold headlines, light body). Feels like Apple meets a meditation app. Not corporate. Not cheesy.

Image 1 — Hero Recruitment Post (square 1080×1080):
Bold headline: "Be the voice behind waQup." Subtext: "We're looking for 100 beta testers to shape the future of personalised audio." Include a glowing microphone icon and a soft CTA: "Apply at waqup.io/join". Purple glow, dark background.

Image 2 — Feature highlight (square 1080×1080):
Headline: "What you get as a beta tester." List style with checkmark icons: "50 free Qs credits to create", "Your own AI-cloned voice", "Early access to every feature", "Founding Member badge — forever". Glassmorphism card style. Dark purple theme.

Image 3 — Story format (vertical 1080×1920):
Top: waQup logo + "Beta Tester Wanted" badge. Middle: Simple 3-step graphic: 1. Sign up free → 2. Create your first affirmation → 3. Give us feedback. Bottom CTA: "Tap to join the waitlist". Soft animated-style orb in background.

Image 4 — Social proof / urgency (square 1080×1080):
Headline: "Only 100 spots." Subtext: "Join before we open to the public. Beta testers get Founding Member pricing locked for life." Include a countdown-style visual or limited seats indicator. Premium, minimal, urgent. Dark theme.

All images should feel cohesive as a campaign set. No stock photo humans. Pure UI, typography, icons, and glow effects.`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginTop: spacing.lg, marginBottom: spacing.sm, fontSize: '0.95rem' }}>
            Carousel / multi-slide post (3 slides)
          </Typography>
          <CodeBlock>
{`Create 3 square images (1080×1080) for an Instagram carousel. App: waQup — voice-first mindfulness, create affirmations/meditations/rituals in your own AI-cloned voice. Beta tester recruitment.

Slide 1: "Stop listening. Start creating." — subtext: "Calm and Headspace sell someone else's voice. waQup gives you yours." Dark purple, glow.
Slide 2: "Your voice. Your practice." — 3 bullet icons: AI voice cloning, personalised scripts, practice free forever. Glassmorphism card.
Slide 3: "100 beta spots." — CTA: "waqup.io/join" — Founding Member pricing locked for life. Urgency, minimal.

Style: dark purple (#0f0a1e), glassmorphism, no stock photos.`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginTop: spacing.lg, marginBottom: spacing.sm, fontSize: '0.95rem' }}>
            LinkedIn / professional audience (single image)
          </Typography>
          <CodeBlock>
{`Create a single professional LinkedIn post image (1200×627). waQup: voice-first mindfulness app for coaches, teachers, wellness practitioners. Create affirmations and meditations in your own voice. Beta recruitment.

Headline: "Turn your guidance into scalable audio."
Subtext: "Join 100 practitioners shaping waQup — Founding Member pricing, AI voice cloning, early access."
Style: clean, premium, not playful. Deep purple accent, white/light text. Professional, not mystical.`}
          </CodeBlock>
        </Section>

        {/* ── Onboarding Links ────────────────────────────────────────────────── */}
        <Section title="Onboarding Links — How to Use Them" colors={colors}>
          <GlassCard variant="content" style={{ padding: spacing.lg, marginBottom: spacing.md }}>
            <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginBottom: spacing.sm }}>
              Primary link for beta recruitment
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
              <code>https://waqup.io/join</code> — Founding Member page with 50 Qs, badge, locked pricing. Best for social posts.
            </Typography>
            <a href="/join" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent.primary, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ExternalLink size={14} /> Open /join
            </a>
          </GlassCard>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
            <strong>Other links:</strong>
          </Typography>
          <ul style={{ color: colors.text.secondary, marginLeft: spacing.lg, marginBottom: spacing.md }}>
            <li><code>/signup</code> — Direct account creation. Use when you want immediate access without Founding Member framing.</li>
            <li><code>/waitlist</code> — Multi-step waitlist form. Use for colder audiences you want to nurture before signup.</li>
            <li><code>/join?ref=beta</code> — Same as /join; <code>ref</code> can be passed to track source (needs backend wiring to persist).</li>
          </ul>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
            <strong>Persona-specific:</strong> <code>/for-teachers</code>, <code>/for-coaches</code>, <code>/for-studios</code>, <code>/for-creators</code> — each has a CTA to sign up or join.
          </Typography>
        </Section>

        {/* ── How to Mark Someone as Beta Tester ─────────────────────────────── */}
        <Section title="How to Mark Someone as a Beta Tester" colors={colors}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            After a user signs up, set <code>is_beta_tester = true</code> in Supabase. Run in SQL Editor:
          </Typography>
          <CodeBlock>
{`-- Single user by email (profiles.id = auth.users.id)
UPDATE public.profiles p
SET is_beta_tester = true
FROM auth.users u
WHERE p.id = u.id AND u.email = 'their@email.com';

-- Single user by profile id (from Admin Users)
UPDATE public.profiles
SET is_beta_tester = true
WHERE id = 'uuid-here';

-- All users who signed up after a date
UPDATE public.profiles p
SET is_beta_tester = true
FROM auth.users u
WHERE p.id = u.id
  AND u.created_at >= '2026-03-10'
  AND p.is_beta_tester = false;`}
          </CodeBlock>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md }}>
            <strong>Note:</strong> <code>profiles</code> is keyed by <code>id</code> (from <code>auth.users</code>). To update by email, join with <code>auth.users</code>. Supabase Dashboard → SQL Editor has access to <code>auth.users</code> for service-role sessions.
          </Typography>
        </Section>

        {/* ── Environment Variables & External Setup ─────────────────────────── */}
        <Section title="Environment Variables & External Setup" colors={colors}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            For join, signup, and waitlist to work in production, these env vars and external configs must be in place.
          </Typography>

          <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginBottom: spacing.sm, fontSize: '0.95rem' }}>
            Required env vars (Vercel / .env.local)
          </Typography>
          <CodeBlock>
{`# Supabase — auth, DB, waitlist, profiles
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server-side only; needed for admin/waitlist APIs

# App URL — MUST match your production domain for OAuth redirects
NEXT_PUBLIC_APP_URL=https://waqup.io

# Stripe — if /join uses Founding Member checkout
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
# Price ID for Founding Member plan (create in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...   # Stripe Dashboard → Webhooks

# Optional: Analytics (for tracking campaign)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginTop: spacing.lg, marginBottom: spacing.sm, fontSize: '0.95rem' }}>
            Things to do outside the app
          </Typography>
          <ul style={{ color: colors.text.secondary, marginLeft: spacing.lg }}>
            <li><strong>Domain & DNS</strong> — Point <code>waqup.io</code> to Vercel. Add custom domain in Vercel Project Settings → Domains.</li>
            <li><strong>Supabase Auth</strong> — In Supabase Dashboard → Authentication → URL Configuration: set Site URL to <code>https://waqup.io</code>. Add <code>https://waqup.io/auth/callback</code> to Redirect URLs.</li>
            <li><strong>Supabase Email</strong> — Decide: enable {'"'}Confirm email{'"'} (users must click link) or disable (instant access). Auth → Providers → Email → Confirm email.</li>
            <li><strong>Google OAuth</strong> — If using &quot;Sign in with Google&quot;: Supabase Auth → Providers → Google. Add redirect URI in Google Cloud Console: <code>https://&lt;project-ref&gt;.supabase.co/auth/v1/callback</code>.</li>
            <li><strong>Stripe products</strong> — Create Founding Member subscription in Stripe Dashboard. Copy price ID to <code>NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID</code>. Set up webhook for <code>checkout.session.completed</code>.</li>
            <li><strong>Vercel env vars</strong> — Add all vars above in Vercel → Project Settings → Environment Variables. Use Production + Preview as needed.</li>
            <li><strong>Meta / Facebook Ads</strong> — If running paid campaigns: create Meta App, add <code>META_APP_SECRET</code>, <code>META_WEBHOOK_VERIFY_TOKEN</code>. Configure Pixel if tracking conversions.</li>
            <li><strong>Supabase RLS</strong> — Ensure <code>profiles</code>, <code>waitlist_signups</code>, <code>founding_members</code> tables have correct RLS policies. Check Supabase → Table Editor → each table.</li>
          </ul>

          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md }}>
            Reference: <code>.env.example</code> in repo root. Never commit real secrets.
          </Typography>
        </Section>

        {/* ── Checklist: Make It Work ────────────────────────────────────────── */}
        <Section title="Checklist: Everything You Need to Make It Work" colors={colors}>
          <ol style={{ color: colors.text.secondary, marginLeft: spacing.lg }}>
            <li><strong>Run the migration</strong> — Ensure <code>profiles.is_beta_tester</code> exists.</li>
            <li><strong>Set env vars</strong> — Supabase, <code>NEXT_PUBLIC_APP_URL</code>, Stripe (if using checkout). See section above.</li>
            <li><strong>Configure Supabase Auth</strong> — Site URL, redirects, email confirmation setting.</li>
            <li><strong>Confirm your domain</strong> — <code>waqup.io</code> must be live and pointing to the app.</li>
            <li><strong>Use /join in posts</strong> — Primary CTA for beta recruitment.</li>
            <li><strong>Generate images & copy</strong> — Use the ChatGPT prompts above, export, and post on socials.</li>
            <li><strong>After signups</strong> — Run the SQL update to set <code>is_beta_tester = true</code> for new beta testers.</li>
            <li><strong>Access control</strong> — If you gate app access by <code>access_granted</code> or <code>is_beta_tester</code>, ensure your gate logic reads this column (check <code>AuthProvider</code> / middleware).</li>
          </ol>
        </Section>

        {/* ── Suggestions to Improve ─────────────────────────────────────────── */}
        <Section title="Suggestions to Improve" colors={colors}>
          <ul style={{ color: colors.text.secondary, marginLeft: spacing.lg }}>
            <li><strong>Auto-set <code>is_beta_tester</code> from <code>?ref=beta</code></strong> — When user signs up via <code>/join?ref=beta</code>, persist <code>ref</code> and set <code>is_beta_tester = true</code> automatically in a signup webhook or profile trigger.</li>
            <li><strong>Admin UI to promote users</strong> — Add a &quot;Promote to beta&quot; button in <Link href="/admin/users" style={{ color: colors.accent.primary }}>/admin/users</Link> that sets <code>is_beta_tester = true</code> via an API route.</li>
            <li><strong>Waitlist → beta pipeline</strong> — When approving from <Link href="/admin/waitlist" style={{ color: colors.accent.primary }}>/admin/waitlist</Link>, optionally create account and set <code>is_beta_tester</code> in one action.</li>
            <li><strong>Dedicated beta landing page</strong> — <code>/beta</code> with &quot;100 spots&quot; copy, countdown, and CTA to /join. Keeps messaging focused.</li>
            <li><strong>UTM tracking</strong> — Append <code>?utm_source=instagram&amp;utm_campaign=beta</code> to links and store in waitlist/signup for attribution.</li>
            <li><strong>Email sequence</strong> — After waitlist signup, send a 3-email sequence before inviting to create an account.</li>
          </ul>
        </Section>

        {/* ── Quick Links ─────────────────────────────────────────────────────── */}
        <Section title="Quick Links" colors={colors}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
            <Link href="/join" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <Link2 size={16} /> /join
            </Link>
            <Link href="/waitlist" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <Link2 size={16} /> /waitlist
            </Link>
            <Link href="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <Database size={16} /> Admin Users
            </Link>
            <Link href="/admin/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <Database size={16} /> Admin Waitlist
            </Link>
          </div>
        </Section>
      </div>
    </PageShell>
  );
}
