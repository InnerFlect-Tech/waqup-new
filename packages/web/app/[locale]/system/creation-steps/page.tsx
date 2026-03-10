'use client';

import React from 'react';
import { Typography, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius, CONTENT_MAX_WIDTH, BLUR } from '@/theme';
import { Link } from '@/i18n/navigation';
import { ALL_PIPELINE_STEPS, CONTENT_TYPE_META, CONVERSATION_STEP_PROMPTS } from '@/lib/creation-steps';
import type { ContentItemType } from '@waqup/shared/types';

const CONTENT_TYPES: ContentItemType[] = ['affirmation', 'meditation', 'ritual'];

type StepStatus = 'built' | 'partial' | 'missing';

function getStepStatus(type: ContentItemType, stepSlug: string): StepStatus {
  const stepData = ALL_PIPELINE_STEPS.find((s) => s.step === stepSlug);
  if (!stepData) return 'missing';
  if (!stepData.applyToTypes.includes(type)) return 'missing';

  const builtSteps = ['intent', 'context', 'personalization', 'script', 'voice', 'audio', 'review', 'complete'];
  if (builtSteps.includes(stepSlug)) return 'built';
  return 'partial';
}

function StatusBadge({ status, colors }: { status: StepStatus; colors: ReturnType<typeof useTheme>['theme']['colors'] }) {
  const map: Record<StepStatus, { label: string; bg: string; border: string; color: string }> = {
    built: { label: 'Built', bg: '#10b98115', border: '#10b98140', color: '#10b981' },
    partial: { label: 'Partial', bg: '#f59e0b15', border: '#f59e0b40', color: '#f59e0b' },
    missing: { label: 'N/A', bg: colors.glass.light, border: colors.glass.border, color: colors.text.secondary },
  };
  const s = map[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 99,
        background: s.bg,
        border: `1px solid ${s.border}`,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
        letterSpacing: '0.03em',
      }}
    >
      {s.label}
    </span>
  );
}

function ModeTag({ label, color, colors }: { label: string; color: string; colors: ReturnType<typeof useTheme>['theme']['colors'] }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '2px 7px',
        borderRadius: 4,
        background: `${color}15`,
        border: `1px solid ${color}35`,
        fontSize: 11,
        color,
        fontWeight: 500,
        marginRight: 4,
      }}
    >
      {label}
    </span>
  );
}

