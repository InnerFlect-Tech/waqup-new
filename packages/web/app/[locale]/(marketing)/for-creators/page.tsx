'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Layers,
  Zap,
  Share2,
  Mic,
  ArrowRight,
  Star,
  BarChart3,
} from 'lucide-react';
import { useTheme, spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH, PAGE_TOP_PADDING, HEADER_PADDING_X } from '@/theme';
import { Typography, Button, PageShell } from '@/components';

const TIERS = [
  {
    label: 'Micro',
    range: 'Under 500 plays',
    earn: '1 Q per share',
    perk: 'Marketplace listing + shareable player',
    color: '#c084fc',
  },
  {
    label: 'Creator',
    range: '500–5,000 plays',
    earn: '2 Qs per share + monthly bonus',
    perk: 'Elevated marketplace placement',
    color: '#818cf8',
    highlighted: true,
  },
  {
    label: 'Partner',
    range: '5,000+ plays',
    earn: 'Revenue share on attributed subscriptions',
    perk: 'Co-branded experience + dedicated support',
    color: '#34d399',
  },
];

const BENEFITS = [
  {
    icon: Mic,
    title: 'Your voice, your brand',
    body: 'Create audio in your voice — your tone, your energy, your words. Not a generic AI voice. ElevenLabs voice cloning makes it yours.',
  },
  {
    icon: Layers,
    title: 'Drop series to your audience',
    body: '5-Day Reset. 7-Day Abundance Shift. 21-Day Rewire. Group your sessions into series and release as drops your followers actually collect.',
  },
  {
    icon: Share2,
    title: 'Every share earns you more',
    body: "Your followers share your practice. You earn credits and revenue. The more reach your content gets, the more waQup gives back to you.",
  },
  {
    icon: BarChart3,
    title: 'Analytics for every session',
    body: "See exactly where plays and shares come from. Know which content resonates. Optimise your drops like you optimise your posts.",
  },
  {
    icon: Zap,
    title: 'Link-in-bio audio that converts',
    body: "One link to your practice series. A beautiful immersive player. An email capture that builds your list even when followers don't sign up immediately.",
  },
  {
    icon: TrendingUp,
    title: 'Real revenue, not just credits',
    body: "Partner-tier creators earn a percentage of subscriptions attributed to their audience. As you grow, waQup grows with you.",
  },
];

const DROPS_EXAMPLES = [
  { title: '5-Day Morning Reset', type: 'Ritual Series', sessions: 5, plays: '2.4k' },
  { title: 'Identity Shift Affirmations', type: 'Affirmation Pack', sessions: 7, plays: '1.8k' },
  { title: 'Nervous System Nidra', type: 'Meditation Series', sessions: 4, plays: '3.1k' },
];

