'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import {
  Mic,
  Share2,
  TrendingUp,
  Users,
  Sparkles,
  Check,
  ArrowRight,
  Play,
  Globe,
  Zap,
} from 'lucide-react';
import { useTheme, spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH, PAGE_TOP_PADDING } from '@/theme';
import { Typography, Button, PageShell, WaitlistCTA, PublicFooter } from '@/components';

const BENEFITS = [
  {
    icon: Mic,
    title: 'Create in minutes, not hours',
    body: 'Speak your intention once. waQup turns your words into a polished guided meditation — in your voice, with ambient layers and binaural tones.',
  },
  {
    icon: Globe,
    title: 'Publish to the marketplace',
    body: 'One-click publish. Your sessions become discoverable by thousands of practitioners actively looking for new guided content.',
  },
  {
    icon: Share2,
    title: 'Earn every time students share',
    body: 'Every share earns you Qs. The more your students spread your work, the more creation power you accumulate — automatically.',
  },
  {
    icon: Users,
    title: 'Build a library, not just a class',
    body: 'Group your sessions into themed series — 7-Day Nervous System Reset, Morning Ritual Pack, Sleep Deepening Series. Your students get a complete experience.',
  },
  {
    icon: Sparkles,
    title: 'AI-assisted script generation',
    body: 'Describe your intention. waQup writes the script, you approve or edit it, then render audio with your voice. No recording sessions, no editing software.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics that matter',
    body: 'See play counts, share counts, and credits earned per session. Understand what resonates so you can create more of what works.',
  },
];

const STEPS = [
  { step: '01', label: 'Describe your session', sub: 'Speak or type your intention — theme, duration, tone, focus.' },
  { step: '02', label: 'waQup builds the audio', sub: 'AI writes the script. Your voice (or a professional voice) renders it with ambient and binaural layers.' },
  { step: '03', label: 'Publish to marketplace', sub: 'One tap. Your session appears in the waQup marketplace and gets a shareable public link.' },
  { step: '04', label: 'Students share, you earn', sub: 'Every share of your content earns you Qs. More students, more credits, more sessions.' },
];

const COMPARISON_ROWS = [
  { label: 'Create content', other: 'Record → Edit → Export → Upload', waQup: 'Describe → Approve → Publish' },
  { label: 'Reach students', other: 'Your existing channels only', waQup: 'Marketplace discovery + share loops' },
  { label: 'Earn from sharing', other: 'No mechanism', waQup: 'Qs per share, auto-credited' },
  { label: 'Personalisation', other: 'One recording for everyone', waQup: 'Students can customise for their practice' },
  { label: 'Series / courses', other: 'Manual playlist curation', waQup: 'Built-in series publishing' },
];