export default function CreationStepsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const allStepSlugs = ALL_PIPELINE_STEPS.map((s) => s.step);

  return (
    <SuperAdminGate>
    <PageShell intensity="medium" bare>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>
        {/* Header */}
        <div style={{ marginBottom: spacing.xl }}>
          <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}>
            Creation Steps Reference
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Canonical pipeline steps for each content type, across all 3 creation modes (form, conversation, orb).
          </Typography>
        </div>

        {/* Per content type sections */}
        {CONTENT_TYPES.map((type) => {
          const meta = CONTENT_TYPE_META[type];
          const typeSteps = ALL_PIPELINE_STEPS.filter((s) => s.applyToTypes.includes(type));
          const conversationSteps = CONVERSATION_STEP_PROMPTS[type];

          return (
            <div key={type} style={{ marginBottom: spacing.xxl }}>
              {/* Section header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  marginBottom: spacing.lg,
                  paddingBottom: spacing.md,
                  borderBottom: `2px solid ${meta.color}40`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: borderRadius.md,
                    background: `${meta.color}20`,
                    border: `1px solid ${meta.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  {meta.emoji}
                </div>
                <div>
                  <Typography variant="h2" style={{ color: meta.color, fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                    {meta.label}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 13 }}>
                    {meta.description} · {typeSteps.length} steps
                  </Typography>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: spacing.sm }}>
                  <Link href={`/sanctuary/${type}s/create/init`} style={{ color: meta.color, fontSize: 13, textDecoration: 'none' }}>
                    Form ↗
                  </Link>
                  <Link href={`/create/conversation?type=${type}`} style={{ color: meta.color, fontSize: 13, textDecoration: 'none' }}>
                    Chat ↗
                  </Link>
                  <Link href={`/create/orb?type=${type}`} style={{ color: meta.color, fontSize: 13, textDecoration: 'none' }}>
                    Orb ↗
                  </Link>
                </div>
              </div>

              {/* Steps table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {typeSteps.map((step, idx) => {
                  const status = getStepStatus(type, step.step);
                  const inConversation = conversationSteps.some((s) => s.step === step.step);

                  return (
                    <div
                      key={step.step}
                      style={{
                        padding: spacing.md,
                        borderRadius: borderRadius.lg,
                        background: colors.glass.light,
                        backdropFilter: BLUR.lg,
                        WebkitBackdropFilter: BLUR.lg,
                        border: `1px solid ${status === 'built' ? meta.color + '20' : colors.glass.border}`,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: spacing.md,
                      }}
                    >
                      {/* Step number */}
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: `${meta.color}20`,
                          border: `1px solid ${meta.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: 12,
                          fontWeight: 700,
                          color: meta.color,
                        }}
                      >
                        {idx + 1}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap', marginBottom: 4 }}>
                          <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500, fontSize: 14, margin: 0 }}>
                            {step.label}
                          </Typography>
                          <code
                            style={{
                              background: colors.background?.secondary ?? colors.glass.light,
                              padding: '1px 6px',
                              borderRadius: 4,
                              fontSize: 11,
                              color: colors.text.secondary,
                            }}
                          >
                            {step.step}
                          </code>
                          <StatusBadge status={status} colors={colors} />
                        </div>
                        <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 13, display: 'block', marginBottom: spacing.sm }}>
                          {step.description}
                        </Typography>
                        {/* Mode tags */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
                          <ModeTag label="Form" color={meta.color} colors={colors} />
                          {inConversation && <ModeTag label="Chat" color="#60a5fa" colors={colors} />}
                          {inConversation && <ModeTag label="Orb" color="#34d399" colors={colors} />}
                        </div>
                        {/* Orb prompt */}
                        {step.orbPrompt && (
                          <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, marginTop: spacing.xs, opacity: 0.7, fontStyle: 'italic' }}>
                            Orb: &ldquo;{step.orbPrompt}&rdquo;
                          </Typography>
                        )}
                      </div>

                      {/* Form route */}
                      <div style={{ flexShrink: 0 }}>
                        <Link href={step.formRoute(type)} style={{ color: meta.color, fontSize: 12, textDecoration: 'none', opacity: 0.8 }}>
                          {step.formRoute(type).split('/create/')[1] ?? step.step} ↗
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Cross-reference table */}
        <div style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ color: colors.text.primary, fontSize: '1.25rem', fontWeight: 600, marginBottom: spacing.lg }}>
            Step × Content Type Matrix
          </Typography>
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
                  <th style={{ textAlign: 'left', padding: `${spacing.sm} ${spacing.md}`, color: colors.text.secondary, fontWeight: 500, borderBottom: `1px solid ${colors.glass.border}` }}>
                    Step
                  </th>
                  {CONTENT_TYPES.map((type) => {
                    const meta = CONTENT_TYPE_META[type];
                    return (
                      <th
                        key={type}
                        style={{
                          textAlign: 'center',
                          padding: `${spacing.sm} ${spacing.md}`,
                          color: meta.color,
                          fontWeight: 600,
                          borderBottom: `1px solid ${colors.glass.border}`,
                        }}
                      >
                        {meta.emoji} {meta.label}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {allStepSlugs.map((slug) => {
                  const stepData = ALL_PIPELINE_STEPS.find((s) => s.step === slug);
                  if (!stepData) return null;
                  return (
                    <tr key={slug} style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                      <td style={{ padding: `${spacing.sm} ${spacing.md}`, color: colors.text.primary }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                          <span style={{ fontWeight: 500 }}>{stepData.label}</span>
                          <code style={{ fontSize: 11, color: colors.text.secondary, opacity: 0.7 }}>{slug}</code>
                        </div>
                      </td>
                      {CONTENT_TYPES.map((type) => {
                        const meta = CONTENT_TYPE_META[type];
                        const applies = stepData.applyToTypes.includes(type);
                        return (
                          <td key={type} style={{ textAlign: 'center', padding: `${spacing.sm} ${spacing.md}` }}>
                            {applies ? (
                              <span style={{ color: meta.color, fontSize: 16 }}>✓</span>
                            ) : (
                              <span style={{ color: colors.text.secondary, opacity: 0.3, fontSize: 14 }}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversation step mapping */}
        <div style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ color: colors.text.primary, fontSize: '1.25rem', fontWeight: 600, marginBottom: spacing.sm }}>
            Conversation & Orb Step Mapping
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14, marginBottom: spacing.sm }}>
            Steps surfaced in conversation/orb modes per content type. The AI moves through these sequentially before generating the script.
          </Typography>
          <div
            style={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: colors.glass.light,
              border: `1px solid ${colors.glass.border}`,
              marginBottom: spacing.lg,
              fontSize: 13,
              lineHeight: 1.7,
              color: colors.text.secondary,
            }}
          >
            <strong style={{ color: colors.text.primary }}>Chat mode flow:</strong>{' '}
            Gather via text → AI generates script → inline review → navigate to <code>/sanctuary/[type]s/create/voice</code>
            <br />
            <strong style={{ color: colors.text.primary }}>Orb mode flow:</strong>{' '}
            Gather via voice (mic + SpeechRecognition, real frequency data drives orb) → AI generates script <em>inline</em> (no redirect) → inline review with &ldquo;Choose Voice&rdquo; → navigate to <code>/sanctuary/[type]s/create/voice</code>
            <br />
            <strong style={{ color: colors.text.primary }}>Script handoff:</strong>{' '}
            Both modes call <code>saveCreationHandoff(type, script, intent)</code> which writes to <code>sessionStorage[&apos;waqup_creation_[type]&apos;]</code> before navigating.
            <br />
            <strong style={{ color: colors.text.primary }}>Voice config:</strong>{' '}
            Both modes read ElevenLabs voice from <code>localStorage[&apos;elevenlabs-config&apos;].contentEngine / contentVoiceId</code>. Configure at <Link href="/admin/oracle" style={{ color: colors.accent.primary }}>Admin → Oracle</Link>.
          </div>
          {CONTENT_TYPES.map((type) => {
            const meta = CONTENT_TYPE_META[type];
            const steps = CONVERSATION_STEP_PROMPTS[type];
            return (
              <div
                key={type}
                style={{
                  padding: spacing.lg,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  border: `1px solid ${meta.color}25`,
                  marginBottom: spacing.md,
                }}
              >
                <Typography variant="small" style={{ color: meta.color, fontWeight: 600, fontSize: 13, display: 'block', marginBottom: spacing.md }}>
                  {meta.emoji} {meta.label} — {steps.length} gathering steps
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  {steps.map((s, i) => (
                    <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.md }}>
                      <span style={{ color: meta.color, fontWeight: 700, fontSize: 13, minWidth: 20 }}>{i + 1}.</span>
                      <div>
                        <span style={{ color: colors.text.primary, fontWeight: 500, fontSize: 13 }}>{s.step}</span>
                        <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, display: 'block' }}>
                          {s.question}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer links */}
        <div style={{ paddingTop: spacing.lg, borderTop: `1px solid ${colors.glass.border}`, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
          <Link href="/system" style={{ color: colors.accent.tertiary, fontSize: '14px', textDecoration: 'none' }}>
            System docs
          </Link>
          <Link href="/health" style={{ color: colors.accent.tertiary, fontSize: '14px', textDecoration: 'none' }}>
            API Health
          </Link>
        </div>
      </div>
    </PageShell>
    </SuperAdminGate>
  );
}