export default function ForCreatorsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const gold = '#F59E0B';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'creator', source: 'for-creators' }),
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
          minHeight: '90dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '120px',
          paddingBottom: spacing.xxl,
          marginTop: `calc(-1 * ${PAGE_TOP_PADDING})`,
        }}
      >
        {/* Background — full viewport width */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/images/for-creators-hero.png"
            alt=""
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,2,20,0.9) 0%, rgba(6,2,20,0.75) 50%, rgba(6,2,20,0.9) 100%)' }} />
        </div>
        {/* Hero content — centered with padding */}
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
              background: `${gold}18`,
              border: `1px solid ${gold}40`,
              marginBottom: spacing.lg,
            }}
          >
            <Star size={14} color={gold} />
            <Typography variant="smallBold" style={{ color: gold, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
              For Creators & Influencers
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
            A premium freebie your audience{' '}
            <span
              style={{
                background: `linear-gradient(to right, ${gold}, ${colors.accent.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              will keep
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
            Create audio in your voice. Drop series to your followers. Earn revenue when they subscribe. waQup is the link-in-bio audio studio built for creators who care about depth.
          </Typography>

          {/* Example drops */}
          <div
            style={{
              display: 'flex',
              gap: spacing.md,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: spacing.xxl,
            }}
          >
            {DROPS_EXAMPLES.map((d) => (
              <div
                key={d.title}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: BLUR.md,
                  WebkitBackdropFilter: BLUR.md,
                  border: `1px solid ${colors.glass.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.xs,
                  minWidth: 160,
                  textAlign: 'left',
                }}
              >
                <Typography variant="small" style={{ color: colors.accent.primary, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  {d.type}
                </Typography>
                <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, fontSize: 13 }}>
                  {d.title}
                </Typography>
                <div style={{ display: 'flex', gap: spacing.md }}>
                  <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>
                    {d.sessions} sessions
                  </Typography>
                  <Typography variant="small" style={{ color: colors.accent.tertiary, fontSize: 11, fontWeight: 600 }}>
                    {d.plays} plays
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: `${spacing.lg} ${spacing.xxl}`, borderRadius: borderRadius.lg, background: `${gold}18`, border: `1px solid ${gold}40` }}
            >
              <Typography variant="body" style={{ color: gold, fontWeight: 600 }}>
                You&apos;re on the Creator list. We&apos;ll reach out about your Creator Pack.
              </Typography>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 480 }}>
              <input
                type="email"
                placeholder="creator@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ flex: 1, minWidth: 200, padding: `${spacing.md} ${spacing.lg}`, borderRadius: borderRadius.lg, background: colors.glass.light, border: `1px solid ${colors.glass.border}`, color: colors.text.primary, fontSize: 15, outline: 'none' }}
              />
              <Button type="submit" variant="primary" size="md" loading={loading} style={{ whiteSpace: 'nowrap', background: `linear-gradient(to right, ${gold}, ${colors.accent.primary})`, border: 'none' }}>
                Apply as Creator
              </Button>
            </form>
          )}

          <Typography variant="small" style={{ color: colors.text.secondary, marginTop: spacing.md, fontSize: 13, opacity: 0.7 }}>
            Free to start · Earn from day one · Revenue share at Partner tier
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
        {/* Earnings tiers */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ paddingBottom: `calc(${spacing.xxl} + ${spacing.xxl})` }}
        >
          <Typography variant="h2" style={{ color: colors.text.primary, textAlign: 'center', marginBottom: spacing.md, fontWeight: 200, letterSpacing: '-0.02em' }}>
            Grow with your audience
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xxl, maxWidth: 520, margin: `0 auto ${spacing.xxl}`, lineHeight: 1.6 }}>
            As your content reaches more people, your earning tier rises automatically. No applications, no waiting periods.
          </Typography>

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 480,
              aspectRatio: '1',
              borderRadius: borderRadius.lg,
              overflow: 'hidden',
              margin: '0 auto',
              marginBottom: spacing.xxl,
            }}
          >
            <Image
              src="/images/for-creators-growth.png"
              alt="Growth visualization — upward trend, success, scaling"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: spacing.xl }}>
            {TIERS.map((t) => (
              <div
                key={t.label}
                style={{
                  padding: spacing.xl,
                  borderRadius: borderRadius.xl,
                  background: t.highlighted ? `linear-gradient(145deg, ${t.color}15, ${colors.accent.secondary}08)` : colors.glass.light,
                  backdropFilter: BLUR.lg,
                  WebkitBackdropFilter: BLUR.lg,
                  border: `1px solid ${t.highlighted ? t.color + '50' : colors.glass.border}`,
                  boxShadow: t.highlighted ? `0 16px 48px ${t.color}20` : undefined,
                  position: 'relative',
                }}
              >
                {t.highlighted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -1,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '2px 12px',
                      borderRadius: '0 0 8px 8px',
                      background: t.color,
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#000',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Most active
                  </div>
                )}
                <div style={{ fontSize: 24, fontWeight: 200, color: t.color, marginBottom: spacing.sm, letterSpacing: '-0.02em' }}>
                  {t.label}
                </div>
                <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, marginBottom: spacing.md }}>
                  {t.range}
                </Typography>
                <div
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: borderRadius.md,
                    background: `${t.color}12`,
                    border: `1px solid ${t.color}25`,
                    marginBottom: spacing.md,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                    <DollarSign size={14} color={t.color} />
                    <Typography variant="body" style={{ color: t.color, fontWeight: 700, fontSize: 14 }}>
                      {t.earn}
                    </Typography>
                  </div>
                </div>
                <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 1.5 }}>
                  {t.perk}
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
            Built for how creators think
          </Typography>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.xl }}>
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} style={{ padding: spacing.xl, borderRadius: borderRadius.lg, background: colors.glass.light, backdropFilter: BLUR.lg, WebkitBackdropFilter: BLUR.lg, border: `1px solid ${colors.glass.border}`, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  <div style={{ width: 44, height: 44, borderRadius: borderRadius.md, background: `${gold}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={gold} strokeWidth={1.5} />
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
          <div
            style={{
              maxWidth: 560,
              margin: '0 auto',
              padding: spacing.xxl,
              borderRadius: borderRadius.xl,
              background: `linear-gradient(135deg, ${gold}0a, ${colors.accent.primary}08)`,
              border: `1px solid ${gold}25`,
            }}
          >
            <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: 200, marginBottom: spacing.md, letterSpacing: '-0.02em' }}>
              Your voice. Your audience. Your revenue.
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, maxWidth: 480, margin: `0 auto ${spacing.xl}`, lineHeight: 1.6 }}>
              Apply for the Creator Pack — pre-loaded credits, co-branded player templates, and direct support for your first series drop.
            </Typography>
            <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm, background: `linear-gradient(to right, ${gold}, ${colors.accent.primary})`, border: 'none' }}>
                  Apply as Creator
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/marketplace" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
                  See top creators
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </PageShell>
  );
}
