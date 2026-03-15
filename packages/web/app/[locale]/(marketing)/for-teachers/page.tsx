'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
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
} from 'lucide-react';
import { useTheme, spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH, PAGE_TOP_PADDING, HEADER_PADDING_X, LANDING_SECTION_PADDING_Y, SECTION_TITLE_FONT_SIZE, HERO_H1_FONT_SIZE, HERO_BODY_FONT_SIZE, HERO_MIN_HEIGHT } from '@/theme';
import { Typography, Button, PageShell, PublicFooter } from '@/components';

const BENEFIT_ICONS = [Mic, Globe, Share2, Users, Sparkles, TrendingUp] as const;
const STEPS_CONFIG = [
  { step: '01', labelKey: 'step1Label', subKey: 'step1Sub' },
  { step: '02', labelKey: 'step2Label', subKey: 'step2Sub' },
  { step: '03', labelKey: 'step3Label', subKey: 'step3Sub' },
  { step: '04', labelKey: 'step4Label', subKey: 'step4Sub' },
] as const;
const COMPARISON_ROW_KEYS = [1, 2, 3, 4, 5] as const;
const BENEFIT_KEYS = [1, 2, 3, 4, 5, 6] as const;

export default function ForTeachersPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const t = useTranslations('marketing.forTeachers.page');
  const BENEFITS = BENEFIT_KEYS.map((i) => ({
    title: t(`benefit${i}Title`),
    body: t(`benefit${i}Body`),
    icon: BENEFIT_ICONS[i - 1],
  }));
  const STEPS = STEPS_CONFIG.map((c) => ({
    step: c.step,
    label: t(c.labelKey),
    sub: t(c.subKey),
  }));
  const COMPARISON_ROWS = COMPARISON_ROW_KEYS.map((i) => ({
    label: t(`comparisonRow${i}Label`),
    other: t(`comparisonRow${i}Other`),
    waQup: t(`comparisonRow${i}WaQup`),
  }));
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
            src="/images/for-teachers-hero.png"
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
              fontSize: HERO_H1_FONT_SIZE,
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
              fontSize: HERO_BODY_FONT_SIZE,
              color: colors.text.secondary,
              maxWidth: 560,
              lineHeight: 1.6,
              marginBottom: spacing.xxl,
            }}
          >
            Create a growing library of guided meditations, breathwork, and rituals — without audio editing software. Publish to the marketplace. Earn credits every time a student shares.
          </Typography>

          <Link href="/waitlist?source=for-teachers" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm }}>
              Get Teacher Access <ArrowRight size={16} />
            </Button>
          </Link>

          <Typography variant="small" style={{ color: colors.text.secondary, marginTop: spacing.md, fontSize: 13, opacity: 0.7 }}>
            Free to join · Teacher Starter Kit included · No credit card
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
        {/* How it works — spacing matches main page (LANDING_SECTION_PADDING_Y, SSOT tokens) */}
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
            From intention to published session in 4 steps
          </h2>

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
            Everything a teacher needs
          </h2>

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

        {/* Analytics visual + Comparison table */}
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
            Your current workflow vs waQup
          </h2>

          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: borderRadius.lg,
              overflow: 'hidden',
              marginBottom: spacing.xxl,
            }}
          >
            <Image
              src="/images/for-teachers-analytics.png"
              alt="Educational dashboard with analytics — play counts, progress tracking"
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              style={{ objectFit: 'cover' }}
            />
          </div>

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
          style={{ textAlign: 'center', paddingTop: LANDING_SECTION_PADDING_Y, paddingBottom: LANDING_SECTION_PADDING_Y }}
        >
          <div
            style={{
              maxWidth: 560,
              margin: '0 auto',
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
      </div>

      <PublicFooter />
    </PageShell>
  );
}
