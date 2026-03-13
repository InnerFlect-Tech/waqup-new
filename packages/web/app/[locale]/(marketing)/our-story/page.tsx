'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Linkedin, Instagram, Github, Music } from 'lucide-react';
import { useTheme, spacing, borderRadius } from '@/theme';
import { PageShell, GlassCard, Logo } from '@/components';
import { Typography, Button } from '@/components';
import { CONTENT_MEDIUM, CONTENT_MAX_WIDTH, PAGE_HORIZONTAL_PADDING } from '@/theme';
import { Analytics } from '@waqup/shared/utils';

const FOUNDER_SOCIALS = [
  { href: 'https://www.linkedin.com/in/indiasfernandes/', label: 'LinkedIn', icon: Linkedin, destination: 'linkedin' },
  { href: 'https://www.instagram.com/indiasfernandes', label: 'Instagram', icon: Instagram, destination: 'instagram' },
  { href: 'https://github.com/indiasFernandes', label: 'GitHub', icon: Github, destination: 'github' },
] as const;

const MUSIC_PROJECTS = [
  { name: 'Nu Moksa', href: 'https://open.spotify.com/search/Nu%20Moksa', destination: 'spotify_nu_moksa' },
  { name: 'Cronaxy', href: 'https://open.spotify.com/search/Cronaxy', destination: 'spotify_cronaxy' },
] as const;

/**
 * Our Story — Founder narrative (scroll-down story)
 *
 * Purpose: Trust-building, legitimacy, why waQup exists.
 * Design: Full-viewport hero, scroll-triggered reveals, narrative pacing.
 * Tone: Authentic, human, thoughtful, visionary, grounded.
 */
const PROSE_MAX_WIDTH = '640px';
const SECTION_MIN_HEIGHT = 'min(70dvh, 480px)';
const PARAGRAPH_GAP = spacing.xl;

const revealVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function OurStoryPage() {
  const t = useTranslations('marketing');
  const tp = (key: string) => t(`ourStory.page.${key}`);
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="strong" bare allowDocumentScroll>
      {/* Hero — full width, outside max-width wrapper (matches for-teachers, for-coaches pattern) */}
      <motion.section
          className="our-story-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: spacing.xxl,
            paddingBottom: spacing.xxl,
            minWidth: 0,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Image
              src="/images/our-story-hero.png"
              alt=""
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,2,20,0.88) 0%, rgba(6,2,20,0.7) 50%, rgba(6,2,20,0.92) 100%)' }} />
          </div>
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: CONTENT_MAX_WIDTH,
              margin: '0 auto',
              padding: `0 ${PAGE_HORIZONTAL_PADDING}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ marginBottom: spacing.xxl }}>
              <Logo size="lg" showIcon={false} href="/" />
            </div>
          </div>
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: CONTENT_MAX_WIDTH,
              margin: '0 auto',
              padding: `0 ${PAGE_HORIZONTAL_PADDING}`,
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
                padding: '6px 16px',
                borderRadius: borderRadius.full,
                background: `${colors.accent.tertiary}15`,
                border: `1px solid ${colors.accent.tertiary}30`,
                marginBottom: spacing.xl,
              }}
            >
              <Typography variant="smallBold" style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 11 }}>
                {tp('badge')}
              </Typography>
            </div>
            <h1
              style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: '-1px',
              color: colors.text.primary,
              margin: '0 0 28px',
              maxWidth: 520,
              }}
            >
              {tp('heroTitle')}{' '}
              <span style={{ background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {tp('heroTitleHighlight')}
              </span>
            </h1>
            <p
              style={{
                fontSize: 'clamp(17px, 1.8vw, 19px)',
                color: colors.text.secondary,
                lineHeight: 1.7,
                maxWidth: 480,
                margin: '0 0 48px',
                fontWeight: 300,
              }}
            >
              {tp('heroSubhead')}
            </p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}
            >
              <Typography variant="caption" style={{ color: colors.text.tertiary, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {tp('scrollCue')}
              </Typography>
              <ChevronDown size={20} color={colors.text.tertiary} strokeWidth={2} />
            </motion.div>
          </div>
        </motion.section>

        <div
          style={{
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
            padding: `0 ${PAGE_HORIZONTAL_PADDING}`,
            width: '100%',
            minWidth: 0,
          }}
        >
        {/* Section 1 — Personal Origin */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -80px 0px' }}
          variants={revealVariants}
          style={{
            minHeight: SECTION_MIN_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: `${spacing.xxxl} 0`,
            maxWidth: PROSE_MAX_WIDTH,
            margin: '0 auto',
          }}
        >
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              fontSize: '18px',
              lineHeight: 1.8,
              marginBottom: PARAGRAPH_GAP,
            }}
          >
            {tp('section1P1')}
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              fontSize: '18px',
              lineHeight: 1.8,
              marginBottom: PARAGRAPH_GAP,
            }}
          >
            {tp('section1P2')}
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              fontSize: '18px',
              lineHeight: 1.8,
            }}
          >
            {t('ourStory.page.section1P3', { nuMoksa: 'Nu Moksa', cronaxy: 'Cronaxy' })}
          </Typography>
        </motion.section>

        {/* Section 2 — The Realization */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -80px 0px' }}
          variants={revealVariants}
          style={{
            position: 'relative',
            minHeight: SECTION_MIN_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: `${spacing.xxxl} 0`,
            margin: `0 calc(-1 * ${PAGE_HORIZONTAL_PADDING})`,
            paddingLeft: PAGE_HORIZONTAL_PADDING,
            paddingRight: PAGE_HORIZONTAL_PADDING,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Image
              src="/images/our-story-insight.png"
              alt=""
              fill
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(6,2,20,0.92) 0%, rgba(6,2,20,0.82) 50%, rgba(6,2,20,0.92) 100%)` }} />
          </div>
          <div style={{ maxWidth: PROSE_MAX_WIDTH, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontSize: 11,
                color: colors.accent.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
                marginBottom: spacing.lg,
              }}
            >
              {tp('insightLabel')}
            </div>
            <Typography
              variant="body"
              style={{
                color: colors.text.primary,
                fontSize: 'clamp(22px, 2.8vw, 28px)',
                lineHeight: 1.35,
                fontWeight: 500,
                marginBottom: spacing.xl,
                letterSpacing: '-0.3px',
              }}
            >
              {tp('insightTitle')}
            </Typography>
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                fontSize: '18px',
                lineHeight: 1.8,
                marginBottom: PARAGRAPH_GAP,
              }}
            >
              {tp('insightP1')}
            </Typography>
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                fontSize: '18px',
                lineHeight: 1.8,
              }}
            >
              {tp('insightP2')}
            </Typography>
          </div>
        </motion.section>

        {/* Section 3 — Why waQup Exists */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -80px 0px' }}
          variants={revealVariants}
          style={{
            minHeight: SECTION_MIN_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: `${spacing.xxxl} 0`,
            maxWidth: PROSE_MAX_WIDTH,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: colors.accent.tertiary,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
              marginBottom: spacing.lg,
            }}
          >
            {tp('whyExistsLabel')}
          </div>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              fontSize: '18px',
              lineHeight: 1.8,
              marginBottom: PARAGRAPH_GAP,
            }}
          >
            {tp('whyExistsP1')}
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              fontSize: '18px',
              lineHeight: 1.8,
            }}
          >
            {tp('whyExistsP2')}
          </Typography>
        </motion.section>

        {/* Section 4 — What waQup Represents */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -80px 0px' }}
          variants={revealVariants}
          style={{
            minHeight: SECTION_MIN_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: `${spacing.xxxl} 0`,
            background: `linear-gradient(to bottom, transparent, ${colors.accent.primary}04, transparent)`,
            margin: `0 calc(-1 * ${PAGE_HORIZONTAL_PADDING})`,
            paddingLeft: PAGE_HORIZONTAL_PADDING,
            paddingRight: PAGE_HORIZONTAL_PADDING,
          }}
        >
          <div style={{ maxWidth: PROSE_MAX_WIDTH, margin: '0 auto', width: '100%' }}>
            <div
              style={{
                fontSize: 11,
                color: colors.accent.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
                marginBottom: spacing.lg,
              }}
            >
              {tp('representsLabel')}
            </div>
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                fontSize: '18px',
                lineHeight: 1.8,
                marginBottom: PARAGRAPH_GAP,
              }}
            >
              {tp('representsP1')}
            </Typography>
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                fontSize: '18px',
                lineHeight: 1.8,
              }}
            >
              {tp('representsP2')}
            </Typography>
          </div>
        </motion.section>

        {/* Section 5 — Founder Message (Glass Card) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -80px 0px' }}
          variants={revealVariants}
          style={{
            padding: `${spacing.xxxl} 0`,
            maxWidth: PROSE_MAX_WIDTH,
            margin: '0 auto',
          }}
        >
          <GlassCard style={{ padding: `${spacing.xxl} ${spacing.xl}`, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: spacing.xl, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flexShrink: 0, width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                <Image
                  src="/images/indias-fernandes-portrait.png"
                  alt="Daniel Indias Fernandes"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body"
                  style={{
                    color: colors.text.primary,
                    fontSize: '20px',
                    lineHeight: 1.65,
                    marginBottom: spacing.xl,
                    fontWeight: 400,
                  }}
                >
                  {tp('founderQuote')}
                </Typography>
                <Typography
                  variant="body"
                  style={{
                    color: colors.text.secondary,
                    fontSize: '17px',
                    lineHeight: 1.75,
                    marginBottom: spacing.xl,
                  }}
                >
                  {tp('founderStory')}
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  <Typography
                    variant="h3"
                    style={{
                      color: colors.text.primary,
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    {tp('founderName')}
                  </Typography>
                  <Typography
                    variant="body"
                    style={{
                      color: colors.text.tertiary,
                      fontSize: '14px',
                      lineHeight: 1.5,
                      marginBottom: spacing.sm,
                    }}
                  >
                    {tp('founderRole')}
                  </Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' }}>
                    {FOUNDER_SOCIALS.map(({ href, label, icon: Icon, destination }) => (
                      <a
                        key={destination}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => Analytics.linkClicked(destination, 'our_story', label)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          color: colors.accent.tertiary,
                          fontSize: 14,
                          textDecoration: 'none',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                      >
                        <Icon size={16} />
                        {label}
                      </a>
                    ))}
                    <span style={{ color: colors.glass.border, fontSize: 12 }}>·</span>
                    {MUSIC_PROJECTS.map(({ name, href, destination }) => (
                      <a
                        key={destination}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => Analytics.linkClicked(destination, 'our_story', name)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          color: colors.accent.secondary,
                          fontSize: 14,
                          textDecoration: 'none',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                      >
                        <Music size={14} />
                        {name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Final CTA Band */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          style={{
            padding: `${spacing.xxl} 0`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: CONTENT_MEDIUM,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.lg,
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h2"
              style={{
                color: colors.text.primary,
                fontSize: 'clamp(22px, 2.5vw, 26px)',
                fontWeight: 400,
                letterSpacing: '-0.3px',
              }}
            >
              {tp('ctaHeadline')}
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, width: '100%', maxWidth: 360 }}>
              <Link href="/how-it-works" style={{ textDecoration: 'none', width: '100%' }}>
                <Button
                  variant="primary"
                  size="lg"
                  style={{
                    width: '100%',
                    minHeight: '56px',
                    fontSize: '17px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing.sm,
                  }}
                >
                  {tp('ctaPrimary')} <ArrowRight size={18} color={colors.text.onDark} strokeWidth={2} />
                </Button>
              </Link>
              <Link href="/waitlist" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body"
                  style={{
                    color: colors.text.secondary,
                    fontSize: '15px',
                    opacity: 0.9,
                    cursor: 'pointer',
                    padding: spacing.sm,
                  }}
                >
                  {tp('ctaSecondary')}
                </Typography>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </PageShell>
  );
}