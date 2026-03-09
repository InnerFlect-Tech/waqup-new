'use client';

import React, { useState, useRef } from 'react';
import {
  Typography,
  Button,
  Input,
  Card,
  Loading,
  Badge,
  Progress,
  Icon,
  Container,
  QCoin,
} from '@/components';
import {
  PageShell,
  PageContent,
  SpeakingAnimation,
  GlassCard,
  Logo,
  ThemeSelector,
  CreateProgressBar,
  VoiceOrb,
} from '@/components';
import { spacing, typography, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import { useTheme } from '@/theme';
import Link from 'next/link';
import type { CreationStep } from '@/lib/contexts/ContentCreationContext';

export default function ShowcasePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [inputValue, setInputValue] = useState('');
  const [progressValue, setProgressValue] = useState(45);
  const [selectedTab, setSelectedTab] = useState('Home');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [createStep, setCreateStep] = useState<CreationStep>('init');
  const [voiceOrbActive, setVoiceOrbActive] = useState(false);
  const frequencyDataRef = useRef<Uint8Array | null>(null);

  return (
    <PageShell intensity="medium" bare>
      <ThemeSelector />
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>
        {/* Header */}
        <div style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
          <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            wa<span style={{ background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Q</span>up Design System
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Complete UI Component Library & Design Tokens
          </Typography>
        </div>

        {/* Typography Scale */}
        <Section title="Typography Scale" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <Typography variant="h1" style={{ color: colors.text.primary }}>h1 — Page titles (32px, 300)</Typography>
              <Typography variant="h2" style={{ color: colors.text.primary }}>h2 — Section headings (24px, 300)</Typography>
              <Typography variant="h3" style={{ color: colors.text.primary }}>h3 — Sub-sections (20px, 300)</Typography>
              <Typography variant="h4" style={{ color: colors.text.primary }}>h4 — UI labels (18px, 600)</Typography>
              <Typography variant="body" style={{ color: colors.text.primary }}>body — Default copy (16px, 400)</Typography>
              <Typography variant="bodyBold" style={{ color: colors.text.primary }}>bodyBold — Emphasized body (16px, 600)</Typography>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>caption — Labels, secondary (14px, 400)</Typography>
              <Typography variant="captionBold" style={{ color: colors.text.primary }}>captionBold — Active labels (14px, 600)</Typography>
              <Typography variant="small" style={{ color: colors.text.tertiary }}>small — Metadata, badges (12px, 400)</Typography>
            </div>
          </GlassCard>
        </Section>

        {/* Spacing Scale */}
        <Section title="Spacing Scale" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {(['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] as const).map((key) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                  <Typography variant="small" style={{ color: colors.text.secondary, minWidth: 40 }}>{key}</Typography>
                  <div style={{ height: spacing[key], width: spacing[key], background: colors.accent.primary, opacity: 0.6, borderRadius: 2 }} />
                  <Typography variant="small" style={{ color: colors.text.tertiary }}>{spacing[key]}px</Typography>
                </div>
              ))}
            </div>
          </GlassCard>
        </Section>

        {/* Border Radius */}
        <Section title="Border Radius" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.lg, alignItems: 'flex-end' }}>
              {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((key) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                  <div style={{ width: 64, height: 64, borderRadius: borderRadius[key], background: colors.accent.primary, opacity: 0.7 }} />
                  <Typography variant="small" style={{ color: colors.text.secondary }}>{key}</Typography>
                  <Typography variant="small" style={{ color: colors.text.tertiary }}>{borderRadius[key]}px</Typography>
                </div>
              ))}
            </div>
          </GlassCard>
        </Section>

        {/* Text Colors */}
        <Section title="Text Colors" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <Typography variant="body" style={{ color: colors.text.primary }}>text.primary — Headings, body</Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>text.secondary — Subtitles, secondary copy</Typography>
              <Typography variant="body" style={{ color: colors.text.tertiary }}>text.tertiary — Captions, placeholders</Typography>
            </div>
          </GlassCard>
        </Section>

        {/* Glass Tokens */}
        <Section title="Glass Tokens" colors={colors}>
          <GlassCard variant="content">
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
              glass.light = card backgrounds · glass.medium = hover overlays · glass.border = card/input borders · glass.opaque = borders/highlights only (not card bg)
            </Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: spacing.md }}>
              <ColorSwatch name="light" color={colors.glass.light} colors={colors} />
              <ColorSwatch name="medium" color={colors.glass.medium} colors={colors} />
              <ColorSwatch name="border" color={colors.glass.border} colors={colors} />
              <ColorSwatch name="opaque" color={colors.glass.opaque} colors={colors} />
            </div>
          </GlassCard>
        </Section>

        {/* Gradients */}
        <Section title="Gradients" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <div>
                <Typography variant="caption" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>gradients.primary (buttons)</Typography>
                <div style={{ height: 48, background: colors.gradients.primary, borderRadius: borderRadius.md }} />
              </div>
              <div>
                <Typography variant="caption" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>gradients.background (page wash)</Typography>
                <div style={{ height: 48, background: colors.gradients.background, borderRadius: borderRadius.md }} />
              </div>
              <div>
                <Typography variant="caption" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>gradients.mystical (overlay)</Typography>
                <div style={{ height: 48, background: colors.gradients.mystical, borderRadius: borderRadius.md }} />
              </div>
            </div>
          </GlassCard>
        </Section>

        {/* Theme Tokens - Colors */}
        <Section title="Theme Tokens - Colors" colors={colors}>
          <GlassCard variant="content" style={{ marginBottom: spacing.md }}>
            <Typography variant="h4" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>Background</Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: spacing.md }}>
              <ColorSwatch name="Primary" color={colors.background.primary} colors={colors} />
              <ColorSwatch name="Secondary" color={colors.background.secondary} colors={colors} />
              <ColorSwatch name="Tertiary" color={colors.background.tertiary} colors={colors} />
              <ColorSwatch name="Glass" color={colors.background.glass} colors={colors} />
            </div>
          </GlassCard>
          <GlassCard variant="content" style={{ marginBottom: spacing.md }}>
            <Typography variant="h4" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>Accent</Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: spacing.md }}>
              <ColorSwatch name="Primary" color={colors.accent.primary} colors={colors} />
              <ColorSwatch name="Secondary" color={colors.accent.secondary} colors={colors} />
              <ColorSwatch name="Tertiary" color={colors.accent.tertiary} colors={colors} />
              <ColorSwatch name="Light" color={colors.accent.light} colors={colors} />
            </div>
          </GlassCard>
          <GlassCard variant="content">
            <Typography variant="h4" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>Mystical Effects</Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: spacing.md }}>
              <ColorSwatch name="Glow" color={colors.mystical.glow} colors={colors} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                <div style={{ width: '100%', height: 60, borderRadius: borderRadius.md, background: colors.accent.primary, filter: `blur(${colors.mystical.blur})`, boxShadow: `0 0 ${colors.mystical.blur} ${colors.accent.primary}` }} />
                <Typography variant="small" style={{ color: colors.text.primary }}>Blur: {colors.mystical.blur}</Typography>
              </div>
            </div>
          </GlassCard>
        </Section>

        {/* Logo */}
        <Section title="Logo" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'flex', gap: spacing.xl, alignItems: 'center', flexWrap: 'wrap' }}>
              <Logo size="sm" href="" />
              <Logo size="md" href="" />
              <Logo size="lg" href="" />
            </div>
          </GlassCard>
        </Section>

        {/* QCoin - Credits icon */}
        <Section title="QCoin (Credits icon)" colors={colors}>
          <GlassCard variant="content">
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
              Branded Q icon for credits/Qs — minimalist coin with theme accent.
            </Typography>
            <div style={{ display: 'flex', gap: spacing.xl, alignItems: 'center', flexWrap: 'wrap' }}>
              <QCoin size="sm" />
              <QCoin size="md" />
              <QCoin size="lg" />
            </div>
          </GlassCard>
        </Section>

        {/* ThemeSelector note */}
        <Section title="ThemeSelector" colors={colors}>
          <GlassCard variant="content">
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Theme switcher appears fixed top-right. Use the Theme button above to switch themes.
            </Typography>
          </GlassCard>
        </Section>

        {/* Navigation Menu Showcase */}
        <Section title="Navigation Menus" colors={colors}>
          <Card variant="elevated">
            <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>Bottom Tab Navigation</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: colors.background.secondary, borderRadius: borderRadius.md, padding: spacing.xs, marginTop: spacing.md }}>
              {['Home', 'Library', 'Create', 'Profile'].map((tab, index) => {
                const isSelected = selectedTab === tab;
                const useGradient = index < 2;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    style={{
                      flex: 1,
                      padding: spacing.sm,
                      textAlign: 'center',
                      borderRadius: borderRadius.sm,
                      border: 'none',
                      background: isSelected ? (useGradient ? colors.gradients.primary : colors.glass.border) : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      color: isSelected ? colors.text.onDark : colors.text.secondary,
                      fontWeight: isSelected ? 600 : 400,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      boxShadow: isSelected && useGradient ? `0 4px 12px ${colors.accent.primary}60` : 'none',
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </Card>
        </Section>

        {/* Pages Preview */}
        <Section title="Pages & Screens" colors={colors}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: spacing.md }}>
            <PagePreview title="Login" route="/login" colors={colors} />
            <PagePreview title="Signup" route="/signup" colors={colors} />
            <PagePreview title="Home" route="/home" colors={colors} />
            <PagePreview title="Library" route="/library" colors={colors} />
            <PagePreview title="Create" route="/create" colors={colors} />
            <PagePreview title="Profile" route="/profile" colors={colors} />
          </div>
        </Section>

        {/* UI Components - Input */}
        <Section title="UI Components - Input" colors={colors}>
          <GlassCard variant="content">
            <div style={{ maxWidth: 400 }}>
              <Input label="Default" placeholder="Enter text..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              <Input label="With error" error="This field is required" placeholder="Error state" />
              <Input label="Password" type="password" placeholder="••••••••" />
            </div>
          </GlassCard>
        </Section>

        {/* UI Components - Progress */}
        <Section title="UI Components - Progress" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              <div>
                <Typography variant="caption" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>Linear (0%, 50%, 100%)</Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  <Progress variant="linear" value={0} />
                  <Progress variant="linear" value={progressValue} />
                  <Progress variant="linear" value={100} color="success" />
                </div>
              </div>
              <div>
                <Typography variant="caption" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>Circular</Typography>
                <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'center' }}>
                  <Progress variant="circular" value={25} size="sm" />
                  <Progress variant="circular" value={50} size="md" />
                  <Progress variant="circular" value={75} size="lg" color="success" />
                </div>
              </div>
            </div>
          </GlassCard>
        </Section>

        {/* UI Components - Loading */}
        <Section title="UI Components - Loading" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xl, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                <Loading variant="spinner" size="sm" />
                <Typography variant="small" style={{ color: colors.text.tertiary }}>Spinner sm</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                <Loading variant="spinner" size="md" />
                <Typography variant="small" style={{ color: colors.text.tertiary }}>Spinner md</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                <Loading variant="spinner" size="lg" />
                <Typography variant="small" style={{ color: colors.text.tertiary }}>Spinner lg</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                <Loading variant="dots" size="md" />
                <Typography variant="small" style={{ color: colors.text.tertiary }}>Dots</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs, width: 200 }}>
                <Loading variant="skeleton" size="md" />
                <Typography variant="small" style={{ color: colors.text.tertiary }}>Skeleton</Typography>
              </div>
            </div>
          </GlassCard>
        </Section>

        {/* UI Components - Badge */}
        <Section title="UI Components - Badge" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <div>
                <Typography variant="caption" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>Variants</Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="accent">Accent</Badge>
                </div>
              </div>
              <div>
                <Typography variant="caption" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>Sizes</Typography>
                <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
                  <Badge variant="success" size="sm">Small</Badge>
                  <Badge variant="success" size="md">Medium</Badge>
                </div>
              </div>
            </div>
          </GlassCard>
        </Section>

        {/* UI Components - Icon */}
        <Section title="UI Components - Icon" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: spacing.md }}>
              {(['Home', 'User', 'Settings', 'Heart', 'Play', 'Pause', 'Mic', 'Search', 'Menu', 'X', 'ChevronRight', 'Check'] as const).map((name) => (
                <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                  <Icon name={name} size={24} />
                  <Typography variant="small" style={{ color: colors.text.tertiary }}>{name}</Typography>
                </div>
              ))}
            </div>
          </GlassCard>
        </Section>

        {/* UI Components - Buttons */}
        <Section title="UI Components - Buttons" colors={colors}>
          <GlassCard variant="content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <Button variant="primary" size="sm">Primary Small</Button>
              <Button variant="primary" size="md">Primary Medium</Button>
              <Button variant="primary" size="lg">Primary Large</Button>
              <Button variant="secondary" size="md">Secondary Button</Button>
              <Button variant="outline" size="md">Outline Button</Button>
              <Button variant="text" size="md">Text Button</Button>
              <Button variant="ghost" size="md">Ghost Button</Button>
              <Button variant="primary" size="md" loading>Loading Button</Button>
              <Button variant="primary" size="md" disabled>Disabled Button</Button>
            </div>
          </GlassCard>
        </Section>

        {/* UI Components - Cards */}
        <Section title="UI Components - Cards" colors={colors}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <Card variant="default">
              <Typography variant="h3" style={{ color: colors.text.primary }}>Default Card</Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>Glass-morphism styling and subtle shadow.</Typography>
            </Card>
            <Card variant="elevated">
              <Typography variant="h3" style={{ color: colors.text.primary }}>Elevated Card</Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>Prominent shadow with mystical glow effects.</Typography>
            </Card>
          </div>
        </Section>

        {/* GlassCard variants */}
        <Section title="GlassCard Variants" colors={colors}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <GlassCard variant="auth">
              <Typography variant="h3" style={{ color: colors.text.primary }}>GlassCard variant=&quot;auth&quot;</Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>Used for auth forms. Larger padding (xxxl).</Typography>
            </GlassCard>
            <GlassCard variant="content">
              <Typography variant="h3" style={{ color: colors.text.primary }}>GlassCard variant=&quot;content&quot;</Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>Used for content cards. Standard padding (xl).</Typography>
            </GlassCard>
          </div>
        </Section>

        {/* Container */}
        <Section title="Container" colors={colors}>
          <Container variant="secondary" maxWidth="md" style={{ border: `1px dashed ${colors.glass.border}` }}>
            <Typography variant="body" style={{ color: colors.text.primary }}>Container maxWidth=&quot;md&quot; (768px) with secondary background</Typography>
          </Container>
        </Section>

        {/* CreateProgressBar */}
        <Section title="CreateProgressBar" colors={colors}>
          <GlassCard variant="content">
            <div style={{ marginBottom: spacing.md }}>
              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>Step progress for content creation flow:</Typography>
              <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.md }}>
                {(['init', 'intent', 'review', 'voice', 'complete'] as CreationStep[]).map((step) => (
                  <Button key={step} variant={createStep === step ? 'primary' : 'ghost'} size="sm" onClick={() => setCreateStep(step)}>{step}</Button>
                ))}
              </div>
            </div>
            <CreateProgressBar currentStep={createStep} />
          </GlassCard>
        </Section>

        {/* VoiceOrb */}
        <Section title="VoiceOrb" colors={colors}>
          <GlassCard variant="content">
            <div style={{ marginBottom: spacing.md }}>
              <Button variant={voiceOrbActive ? 'secondary' : 'primary'} onClick={() => setVoiceOrbActive(!voiceOrbActive)}>
                {voiceOrbActive ? 'Deactivate' : 'Activate'} orb
              </Button>
            </div>
            <div style={{ minHeight: 280, borderRadius: borderRadius.lg, overflow: 'hidden' }}>
              <VoiceOrb isActive={voiceOrbActive} frequencyDataRef={frequencyDataRef} />
            </div>
          </GlassCard>
        </Section>

        {/* Audio Components - Speaking Animation */}
        <Section title="Audio Components - SpeakingAnimation" colors={colors}>
          <Card variant="elevated">
            <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>Speaking Animation</Typography>
            <Typography variant="body" style={{ marginBottom: spacing.md, color: colors.text.secondary }}>
              Cycles through 4 pages: floating glass orbs, frequency bars, subtle waves, rotating rings.
            </Typography>
            <div style={{ width: '100%', height: 450, marginBottom: spacing.md, borderRadius: borderRadius.lg, overflow: 'hidden', position: 'relative', background: colors.background.primary, border: `1px solid ${colors.glass.border}` }}>
              <SpeakingAnimation isSpeaking={isSpeaking} pageDuration={5000} />
            </div>
            <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
              <Button variant={isSpeaking ? 'secondary' : 'primary'} onClick={() => setIsSpeaking(!isSpeaking)}>
                {isSpeaking ? 'Pause' : 'Play'}
              </Button>
              <Typography variant="small" style={{ color: colors.text.tertiary, marginLeft: spacing.sm }}>
                {isSpeaking ? 'Animations active' : 'Click to start'}
              </Typography>
            </div>
          </Card>
        </Section>

        {/* Utility nav */}
        <div style={{ marginTop: spacing.xl, paddingTop: spacing.xl, borderTop: `1px solid ${colors.glass.border}`, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
          <Link href="/system" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>System</Link>
          <Link href="/sitemap-view" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Sitemap</Link>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: spacing.xl, paddingTop: spacing.xl }}>
          <Typography variant="body" style={{ marginBottom: spacing.xs, color: colors.text.secondary }}>waQup Design System v1.0</Typography>
          <Typography variant="caption" style={{ color: colors.text.tertiary }}>Glass-Morphism Minimalist Design with Mystical Themes</Typography>
        </div>
      </div>
    </PageShell>
  );
}

