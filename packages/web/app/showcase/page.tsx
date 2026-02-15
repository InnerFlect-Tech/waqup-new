'use client';

import React, { useState } from 'react';
import {
  Typography,
  Button,
  Input,
  Card,
  Loading,
  Badge,
  Progress,
} from '@/components';
import { spacing, typography, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, ThemeSelector, SpeakingAnimation, AppHeader } from '@/components';
import Link from 'next/link';

export default function ShowcasePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [inputValue, setInputValue] = useState('');
  const [progressValue, setProgressValue] = useState(45);
  const [selectedTab, setSelectedTab] = useState('Home');
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <PageShell intensity="medium" bare>
      <ThemeSelector />
      <AppHeader variant="public" />
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              wa<span style={{ background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Q</span>up Design System
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Complete UI Component Library & Design Tokens
            </Typography>
          </div>

          {/* Navigation Menu Showcase */}
          <Section title="Navigation Menus" colors={colors}>
            <Card
              variant="elevated"
              style={{
                marginBottom: spacing.md,
                background: colors.glass.light,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${colors.glass.border}`,
                boxShadow: `0 8px 32px ${colors.mystical.glow}40`,
              }}
            >
              <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
                Bottom Tab Navigation
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  backgroundColor: colors.background.secondary,
                  borderRadius: borderRadius.md,
                  padding: spacing.xs,
                  marginTop: spacing.md,
                }}
              >
                {['Home', 'Library', 'Create', 'Profile'].map((tab, index) => {
                  const isSelected = selectedTab === tab;
                  // First two tabs: more opaque when selected, last two: more transparent
                  const isOpaque = index < 2;
                  const selectedBackground = isOpaque 
                    ? colors.gradients.primary 
                    : colors.glass.opaque;
                  const unselectedBackground = isOpaque 
                    ? colors.glass.opaque 
                    : colors.glass.transparent;
                  
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
                        background: isSelected ? selectedBackground : unselectedBackground,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        color: isSelected 
                          ? colors.text.onDark 
                          : (isOpaque ? colors.text.primary : colors.text.secondary),
                        fontWeight: isSelected ? 600 : 400,
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: isSelected && isOpaque 
                          ? `0 4px 12px ${colors.mystical.glow}60` 
                          : 'none',
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: spacing.md,
              }}
            >
              <PagePreview title="Login" route="/login" colors={colors} />
              <PagePreview title="Signup" route="/signup" colors={colors} />
              <PagePreview title="Home" route="/home" colors={colors} />
              <PagePreview title="Library" route="/library" colors={colors} />
              <PagePreview title="Create" route="/create" colors={colors} />
              <PagePreview title="Profile" route="/profile" colors={colors} />
            </div>
          </Section>

          {/* Theme Tokens - Colors */}
          <Section title="Theme Tokens - Colors" colors={colors}>
            <Card
              variant="default"
              style={{
                marginBottom: spacing.md,
                background: colors.glass.light,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${colors.glass.border}`,
              }}
            >
              <Typography variant="h4" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
                Background Colors
              </Typography>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: spacing.md,
                  marginTop: spacing.sm,
                }}
              >
                <ColorSwatch name="Primary" color={colors.background.primary} colors={colors} />
                <ColorSwatch name="Secondary" color={colors.background.secondary} colors={colors} />
                <ColorSwatch name="Tertiary" color={colors.background.tertiary} colors={colors} />
                <ColorSwatch name="Glass" color={colors.background.glass} colors={colors} />
              </div>
            </Card>

            <Card
              variant="default"
              style={{
                marginBottom: spacing.md,
                background: colors.glass.light,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${colors.glass.border}`,
              }}
            >
              <Typography variant="h4" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
                Accent Colors
              </Typography>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: spacing.md,
                  marginTop: spacing.sm,
                }}
              >
                <ColorSwatch name="Primary" color={colors.accent.primary} colors={colors} />
                <ColorSwatch name="Secondary" color={colors.accent.secondary} colors={colors} />
                <ColorSwatch name="Tertiary" color={colors.accent.tertiary} colors={colors} />
                <ColorSwatch name="Light" color={colors.accent.light} colors={colors} />
              </div>
            </Card>

            <Card
              variant="default"
              style={{
                marginBottom: spacing.md,
                background: colors.glass.light,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${colors.glass.border}`,
              }}
            >
              <Typography variant="h4" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
                Mystical Effects
              </Typography>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: spacing.md,
                  marginTop: spacing.sm,
                }}
              >
                <ColorSwatch name="Glow" color={colors.mystical.glow} colors={colors} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '60px',
                      borderRadius: borderRadius.md,
                      background: colors.accent.primary,
                      filter: `blur(${colors.mystical.blur})`,
                      boxShadow: `0 0 ${colors.mystical.blur} ${colors.mystical.glow}`,
                    }}
                  />
                  <Typography variant="small" style={{ color: colors.text.primary }}>
                    Blur: {colors.mystical.blur}
                  </Typography>
                </div>
              </div>
            </Card>
          </Section>

          {/* UI Components - Buttons */}
          <Section title="UI Components - Buttons" colors={colors}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <Button variant="primary" size="sm" style={{ background: colors.gradients.primary }}>
                Primary Small
              </Button>
              <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
                Primary Medium
              </Button>
              <Button variant="primary" size="lg" style={{ background: colors.gradients.primary }}>
                Primary Large
              </Button>
              <Button variant="secondary" size="md">Secondary Button</Button>
              <Button variant="outline" size="md">Outline Button</Button>
              <Button variant="text" size="md">Text Button</Button>
              <Button variant="ghost" size="md">Ghost Button</Button>
              <Button variant="primary" size="md" loading style={{ background: colors.gradients.primary }}>
                Loading Button
              </Button>
              <Button variant="primary" size="md" disabled style={{ background: colors.gradients.primary }}>
                Disabled Button
              </Button>
            </div>
          </Section>

          {/* Audio Components - Speaking Animation */}
          <Section title="Audio Components - Incredible Speaking Animation" colors={colors}>
            <Card
              variant="elevated"
              style={{
                marginBottom: spacing.md,
                background: colors.glass.light,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${colors.glass.border}`,
                boxShadow: `0 8px 32px ${colors.mystical.glow}40`,
                padding: spacing.lg,
              }}
            >
              <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
                Professional Speaking Animation
              </Typography>
              <Typography variant="body" style={{ marginBottom: spacing.md, color: colors.text.secondary }}>
                A refined, ChatGPT-like animated component with clean minimalism and futuristic glass-morphism.
                Cycles through 4 elegant pages: floating glass orbs, frequency bars, subtle waves, and rotating rings.
                Professional design with ample white space and subtle animations.
              </Typography>
              <div
                style={{
                  width: '100%',
                  height: '450px',
                  marginBottom: spacing.md,
                  borderRadius: borderRadius.lg,
                  overflow: 'hidden',
                  position: 'relative',
                  background: colors.background.primary,
                  border: `1px solid ${colors.border.light}`,
                  boxShadow: `0 2px 8px ${colors.mystical.glow}10`,
                }}
              >
                <SpeakingAnimation isSpeaking={isSpeaking} pageDuration={5000} />
              </div>
              <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
                <Button
                  variant={isSpeaking ? 'secondary' : 'primary'}
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  style={isSpeaking ? {} : { background: colors.gradients.primary }}
                >
                  {isSpeaking ? 'Pause' : 'Play'}
                </Button>
                <Typography variant="small" style={{ color: colors.text.tertiary, marginLeft: spacing.sm }}>
                  {isSpeaking ? 'Animations active' : 'Click to start'}
                </Typography>
              </div>
            </Card>
          </Section>

          {/* UI Components - Cards */}
          <Section title="UI Components - Cards" colors={colors}>
            <Card
              variant="default"
              style={{
                marginBottom: spacing.md,
                background: colors.glass.light,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${colors.glass.border}`,
              }}
            >
              <Typography variant="h3" style={{ color: colors.text.primary }}>Default Card</Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>
                This is a default card with glass-morphism styling and subtle shadow.
              </Typography>
            </Card>
            <Card
              variant="elevated"
              style={{
                marginBottom: spacing.md,
                background: colors.glass.light,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${colors.glass.border}`,
                boxShadow: `0 8px 32px ${colors.mystical.glow}40`,
              }}
            >
              <Typography variant="h3" style={{ color: colors.text.primary }}>Elevated Card</Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>
                This card has more prominent shadow with mystical glow effects.
              </Typography>
            </Card>
          </Section>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              marginTop: spacing.xl,
              paddingTop: spacing.xl,
              borderTop: `1px solid ${colors.border.light}`,
            }}
          >
            <Typography variant="body" style={{ marginBottom: spacing.xs, color: colors.text.secondary }}>
              waQup Design System v1.0
            </Typography>
            <Typography variant="caption" style={{ color: colors.text.tertiary }}>
              Glass-Morphism Minimalist Design with Mystical Themes
            </Typography>
          </div>
        </div>
    </PageShell>
  );
}

const Section: React.FC<{ title: string; children: React.ReactNode; colors: any }> = ({ title, children, colors }) => (
  <div style={{ marginBottom: spacing.xl }}>
    <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
      {title}
    </Typography>
    {children}
  </div>
);

const PagePreview: React.FC<{ title: string; route: string; colors: any }> = ({ title, route, colors }) => (
  <Link href={route} style={{ textDecoration: 'none' }}>
    <Card
      variant="default"
      pressable
      style={{
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.glass.light,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${colors.glass.border}`,
      }}
    >
      <Typography variant="h4" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
        {title}
      </Typography>
      <Typography variant="caption" style={{ color: colors.text.secondary }}>
        {route}
      </Typography>
    </Card>
  </Link>
);

const ColorSwatch: React.FC<{ name: string; color: string; colors: any; textColor?: 'primary' | 'inverse' }> = ({
  name,
  color,
  colors,
  textColor = 'primary',
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div
      style={{
        width: '100%',
        height: '60px',
        backgroundColor: color,
        borderRadius: borderRadius.md,
        marginBottom: spacing.xs,
        boxShadow: color === colors.mystical.glow ? `0 0 20px ${color}` : undefined,
      }}
    />
    <Typography variant="small" style={{ color: colors.text[textColor] }}>
      {name}
    </Typography>
    <Typography variant="small" style={{ color: colors.text.tertiary }}>
      {color}
    </Typography>
  </div>
);
