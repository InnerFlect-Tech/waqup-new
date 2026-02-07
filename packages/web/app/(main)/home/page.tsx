'use client';

import React from 'react';
import { Container } from '@/components';
import { Typography, Button, Card } from '@/components';
import { Icon } from '@/components/ui/Icon';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { AnimatedBackground, ThemeSelector } from '@/components';
import Link from 'next/link';
import { 
  Sparkles, 
  Bell, 
  GraduationCap, 
  Library, 
  TrendingUp, 
  CreditCard, 
  Settings,
  Wand2,
  Brain,
  Zap
} from 'lucide-react';

interface QuickAction {
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  href: string;
}

interface MenuItem {
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  href: string;
  count?: number;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    name: 'Create New',
    description: 'Start a new ritual or affirmation',
    icon: Sparkles,
    href: '/create',
  },
  {
    name: 'Set Reminder',
    description: 'Schedule your practice',
    icon: Bell,
    href: '/reminders',
  },
  {
    name: 'Learn & Transform',
    description: 'Understand the science of transformation',
    icon: GraduationCap,
    href: '/learn',
  },
];

const MENU_ITEMS: MenuItem[] = [
  {
    name: 'Library',
    description: 'Your rituals and affirmations',
    icon: Library,
    href: '/library',
    count: 0,
  },
  {
    name: 'Progress',
    description: 'Track your transformation journey',
    icon: TrendingUp,
    href: '/progress',
  },
  {
    name: 'Credits',
    description: 'Manage your credits',
    icon: CreditCard,
    href: '/credits',
    count: 50,
  },
  {
    name: 'Settings',
    description: 'Customize your experience',
    icon: Settings,
    href: '/settings',
  },
];

export default function HomePage() {
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
              Welcome to Your Sanctuary
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Your space for transformation and growth
            </Typography>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: spacing.lg,
              marginBottom: spacing.xl,
            }}
          >
            {QUICK_ACTIONS.map((action, index) => {
              // First two: more opaque (darker), last one: more transparent (lighter)
              const isOpaque = index < 2;
              const cardBackground = isOpaque ? colors.glass.opaque : colors.glass.transparent;
              const textColor = isOpaque ? colors.text.onDark : colors.text.primary;
              const secondaryTextColor = isOpaque ? colors.text.onDark : colors.text.secondary;
              
              return (
                <Link key={action.name} href={action.href} style={{ textDecoration: 'none' }}>
                  <Card
                    variant="elevated"
                    pressable
                    style={{
                      padding: spacing.lg,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      background: cardBackground,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.glass.border}`,
                      boxShadow: isOpaque 
                        ? `0 8px 32px ${colors.mystical.glow}60` 
                        : `0 4px 16px ${colors.mystical.glow}30`,
                    }}
                  >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: borderRadius.full,
                        background: isOpaque 
                          ? colors.gradients.primary 
                          : colors.accent.light,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                      <action.icon 
                        size={24} 
                        color={isOpaque ? colors.text.onDark : colors.accent.primary}
                        strokeWidth={2.5}
                        style={{ position: 'relative', zIndex: 1 }}
                      />
                    </div>
                      <Typography variant="h3" style={{ color: textColor }}>
                        {action.name}
                      </Typography>
                    </div>
                    <Typography variant="body" style={{ color: secondaryTextColor }}>
                      {action.description}
                    </Typography>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Menu Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: spacing.lg,
            }}
          >
            {MENU_ITEMS.map((item, index) => {
              // First two: more opaque (darker), last two: more transparent (lighter)
              const isOpaque = index < 2;
              const cardBackground = isOpaque ? colors.glass.opaque : colors.glass.transparent;
              const textColor = isOpaque ? colors.text.onDark : colors.text.primary;
              const secondaryTextColor = isOpaque ? colors.text.onDark : colors.text.secondary;
              
              return (
                <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                  <Card
                    variant="default"
                    pressable
                    style={{
                      padding: spacing.lg,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      background: cardBackground,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.glass.border}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: borderRadius.full,
                          background: isOpaque 
                            ? colors.gradients.primary 
                            : colors.background.tertiary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: `radial-gradient(circle at center, ${colors.mystical.glow}30, transparent)`,
                            opacity: isOpaque ? 0.5 : 0.3,
                          }}
                        />
                        <item.icon 
                          size={20} 
                          color={isOpaque ? colors.text.onDark : colors.accent.primary}
                          strokeWidth={2.5}
                          style={{ position: 'relative', zIndex: 1 }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                          <Typography variant="h4" style={{ color: textColor }}>
                            {item.name}
                          </Typography>
                          {item.count !== undefined && (
                            <div
                              style={{
                                padding: `${spacing.xs} ${spacing.sm}`,
                                borderRadius: borderRadius.full,
                                background: isOpaque 
                                  ? colors.accent.secondary 
                                  : colors.accent.light,
                                fontSize: '12px',
                                color: isOpaque ? colors.text.onDark : colors.accent.primary,
                              }}
                            >
                              {item.count}
                            </div>
                          )}
                        </div>
                        <Typography variant="body" style={{ color: secondaryTextColor }}>
                          {item.description}
                        </Typography>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Recent Activity Section */}
          <div style={{ marginTop: spacing.xl }}>
            <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary }}>
              Recent Activity
            </Typography>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: spacing.lg,
              }}
            >
              <Card
                variant="default"
                style={{
                  padding: spacing.lg,
                  minHeight: '200px',
                  background: colors.glass.light,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `1px solid ${colors.glass.border}`,
                }}
              >
                <Typography variant="body" style={{ textAlign: 'center', color: colors.text.secondary }}>
                  No recent activity
                </Typography>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
