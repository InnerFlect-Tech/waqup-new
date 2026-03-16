'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { withOpacity } from '@waqup/shared/theme';
import { PageShell, WaitlistCTA, PublicFooter } from '@/components';
import { spacing, borderRadius, BLUR, FROSTED_GLASS_HERO, imageEdgeFades, LANDING_SECTION_PADDING_Y } from '@/theme';
import { CONTENT_MAX_WIDTH, CONTENT_MEDIUM, PAGE_PADDING } from '@/theme';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import {
  ArrowRight,
  Brain,
  Check,
  Clock,
  Mic,
  Moon,
  Sun,
  Volume2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ThemeColors = ReturnType<typeof useTheme>['theme']['colors'];

// ─── Main Page ────────────────────────────────────────────────────────────────

/**
 * The Science — Research-backed mechanisms behind waQup
 *
 * Purpose: Proof, credibility, why voice + affirmations work.
 * Visitor intent: "Is this real? Why does my own voice matter?"
 *
 * Design: Mirrors how-it-works page — full-width sections, photo dividers,
 * glass cards, badge/label patterns, research-backed copy.
 */
export default function SciencePage() {
  const t = useTranslations('marketing');
  const tp = (key: string) => t(`explanation.page.${key}`);
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="high" bare allowDocumentScroll>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="science-hero"
        style={{
          padding: `${spacing.xxl} ${PAGE_PADDING}`,
          maxWidth: CONTENT_MAX_WIDTH,
          marginLeft: 'auto',
          marginRight: 'auto',
          minHeight: 'calc(100dvh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 8,
            padding: '6px 16px',
            borderRadius: borderRadius.full,
            background: `${colors.accent.tertiary}15`,
            border: `1px solid ${colors.accent.tertiary}30`,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: colors.accent.secondary,
              animation: 'wqPulse 2s ease-in-out infinite',
            }}
          />
          <Typography
            variant="smallBold"
            style={{
              color: colors.accent.tertiary,
              textTransform: 'uppercase',
              letterSpacing: '0.7px',
              fontSize: 11,
            }}
          >
            {tp('badge')}
          </Typography>
        </div>

        <h1
          style={{
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: '-2px',
            color: colors.text.primary,
            margin: '0 0 28px',
          }}
        >
          {tp('heroTitle1')}
          <br />
          <span
            style={{
              background: colors.gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {tp('heroTitle2')}
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(17px, 1.8vw, 21px)',
            color: colors.text.secondary,
            lineHeight: 1.65,
            maxWidth: 520,
            margin: '0 0 48px',
            fontWeight: 300,
          }}
        >
          {tp('heroParagraph')}
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <Button
              variant="primary"
              size="lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '17px',
                padding: '16px 36px',
                boxShadow: `0 8px 48px ${colors.accent.primary}50`,
              }}
            >
              {tp('ctaStart')}
              <ArrowRight size={18} color={colors.text.onDark} />
            </Button>
          </Link>
          <Link href="/how-it-works" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '17px' }}>
              {tp('ctaHowItWorks')}
            </Button>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 28 }}>
          {[
            { n: tp('stat1N'), l: tp('stat1L') },
            { n: tp('stat2N'), l: tp('stat2L') },
            { n: tp('stat3N'), l: tp('stat3L') },
          ].map(({ n, l }) => (
            <div key={l}>
              <div style={{ fontSize: 20, fontWeight: 500, color: colors.text.primary, letterSpacing: '-0.5px' }}>
                {n}
              </div>
              <div style={{ fontSize: 12, color: colors.text.tertiary, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pillar divider ─────────────────────────────────── */}
      <div style={{ background: colors.glass.dark }}>
        <div
          className="science-pillar-divider"
          style={{
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
            padding: `${spacing.xxl} ${PAGE_PADDING}`,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
          }}
        >
          {[
            { n: '01', label: tp('pillar1Label'), icon: Brain },
            { n: '02', label: tp('pillar2Label'), icon: Volume2 },
            { n: '03', label: tp('pillar3Label'), icon: Clock },
          ].map(({ n, label, icon: Icon }, i) => (
            <div
              key={n}
              style={{
                textAlign: 'center',
                padding: '0 32px',
                borderRight: i < 2 ? `1px solid ${colors.glass.border}` : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ fontSize: 11, color: colors.accent.primary, fontWeight: 700, letterSpacing: '0.1em' }}>
                {n}
              </div>
              <Icon size={18} color={colors.text.secondary} />
              <div style={{ fontSize: 14, color: colors.text.secondary, fontWeight: 400 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Neuroplasticity ───────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          zIndex: 10,
          padding: `${LANDING_SECTION_PADDING_Y} ${PAGE_PADDING}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <div
          className="science-neuro"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
          }}
        >
          {/* Left — neuroplasticity image */}
          <div style={{ position: 'relative', minHeight: 520 }}>
            <Image
              src="/images/neuroplasticity-visual.png"
              alt="Neural pathways lighting up as sound waves enter the brain"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at 55% 50%, transparent 45%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '30%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '35%',
                background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 52,
                left: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'flex-start',
              }}
            >
              {[
                { label: tp('neuroTag1'), color: colors.accent.primary },
                { label: tp('neuroTag2'), color: colors.accent.secondary },
                { label: tp('neuroTag3'), color: colors.accent.tertiary },
                { label: tp('neuroTag4'), color: colors.accent.primary },
              ].map(({ label, color }) => (
                <div
                  key={label}
                  style={{
                    padding: '5px 13px',
                    borderRadius: borderRadius.full,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: BLUR.md,
                    WebkitBackdropFilter: BLUR.md,
                    border: `1px solid ${color}35`,
                    fontSize: 11,
                    color,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — copy */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: colors.accent.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              {tp('neuroLabel')}
            </div>
            <h2
              style={{
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                fontWeight: 300,
                letterSpacing: '-1.2px',
                color: colors.text.primary,
                margin: '0 0 28px',
                lineHeight: 1.15,
              }}
            >
              {tp('neuroTitle')}
            </h2>
            <p style={{ fontSize: 17, color: colors.text.secondary, lineHeight: 1.75, margin: '0 0 24px' }}>
              {tp('neuroP1')}
            </p>
            <p style={{ fontSize: 16, color: colors.text.secondary, lineHeight: 1.75, margin: '0 0 40px' }}>
              {tp('neuroP2')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: tp('neuroBullet1Label'), desc: tp('neuroBullet1Desc') },
                { label: tp('neuroBullet2Label'), desc: tp('neuroBullet2Desc') },
                { label: tp('neuroBullet3Label'), desc: tp('neuroBullet3Desc') },
              ].map(({ label, desc }) => (
                <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: `${colors.accent.primary}20`,
                      border: `1px solid ${colors.accent.primary}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <Check size={11} color={colors.accent.primary} strokeWidth={3} />
                  </div>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: colors.text.primary }}>{label} </span>
                    <span style={{ fontSize: 15, color: colors.text.secondary }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo divider ──────────────────────────────────── */}
      <section style={{ position: 'relative', height: 500, overflow: 'visible' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <Image
            src="/images/hero-transform.png"
            alt="Person in transformation — headphones, cosmic identity shift"
            fill
            unoptimized
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </div>
        <div style={{ ...imageEdgeFades(colors.background.primary).top }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).bottom }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).left }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).right }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `0 ${PAGE_PADDING}`,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ padding: '48px 56px', maxWidth: 700, ...FROSTED_GLASS_HERO, borderRadius: 24 }}>
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(20px, 2.5vw, 28px)',
                fontWeight: 300,
                lineHeight: 1.4,
                  color: colors.text.onDark,
                letterSpacing: '-0.5px',
                textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              }}
            >
              {tp('quoteDivider')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Three Science Pillars ──────────────────────────── */}
      <section
        style={{
          position: 'relative',
          zIndex: 10,
          padding: `${LANDING_SECTION_PADDING_Y} ${PAGE_PADDING}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>
            {tp('pillarsTitle')}
          </h2>
          <p style={{ fontSize: 19, color: colors.text.secondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>
            {tp('pillarsSubtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {[
            {
              icon: Brain,
              name: tp('pillar1Name'),
              tagline: tp('pillar1Tagline'),
              desc: tp('pillar1Desc'),
              color: colors.accent.primary,
              gradient: `linear-gradient(160deg, ${colors.accent.primary}18, ${colors.accent.secondary}06)`,
              science: tp('pillar1Science'),
            },
            {
              icon: Volume2,
              name: tp('pillar2Name'),
              tagline: tp('pillar2Tagline'),
              desc: tp('pillar2Desc'),
              color: colors.accent.secondary,
              gradient: `linear-gradient(160deg, ${colors.accent.secondary}18, ${withOpacity(colors.accent.secondary, 0.06)})`,
              science: tp('pillar2Science'),
            },
            {
              icon: Mic,
              name: tp('pillar3Name'),
              tagline: tp('pillar3Tagline'),
              desc: tp('pillar3Desc'),
              color: colors.accent.tertiary,
              gradient: `linear-gradient(160deg, ${colors.accent.tertiary}18, ${colors.accent.primary}06)`,
              science: tp('pillar3Science'),
            },
          ].map(({ icon: Icon, name, tagline, desc, color, gradient, science }) => (
            <div
              key={name}
              style={{
                borderRadius: borderRadius.xl,
                background: gradient,
                backdropFilter: BLUR.xl,
                WebkitBackdropFilter: BLUR.xl,
                border: `1px solid ${color}22`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = `0 40px 100px ${color}30`;
                e.currentTarget.style.borderColor = `${color}45`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = `${color}22`;
              }}
            >
              <div style={{ padding: '48px 40px 36px', position: 'relative', borderBottom: `1px solid ${color}12` }}>
                <div
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}15, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 28,
                    boxShadow: `0 0 40px ${color}20`,
                  }}
                >
                  <Icon size={34} color={color} />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 400, color: colors.text.primary, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                  {name}
                </h3>
                <p style={{ fontSize: 14, color, fontWeight: 500, margin: 0, letterSpacing: '0.02em' }}>{tagline}</p>
              </div>
              <div style={{ padding: '32px 40px 40px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <p style={{ fontSize: 15, color: colors.text.secondary, lineHeight: 1.7, margin: 0 }}>{desc}</p>
                <p
                  style={{
                    fontSize: 12,
                    color: colors.text.secondary,
                    lineHeight: 1.6,
                    margin: 0,
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: `${color}10`,
                    border: `1px solid ${color}20`,
                    fontStyle: 'italic',
                  }}
                >
                  {science}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Day & Night Science ───────────────────────────── */}
      <section style={{ padding: `${LANDING_SECTION_PADDING_Y} ${PAGE_PADDING}`, background: `linear-gradient(to bottom, transparent, ${colors.accent.primary}06, transparent)` }}>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 16 }}>
              {tp('timingLabel')}
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-1.5px', color: colors.text.primary, margin: '0 0 20px' }}>
              {tp('timingTitle')}
            </h2>
            <p style={{ fontSize: 19, color: colors.text.secondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>
              {tp('timingSubtitle')}
            </p>
          </div>

          <div
            className="science-timeline"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
              maxWidth: 820,
              margin: '0 auto',
            }}
          >
            {[
              { icon: Sun, label: tp('timeline1Label'), sub: tp('timeline1Sub'), desc: tp('timeline1Desc'), color: colors.accent.primary },
              { icon: Moon, label: tp('timeline2Label'), sub: tp('timeline2Sub'), desc: tp('timeline2Desc'), color: colors.accent.secondary },
              { icon: Clock, label: tp('timeline3Label'), sub: tp('timeline3Sub'), desc: tp('timeline3Desc'), color: colors.accent.tertiary },
            ].map(({ icon: Icon, label, sub, desc, color }) => (
              <div
                key={label}
                style={{
                  padding: '40px 36px',
                  borderRadius: borderRadius.xl,
                  background: colors.glass.light,
                  backdropFilter: BLUR.xl,
                  WebkitBackdropFilter: BLUR.xl,
                  border: `1px solid ${colors.glass.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={30} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: colors.text.primary, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 12, color, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 12 }}>{sub}</div>
                  <p style={{ fontSize: 15, color: colors.text.secondary, lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Voice Cloning Photo Divider ───────────────────── */}
      <section style={{ position: 'relative', height: 520, overflow: 'visible' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <Image
            src="/images/voice-cloning-hero.png"
            alt="Person with headphones in cosmic transformation"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
            unoptimized
          />
        </div>
        <div style={{ ...imageEdgeFades(colors.background.primary).top }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).bottom }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).left }} />
        <div style={{ ...imageEdgeFades(colors.background.primary).right }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: `0 ${PAGE_PADDING}` }}>
            <div style={{ maxWidth: 520, padding: '48px 56px', ...FROSTED_GLASS_HERO, borderRadius: 24 }}>
              <div
                style={{
                  fontSize: 11,
                  color: colors.accent.tertiary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                  marginBottom: 20,
                }}
              >
                {tp('voiceCloningLabel')}
              </div>
              <h3
                style={{
                  fontSize: 'clamp(28px, 3vw, 44px)',
                  fontWeight: 300,
                  letterSpacing: '-1px',
                  color: colors.text.onDark,
                  margin: '0 0 24px',
                  lineHeight: 1.15,
                  textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                }}
              >
                {tp('voiceCloningTitle1')}
                <br />
                <span
                  style={{
                    background: colors.gradients.primary,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {tp('voiceCloningTitle2')}
                </span>
              </h3>
              <p
                style={{
                  fontSize: 16,
                  color: withOpacity(colors.text.onDark, 0.8),
                  lineHeight: 1.75,
                  margin: '0 0 32px',
                  fontWeight: 300,
                }}
              >
                {tp('voiceCloningParagraph')}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div
                  style={{
                    padding: '10px 22px',
                    borderRadius: borderRadius.full,
                    background: `${colors.accent.primary}25`,
                    border: `1px solid ${colors.accent.primary}50`,
                    fontSize: 13,
                    color: colors.accent.tertiary,
                    fontWeight: 500,
                  }}
                >
                  {tp('voiceCloningBadge1')}
                </div>
                <div
                  style={{
                    padding: '10px 22px',
                    borderRadius: borderRadius.full,
                    background: withOpacity(colors.text.onDark, 0.08),
                    border: `1px solid ${withOpacity(colors.text.onDark, 0.12)}`,
                    fontSize: 13,
                    color: withOpacity(colors.text.onDark, 0.7),
                  }}
                >
                  {tp('voiceCloningBadge2')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section style={{ padding: `${LANDING_SECTION_PADDING_Y} ${PAGE_PADDING}`, position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.accent.primary}14 0%, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: CONTENT_MEDIUM, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <WaitlistCTA
            variant="banner"
            headline={tp('ctaHeadline')}
            subtext={tp('ctaSubtext')}
          />
        </div>
      </section>

      <PublicFooter />

      {/* ── Global Styles ─────────────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes wqPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

        html { scroll-snap-type: y proximity; }
        section { scroll-snap-align: start; scroll-snap-stop: normal; }

        .science-hero { min-height: calc(100dvh - 64px); }
        .science-neuro { grid-template-columns: 1fr 1fr; }
        .science-pillar-divider { grid-template-columns: repeat(3, 1fr); }
        .science-timeline { grid-template-columns: repeat(3, 1fr); }

        @media (max-width: 960px) {
          .science-hero { min-height: auto !important; padding-top: 60px !important; padding-bottom: 60px !important; }
          .science-neuro { grid-template-columns: 1fr !important; }
          .science-pillar-divider { grid-template-columns: 1fr !important; }
          .science-timeline { grid-template-columns: 1fr !important; }
        }
      `,
        }}
      />
    </PageShell>
  );
}
