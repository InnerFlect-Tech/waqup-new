'use client';

import React from 'react';
import { Container } from '@/components';
import { Typography, Button, Card } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { AnimatedBackground, ThemeSelector } from '@/components';
import Link from 'next/link';
import { 
  Sparkles, 
  Brain,
  Music,
  Wand2,
} from 'lucide-react';

interface ContentType {
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  href: string;
  color: string;
}

const CONTENT_TYPES: ContentType[] = [
  {
    name: 'Create Affirmation',
    description: 'Powerful statements to rewire your subconscious mind',
    icon: Sparkles,
    href: '/affirmations/create',
    color: 'primary',
  },
  {
    name: 'Create Meditation',
    description: 'Guided meditations for deep relaxation and transformation',
    icon: Brain,
    href: '/meditations/create',
    color: 'secondary',
  },
  {
    name: 'Create Ritual',
    description: 'Personalized rituals combining voice, frequencies, and intention',
    icon: Music,
    href: '/rituals/create',
    color: 'tertiary',
  },
];

export default function CreatePage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <Container>
      <ThemeSelector />
      <AnimatedBackground intensity="medium" color="primary" />
      
      <div
        style={{
          minHeight: '100vh',
          padding: spacing.xl,
          background: colors.gradients.background,
          position: 'relative',
        }}
      >
        {/* Mystical Radial Gradient Overlay */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: colors.gradients.mystical,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: spacing.xl }}>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              Create New Content
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Choose the type of content you want to create
            </Typography>
          </div>

          {/* Content Type Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: spacing.xl,
            }}
          >
            {CONTENT_TYPES.map((type, index) => {
              const IconComponent = type.icon;
              // First card: more opaque (darker), others: more transparent (lighter)
              const isOpaque = index === 0;
              const cardBackground = isOpaque ? colors.glass.opaque : colors.glass.transparent;
              const textColor = isOpaque ? colors.text.onDark : colors.text.primary;
              const secondaryTextColor = isOpaque ? colors.text.onDark : colors.text.secondary;
              
              return (
                <Link key={type.name} href={type.href} style={{ textDecoration: 'none' }}>
                  <Card
                    variant="elevated"
                    pressable
                    style={{
                      padding: spacing.xxl,
                      height: '100%',
                      minHeight: '300px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      background: cardBackground,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.glass.border}`,
                      boxShadow: isOpaque 
                        ? `0 8px 32px ${colors.mystical.glow}60` 
                        : `0 4px 16px ${colors.mystical.glow}30`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: borderRadius.full,
                        background: isOpaque 
                          ? colors.gradients.primary 
                          : colors.accent.light,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: spacing.lg,
                        boxShadow: isOpaque 
                          ? `0 4px 12px ${colors.mystical.glow}80` 
                          : `0 2px 8px ${colors.mystical.glow}40`,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `radial-gradient(circle at center, ${colors.mystical.glow}40, transparent)`,
                          opacity: 0.6,
                        }}
                      />
                      <IconComponent 
                        size={40} 
                        color={isOpaque ? colors.text.onDark : colors.accent.primary}
                        strokeWidth={2.5}
                        style={{ position: 'relative', zIndex: 1 }}
                      />
                    </div>
                    <Typography variant="h2" style={{ color: textColor, marginBottom: spacing.md }}>
                      {type.name}
                    </Typography>
                    <Typography variant="body" style={{ color: secondaryTextColor, lineHeight: 1.6 }}>
                      {type.description}
                    </Typography>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Back Link */}
          <div style={{ marginTop: spacing.xl, textAlign: 'center' }}>
            <Link href="/home" style={{ textDecoration: 'none' }}>
              <Button
                variant="ghost"
                size="md"
                style={{
                  color: colors.text.secondary,
                }}
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
