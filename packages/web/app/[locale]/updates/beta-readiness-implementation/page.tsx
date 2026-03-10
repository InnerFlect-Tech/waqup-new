'use client';

import React from 'react';
import { Typography, PageShell, GlassCard } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Shield, Zap, RefreshCw, Mic, FileText, Database, Settings, Sparkles } from 'lucide-react';

function Section({
  title,
  children,
  colors,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
  icon?: React.ComponentType<{ size?: number; color?: string }>;
}) {
  return (
    <section style={{ marginBottom: spacing.xl }}>
      <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.md, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        {Icon && <Icon size={20} color={colors.accent.primary} />}
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

export default function BetaReadinessImplementationPage() {
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
            Beta Readiness Implementation
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            What was done in the beta audit, how to make it work, database migrations, suggestions to improve, and ChatGPT prompts for copyrights and social media.
          </Typography>
        </div>

        {/* ── What Was Done ───────────────────────────────────────────────────── */}
        <Section title="What Was Done" colors={colors} icon={FileText}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Four critical/high-severity changes were implemented to make the app beta-ready:
          </Typography>
          <ul style={{ color: colors.text.secondary, marginLeft: spacing.lg, marginBottom: spacing.md }}>
            <li>
              <strong>R1 — Server-side auth in middleware</strong> — <code>packages/web/middleware.ts</code> now checks Supabase session at the Edge for protected routes (<code>/library</code>, <code>/create</code>, <code>/profile</code>, <code>/sanctuary</code>, <code>/speak</code>, <code>/marketplace</code>). Unauthenticated requests are redirected to <code>/</code> before any page renders.
            </li>
            <li>
              <strong>R3 — Get Qs link mid-session</strong> — When credits run low during an active Oracle session, a &quot;Get Qs →&quot; pill link to <code>/sanctuary/credits/buy</code> appears in the in-session panel so users aren&apos;t stranded.
            </li>
            <li>
              <strong>R4 — Sanctuary streak error state</strong> — When <code>getProgressStats()</code> fails, the streak card shows a &quot;Retry →&quot; button instead of silently displaying <code>0 days streak</code>.
            </li>
            <li>
              <strong>R5 — Orb &quot;Start over&quot; button</strong> — During the <code>generating-script</code> phase, a ghost &quot;Start over&quot; button appears after 3 seconds so users can reset the flow if AI hangs.
            </li>
          </ul>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Eight earlier fixes from the beta audit (create hub links, alert → styled banner, checkout button guard, analytics race fix, test fixture fixes, etc.) are also in place — see <code>docs/audits/beta-readiness-report.md</code> for the full list.
          </Typography>
        </Section>

        {/* ── How to Use It ─────────────────────────────────────────────────── */}
        <Section title="How to Use It" colors={colors} icon={Zap}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            These changes are built-in. No extra configuration is required. Once deployed:
          </Typography>
          <ul style={{ color: colors.text.secondary, marginLeft: spacing.lg }}>
            <li><strong>Auth</strong> — Protected routes are enforced server-side. Users without a valid Supabase session hitting <code>/sanctuary</code> or <code>/speak</code> will be redirected before the page loads.</li>
            <li><strong>Get Qs</strong> — When credits run out during a Speak session, the &quot;Get Qs →&quot; link appears automatically.</li>
            <li><strong>Streak retry</strong> — If the progress stats API fails, users see a &quot;Retry →&quot; button in the streak card.</li>
            <li><strong>Start over</strong> — During Orb script generation, after 3 seconds a &quot;Start over&quot; button appears below the &quot;crafting script…&quot; label.</li>
          </ul>
        </Section>

        {/* ── What You Need to Do to Make It Work ─────────────────────────────── */}
        <Section title="Everything You Need to Make It Work" colors={colors} icon={Settings}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Checklist before opening beta:
          </Typography>
          <ol style={{ color: colors.text.secondary, marginLeft: spacing.lg, marginBottom: spacing.md }}>
            <li>
              <strong>Environment variables</strong> — Ensure <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> are set. Middleware uses these to validate sessions.
            </li>
            <li>
              <strong>Run required Supabase migrations</strong> — See &quot;Database Migration&quot; below.
            </li>
            <li>
              <strong>Promote superadmins</strong> — Use <Link href="/admin/users" style={{ color: colors.accent.primary }}>/admin/users</Link> or the SQL script in <code>supabase/scripts/repair_superadmin_daniel.sql</code> to set <code>profiles.role = &apos;superadmin&apos;</code> for admin accounts.
            </li>
            <li>
              <strong>E2E tests in CI</strong> — CI already sets <code>OVERRIDE_LOGIN_EMAIL</code>, <code>OVERRIDE_LOGIN_PASSWORD</code>, and <code>NEXT_PUBLIC_ENABLE_TEST_LOGIN</code>. No action needed.
            </li>
          </ol>
        </Section>

        {/* ── Database Migration (Supabase) ───────────────────────────────────── */}
        <Section title="Database Migration (Supabase)" colors={colors} icon={Database}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            The beta readiness implementation does <strong>not</strong> introduce new migrations. Ensure these existing migrations have been applied:
          </Typography>
          <CodeBlock>
{`-- 1. Role column (superadmin, admin, creator, user)
-- Migration: 20260310000002_add_role_to_profiles.sql
alter table public.profiles
  add column if not exists role text not null default 'user'
    check (role in ('user', 'creator', 'admin', 'superadmin'));

-- 2. Access gate (access_granted — who can use the app)
-- Migration: 20260310000004_add_access_granted_to_profiles.sql
alter table public.profiles
  add column if not exists access_granted boolean not null default false;

-- 3. Beta tester flag (for recruitment tracking)
-- Migration: 20260314000002_add_is_beta_tester_to_profiles.sql
alter table public.profiles
  add column if not exists is_beta_tester boolean not null default false;`}
          </CodeBlock>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md, marginBottom: spacing.sm }}>
            <strong>What you need to do:</strong>
          </Typography>
          <ol style={{ color: colors.text.secondary, marginLeft: spacing.lg, marginBottom: spacing.md }}>
            <li>Open Supabase Dashboard → SQL Editor.</li>
            <li>Check <code>profiles</code> table columns: <code>role</code>, <code>access_granted</code>, <code>is_beta_tester</code> should exist.</li>
            <li>If using Supabase CLI: run <code>supabase db push</code> to apply any pending migrations.</li>
            <li>To apply manually: run each migration file from <code>supabase/migrations/</code> in order if they are not yet applied.</li>
          </ol>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            <strong>Verify:</strong> Run <code>SELECT column_name FROM information_schema.columns WHERE table_name = &apos;profiles&apos;;</code> — you should see <code>role</code>, <code>access_granted</code>, <code>is_beta_tester</code>.
          </Typography>
        </Section>

        {/* ── Suggestions to Improve ─────────────────────────────────────────── */}
        <Section title="Suggestions to Improve" colors={colors} icon={Sparkles}>
          <ul style={{ color: colors.text.secondary, marginLeft: spacing.lg }}>
            <li><strong>Override login in middleware</strong> — E2E tests use a test login that stores user in localStorage; middleware cannot read that. If tests fail on protected routes, consider a cookie-based override (e.g. <code>waqup-override-user</code>) that middleware can read, or keep client-side redirect as acceptable for test-only flow.</li>
            <li><strong>Rate-limit auth checks</strong> — Middleware calls <code>supabase.auth.getUser()</code> on every protected request. For high traffic, consider caching session validity at the Edge or using a lighter-weight cookie check.</li>
            <li><strong>Streak retry with exponential backoff</strong> — If <code>getProgressStats()</code> fails repeatedly, add a retry limit and user-facing message (e.g. &quot;Progress unavailable — try again later&quot;).</li>
            <li><strong>Orb Start over — also during gathering</strong> — Plan mentions a &quot;Start over&quot; during <code>gathering</code>; currently it only appears in <code>generating-script</code>. Add a small link during gathering if users request it.</li>
            <li><strong>Get Qs — track low-credits upsell clicks</strong> — Fire an analytics event when the mid-session &quot;Get Qs&quot; link is clicked for conversion insight.</li>
          </ul>
        </Section>

        {/* ── ChatGPT Prompts for Copyrights & Social Media ───────────────────── */}
        <Section title="ChatGPT Prompts for Copyrights, Socials & Images" colors={colors} icon={FileText}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Copy these prompts into ChatGPT to generate copyright text, social captions, and image descriptions for waQup marketing.
          </Typography>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 600 }}>
            1. Copyright notice for footer / legal pages
          </Typography>
          <CodeBlock>
{`Generate a short copyright notice for waQup — a voice-first mindfulness app where users create personalised affirmations, meditations, and rituals in their own cloned voice. Include: year range (2024–2026), company name placeholder, and "All rights reserved." Keep it under 2 lines.`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 600, marginTop: spacing.md }}>
            2. Social media caption with attribution
          </Typography>
          <CodeBlock>
{`Write a 2–3 sentence Instagram caption for a post promoting waQup beta. Tone: warm, inviting, not salesy. Include: brief product description, CTA to waqup.io/join, hashtags #waQup #mindfulness #personalgrowth. Add proper attribution: "waQup — create affirmations in your own voice."`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 600, marginTop: spacing.md }}>
            3. Image alt text for accessibility
          </Typography>
          <CodeBlock>
{`Generate alt text for a social media image promoting waQup. The image shows: dark purple gradient background, glowing microphone icon, headline "Be the voice behind waQup", subtext about beta testers. Alt text must be under 125 characters, descriptive, and inclusive.`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 600, marginTop: spacing.md }}>
            4. User-generated content (UGC) terms
          </Typography>
          <CodeBlock>
{`Draft 2–3 short paragraphs for a "User-Generated Content" section in waQup's terms. Users create audio affirmations, meditations, and rituals. Include: (a) users retain ownership, (b) waQup gets a licence to host and play content, (c) users must not upload infringing material. Plain language, not legalese.`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 600, marginTop: spacing.md }}>
            5. DALL·E / image generation prompt for social assets
          </Typography>
          <CodeBlock>
{`Create a set of 4 social media images for waQup beta recruitment. waQup is a voice-first mindfulness platform where users create personalised affirmations, meditations, and rituals in their own cloned voice.

Visual style: Dark, mystical, premium. Deep purple/indigo gradient (#0f0a1e). Glassmorphism cards. Soft glowing orbs. Clean sans-serif. Apple meets meditation app. Not corporate.

Image 1 (1080×1080): Headline "Be the voice behind waQup." Subtext: "We're looking for 100 beta testers." CTA: "Apply at waqup.io/join". Microphone icon, purple glow.

Image 2 (1080×1080): "What you get as a beta tester." Checklist: 50 free Qs, AI-cloned voice, early access, Founding Member badge. Dark purple glassmorphism.

Image 3 (1080×1920 story): waQup logo + "Beta Tester Wanted". 3 steps: Sign up → Create first affirmation → Give feedback. CTA: "Tap to join".

Image 4 (1080×1080): "Only 100 spots." Urgency. Founding Member pricing locked for life. Minimal, premium, dark theme.

No stock humans. UI, typography, icons, glow only.`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md }}>
            <strong>Tip:</strong> For legal text (copyright, UGC terms), always have a lawyer review before publishing.
          </Typography>
        </Section>

        {/* ── Quick Links ─────────────────────────────────────────────────────── */}
        <Section title="Quick Links" colors={colors}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
            <Link href="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <Database size={16} /> Admin Users
            </Link>
            <Link href="/admin/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <Database size={16} /> Admin Waitlist
            </Link>
            <Link href="/sanctuary/credits/buy" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <Zap size={16} /> Buy Qs
            </Link>
            <Link href="/speak" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <Mic size={16} /> Speak
            </Link>
            <a href="/join" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <FileText size={16} /> /join
            </a>
          </div>
        </Section>
      </div>
    </PageShell>
  );
}
