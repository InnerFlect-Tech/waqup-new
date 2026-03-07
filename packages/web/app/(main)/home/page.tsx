'use client';

import React from 'react';
import { Typography, Button, Card } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { GRID_CARD_MIN } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Wand2, Brain, Zap } from 'lucide-react';
import { HOME_QUICK_ACTIONS, SANCTUARY_MENU_ITEMS } from '@/lib';

export default function HomePage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium">
      <PageContent>
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
              gridTemplateColumns: `repeat(auto-fit, minmax(${GRID_CARD_MIN}, 1fr))`,
              gap: spacing.lg,
              marginBottom: spacing.xl,
            }}
          >
            {HOME_QUICK_ACTIONS.map((action, index) => {
              const isOpaque = index < 2;
              const cardBackground = colors.glass.light;
              const textColor = colors.text.primary;
              const secondaryTextColor = colors.text.secondary;
              
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
                        ? `0 8px 32px ${colors.accent.primary}60` 
                        : `0 4px 16px ${colors.accent.primary}30`,
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
                          ? `0 4px 12px ${colors.accent.primary}80` 
                          : `0 2px 8px ${colors.accent.primary}40`,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `radial-gradient(circle at center, ${colors.accent.primary}40, transparent)`,
                          opacity: 0.6,
                        }}
                      />
                      <span style={{ position: 'relative', zIndex: 1 }}>
                        <action.icon 
                          size={24} 
                          color={isOpaque ? colors.text.onDark : colors.accent.primary}
                          strokeWidth={2.5}
                        />
                      </span>
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
              gridTemplateColumns: `repeat(auto-fit, minmax(${GRID_CARD_MIN}, 1fr))`,
              gap: spacing.lg,
            }}
          >
            {SANCTUARY_MENU_ITEMS.map((item, index) => {
              const isOpaque = index < 2;
              const cardBackground = colors.glass.light;
              const textColor = colors.text.primary;
              const secondaryTextColor = colors.text.secondary;
              
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
                            background: `radial-gradient(circle at center, ${colors.accent.primary}30, transparent)`,
                            opacity: isOpaque ? 0.5 : 0.3,
                          }}
                        />
                        <span style={{ position: 'relative', zIndex: 1 }}>
                          <item.icon 
                            size={20} 
                            color={isOpaque ? colors.text.onDark : colors.accent.primary}
                            strokeWidth={2.5}
                          />
                        </span>
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
                gridTemplateColumns: `repeat(auto-fill, minmax(${GRID_CARD_MIN}, 1fr))`,
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
      </PageContent>
    </PageShell>
  );
}
