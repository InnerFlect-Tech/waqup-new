'use client';

import React from 'react';
import { Typography, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius, CONTENT_MAX_WIDTH, BLUR } from '@/theme';
import { Link } from '@/i18n/navigation';

export default function PipelinesPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <SuperAdminGate>
      <PageShell intensity="medium" bare>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>
          <div style={{ marginBottom: spacing.xl }}>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}>
              Pipelines Reference
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
              Scientific foundations and pipeline comparison for all three content types. From docs/01-core.
            </Typography>
          </div>

          <Section title="Shared structure: Voice → Audio → Review" colors={colors}>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
              All pipelines share the <strong style={{ color: colors.text.primary }}>Audio page</strong> step. After Voice (ElevenLabs or recording), users go to a dedicated Audio page to:
            </Typography>
            <ul style={{ color: colors.text.secondary, paddingLeft: spacing.lg, marginBottom: spacing.md }}>
              <li>Adjust volumes (voice vs background/ambience)</li>
              <li>Choose waves (waveform visualization style, presets)</li>
              <li>Preview with real-time waveform</li>
              <li>Save the final mix</li>
            </ul>
            <Typography variant="small" style={{ color: colors.text.tertiary }}>
              Edit-audio routes lead to the same Audio page for re-customization.
            </Typography>
          </Section>

          <Section title="Pipeline comparison" colors={colors}>
            <div
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.lg,
                background: colors.glass.light,
                backdropFilter: BLUR.lg,
                WebkitBackdropFilter: BLUR.lg,
                border: `1px solid ${colors.glass.border}`,
                overflowX: 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: spacing.sm, color: colors.text.secondary, borderBottom: `1px solid ${colors.glass.border}` }}>Step</th>
                    <th style={{ textAlign: 'left', padding: spacing.sm, color: '#c084fc', borderBottom: `1px solid ${colors.glass.border}` }}>Affirmation</th>
                    <th style={{ textAlign: 'left', padding: spacing.sm, color: '#60a5fa', borderBottom: `1px solid ${colors.glass.border}` }}>Meditation</th>
                    <th style={{ textAlign: 'left', padding: spacing.sm, color: '#34d399', borderBottom: `1px solid ${colors.glass.border}` }}>Ritual</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1', 'Intent', 'Intent', 'Intent'],
                    ['2', 'Script', 'Context', 'Context'],
                    ['3', 'Voice', 'Script', 'Personalization'],
                    ['4', 'Audio', 'Voice', 'Script'],
                    ['5', 'Review', 'Audio', 'Voice'],
                    ['6', 'Edit-audio', 'Review', 'Audio'],
                    ['7', '—', 'Edit-audio', 'Review'],
                    ['8', '—', '—', 'Edit-audio'],
                  ].map(([n, aff, med, rit], i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                      <td style={{ padding: spacing.sm, color: colors.text.tertiary }}>{n}</td>
                      <td style={{ padding: spacing.sm, color: colors.text.secondary }}>{aff}</td>
                      <td style={{ padding: spacing.sm, color: colors.text.secondary }}>{med}</td>
                      <td style={{ padding: spacing.sm, color: colors.text.secondary }}>{rit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Depth (scientific foundations)" colors={colors}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <DepthCard color="#c084fc" label="Affirmation" desc="Cognitive re-patterning (shallow → medium) — repetition, positive language, believability, own voice" colors={colors} />
              <DepthCard color="#60a5fa" label="Meditation" desc="State induction (medium) — relaxed states, visualization, hypnosis-like principles" colors={colors} />
              <DepthCard color="#34d399" label="Ritual" desc="Identity encoding (deepest) — value alignment, emotional anchoring, ritual structure, RAS priming" colors={colors} />
            </div>
          </Section>

          <Section title="Route map" colors={colors}>
            <div
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.md,
                background: colors.background.secondary,
                border: `1px solid ${colors.glass.border}`,
                fontSize: 13,
                color: colors.text.secondary,
              }}
            >
              <div style={{ marginBottom: spacing.sm }}><strong style={{ color: colors.text.primary }}>Create:</strong> /create/conversation or /sanctuary/[type]s/create</div>
              <div><strong style={{ color: colors.text.primary }}>Edit-audio:</strong> /sanctuary/[affirmations|meditations|rituals]/[id]/edit-audio</div>
            </div>
          </Section>

          <div style={{ marginTop: spacing.xl, paddingTop: spacing.lg, borderTop: `1px solid ${colors.glass.border}`, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
            <Link href="/system/creation-steps" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Creation Steps</Link>
            <Link href="/system/audio" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Audio & TTS</Link>
            <Link href="/system" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>System</Link>
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

function DepthCard({ color, label, desc, colors }: { color: string; label: string; desc: string; colors: ReturnType<typeof useTheme>['theme']['colors'] }) {
  return (
    <div
      style={{
        padding: spacing.md,
        borderRadius: borderRadius.md,
        background: `${color}12`,
        border: `1px solid ${color}40`,
      }}
    >
      <Typography variant="body" style={{ color, fontWeight: 600, marginBottom: spacing.xs }}>{label}</Typography>
      <Typography variant="small" style={{ color: colors.text.secondary }}>{desc}</Typography>
    </div>
  );
}
