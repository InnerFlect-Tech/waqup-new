'use client';

import React from 'react';
import { Typography, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius, CONTENT_MAX_WIDTH } from '@/theme';
import { Link } from '@/i18n/navigation';

export default function ConversationPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <SuperAdminGate>
      <PageShell intensity="medium" bare>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>
          <div style={{ marginBottom: spacing.xl }}>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}>
              Conversation Flow
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
              LLM state machine, chat vs orb modes, handoff logic. From docs/01-core/08-llm-conversation-summary.
            </Typography>
          </div>

          <Section title="Principles" colors={colors}>
            <ul style={{ color: colors.text.secondary, paddingLeft: spacing.lg }}>
              <li>No static forms — all creation through dialogue</li>
              <li>Chat-like interface — conversational UI</li>
              <li>State machine — manages flow, transitions</li>
              <li>Context-aware — adapts based on responses</li>
            </ul>
          </Section>

          <Section title="LLM steps per content type" colors={colors}>
            <div
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.md,
                background: colors.background.secondary,
                border: `1px solid ${colors.glass.border}`,
                overflowX: 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: spacing.sm, color: colors.text.primary, borderBottom: `1px solid ${colors.glass.border}` }}>Step</th>
                    <th style={{ textAlign: 'left', padding: spacing.sm, color: '#c084fc', borderBottom: `1px solid ${colors.glass.border}` }}>Affirmation</th>
                    <th style={{ textAlign: 'left', padding: spacing.sm, color: '#60a5fa', borderBottom: `1px solid ${colors.glass.border}` }}>Meditation</th>
                    <th style={{ textAlign: 'left', padding: spacing.sm, color: '#34d399', borderBottom: `1px solid ${colors.glass.border}` }}>Ritual</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Intent', 'Conversational + LLM', 'Conversational + LLM', 'Conversational + LLM'],
                    ['Context', '—', 'Conversational + LLM', 'Conversational + LLM'],
                    ['Personalization', '—', '—', 'Conversational + LLM'],
                    ['Script', 'LLM generates', 'LLM generates', 'LLM generates'],
                    ['Voice', 'Choice', 'Choice', 'Choice'],
                    ['Audio', 'UI', 'UI', 'UI'],
                    ['Review', 'UI', 'UI', 'UI'],
                  ].map(([step, aff, med, rit], i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                      <td style={{ padding: spacing.sm, color: colors.text.secondary }}>{step}</td>
                      <td style={{ padding: spacing.sm, color: colors.text.secondary }}>{aff}</td>
                      <td style={{ padding: spacing.sm, color: colors.text.secondary }}>{med}</td>
                      <td style={{ padding: spacing.sm, color: colors.text.secondary }}>{rit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Message flow" colors={colors}>
            <ol style={{ color: colors.text.secondary, paddingLeft: spacing.lg, lineHeight: 1.8 }}>
              <li><strong style={{ color: colors.text.primary }}>User</strong> sends message (text or voice)</li>
              <li><strong style={{ color: colors.text.primary }}>LLM</strong> responds — clarifies, gathers context, or generates script</li>
              <li><strong style={{ color: colors.text.primary }}>Context</strong> accumulated in conversation state</li>
              <li><strong style={{ color: colors.text.primary }}>Transition</strong> to next step when sufficient context</li>
            </ol>
          </Section>

          <Section title="Handoff (chat & orb modes)" colors={colors}>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
              Both modes call <code style={{ background: colors.background.secondary, padding: '2px 6px', borderRadius: borderRadius.sm }}>saveCreationHandoff(type, script, intent)</code> which writes to <code style={{ background: colors.background.secondary, padding: '2px 6px', borderRadius: borderRadius.sm }}>sessionStorage[&apos;waqup_creation_[type]&apos;]</code> before navigating to the Voice step.
            </Typography>
            <Typography variant="small" style={{ color: colors.text.tertiary }}>
              Voice config: both read ElevenLabs from <code>localStorage[&apos;elevenlabs-config&apos;]</code>. Configure at Admin → Oracle.
            </Typography>
          </Section>

          <div style={{ marginTop: spacing.xl, paddingTop: spacing.lg, borderTop: `1px solid ${colors.glass.border}`, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
            <Link href="/create/conversation" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Chat creation</Link>
            <Link href="/create/orb" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Orb creation</Link>
            <Link href="/system/creation-steps" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Creation Steps</Link>
            <Link href="/admin/oracle" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Oracle</Link>
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
