'use client';

import React from 'react';
import { Typography, PageShell, GlassCard } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft,
  Mic,
  FileText,
  Database,
  Settings,
  Sparkles,
  Zap,
  Headphones,
  Upload,
  Play,
} from 'lucide-react';

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

export default function AudioSystemImplementationPage() {
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
          <Typography
            variant="h1"
            style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}
          >
            Audio System Implementation
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Full professional audio audit fixes: own-voice recording, atmosphere presets, Safari compatibility,
            database migrations, and ChatGPT prompts for copyrights and social assets.
          </Typography>
        </div>

        {/* ── What Was Done ───────────────────────────────────────────────────── */}
        <Section title="What Was Done" colors={colors} icon={FileText}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Ten critical and high-priority fixes were implemented across the entire waQup audio pipeline:
          </Typography>
          <ul style={{ color: colors.text.secondary, marginLeft: spacing.lg, marginBottom: spacing.md }}>
            <li>
              <strong>Own-voice recording (critical)</strong> — Recorded blobs are now uploaded to Supabase Storage
              via <code>POST /api/audio/upload-recording</code>, stored in ContentCreationContext as <code>ownVoiceUrl</code>,
              and passed to <code>/api/ai/render</code>. When <code>ownVoiceUrl</code> is set, the render route skips
              ElevenLabs TTS entirely and uses the recording URL directly as <code>voice_url</code> (no credit deduction).
            </li>
            <li>
              <strong>Atmosphere layer auto-resolution</strong> — <code>resolveAtmosphereUrl()</code> in{' '}
              <code>packages/web/src/utils/atmosphere.ts</code> builds URLs from <code>NEXT_PUBLIC_SUPABASE_URL</code> +
              preset ID. Once you upload MP3 files to the <code>atmosphere</code> bucket, the ambient layer activates
              automatically. No code changes needed.
            </li>
            <li>
              <strong>Safari MediaRecorder MIME fix</strong> — <code>ContentVoiceStep</code> detects supported MIME
              type (<code>audio/webm;codecs=opus</code> on Chrome, <code>audio/mp4</code> on Safari) before creating
              MediaRecorder, so recorded blobs decode correctly on all browsers.
            </li>
            <li>
              <strong>ElevenLabs streaming chunk accumulation</strong> — Speak page accumulates SSE audio chunks to
              32 KB before calling <code>decodeAudioData</code>, avoiding <code>EncodingError</code> on partial MP3 frames.
              Force-flush on <code>audio_done</code> decodes any remainder.
            </li>
            <li>
              <strong>AudioContext on user gesture (iOS Safari)</strong> — <code>useWebAudioPlayer</code> defers{' '}
              <code>new AudioContext()</code> to the first <code>play()</code> call so iOS Safari can resume audio.
              Raw buffers are fetched eagerly; graph is built lazily.
            </li>
            <li>
              <strong>AudioContext memory leak fix</strong> — <code>useAudioAnalyzer</code> now calls{' '}
              <code>ctx.close()</code> on cleanup instead of <code>suspend()</code>, releasing the browser resource slot.
            </li>
            <li>
              <strong>Ambient stops when voice ends</strong> — When the voice track finishes, the ambient loop is
              explicitly stopped so it doesn&apos;t play forever.
            </li>
            <li>
              <strong>Signed URL TTL extended to 7 days</strong> — Audio storage fallback URLs now last 7 days instead
              of 1 hour, so content stays playable.
            </li>
            <li>
              <strong>FFmpeg normalize route runtime</strong> — Added <code>export const runtime = &apos;nodejs&apos;</code> and{' '}
              <code>maxDuration = 60</code> to <code>/api/audio/normalize</code> so it runs correctly on Vercel.
            </li>
            <li>
              <strong>Position tick throttled to 250ms</strong> — Replaced 60fps RAF with <code>setInterval(250)</code> for
              progress bar updates, reducing CPU on mobile.
            </li>
          </ul>
        </Section>

        {/* ── How to Use It ───────────────────────────────────────────────────── */}
        <Section title="How to Use It" colors={colors} icon={Zap}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Most fixes are automatic. Here&apos;s what each path does:
          </Typography>
          <ul style={{ color: colors.text.secondary, marginLeft: spacing.lg }}>
            <li>
              <strong>Own voice</strong> — User selects &quot;My Voice&quot; in ContentVoiceStep, records, sees
              &quot;Saving recording…&quot; then &quot;✓ Recording ready&quot;. Continue is disabled until upload
              completes. On the next step, the render route receives <code>ownVoiceUrl</code> and uses it directly.
            </li>
            <li>
              <strong>Atmosphere</strong> — User picks Rain/Forest/Ocean/White Noise in audio settings. The player
              fetches from <code>{`{SUPABASE_URL}/storage/v1/object/public/atmosphere/{id}.mp3`}</code>. If files
              aren&apos;t uploaded yet, the layer is silent (no error).
            </li>
            <li>
              <strong>Health check</strong> — <code>GET /api/audio/atmosphere-status</code> (superadmin only) reports
              which atmosphere files are accessible. Use after uploading to verify.
            </li>
          </ul>
        </Section>

        {/* ── Everything You Need to Make It Work ───────────────────────────────── */}
        <Section title="Everything You Need to Make It Work" colors={colors} icon={Settings}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Checklist:
          </Typography>
          <ol style={{ color: colors.text.secondary, marginLeft: spacing.lg, marginBottom: spacing.md }}>
            <li>
              <strong>Run the database migration</strong> — See &quot;Database Migration&quot; below. Creates the{' '}
              <code>atmosphere</code> bucket and adds the <code>recordings</code> path policy for the <code>audio</code>{' '}
              bucket.
            </li>
            <li>
              <strong>Upload atmosphere audio files</strong> — Create the <code>atmosphere</code> bucket in Supabase
              Storage (or run the migration), then upload 4 looping MP3s: <code>rain.mp3</code>, <code>forest.mp3</code>,{' '}
              <code>ocean.mp3</code>, <code>white-noise.mp3</code>. See <code>packages/web/scripts/upload-atmosphere-presets.md</code> for
              specs and free sources (Freesound, Pixabay).
            </li>
            <li>
              <strong>Confirm ELEVENLABS_API_KEY</strong> — Required for AI voice path. Own-voice path doesn&apos;t need
              it.
            </li>
            <li>
              <strong>Confirm NEXT_PUBLIC_SUPABASE_URL</strong> — Required for atmosphere URL resolution and upload
              redirects.
            </li>
          </ol>
        </Section>

        {/* ── Database Migration (Supabase) ────────────────────────────────────── */}
        <Section title="Database Migration (Supabase)" colors={colors} icon={Database}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Run the migration <code>20260324000001_audio_system_buckets.sql</code>:
          </Typography>
          <CodeBlock>
{`-- 1. Recordings path policy (audio bucket)
-- Allows users to upload/read at recordings/{userId}/...
create policy "Owner recordings access"
  on storage.objects for all
  using (
    bucket_id = 'audio'
    and (storage.foldername(name))[1] = 'recordings'
    and auth.uid()::text = (storage.foldername(name))[2]
  )
  with check (...);

-- 2. Atmosphere bucket (public)
insert into storage.buckets (id, name, public, ...)
values ('atmosphere', 'atmosphere', true, ...);

-- 3. Public read + superadmin write policies for atmosphere`}
          </CodeBlock>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md, marginBottom: spacing.sm }}>
            <strong>What you need to do:</strong>
          </Typography>
          <ol style={{ color: colors.text.secondary, marginLeft: spacing.lg, marginBottom: spacing.md }}>
            <li>Open Supabase Dashboard → SQL Editor.</li>
            <li>
              Run the migration: <code>supabase/migrations/20260324000001_audio_system_buckets.sql</code>, or use{' '}
              <code>supabase db push</code> if using Supabase CLI.
            </li>
            <li>
              Verify: Storage → Buckets. You should see <code>atmosphere</code> (public). The <code>audio</code> bucket
              should already exist.
            </li>
            <li>
              Upload atmosphere files: Storage → atmosphere bucket → upload <code>rain.mp3</code>, <code>forest.mp3</code>,{' '}
              <code>ocean.mp3</code>, <code>white-noise.mp3</code>. If the superadmin policy blocks Dashboard uploads,
              use Supabase CLI: <code>supabase storage cp ./rain.mp3 ss://atmosphere/rain.mp3 --project-ref YOUR_REF</code>{' '}
              (CLI uses service role and bypasses RLS).
            </li>
          </ol>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            <strong>Verify atmosphere:</strong> Log in as superadmin and hit <code>GET /api/audio/atmosphere-status</code>.
            Response shows <code>allReady: true</code> when all 4 files are accessible.
          </Typography>
        </Section>

        {/* ── Suggestions to Improve ────────────────────────────────────────────── */}
        <Section title="Suggestions to Improve" colors={colors} icon={Sparkles}>
          <ul style={{ color: colors.text.secondary, marginLeft: spacing.lg }}>
            <li>
              <strong>Waveform preview for recorded audio</strong> — Add a canvas or Web Audio analyser to show the
              waveform while the user is recording, so they can see levels and re-record if needed.
            </li>
            <li>
              <strong>Normalize own-voice recordings</strong> — After upload, optionally call <code>/api/audio/normalize</code>{' '}
              to bring user recordings to -14 LUFS before using as voice_url, for consistent loudness with AI voice.
            </li>
            <li>
              <strong>Convert webm/mp4 to mp3 server-side</strong> — Recorded blobs are stored as webm (Chrome) or mp4
              (Safari). The Web Audio API decodes both, but for smaller storage and CDN caching, consider converting to
              MP3 on the server after upload.
            </li>
            <li>
              <strong>Cache TTS output</strong> — <code>/api/ai/render</code> re-generates TTS every time. Add a check
              for existing <code>voice_url</code> before calling ElevenLabs to avoid re-charging credits on duplicate
              renders.
            </li>
            <li>
              <strong>Streaming decode for long files</strong> — For 20+ minute meditations, full buffer decode can
              spike memory. Consider streaming decode or lazy buffer loading.
            </li>
          </ul>
        </Section>

        {/* ── ChatGPT Prompts for Copyrights, Socials & Images ─────────────────── */}
        <Section title="ChatGPT Prompts for Copyrights, Socials & Images" colors={colors} icon={FileText}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Copy these prompts into ChatGPT to generate copyright text, social captions, and image descriptions for
            waQup marketing — especially around the audio/voice features.
          </Typography>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 600 }}>
            1. Copyright notice for footer / legal pages
          </Typography>
          <CodeBlock>
{`Generate a short copyright notice for waQup — a voice-first mindfulness app where users create personalised affirmations, meditations, and rituals in their own cloned voice or AI voice. Include: year range (2024–2026), company name placeholder, and "All rights reserved." Keep it under 2 lines.`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 600, marginTop: spacing.md }}>
            2. Social media caption — own-voice feature
          </Typography>
          <CodeBlock>
{`Write a 2–3 sentence Instagram caption for a post promoting waQup's "My Voice" feature. waQup lets users record their own voice for affirmations and meditations — the most powerful form of neural encoding. Tone: warm, empowering, not salesy. CTA: waqup.io/join. Hashtags: #waQup #mindfulness #personalgrowth #ownvoice. Include attribution: "waQup — be the voice behind your practice."`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 600, marginTop: spacing.md }}>
            3. Image alt text for accessibility
          </Typography>
          <CodeBlock>
{`Generate alt text for a social media image promoting waQup. The image shows: dark purple gradient, glowing microphone icon, headline "Record your own voice — the most powerful form of identity encoding", subtext about affirmations in your voice. Alt text must be under 125 characters, descriptive, and inclusive.`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 600, marginTop: spacing.md }}>
            4. User-generated audio (UGC) terms
          </Typography>
          <CodeBlock>
{`Draft 2–3 short paragraphs for a "User-Generated Content" section in waQup's terms. Users create audio affirmations, meditations, and rituals — either by recording their own voice or using AI voice. Include: (a) users retain ownership of their recordings and scripts, (b) waQup gets a licence to host, play, and process the audio for the service, (c) users must not upload infringing or harmful material. Plain language, not legalese.`}
          </CodeBlock>

          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 600, marginTop: spacing.md }}>
            5. DALL·E / image generation prompt — audio/voice theme
          </Typography>
          <CodeBlock>
{`Create a set of 4 social media images for waQup. waQup is a voice-first mindfulness platform where users create personalised affirmations, meditations, and rituals in their own cloned voice or AI voice.

Visual style: Dark, mystical, premium. Deep purple/indigo gradient (#0f0a1e). Glassmorphism. Soft glowing orbs. Clean sans-serif. Apple meets meditation app.

Image 1 (1080×1080): Headline "Your voice. Your practice." Subtext: "Record affirmations in your own voice — the most powerful neural encoding." Microphone icon with purple glow. CTA: "Start at waqup.io/join".

Image 2 (1080×1080): "Three layers of sound." Venn diagram or stacked icons: Voice (narration) + Atmosphere (rain, forest, ocean) + Binaural beats. Dark glassmorphism. Minimal.

Image 3 (1080×1920 story): "Create in 3 steps." 1) Choose type (affirmation / meditation / ritual) 2) Record or pick AI voice 3) Add atmosphere & binaural. CTA: "Try waQup".

Image 4 (1080×1080): "Rain. Forest. Ocean. Your voice." Mood board: soft rain, rustling leaves, waves, glowing mic. Text overlay: "Ambient soundscapes that loop with your affirmations." Premium, minimal.

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
            <a
              href="/api/audio/atmosphere-status"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}
            >
              <Headphones size={16} /> Atmosphere Status
            </a>
            <Link href="/sanctuary/affirmations/create/init" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <Mic size={16} /> Create Affirmation
            </Link>
            <Link href="/speak" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}>
              <Play size={16} /> Speak
            </Link>
            <a
              href="https://github.com/supabase/supabase/blob/main/examples/storage/upload-file/README.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.accent.primary, fontSize: 14 }}
            >
              <Upload size={16} /> Supabase Storage Docs
            </a>
          </div>
        </Section>
      </div>
    </PageShell>
  );
}
