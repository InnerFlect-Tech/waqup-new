'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Typography, Button } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { useAuthStore } from '@/stores';
import { clearStoredOverride } from '@/lib/auth-override';
import Link from 'next/link';
import { LogOut, ChevronRight } from 'lucide-react';
import { PROFILE_MENU_ITEMS } from '@/lib';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { user: authUser } = useAuthStore();

  const displayName =
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.user_metadata?.display_name ||
    authUser?.email?.split('@')[0] ||
    'User';
  const displayEmail = authUser?.email || '';
  const initials = getInitials(displayName);
  const memberSince = authUser?.created_at
    ? new Date(authUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const STATS = [
    { label: 'Content', value: '—' },
    { label: 'Credits', value: '50' },
    { label: 'Member since', value: memberSince },
  ];

  return (
    <PageShell intensity="medium">
      <PageContent>
        {/* Avatar + name card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: spacing.xxl,
            borderRadius: borderRadius.xl,
            background: `linear-gradient(145deg, ${colors.accent.primary}18, ${colors.glass.light})`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${colors.accent.primary}30`,
            boxShadow: `0 16px 48px ${colors.accent.primary}20`,
            marginBottom: spacing.xl,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
            {/* Initials avatar */}
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: borderRadius.full,
                background: colors.gradients.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 8px 24px ${colors.accent.primary}50`,
                fontSize: 28,
                fontWeight: 600,
                color: colors.text.onDark,
                letterSpacing: '0.05em',
              }}
            >
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 300 }}>
                {displayName}
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>
                {displayEmail}
              </Typography>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: spacing.md,
              marginTop: spacing.xl,
              paddingTop: spacing.xl,
              borderTop: `1px solid ${colors.glass.border}`,
            }}
          >
            {STATS.map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontWeight: 500 }}>
                  {stat.value}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                  {stat.label}
                </Typography>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Menu Items */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gridAutoRows: 'minmax(88px, 1fr)',
            gap: spacing.md,
            marginBottom: spacing.xl,
          }}
        >
          {PROFILE_MENU_ITEMS.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <Link key={item.name} href={item.href} style={{ textDecoration: 'none', display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.06 }}
                  whileHover={{ scale: 1.015 }}
                  style={{
                    padding: spacing.lg,
                    borderRadius: borderRadius.lg,
                    background: colors.glass.light,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${colors.glass.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    transition: 'border-color 0.2s ease',
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
                    <IconComponent size={20} color={index < 2 ? colors.text.onDark : colors.accent.primary} strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h4" style={{ color: colors.text.primary, margin: 0, marginBottom: spacing.xs }}>
                      {item.name}
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                      {item.description}
                    </Typography>
                  </div>
                  <ChevronRight size={18} color={colors.text.secondary} style={{ opacity: 0.5, flexShrink: 0 }} />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Sign out */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.error}30`,
            background: `${colors.error}08`,
          }}
        >
          <Button
            variant="outline"
            size="lg"
            fullWidth
            style={{ borderColor: colors.error, color: colors.error }}
            onClick={async () => {
              clearStoredOverride();
              await useAuthStore.getState().logout();
              router.push('/login');
            }}
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </motion.div>

        <div style={{ marginTop: spacing.xl, textAlign: 'center' }}>
          <Link href="/sanctuary" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" style={{ color: colors.text.secondary }}>
              ← Back to Sanctuary
            </Button>
          </Link>
        </div>
      </PageContent>
    </PageShell>
  );
}
