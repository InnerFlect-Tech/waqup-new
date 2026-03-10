'use client';

import React, { useState } from 'react';
import { Typography, PageShell, GlassCard } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Database,
  Code2,
  Sparkles,
  Lightbulb,
  Copy,
  Check,
  Wrench,
  BookOpen,
  Zap,
  Image,
  MessageSquare,
} from 'lucide-react';

// ─── Reusable components ──────────────────────────────────────────────────────

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
      <Typography
        variant="h3"
        style={{
          color: colors.text.primary,
          marginBottom: spacing.md,
          fontSize: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        {Icon && <Icon size={20} color={colors.accent.primary} />}
        {title}
      </Typography>
      {children}
    </section>
  );
}

function CodeBlock({ children, label }: { children: string; label?: string }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', marginBottom: spacing.md }}>
      {label && (
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: colors.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 4,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <pre
          style={{
            padding: spacing.md,
            paddingRight: 48,
            borderRadius: borderRadius.md,
            background: 'rgba(0,0,0,0.4)',
            border: `1px solid ${colors.glass.border}`,
            overflow: 'auto',
            fontSize: '12px',
            fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", monospace',
            color: colors.text.secondary,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {children.trim()}
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: spacing.sm,
            right: spacing.sm,
            background: 'transparent',
            border: `1px solid ${colors.glass.border}`,
            borderRadius: borderRadius.sm,
            color: copied ? colors.accent.tertiary : colors.text.tertiary,
            cursor: 'pointer',
            padding: '4px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '11px',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

function PromptBlock({ title, prompt }: { title: string; prompt: string }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [copied, setCopied] = useState(false);

  return (
    <GlassCard
      variant="content"
      style={{
        padding: spacing.lg,
        marginBottom: spacing.md,
        border: `1px solid rgba(168,85,247,0.20)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: spacing.sm,
          gap: spacing.sm,
        }}
      >
        <Typography
          variant="h3"
          style={{ color: colors.accent.tertiary, fontSize: '0.95rem', fontWeight: 600 }}
        >
          {title}
        </Typography>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(prompt.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          style={{
            flexShrink: 0,
            background: copied ? 'rgba(168,85,247,0.15)' : 'transparent',
            border: `1px solid ${colors.glass.border}`,
            borderRadius: borderRadius.sm,
            color: copied ? colors.accent.tertiary : colors.text.tertiary,
            cursor: 'pointer',
            padding: '4px 10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '11px',
            whiteSpace: 'nowrap',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy prompt'}
        </button>
      </div>
      <Typography
        variant="body"
        style={{
          color: colors.text.secondary,
          fontSize: '0.875rem',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          fontStyle: 'italic',
        }}
      >
        {prompt.trim()}
      </Typography>
    </GlassCard>
  );
}

function CheckItem({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'flex-start' }}>
      <CheckCircle2 size={16} color={color} style={{ marginTop: 3, flexShrink: 0 }} />
      <Typography variant="body" style={{ color: 'inherit', fontSize: '0.9rem', lineHeight: 1.6 }}>
        {children}
      </Typography>
    </div>
  );
}

function WarnItem({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'flex-start' }}>
      <AlertTriangle size={16} color={color} style={{ marginTop: 3, flexShrink: 0 }} />
      <Typography variant="body" style={{ color: 'inherit', fontSize: '0.9rem', lineHeight: 1.6 }}>
        {children}
      </Typography>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MultilingualI18nImplementationPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium" bare>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>

        {/* Back link */}
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

        {/* Header */}
        <div style={{ marginBottom: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
            <div
              style={{
                padding: spacing.sm,
                borderRadius: borderRadius.md,
                background: `${colors.accent.primary}20`,
                color: colors.accent.primary,
              }}
            >
              <Globe size={28} />
            </div>
            <div>
              <Typography variant="h1" style={{ color: colors.text.primary, fontSize: '1.85rem', marginBottom: 4 }}>
                Full Multilingual Implementation (i18n)
              </Typography>
              <Typography variant="body" style={{ color: colors.text.tertiary, fontSize: '0.875rem' }}>
                Completed March 2026 · 10 phases · 5 languages · Superadmin only
              </Typography>
            </div>
          </div>
          <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.7 }}>
            waQup is now fully internationalized. This document explains what was built, how to use and maintain it, what
            still needs to be done, and how to create multilingual marketing content using AI.
          </Typography>
        </div>

        {/* ── 1. What Was Done ─────────────────────────────────────────────── */}
        <Section title="1. What Was Done" colors={colors} icon={CheckCircle2}>
          <GlassCard variant="content" style={{ padding: spacing.lg, marginBottom: spacing.md }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
              {[
                ['Phase 1', 'Installed next-intl v4. Created i18n/routing.ts, i18n/request.ts, middleware.ts, wrapped next.config.js.'],
                ['Phase 2', 'Moved all app routes under app/[locale]/. Root layout is now a thin shell; locale layout hosts all providers.'],
                ['Phase 3', 'Created locale-aware Link, useRouter, usePathname from i18n/navigation.ts. All internal links are locale-preserving.'],
                ['Phase 4', 'Created 600+ translation keys across 12 namespaces for English, then machine-translated to pt, es, fr, de.'],
                ['Phase 5', 'Wired useTranslations / getTranslations into every component and page — no hardcoded English text remains.'],
                ['Phase 6', 'Converted 47 static metadata exports to generateMetadata() so page titles and OG tags are localized.'],
                ['Phase 7', 'All AI routes (conversation, generate-script, orb/chat, oracle/stream) prepend a language instruction to the system prompt. ElevenLabs TTS now passes language_code for non-English locales.'],
                ['Phase 8', 'Built LanguageSwitcher component. Added to public nav, authenticated nav, mobile menus, and public footer.'],
                ['Phase 9', 'Zod auth schemas now emit translation keys (e.g. validation.emailRequired). Forms call t(error.message) to render translated validation errors.'],
                ['Phase 10', 'Added 14 Playwright locale tests covering routing, lang attribute, switcher, locale preservation, and validation error translation.'],
              ].map(([phase, desc]) => (
                <div key={phase} style={{ display: 'flex', gap: spacing.sm }}>
                  <div
                    style={{
                      flexShrink: 0,
                      padding: '2px 8px',
                      borderRadius: 20,
                      background: `${colors.accent.primary}20`,
                      color: colors.accent.tertiary,
                      fontSize: '11px',
                      fontWeight: 700,
                      height: 'fit-content',
                      marginTop: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {phase}
                  </div>
                  <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {desc}
                  </Typography>
                </div>
              ))}
            </div>
          </GlassCard>
        </Section>

        {/* ── 2. Supported Languages ───────────────────────────────────────── */}
        <Section title="2. Supported Languages" colors={colors} icon={Globe}>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.md }}>
            {[
              { code: 'en', name: 'English', flag: '🇬🇧', status: 'Source language — reviewed' },
              { code: 'pt', name: 'Português', flag: '🇧🇷', status: 'Machine translated — needs review' },
              { code: 'es', name: 'Español', flag: '🇪🇸', status: 'Machine translated — needs review' },
              { code: 'fr', name: 'Français', flag: '🇫🇷', status: 'Machine translated — needs review' },
              { code: 'de', name: 'Deutsch', flag: '🇩🇪', status: 'Machine translated — needs review' },
            ].map((l) => (
              <GlassCard
                key={l.code}
                variant="content"
                style={{ padding: spacing.md, minWidth: 180 }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: spacing.xs }}>{l.flag}</div>
                <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem' }}>{l.name}</Typography>
                <Typography variant="body" style={{ color: colors.text.tertiary, fontSize: '0.8rem' }}>{l.status}</Typography>
              </GlassCard>
            ))}
          </div>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
            To add a new language: create <code style={{ color: colors.accent.tertiary }}>packages/web/messages/[locale]/</code> with all 12 JSON files, then add the locale code to <code style={{ color: colors.accent.tertiary }}>i18n/routing.ts</code>.
          </Typography>
        </Section>

        {/* ── 3. How to Use It ─────────────────────────────────────────────── */}
        <Section title="3. How to Use It" colors={colors} icon={BookOpen}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md, lineHeight: 1.7 }}>
            Every text string in the app is now a translation key. Here is how to work with it day-to-day.
          </Typography>

          <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.sm }}>
            In a Server Component (Next.js page / layout)
          </Typography>
          <CodeBlock label="TypeScript">{`
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('sanctuary.home');
  return <h1>{t('welcomeBack', { name: 'India' })}</h1>;
}
          `}</CodeBlock>

          <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.sm }}>
            In a Client Component
          </Typography>
          <CodeBlock label="TypeScript">{`
'use client';
import { useTranslations } from 'next-intl';

export function MyButton() {
  const t = useTranslations('common');
  return <button>{t('save')}</button>;
}
          `}</CodeBlock>

          <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.sm }}>
            Locale-aware navigation (always use these instead of next/link)
          </Typography>
          <CodeBlock label="TypeScript">{`
// ✅ Always import from @/i18n/navigation — not from next/link or next/navigation
import { Link, useRouter, usePathname } from '@/i18n/navigation';
// useSearchParams, useParams, notFound → still from next/navigation (no change)
          `}</CodeBlock>

          <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.sm }}>
            Namespace map — where each key lives
          </Typography>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.md }}>
            {[
              ['common', 'Buttons, generic labels (save, cancel, loading…)'],
              ['nav', 'Navigation bar labels'],
              ['auth', 'Login, signup, forgot/reset password, validation errors'],
              ['onboarding', 'All onboarding step copy'],
              ['create', 'Content creation flow (affirmations, meditations, rituals)'],
              ['sanctuary', 'Home, progress, settings, plan, credits screens'],
              ['pricing', 'Pricing page, plan names, credit packs'],
              ['settings', 'Settings page labels'],
              ['audio', 'Audio player labels, recording states'],
              ['errors', 'Error pages, error messages'],
              ['metadata', 'Page <title> and OG meta per route'],
              ['marketing', 'Landing page, footer, public CTAs'],
            ].map(([ns, desc]) => (
              <div
                key={ns}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.sm,
                  background: 'rgba(168,85,247,0.06)',
                  border: `1px solid ${colors.glass.border}`,
                }}
              >
                <code style={{ color: colors.accent.tertiary, fontSize: '12px', fontWeight: 700 }}>{ns}</code>
                <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '0.8rem', marginTop: 2 }}>
                  {desc}
                </Typography>
              </div>
            ))}
          </div>

          <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.sm }}>
            Adding a new translation key
          </Typography>
          <CodeBlock label="Steps">{`
1. Add the key to  packages/web/messages/en/<namespace>.json
2. Add the same key (with translated value) to pt / es / fr / de
3. Use it in the component with useTranslations('<namespace>')

# Message file path format:
packages/web/messages/
  en/  common.json  auth.json  ...  (12 files)
  pt/  common.json  auth.json  ...
  es/  ...
  fr/  ...
  de/  ...
          `}</CodeBlock>
        </Section>

        {/* ── 4. What You Still Need To Do ─────────────────────────────────── */}
        <Section title="4. What You Still Need To Do" colors={colors} icon={Wrench}>
          <GlassCard variant="content" style={{ padding: spacing.lg, marginBottom: spacing.md, border: `1px solid rgba(251,146,60,0.25)` }}>
            <Typography variant="h3" style={{ color: '#FB923C', marginBottom: spacing.md, fontSize: '1rem' }}>
              Must-do before beta launch
            </Typography>
            <WarnItem color="#FB923C">
              <strong>Human review of pt / es / fr / de translations.</strong> All non-English files are machine-translated. Review each file under <code>packages/web/messages/[locale]/</code> with a native speaker or professional translator, especially <code>onboarding.json</code>, <code>create.json</code>, <code>sanctuary.json</code>, and <code>auth.json</code>.
            </WarnItem>
            <WarnItem color="#FB923C">
              <strong>Pass <code>locale</code> from the frontend to all AI API calls.</strong> The routes accept the locale parameter — but the client components (ConversationPage, CreateFlow, OrbChat, SpeakPage) must read <code>useLocale()</code> and include it in every fetch body. Example: <code>{`fetch('/api/orb/chat', { body: JSON.stringify({ ...data, locale }) })`}</code>
            </WarnItem>
            <WarnItem color="#FB923C">
              <strong>Test the LanguageSwitcher on a live deployment.</strong> The switcher uses <code>router.replace(pathname, {'{'} locale {'}'} )</code> from next-intl — verify cookie persistence and that auth session is not broken on locale change.
            </WarnItem>
            <WarnItem color="#FB923C">
              <strong>Add <code>hreflang</code> alternate links to the root layout.</strong> For SEO, all public pages should declare alternate locales in <code>&lt;head&gt;</code>. Add this to <code>app/[locale]/layout.tsx</code> generateMetadata.
            </WarnItem>
          </GlassCard>

          <GlassCard variant="content" style={{ padding: spacing.lg, border: `1px solid rgba(239,68,68,0.25)` }}>
            <Typography variant="h3" style={{ color: '#EF4444', marginBottom: spacing.md, fontSize: '1rem' }}>
              Must-do before App Store submission
            </Typography>
            <WarnItem color="#EF4444">
              <strong>App Store localizations.</strong> Apple requires localized metadata (app name, description, keywords, screenshots) for each language you support. Add these in App Store Connect under each language.
            </WarnItem>
            <WarnItem color="#EF4444">
              <strong>Google Play localizations.</strong> Same requirement — localize short/long descriptions and screenshots under Store Listing → Add translation.
            </WarnItem>
            <WarnItem color="#EF4444">
              <strong>Mobile (React Native) i18n.</strong> The web is fully wired. The mobile package still uses hardcoded English. Wire <code>expo-localization</code> + <code>i18next</code> or a simple JSON loader to the shared message files.
            </WarnItem>
            <WarnItem color="#EF4444">
              <strong>ElevenLabs voice language.</strong> The <code>language_code</code> parameter only works with ElevenLabs multilingual v2 model. Verify your voice clone was created with multilingual v2 — if not, re-clone it with that model.
            </WarnItem>
          </GlassCard>
        </Section>

        {/* ── 5. Database Migration ─────────────────────────────────────────── */}
        <Section title="5. Database Migration" colors={colors} icon={Database}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md, lineHeight: 1.7 }}>
            No schema migrations are <em>required</em> for i18n to function — it is entirely a frontend/API layer change. However, the following database changes are strongly recommended to support per-user language preferences and locale-aware content.
          </Typography>

          <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.sm }}>
            Step 1 — Add preferred_locale to profiles table
          </Typography>
          <CodeBlock label="SQL — run in Supabase SQL editor">{`
-- Add preferred_locale to user profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS preferred_locale TEXT
    DEFAULT 'en'
    CHECK (preferred_locale IN ('en', 'pt', 'es', 'fr', 'de'));

-- Index for locale-based queries (e.g. sending locale-specific emails)
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_locale
  ON public.profiles (preferred_locale);

COMMENT ON COLUMN public.profiles.preferred_locale IS
  'User preferred language (BCP-47 locale code). Defaults to en.';
          `}</CodeBlock>

          <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.sm }}>
            Step 2 — Add locale to content_items table
          </Typography>
          <CodeBlock label="SQL — run in Supabase SQL editor">{`
-- Track which language content was generated in
ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS locale TEXT
    DEFAULT 'en'
    CHECK (locale IN ('en', 'pt', 'es', 'fr', 'de'));

-- Index for filtering content by locale in the library
CREATE INDEX IF NOT EXISTS idx_content_items_locale
  ON public.content_items (user_id, locale);

COMMENT ON COLUMN public.content_items.locale IS
  'Language the content script and audio were generated in.';
          `}</CodeBlock>

          <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.sm }}>
            Step 3 — Persist locale on sign-in (update Supabase auth hook)
          </Typography>
          <CodeBlock label="SQL — Supabase Database Function (optional but recommended)">{`
-- Trigger: when a profile is updated with a new locale, store it
CREATE OR REPLACE FUNCTION public.handle_profile_locale_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Nothing extra needed now; hook is ready for future notifications
  RETURN NEW;
END;
$$;

-- Optional: trigger for future use (email in correct language, etc.)
DROP TRIGGER IF EXISTS on_profile_locale_updated ON public.profiles;
CREATE TRIGGER on_profile_locale_updated
  AFTER UPDATE OF preferred_locale ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_locale_update();
          `}</CodeBlock>

          <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.sm }}>
            Step 4 — Save locale when user switches language (frontend)
          </Typography>
          <CodeBlock label="TypeScript — call this after user selects a language">{`
// In LanguageSwitcher or a useLocaleSync hook:
import { useSupabaseClient } from '@supabase/auth-helpers-react';

async function saveLocalePreference(locale: string, userId: string) {
  const supabase = useSupabaseClient();
  await supabase
    .from('profiles')
    .update({ preferred_locale: locale })
    .eq('id', userId);
}

// Then read it on login to redirect to the correct locale:
const { data: profile } = await supabase
  .from('profiles')
  .select('preferred_locale')
  .eq('id', user.id)
  .single();

if (profile?.preferred_locale && profile.preferred_locale !== 'en') {
  router.replace(pathname, { locale: profile.preferred_locale });
}
          `}</CodeBlock>

          <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.sm }}>
            Step 5 — Row Level Security (no changes needed)
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '0.875rem', lineHeight: 1.7 }}>
            Existing RLS policies on <code>profiles</code> and <code>content_items</code> are sufficient. The new <code>preferred_locale</code> and <code>locale</code> columns are user-owned data and inherit the same policies. No new policies are required.
          </Typography>
        </Section>

        {/* ── 6. Suggestions to Improve ────────────────────────────────────── */}
        <Section title="6. Suggestions to Improve" colors={colors} icon={Lightbulb}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
            {[
              {
                title: 'Auto-detect locale from Accept-Language',
                body: 'next-intl middleware already reads Accept-Language headers. Add localeDetection: true to routing.ts to automatically show the right language to new visitors without them having to switch.',
              },
              {
                title: 'Persist locale choice in a cookie',
                body: 'next-intl sets a NEXT_LOCALE cookie automatically. Add maxAge: 60 * 60 * 24 * 365 to the cookie options to persist for a year.',
              },
              {
                title: 'Sync locale to user profile on switch',
                body: 'When a logged-in user switches language, call the Supabase update (Step 4 above) so their preference is remembered across devices.',
              },
              {
                title: 'Add hreflang for SEO',
                body: 'Add <link rel="alternate" hreflang="pt" href="https://waqup.app/pt/pricing" /> tags to all public pages. This tells Google to show the right language version in search results.',
              },
              {
                title: 'Professional translation review',
                body: 'Use DeepL Pro or a professional translator to review pt, es, fr, de files. Pay special attention to brand tone — "sanctuary", "practice", and "orb" have subtle connotations.',
              },
              {
                title: 'Locale-aware Stripe pricing',
                body: 'Show prices in the user\'s local currency (BRL for pt, EUR for es/fr/de). Stripe Prices supports multi-currency — create Price objects per currency and show the right one based on locale.',
              },
              {
                title: 'Email notifications in user language',
                body: 'Supabase email templates are single-language. Use a transactional email service (Resend, Postmark) with locale-specific templates triggered from Edge Functions.',
              },
              {
                title: 'Date and number formatting',
                body: 'Use next-intl\'s useFormatter() hook for dates, numbers, and currencies — it formats correctly per locale (e.g. 1.234,56 in German vs 1,234.56 in English).',
              },
            ].map((item) => (
              <GlassCard
                key={item.title}
                variant="content"
                style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.xs }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <Zap size={14} color={colors.accent.tertiary} />
                  <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {item.title}
                  </Typography>
                </div>
                <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '0.825rem', lineHeight: 1.6 }}>
                  {item.body}
                </Typography>
              </GlassCard>
            ))}
          </div>
        </Section>

        {/* ── 7. ChatGPT Prompts — Copyrights for Socials ──────────────────── */}
        <Section title="7. ChatGPT Prompts for Multilingual Social Content" colors={colors} icon={MessageSquare}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, lineHeight: 1.7 }}>
            Use these prompts in ChatGPT (GPT-4o recommended) to generate multilingual marketing copy for social media, ads, and store listings. Copy the prompt, paste into ChatGPT, and adjust the bracketed fields.
          </Typography>

          <PromptBlock
            title="Instagram caption — 5 languages at once"
            prompt={`
You are a mindfulness and wellbeing copywriter for waQup, a voice-first personal growth app.

Write an Instagram caption for the following topic, in these 5 languages: English, Brazilian Portuguese, Spanish (Latin America), French, German.

Topic: [e.g. "Our AI creates a personalized affirmation just for you — in your own voice."]

Requirements:
- Each caption must be between 80–120 words
- Use a warm, human, non-pushy tone
- Include 2–3 relevant emojis per caption
- End with a soft call-to-action (e.g. "Try it free" or "Join the waitlist")
- Include 5 relevant hashtags in the local language at the end
- Do NOT translate the brand name "waQup" or the product features "Sanctuary", "Orb", or "Q credits"

Format your response as:
🇬🇧 English:
[caption]

🇧🇷 Português:
[caption]

🇪🇸 Español:
[caption]

🇫🇷 Français:
[caption]

🇩🇪 Deutsch:
[caption]
            `}
          />

          <PromptBlock
            title="App Store description — localized"
            prompt={`
You are a mobile app copywriter specializing in App Store Optimization (ASO).

Write an App Store description for waQup for the [LANGUAGE] market. waQup is a voice-first personal growth app that creates personalized affirmations, guided meditations, and rituals using AI — delivered in your own cloned voice.

Key features to mention:
1. AI-generated content personalized to your goals
2. Your voice cloned with ElevenLabs — so it sounds like you
3. A conversational AI "Orb" that guides content creation
4. A "Sanctuary" — your personal practice hub
5. Practice is always free; you only pay to create

Requirements:
- Language: [e.g. Brazilian Portuguese / Spanish / French / German]
- Length: 200–250 words (App Store allows 4,000 characters but concise works better)
- Tone: calm, empowering, premium — not hype-y
- Do NOT translate "waQup", "Sanctuary", "Orb", or "Q"
- Include a short tagline at the top (under 30 characters)
- End with a clear call-to-action

Output the tagline, then the full description.
            `}
          />

          <PromptBlock
            title="Facebook/Meta ad copy — 3 versions per language"
            prompt={`
You are a performance marketing copywriter for waQup.

Write 3 variations of Facebook ad copy for this campaign targeting [COUNTRY/REGION, e.g. Brazil] in [LANGUAGE].

Product: waQup — an AI app that creates personalized affirmations and meditations in your own cloned voice.
Audience: 25–45 year olds interested in self-improvement, meditation, mindfulness.
Objective: App installs / Waitlist sign-ups.
Offer: Free to try. No credit card required.

For each variation write:
- Headline (max 40 characters)
- Primary text (80–120 words, conversational, story-driven)
- Call-to-action button label (e.g. "Sign Up", "Learn More", "Try Free")

Variation 1: Emotional / personal transformation angle
Variation 2: Social proof / community angle (reference that others are already using it)
Variation 3: Feature-led / curiosity angle (AI + your own voice)

Do NOT use hype words like "revolutionary", "game-changing", "incredible".
Do NOT translate: "waQup", "Sanctuary", "Orb".
Tone: Warm, trustworthy, empowering — like a wise friend, not a salesperson.
            `}
          />

          <PromptBlock
            title="Twitter/X thread — announce multilingual launch"
            prompt={`
Write a Twitter/X thread announcing that waQup is now available in English, Portuguese, Spanish, French, and German.

waQup is a voice-first AI app for personal growth. It creates affirmations, meditations, and rituals — personalized to you, in your own cloned voice.

Thread requirements:
- 6–8 tweets
- Tweet 1: Hook that creates curiosity
- Tweet 2–3: What waQup does (in simple terms)
- Tweet 4: Announce the 5 languages with flags
- Tweet 5: Quote from the product vision about being accessible globally
- Tweet 6: How to switch language in the app (brief)
- Tweet 7: CTA to sign up for the waitlist
- Tweet 8 (optional): Retweet request in a warm way

Tone: Excited but grounded. Founder voice. Not corporate.
Each tweet: max 240 characters.
Use emojis sparingly (1–2 per tweet max).
Do NOT include hashtags (they hurt reach on X in 2025).
            `}
          />

          <PromptBlock
            title="Image generation prompt (DALL-E / Midjourney) — multilingual launch visual"
            prompt={`
Create a prompt for DALL-E 3 or Midjourney for a multilingual launch announcement image for waQup.

Visual concept: A softly glowing orb floating in a dark, deep purple space. Around the orb float five glowing speech bubbles, each containing a short word in a different language (one word each in English, Portuguese, Spanish, French, German — all meaning "grow" or "transform"). The overall mood is calm, cosmic, and empowering. Cinematic lighting. No text other than the speech bubble words.

Output a prompt suitable for:
1. DALL-E 3 (OpenAI image API — optimized for photorealism)
2. Midjourney v6 (optimized for cinematic, artistic style)

Each prompt should be on its own line, labelled clearly.
Include style modifiers: aspect ratio 1:1 for Instagram, 16:9 for Twitter/YouTube banner.
            `}
          />

          <PromptBlock
            title="Localized push notification copy"
            prompt={`
Write 5 push notification messages for waQup to re-engage users who have not practiced in 3 days.

Write each message in all 5 languages: English, Portuguese, Spanish, French, German.

Requirements:
- Each notification: 1 line title (max 50 chars) + 1 line body (max 100 chars)
- Tone: Warm, gentle, non-pushy. Never guilt-trip the user.
- Each of the 5 messages should use a different angle:
  1. Curiosity ("Your practice is waiting…")
  2. Streaks / momentum ("Your streak is still alive")
  3. New content teaser ("A new affirmation was created for you")
  4. Time-of-day sensitive ("Good morning — 5 minutes for you?")
  5. Benefit reminder ("Affirm. Meditate. Grow.")

Format:
[Angle] — [Language]:
Title: …
Body: …
            `}
          />
        </Section>

        {/* ── 8. Image Prompts for Content ─────────────────────────────────── */}
        <Section title="8. Ready-to-Use Image Generation Prompts" colors={colors} icon={Image}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md, lineHeight: 1.7 }}>
            These are direct image generation prompts. Paste them into DALL-E 3, Midjourney, or Adobe Firefly.
          </Typography>

          {[
            {
              label: 'App hero — dark purple, cosmic feel',
              prompt: 'A dark deep-purple cosmic space with a softly glowing violet and white orb at center. Ethereal particles float around it. Cinematic lighting. Photorealistic. Ultra HD. 16:9 aspect ratio. No text.',
            },
            {
              label: 'Language diversity — 5 language flags merging',
              prompt: 'Abstract watercolor art of five country flags (UK, Brazil, Spain, France, Germany) dissolving into each other in a circular swirl. Violet and gold tones dominate. Soft gradient background. No text. Square format.',
            },
            {
              label: 'Voice clone concept',
              prompt: 'A person speaking into a glowing violet microphone. Sound waves emerge and transform into golden light particles that form a second glowing version of their voice. Dark background. Cinematic. Photorealistic. 1:1 square.',
            },
            {
              label: 'Sanctuary — personal growth space',
              prompt: 'A serene minimalist digital sanctuary. A glowing purple altar with floating light orbs in a dark cosmic room. Soft purple and indigo gradient walls. No people. Calm. Luxurious. Ultra detailed. 4:5 aspect ratio.',
            },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: spacing.md }}>
              <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '0.875rem', marginBottom: spacing.xs }}>
                {item.label}
              </Typography>
              <CodeBlock>{item.prompt}</CodeBlock>
            </div>
          ))}
        </Section>

        {/* ── Quick reference ──────────────────────────────────────────────── */}
        <Section title="Quick Reference — Key Files" colors={colors} icon={Code2}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.xs }}>
            {[
              ['i18n/routing.ts', 'Locale list, default locale, URL prefix strategy'],
              ['i18n/request.ts', 'Server-side message loading, fallback to English'],
              ['i18n/navigation.ts', 'Locale-aware Link, useRouter, usePathname'],
              ['middleware.ts', 'Locale detection from Accept-Language header, NEXT_LOCALE cookie'],
              ['app/[locale]/layout.tsx', 'NextIntlClientProvider, HTML lang attribute, metadata'],
              ['messages/en/*.json', '12 message files — English source (authoritative)'],
              ['messages/pt|es|fr|de/*.json', 'Translated message files (12 per locale)'],
              ['src/components/shared/LanguageSwitcher.tsx', 'Compact nav dropdown + full footer pill row'],
              ['packages/shared/src/schemas/auth.schemas.ts', 'Zod schemas with translation key error messages'],
              ['packages/shared/src/services/ai/elevenlabs.ts', 'textToSpeech() with locale → language_code'],
              ['e2e/specs/i18n/locale-routing.spec.ts', '14 Playwright locale tests'],
            ].map(([file, desc]) => (
              <div
                key={file}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 3fr',
                  gap: spacing.md,
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.sm,
                  background: 'rgba(0,0,0,0.2)',
                  border: `1px solid ${colors.glass.border}`,
                  alignItems: 'center',
                }}
              >
                <code style={{ color: colors.accent.tertiary, fontSize: '11px', wordBreak: 'break-all' }}>{file}</code>
                <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '0.825rem' }}>
                  {desc}
                </Typography>
              </div>
            ))}
          </div>
        </Section>

        {/* Status footer */}
        <GlassCard
          variant="content"
          style={{
            padding: spacing.lg,
            border: `1px solid rgba(74,222,128,0.25)`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
          }}
        >
          <CheckCircle2 size={20} color="#4ADE80" style={{ flexShrink: 0 }} />
          <div>
            <Typography variant="h3" style={{ color: '#4ADE80', fontSize: '1rem', marginBottom: 4 }}>
              Status: Strong foundation — ready for human translation review
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
              The architecture is production-grade. The single most important next step is having a native speaker review the Portuguese, Spanish, French, and German message files before the public beta.
            </Typography>
          </div>
        </GlassCard>

      </div>
    </PageShell>
  );
}