const Section: React.FC<{ title: string; children: React.ReactNode; colors: { text: { primary: string } } }> = ({ title, children, colors }) => (
  <div style={{ marginBottom: spacing.xl }}>
    <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>{title}</Typography>
    {children}
  </div>
);

interface PagePreviewProps {
  title: string;
  route: string;
  colors: { text: { primary: string; secondary: string }; glass: { light: string; border: string } };
}
const PagePreview: React.FC<PagePreviewProps> = ({ title, route, colors }) => (
  <Link href={route} style={{ textDecoration: 'none' }}>
    <Card variant="default" pressable style={{ minHeight: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>{title}</Typography>
      <Typography variant="caption" style={{ color: colors.text.secondary }}>{route}</Typography>
    </Card>
  </Link>
);

interface ColorSwatchProps {
  name: string;
  color: string;
  colors: { text: { primary: string; tertiary: string; inverse?: string }; mystical?: { glow?: string } };
  textColor?: 'primary' | 'inverse';
}
const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  color,
  colors,
  textColor = 'primary',
}) => {
  const labelColor = textColor === 'inverse' ? (colors.text.inverse ?? colors.text.primary) : colors.text.primary;
  return (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div
      style={{
        width: '100%',
        height: 60,
        backgroundColor: color,
        borderRadius: borderRadius.md,
        marginBottom: spacing.xs,
        boxShadow: color === colors.mystical?.glow ? `0 0 20px ${color}` : undefined,
      }}
    />
    <Typography variant="small" style={{ color: labelColor }}>{name}</Typography>
    <Typography variant="small" style={{ color: colors.text.tertiary }}>{color}</Typography>
  </div>
  );
};
