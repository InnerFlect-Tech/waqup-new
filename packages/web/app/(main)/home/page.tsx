'use client';

import React from 'react';
import { Typography, Button, Card } from '@/components';
import { Icon } from '@/components/ui/Icon';
import { spacing, borderRadius, SAFE_AREA_RIGHT } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
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
    href: '/sanctuary/reminders',
  },
  {
    name: 'Learn & Transform',
    description: 'Understand the science of transformation',
    icon: GraduationCap,
    href: '/sanctuary/learn',
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
    href: '/sanctuary/progress',
  },
  {
    name: 'Credits',
    description: 'Manage your credits',
    icon: CreditCard,
    href: '/sanctuary/credits',
    count: 50,
  },
  {
    name: 'Settings',
    description: 'Customize your experience',
    icon: Settings,
    href: '/sanctuary/settings',
  },
];

export default function HomePage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium">
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: spacing.md, paddingRight: SAFE_AREA_RIGHT }}>
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
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.name} href={action.href} style={{ textDecoration: 'none' }}>
                <Card
                  variant="elevated"
                  pressable
                  style={{
                    padding: spacing.lg,
                    height: '100%',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    background: colors.glass.opaque,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: `1px solid ${colors.glass.border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: borderRadius.md,
                        background: colors.background.tertiary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <action.icon size={24} color={colors.accent.primary} strokeWidth={2.5} />
                    </div>
                    <Typography variant="h3" style={{ color: colors.text.primary }}>
                      {action.name}
                    </Typography>
                  </div>
                  <Typography variant="body" style={{ color: colors.text.secondary }}>
                    {action.description}
                  </Typography>
                </Card>
              </Link>
            ))}
          </div>

          {/* Menu Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: spacing.lg,
            }}
          >
            {MENU_ITEMS.map((item) => (
                <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                  <Card
                    variant="default"
                    pressable
                    style={{
                      padding: spacing.lg,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      background: colors.glass.opaque,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.glass.border}`,
                      height: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: borderRadius.md,
                          background: colors.background.tertiary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <item.icon size={20} color={colors.accent.primary} strokeWidth={2.5} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                          <Typography variant="h4" style={{ color: colors.text.primary }}>
                            {item.name}
                          </Typography>
                          {item.count !== undefined && (
                            <div
                              style={{
                                padding: `${spacing.xs} ${spacing.sm}`,
                                borderRadius: borderRadius.full,
                                background: colors.accent.light,
                                fontSize: '12px',
                                color: colors.accent.primary,
                              }}
                            >
                              {item.count}
                            </div>
                          )}
                        </div>
                        <Typography variant="body" style={{ color: colors.text.secondary }}>
                          {item.description}
                        </Typography>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
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
    </PageShell>
  );
}
