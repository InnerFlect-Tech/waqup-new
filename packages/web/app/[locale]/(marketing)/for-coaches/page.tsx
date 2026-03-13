'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  BrainCircuit,
  Clock,
  Lock,
  Repeat2,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Users,
} from 'lucide-react';
import { useTheme, spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH, PAGE_TOP_PADDING, HEADER_PADDING_X, LANDING_SECTION_PADDING_Y, SECTION_TITLE_FONT_SIZE, HERO_H1_FONT_SIZE, HERO_BODY_FONT_SIZE, HERO_MIN_HEIGHT } from '@/theme';
import { Typography, Button, PageShell, PublicFooter } from '@/components';

const BENEFIT_ICONS = [MessageSquare, Clock, Lock, Repeat2, TrendingUp, BrainCircuit] as const;
const PAIN_KEYS = ['pain1', 'pain2', 'pain3', 'pain4'] as const;
const WORKFLOW_KEYS = [1, 2, 3, 4] as const;
const BENEFIT_KEYS = [1, 2, 3, 4, 5, 6] as const;

export default function ForCoachesPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const t = useTranslations('marketing.forCoaches.page');
  const PAIN_POINTS = PAIN_KEYS.map((k) => t(k));
  const WORKFLOW = WORKFLOW_KEYS.map((i) => ({
    label: t(`workflow${i}Label`),
    sub: t(`workflow${i}Sub`),
  }));
  const BENEFITS = [1, 2, 3, 4, 5, 6].map((i) => ({
    title: t(`benefit${i}Title`),
    body: t(`benefit${i}Body`),
    icon: BENEFIT_ICONS[i - 1],
  }));
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
      {/* Hero — full width, outside max-width wrapper */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: HERO_MIN_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '120px',
          paddingBottom: spacing.xxl,
          marginTop: `calc(-1 * ${PAGE_TOP_PADDING})`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/images/for-coaches-hero.png"
            alt=""
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,2,20,0.9) 0%, rgba(6,2,20,0.75) 50%, rgba(6,2,20,0.9) 100%)' }} />
        </div>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
            padding: `0 ${HEADER_PADDING_X}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
              fontSize: HERO_H1_FONT_SIZE,
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
              fontSize: HERO_BODY_FONT_SIZE,
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
        </div>
      </motion.section>

      {/* Content — max-width wrapper */}
      <div
        style={{
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
          padding: `0 ${HEADER_PADDING_X}`,
        }}
      >
        {/* Workflow */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ paddingTop: LANDING_SECTION_PADDING_Y, paddingBottom: LANDING_SECTION_PADDING_Y }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: spacing.xxl,
              fontSize: SECTION_TITLE_FONT_SIZE,
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: colors.text.primary,
              textAlign: 'center',
            }}
          >
            A workflow that fits after every session
          </h2>

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 560,
              aspectRatio: '1',
              borderRadius: borderRadius.lg,
              overflow: 'hidden',
              margin: '0 auto',
              marginBottom: spacing.xxl,
            }}
          >
            <Image
              src="/images/for-coaches-notes.png"
              alt="Hand writing session notes — focus, clarity, purple glow"
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              style={{ objectFit: 'cover' }}
            />
          </div>

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
          style={{ paddingTop: LANDING_SECTION_PADDING_Y, paddingBottom: LANDING_SECTION_PADDING_Y }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: spacing.xxl,
              fontSize: SECTION_TITLE_FONT_SIZE,
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: colors.text.primary,
              textAlign: 'center',
            }}
          >
            Built for the way coaches work
          </h2>

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
          style={{ textAlign: 'center', paddingTop: LANDING_SECTION_PADDING_Y, paddingBottom: LANDING_SECTION_PADDING_Y }}
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
      </div>

      <PublicFooter />
    </PageShell>
  );
}
