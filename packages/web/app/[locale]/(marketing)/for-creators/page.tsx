'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
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
import { useTheme, spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH, PAGE_TOP_PADDING, HEADER_PADDING_X, LANDING_SECTION_PADDING_Y, SECTION_TITLE_FONT_SIZE, SECTION_SUBTITLE_FONT_SIZE, HERO_H1_FONT_SIZE, HERO_BODY_FONT_SIZE, HERO_MIN_HEIGHT } from '@/theme';
import { Typography, Button, PageShell, PublicFooter } from '@/components';

const TIER_COLORS = ['#c084fc', '#818cf8', '#34d399'] as const;
const TIER_HIGHLIGHTED_INDEX = 1; // Creator tier
const TIER_KEYS = [1, 2, 3] as const;
const BENEFIT_ICONS = [Mic, Layers, Share2, BarChart3, Zap, TrendingUp] as const;
const DROP_KEYS = [1, 2, 3] as const;
const BENEFIT_KEYS = [1, 2, 3, 4, 5, 6] as const;

export default function ForCreatorsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const t = useTranslations('marketing.forCreators.page');
  const BENEFITS = BENEFIT_KEYS.map((i) => ({
    title: t(`benefit${i}Title`),
    body: t(`benefit${i}Body`),
    icon: BENEFIT_ICONS[i - 1],
  }));
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
              {t('heroBadge')}
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
            {t('heroH1Prefix')}{' '}
            <span
              style={{
                background: `linear-gradient(to right, ${gold}, ${colors.accent.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('heroH1Highlight')}
            </span>
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
            {t('heroBody')}
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
            {DROP_KEYS.map((i) => (
              <div
                key={i}
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
                  {t(`drop${i}Type`)}
                </Typography>
                <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, fontSize: 13 }}>
                  {t(`drop${i}Title`)}
                </Typography>
                <div style={{ display: 'flex', gap: spacing.md }}>
                  <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>
                    {t(`drop${i}Sessions`)} {t('sessionsLabel')}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.accent.tertiary, fontSize: 11, fontWeight: 600 }}>
                    {t(`drop${i}Plays`)} {t('playsLabel')}
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
        {/* Earnings tiers — spacing matches LandingSection (LANDING_SECTION_PADDING_Y, typography tokens) */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ paddingTop: LANDING_SECTION_PADDING_Y, paddingBottom: LANDING_SECTION_PADDING_Y }}
        >
          <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
            <h2
              style={{
                margin: 0,
                marginBottom: spacing.sm,
                fontSize: SECTION_TITLE_FONT_SIZE,
                fontWeight: 300,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: colors.text.primary,
              }}
            >
              {t('tiersTitle')}
            </h2>
            <p
              style={{
                margin: '0 auto',
                fontSize: SECTION_SUBTITLE_FONT_SIZE,
                lineHeight: 1.5,
                color: colors.text.secondary,
                maxWidth: 560,
              }}
            >
              {t('tiersSubtitle')}
            </p>
          </div>

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
            {TIER_KEYS.map((i, idx) => {
              const tierColor = TIER_COLORS[idx];
              const highlighted = idx === TIER_HIGHLIGHTED_INDEX;
              return (
                <div
                  key={i}
                  style={{
                    padding: spacing.xl,
                    borderRadius: borderRadius.xl,
                    background: highlighted ? `linear-gradient(145deg, ${tierColor}15, ${colors.accent.secondary}08)` : colors.glass.light,
                    backdropFilter: BLUR.lg,
                    WebkitBackdropFilter: BLUR.lg,
                    border: `1px solid ${highlighted ? tierColor + '50' : colors.glass.border}`,
                    boxShadow: highlighted ? `0 16px 48px ${tierColor}20` : undefined,
                    position: 'relative',
                  }}
                >
                  {highlighted && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -1,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '2px 12px',
                        borderRadius: '0 0 8px 8px',
                        background: tierColor,
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#000',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {t('tiersHighlight')}
                    </div>
                  )}
                  <div style={{ fontSize: 24, fontWeight: 200, color: tierColor, marginBottom: spacing.sm, letterSpacing: '-0.02em' }}>
                    {t(`tier${i}Label`)}
                  </div>
                  <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, marginBottom: spacing.md }}>
                    {t(`tier${i}Range`)}
                  </Typography>
                  <div
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      borderRadius: borderRadius.md,
                      background: `${tierColor}12`,
                      border: `1px solid ${tierColor}25`,
                      marginBottom: spacing.md,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                      <DollarSign size={14} color={tierColor} />
                      <Typography variant="body" style={{ color: tierColor, fontWeight: 700, fontSize: 14 }}>
                        {t(`tier${i}Earn`)}
                      </Typography>
                    </div>
                  </div>
                  <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 1.5 }}>
                    {t(`tier${i}Perk`)}
                  </Typography>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Benefits */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ paddingTop: LANDING_SECTION_PADDING_Y, paddingBottom: LANDING_SECTION_PADDING_Y }}
        >
          <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
            <h2
              style={{
                margin: 0,
                fontSize: SECTION_TITLE_FONT_SIZE,
                fontWeight: 300,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: colors.text.primary,
              }}
            >
              Built for how creators think
            </h2>
          </div>

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
          style={{ textAlign: 'center', paddingTop: LANDING_SECTION_PADDING_Y, paddingBottom: LANDING_SECTION_PADDING_Y }}
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

      <PublicFooter />
    </PageShell>
  );
}