export default function ForTeachersPage() {
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
        body: JSON.stringify({ email, role: 'teacher', source: 'for-teachers' }),
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
          {/* Role badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xs,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              background: `${colors.accent.primary}18`,
              border: `1px solid ${colors.accent.primary}40`,
              marginBottom: spacing.lg,
            }}
          >
            <Mic size={14} color={colors.accent.primary} />
            <Typography variant="smallBold" style={{ color: colors.accent.primary, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
              For Meditation & Breathwork Teachers
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
              maxWidth: 800,
            }}
          >
            Turn your guidance into{' '}
            <span
              style={{
                background: colors.gradients.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              scalable audio
            </span>
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
            Create a growing library of guided meditations, breathwork, and rituals — without audio editing software. Publish to the marketplace. Earn credits every time a student shares.
          </Typography>

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
                You&apos;re on the list. We&apos;ll reach out with your Teacher Starter Kit.
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
                Get Teacher Access
              </Button>
            </form>
          )}

          <Typography variant="small" style={{ color: colors.text.secondary, marginTop: spacing.md, fontSize: 13, opacity: 0.7 }}>
            Free to join · Teacher Starter Kit included · No credit card
          </Typography>
        </motion.section>

        {/* How it works */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ paddingBottom: `calc(${spacing.xxl} + ${spacing.xxl})` }}
        >
          <Typography variant="h2" style={{ color: colors.text.primary, textAlign: 'center', marginBottom: spacing.xxl, fontWeight: 200, letterSpacing: '-0.02em' }}>
            From intention to published session in 4 steps
          </Typography>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.lg }}>
            {STEPS.map((s) => (
              <div
                key={s.step}
                style={{
                  padding: spacing.xl,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: BLUR.lg,
                  WebkitBackdropFilter: BLUR.lg,
                  border: `1px solid ${colors.glass.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 200,
                    color: colors.accent.primary,
                    opacity: 0.4,
                    lineHeight: 1,
                    marginBottom: spacing.sm,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {s.step}
                </div>
                <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginBottom: spacing.xs }}>
                  {s.label}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.55 }}>
                  {s.sub}
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
            Everything a teacher needs
          </Typography>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.xl }}>
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  style={{
                    padding: spacing.xl,
                    borderRadius: borderRadius.lg,
                    background: colors.glass.light,
                    backdropFilter: BLUR.lg,
                    WebkitBackdropFilter: BLUR.lg,
                    border: `1px solid ${colors.glass.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: borderRadius.md,
                      background: `${colors.accent.primary}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color={colors.accent.primary} strokeWidth={1.5} />
                  </div>
                  <div>
                    <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 700, marginBottom: spacing.xs }}>
                      {b.title}
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                      {b.body}
                    </Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Comparison table */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ paddingBottom: `calc(${spacing.xxl} + ${spacing.xxl})` }}
        >
          <Typography variant="h2" style={{ color: colors.text.primary, textAlign: 'center', marginBottom: spacing.xxl, fontWeight: 200, letterSpacing: '-0.02em' }}>
            Your current workflow vs waQup
          </Typography>

          <div
            style={{
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
              overflow: 'hidden',
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: `${spacing.md} ${spacing.xl}`,
                background: `${colors.accent.primary}10`,
                borderBottom: `1px solid ${colors.glass.border}`,
              }}
            >
              <Typography variant="small" style={{ color: colors.text.secondary, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Task
              </Typography>
              <Typography variant="small" style={{ color: colors.text.secondary, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Old way
              </Typography>
              <Typography variant="small" style={{ color: colors.accent.primary, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                waQup
              </Typography>
            </div>

            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  padding: `${spacing.md} ${spacing.xl}`,
                  borderBottom: i < COMPARISON_ROWS.length - 1 ? `1px solid ${colors.glass.border}` : undefined,
                  gap: spacing.md,
                  alignItems: 'start',
                }}
              >
                <Typography variant="small" style={{ color: colors.text.primary, fontWeight: 600, fontSize: 13 }}>
                  {row.label}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 1.5 }}>
                  {row.other}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.xs }}>
                  <Check size={14} color={colors.accent.primary} strokeWidth={2.5} style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography variant="small" style={{ color: colors.text.primary, fontSize: 13, lineHeight: 1.5 }}>
                    {row.waQup}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', paddingBottom: `calc(${spacing.xxl} + ${spacing.xxl})` }}
        >
          <div
            style={{
              padding: spacing.xxl,
              borderRadius: borderRadius.xl,
              background: `linear-gradient(135deg, ${colors.accent.primary}14, ${colors.accent.secondary}0a)`,
              border: `1px solid ${colors.accent.primary}30`,
            }}
          >
            <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: 200, marginBottom: spacing.md, letterSpacing: '-0.02em' }}>
              Ready to build your audio library?
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, maxWidth: 480, margin: `0 auto ${spacing.xl}`, lineHeight: 1.6 }}>
              Join waQup as a teacher and get your Teacher Starter Kit — pre-loaded credits, themed templates, and early marketplace listing access.
            </Typography>
            <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm }}>
                  Join as a Teacher
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/marketplace" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
                  <Play size={16} />
                  Browse the marketplace
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>

        <PublicFooter />
      </div>
    </PageShell>
  );
}
