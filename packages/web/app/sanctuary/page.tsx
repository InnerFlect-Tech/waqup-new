'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Typography, Card } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { SANCTUARY_QUICK_ACTIONS, SANCTUARY_MENU_ITEMS } from '@/lib';
import { useAuthStore } from '@/stores';
import { Analytics } from '@waqup/shared/utils';
import { Library, TrendingUp, Zap } from 'lucide-react';

export default function SanctuaryHomePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuthStore();
  const searchParams = useSearchParams();

  // Fire analytics event when Stripe redirects back after a successful subscription.
  // Stripe appends ?checkout=success&plan=<planId> to the success_url.
  useEffect(() => {
    if (searchParams.get('checkout') !== 'success') return;
    const planId = searchParams.get('plan') ?? 'unknown';
    Analytics.subscriptionStarted(planId, 0, 'USD', user?.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Seeker';

  const STATS = [
    { label: 'Library', value: '—', icon: Library },
    { label: 'Streak', value: '—', icon: Zap },
    { label: 'Qs', value: '50', icon: TrendingUp },
  ];

  return (
    <PageShell intensity="medium">
      <PageContent>
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: spacing.lg }}
        >
          <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontWeight: 300 }}>
            Welcome back, <span style={{ background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{displayName}</span>
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Your space for transformation and growth
          </Typography>
        </motion.div>

        {/* Stats strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: spacing.md,
            marginBottom: spacing.lg,
          }}
        >
          {STATS.map((stat, i) => {
            const isLibrary = stat.label === 'Library';
            const content = (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                whileHover={isLibrary ? { scale: 1.02, y: -2 } : undefined}
                style={{
                  padding: spacing.md,
                  borderRadius: borderRadius.lg,
                  background: isLibrary
                    ? `linear-gradient(135deg, ${colors.accent.primary}20, ${colors.accent.secondary}10)`
                    : colors.glass.light,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid ${isLibrary ? colors.accent.primary + '40' : colors.glass.border}`,
                  boxShadow: isLibrary ? `0 4px 20px ${colors.accent.primary}25` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing.sm,
                  cursor: isLibrary ? 'pointer' : 'default',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: borderRadius.md,
                    background: isLibrary ? colors.gradients.primary : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <stat.icon
                    size={18}
                    color={isLibrary ? colors.text.onDark : colors.accent.primary}
                    strokeWidth={2}
                  />
                </div>
                <Typography variant="h3" style={{ color: colors.text.primary, margin: 0 }}>
                  {stat.value}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                  {stat.label}
                </Typography>
              </motion.div>
            );
            return isLibrary ? (
              <Link key={stat.label} href="/library" style={{ textDecoration: 'none' }}>
                {content}
              </Link>
            ) : (
              content
            );
          })}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: spacing.lg }}>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Quick Actions
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gridAutoRows: 'minmax(120px, 1fr)',
              gap: spacing.md,
            }}
          >
            {SANCTUARY_QUICK_ACTIONS.map((action, index) => (
              <Link key={action.name} href={action.href} style={{ textDecoration: 'none', display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.35 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  style={{
                    padding: spacing.lg,
                    borderRadius: borderRadius.xl,
                    background: index === 0 ? `linear-gradient(135deg, ${colors.accent.primary}20, ${colors.accent.secondary}10)` : colors.glass.light,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${index === 0 ? colors.accent.primary + '40' : colors.glass.border}`,
                    boxShadow: index === 0 ? `0 8px 32px ${colors.accent.primary}30` : '0 4px 16px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: borderRadius.lg,
                      background: index === 0 ? colors.gradients.primary : colors.glass.medium,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.sm,
                      flexShrink: 0,
                      boxShadow: index === 0 ? `0 4px 16px ${colors.accent.primary}60` : 'none',
                    }}
                  >
                    <action.icon size={18} color={index === 0 ? colors.text.onDark : colors.accent.primary} strokeWidth={2.5} />
                  </div>
                  <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs, flexShrink: 0 }}>
                    {action.name}
                  </Typography>
                  <Typography variant="caption" style={{ color: colors.text.secondary, flex: 1, minHeight: 0 }}>
                    {action.description}
                  </Typography>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Your Sanctuary
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gridAutoRows: 'minmax(72px, 1fr)',
              gap: spacing.sm,
            }}
          >
            {SANCTUARY_MENU_ITEMS.map((item, index) => (
              <Link key={item.name} href={item.href} style={{ textDecoration: 'none', display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.06, duration: 0.3 }}
                  whileHover={{ scale: 1.015 }}
                  style={{
                    padding: spacing.md,
                    borderRadius: borderRadius.lg,
                    background: colors.glass.light,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${colors.glass.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: borderRadius.md,
                      background: index < 2 ? colors.gradients.primary : colors.glass.medium,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.iconNode ?? <item.icon size={20} color={index < 2 ? colors.text.onDark : colors.accent.primary} strokeWidth={2.5} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                      <Typography variant="h4" style={{ color: colors.text.primary, margin: 0 }}>
                        {item.name}
                      </Typography>
                      {item.count !== undefined && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: colors.accent.primary,
                            background: `${colors.accent.primary}20`,
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: borderRadius.full,
                          }}
                        >
                          {item.count}
                        </span>
                      )}
                    </div>
                    <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                      {item.description}
                    </Typography>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                    <path d="M6 3l5 5-5 5" stroke={colors.text.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
}
