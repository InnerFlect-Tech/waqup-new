'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Clock,
  Lock,
  Repeat2,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Check,
  Users,
} from 'lucide-react';
import { useTheme, spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH, PAGE_TOP_PADDING } from '@/theme';
import { Typography, Button, PageShell, PublicFooter } from '@/components';

const PAIN_POINTS = [
  'Clients forget insights between sessions',
  'Manual voice notes feel unprofessional',
  'No scalable way to personalise audio homework',
  'Recording takes longer than the session itself',
];

const BENEFITS = [
  {
    icon: MessageSquare,
    title: 'Create from your session notes',
    body: "Type or speak the key themes from a session. waQup generates a full script — affirmation set, grounding meditation, or identity-based ritual — instantly.",
  },
  {
    icon: Clock,
    title: 'One client = 5 minutes of creation',
    body: 'Each personalised audio takes minutes to create, not hours. Batch multiple clients in a single sitting. Your time stays in sessions, not production.',
  },
  {
    icon: Lock,
    title: 'Private sharing protects your IP',
    body: "Share via private link — unlisted from the public marketplace. Your client gets their homework; your methodology stays yours.",
  },
  {
    icon: Repeat2,
    title: 'Clients practice 10× more often',
    body: "Audio they can replay freely. No credit needed to listen. Clients come back to sessions with more progress because they actually practiced.",
  },
  {
    icon: TrendingUp,
    title: 'Scale across cohorts',
    body: 'Running a group programme? Create one foundational ritual, then personalise it for each participant. Series publishing makes cohort delivery seamless.',
  },
  {
    icon: BrainCircuit,
    title: 'Three types for every modality',
    body: 'Affirmations for belief-level work. Meditations for nervous system regulation. Rituals for identity encoding. The right format for the right coaching objective.',
  },
];

const WORKFLOW = [
  { label: 'Session ends', sub: 'You identify the core belief or state to reinforce' },
  { label: 'Create in 5 min', sub: 'Describe the client\'s context. waQup generates the script.' },
  { label: 'Share privately', sub: 'Client gets an unlisted link — their personal audio homework.' },
  { label: 'They practice daily', sub: 'Unlimited free replays. You see usage signals. Next session, they\'re ahead.' },
];

