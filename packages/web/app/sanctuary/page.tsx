'use client';

import React from 'react';
import Link from 'next/link';
import { Typography, Card } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { SANCTUARY_QUICK_ACTIONS, SANCTUARY_MENU_ITEMS } from '@/lib';

export default function SanctuaryHomePage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium">
      <PageContent>
        <div style={{ marginBottom: spacing.xl }}>
          <Typography variant="h1" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: spacing.xl,
            marginBottom: spacing.xl,
          }}
        >
          {SANCTUARY_QUICK_ACTIONS.map((action, index) => (
            <Link key={action.name} href={action.href} style={{ textDecoration: 'none' }}>
              <Card
                variant="elevated"
                pressable
                style={{
                  padding: spacing.xl,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  background: colors.glass.light,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}30`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: borderRadius.full,
                      background: index === 0 ? colors.gradients.primary : colors.accent.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: index === 0 ? `0 4px 12px ${colors.accent.primary}80` : undefined,
                    }}
                  >
                    <action.icon
                      size={24}
                      color={index === 0 ? colors.text.onDark : colors.accent.tertiary}
                      strokeWidth={2.5}
                    />
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing.xl,
          }}
        >
          {SANCTUARY_MENU_ITEMS.map((item, index) => (
            <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
              <Card
                variant="default"
                pressable
                style={{
                  padding: spacing.lg,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  background: colors.glass.light,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.glass.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: borderRadius.full,
                      background: index < 2 ? colors.gradients.primary : colors.accent.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <item.icon
                      size={20}
                      color={index < 2 ? colors.text.onDark : colors.accent.primary}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                      <Typography variant="h4" style={{ color: colors.text.primary }}>
                        {item.name}
                      </Typography>
                      {item.count !== undefined && (
                        <Typography
                          variant="small"
                          color="secondary"
                          style={{
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: borderRadius.full,
                            background: colors.glass.light,
                          }}
                        >
                          {item.count}
                        </Typography>
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
      </PageContent>
    </PageShell>
  );
}
