'use client';

import React from 'react';
import { Typography, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius, CONTENT_MAX_WIDTH } from '@/theme';
import { Link } from '@/i18n/navigation';

export default function AudioPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <SuperAdminGate>
      <PageShell intensity="medium" bare allowDocumentScroll>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', paddingTop: spacing.xxl, paddingBottom: spacing.xxl }}>
          <div style={{ marginBottom: spacing.xl }}>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}>
              Audio & TTS Reference
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
              ElevenLabs, voice cloning, recording, and the shared Audio page. From docs/01-core/06-audio-generation-summary.
            </Typography>
          </div>

          <Section title="TTS: ElevenLabs" colors={colors}>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
              <strong style={{ color: colors.text.primary }}>Provider:</strong> ElevenLabs Professional Voice Cloning
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
              <strong style={{ color: colors.text.primary }}>Use case:</strong> Long-form content (10–30 min), prosody, 70+ languages
            </Typography>
          </Section>

          <Section title="Recording: Own voice" colors={colors}>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
              <strong style={{ color: colors.text.primary }}>Scientific basis:</strong> Principle 13 — &quot;personalized authority&quot;; own voice bypasses skepticism
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
              <strong style={{ color: colors.text.primary }}>Flow:</strong> Record → upload to Supabase Storage → use in Audio page
            </Typography>
          </Section>

          <Section title="Audio flow" colors={colors}>
            <ol style={{ color: colors.text.secondary, paddingLeft: spacing.lg, lineHeight: 1.8 }}>
              <li><strong style={{ color: colors.text.primary }}>Script</strong> — from LLM</li>
              <li><strong style={{ color: colors.text.primary }}>Choose</strong> — ElevenLabs OR Record</li>
              <li><strong style={{ color: colors.text.primary }}>Generate/upload</strong> — raw audio</li>
              <li><strong style={{ color: colors.text.primary }}>Audio page</strong> — volumes, waves, preview, mix</li>
              <li><strong style={{ color: colors.text.primary }}>Store</strong> — final mix → content_items.audio_url</li>
            </ol>
          </Section>

          <Section title="Audio page (shared)" colors={colors}>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
              Dedicated page where users customize audio before saving. Route: after Voice step; also at /sanctuary/[type]s/[id]/edit-audio.
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: colors.text.secondary }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                  <th style={{ textAlign: 'left', padding: spacing.sm, color: colors.text.primary }}>Control</th>
                  <th style={{ textAlign: 'left', padding: spacing.sm, color: colors.text.primary }}>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}><td style={{ padding: spacing.sm }}>Volumes</td><td style={{ padding: spacing.sm }}>Voice vs background mix; master</td></tr>
                <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}><td style={{ padding: spacing.sm }}>Waves</td><td style={{ padding: spacing.sm }}>Waveform style (bars, line, particles)</td></tr>
                <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}><td style={{ padding: spacing.sm }}>Playback</td><td style={{ padding: spacing.sm }}>Preview with real-time waveform; seek, loop</td></tr>
              </tbody>
            </table>
          </Section>

          <div style={{ marginTop: spacing.xl, paddingTop: spacing.lg, borderTop: `1px solid ${colors.glass.border}`, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
            <Link href="/admin/oracle" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Oracle (voice config)</Link>
            <Link href="/system/pipelines" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Pipelines</Link>
            <Link href="/system/conversation" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Conversation Flow</Link>
            <Link href="/admin" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Admin</Link>
          </div>
        </div>
      </PageShell>
    </SuperAdminGate>
  );
}

function Section({ title, colors, children }: { title: string; colors: ReturnType<typeof useTheme>['theme']['colors']; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: spacing.xl }}>
      <Typography variant="h2" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.25rem', fontWeight: 600 }}>
        {title}
      </Typography>
      {children}
    </div>
  );
}