export default function ForCoachesPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'coach', source: 'for-coaches' }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell intensity="medium" bare allowDocumentScroll>
      <div
        style={{
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
          padding: `0 ${spacing.xl}`,
          marginTop: `calc(-1 * ${PAGE_TOP_PADDING})`,
        }}
      >
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            minHeight: '90dvh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: '120px',
            paddingBottom: spacing.xxl,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xs,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              background: `${colors.accent.secondary}18`,
              border: `1px solid ${colors.accent.secondary}40`,
              marginBottom: spacing.lg,
            }}
          >
            <Users size={14} color={colors.accent.secondary} />
            <Typography variant="smallBold" style={{ color: colors.accent.secondary, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
              For Coaches & Facilitators
            </Typography>
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: 200,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: colors.text.primary,
              margin: `0 0 ${spacing.lg}`,
              maxWidth: 820,
            }}
          >
            Turn your coaching into{' '}
            <span
              style={{
                background: colors.gradients.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              daily practice assets
            </span>{' '}
            clients actually use
          </h1>

          <Typography
            variant="body"
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: colors.text.secondary,
              maxWidth: 560,
              lineHeight: 1.6,
              marginBottom: spacing.xxl,
            }}
          >
            Create personalised affirmations, meditations, and rituals as client homework — in minutes. Private sharing, unlimited free replays, and cohort publishing for group programmes.
          </Typography>

          {/* Pain points */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: spacing.sm,
              width: '100%',
              maxWidth: 640,
              marginBottom: spacing.xxl,
            }}
          >
            {PAIN_POINTS.map((p) => (
              <div
                key={p}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.md,
                  background: `rgba(239,68,68,0.06)`,
                  border: `1px solid rgba(239,68,68,0.15)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  textAlign: 'left',
                }}
              >
                <span style={{ color: 'rgba(239,68,68,0.6)', fontSize: 14 }}>✕</span>
                <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 1.4 }}>
                  {p}
                </Typography>
              </div>
            ))}
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: `${spacing.lg} ${spacing.xxl}`,
                borderRadius: borderRadius.lg,
                background: `${colors.accent.primary}18`,
                border: `1px solid ${colors.accent.primary}40`,
              }}
            >
              <Typography variant="body" style={{ color: colors.accent.primary, fontWeight: 600 }}>
                You&apos;re on the list. We&apos;ll reach out with your Coach Starter Kit.
              </Typography>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 480 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  minWidth: 200,
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  border: `1px solid ${colors.glass.border}`,
                  color: colors.text.primary,
                  fontSize: 15,
                  outline: 'none',
                }}
              />
              <Button type="submit" variant="primary" size="md" loading={loading} style={{ whiteSpace: 'nowrap' }}>
                Get Coach Access
              </Button>
            </form>
          )}

          <Typography variant="small" style={{ color: colors.text.secondary, marginTop: spacing.md, fontSize: 13, opacity: 0.7 }}>
            Free to start · Client homework in 5 minutes · No recording equipment needed
          </Typography>
        </motion.section>

        {/* Workflow */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ paddingBottom: `calc(${spacing.xxl} + ${spacing.xxl})` }}
        >
          <Typography variant="h2" style={{ color: colors.text.primary, textAlign: 'center', marginBottom: spacing.xxl, fontWeight: 200, letterSpacing: '-0.02em' }}>
            A workflow that fits after every session
          </Typography>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.lg }}>
            {WORKFLOW.map((w, i) => (
              <div
                key={w.label}
                style={{
                  padding: spacing.xl,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: BLUR.lg,
                  WebkitBackdropFilter: BLUR.lg,
                  border: `1px solid ${colors.glass.border}`,
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 200, color: colors.accent.secondary, opacity: 0.4, lineHeight: 1, marginBottom: spacing.sm, letterSpacing: '-0.03em' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginBottom: spacing.xs }}>
                  {w.label}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.55 }}>
                  {w.sub}
                </Typography>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Benefits */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ paddingBottom: `calc(${spacing.xxl} + ${spacing.xxl})` }}
        >
          <Typography variant="h2" style={{ color: colors.text.primary, textAlign: 'center', marginBottom: spacing.xxl, fontWeight: 200, letterSpacing: '-0.02em' }}>
            Built for the way coaches work
          </Typography>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.xl }}>
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} style={{ padding: spacing.xl, borderRadius: borderRadius.lg, background: colors.glass.light, backdropFilter: BLUR.lg, WebkitBackdropFilter: BLUR.lg, border: `1px solid ${colors.glass.border}`, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  <div style={{ width: 44, height: 44, borderRadius: borderRadius.md, background: `${colors.accent.secondary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={colors.accent.secondary} strokeWidth={1.5} />
                  </div>
                  <div>
                    <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 700, marginBottom: spacing.xs }}>{b.title}</Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>{b.body}</Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', paddingBottom: `calc(${spacing.xxl} + ${spacing.xxl})` }}
        >
          <div style={{ padding: spacing.xxl, borderRadius: borderRadius.xl, background: `linear-gradient(135deg, ${colors.accent.secondary}14, ${colors.accent.primary}0a)`, border: `1px solid ${colors.accent.secondary}30` }}>
            <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: 200, marginBottom: spacing.md, letterSpacing: '-0.02em' }}>
              Your clients deserve practice that works
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, maxWidth: 480, margin: `0 auto ${spacing.xl}`, lineHeight: 1.6 }}>
              Join waQup as a coach and get the Coach Starter Pack — credits to create your first 10 client sessions, private-link sharing, and cohort templates.
            </Typography>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm }}>
                Start as a Coach
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </motion.section>

        <PublicFooter />
      </div>
    </PageShell>
  );
}
