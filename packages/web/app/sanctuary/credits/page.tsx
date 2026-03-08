'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Button } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { CreditCard, Sparkles, Users, Zap, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const EARN_METHODS = [
  {
    icon: Sparkles,
    title: 'Create content',
    description: 'Earn 2 credits back when you create and publish an affirmation, meditation, or ritual.',
    credits: '+2',
  },
  {
    icon: Users,
    title: 'Refer a friend',
    description: 'You and your friend each get 10 credits when they join and complete onboarding.',
    credits: '+10',
  },
  {
    icon: Zap,
    title: 'Practice streak',
    description: 'Keep a 7-day streak to earn a 5-credit bonus. Streaks reset at midnight.',
    credits: '+5',
  },
];

const MOCK_TRANSACTIONS = [
  { id: 1, label: 'Created affirmation', type: 'debit', amount: -5, date: 'Today' },
  { id: 2, label: 'Referral bonus', type: 'credit', amount: 10, date: 'Yesterday' },
  { id: 3, label: 'Created meditation', type: 'debit', amount: -8, date: '2 days ago' },
  { id: 4, label: '7-day streak bonus', type: 'credit', amount: 5, date: '3 days ago' },
  { id: 5, label: 'Welcome credits', type: 'credit', amount: 50, date: 'Feb 28' },
];

export default function CreditsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <Link href="/sanctuary" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.xl }}>
          <Typography variant="small" style={{ color: colors.text.secondary }}>
            ← Sanctuary
          </Typography>
        </Link>

        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          Credits
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xxl }}>
          Credits power your content creation. Practice is always free.
        </Typography>

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: spacing.xxl,
            borderRadius: borderRadius.xl,
            background: `linear-gradient(145deg, ${colors.accent.primary}25, ${colors.accent.secondary}15)`,
            border: `1px solid ${colors.accent.primary}40`,
            boxShadow: `0 16px 48px ${colors.accent.primary}25`,
            marginBottom: spacing.xl,
            textAlign: 'center',
          }}
        >
          <CreditCard size={32} color={colors.accent.primary} strokeWidth={1.5} style={{ marginBottom: spacing.md }} />
          <div style={{ fontSize: 64, fontWeight: 200, color: colors.text.primary, lineHeight: 1, marginBottom: spacing.sm }}>
            50
          </div>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl }}>
            credits available
          </Typography>
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg" style={{ background: colors.gradients.primary }}>
              <Plus size={16} style={{ marginRight: spacing.sm }} />
              Get more credits
            </Button>
          </Link>
        </motion.div>

        {/* How to earn */}
        <div style={{ marginBottom: spacing.xxl }}>
          <Typography
            variant="h4"
            style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}
          >
            How to earn credits
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {EARN_METHODS.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                style={{
                  padding: spacing.lg,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid ${colors.glass.border}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.md,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: borderRadius.md,
                    background: `${colors.accent.primary}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: spacing.xs,
                  }}
                >
                  <method.icon size={20} color={colors.accent.primary} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                    {method.title}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.5 }}>
                    {method.description}
                  </Typography>
                </div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#34d399',
                    flexShrink: 0,
                    paddingTop: spacing.xs,
                  }}
                >
                  {method.credits}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Transaction history */}
        <div>
          <Typography
            variant="h4"
            style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}
          >
            Recent transactions
          </Typography>
          <div
            style={{
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${colors.glass.border}`,
              overflow: 'hidden',
            }}
          >
            {MOCK_TRANSACTIONS.map((tx, index) => (
              <div
                key={tx.id}
                style={{
                  padding: `${spacing.md}px ${spacing.lg}px`,
                  paddingRight: spacing.xl,
                  borderBottom: index < MOCK_TRANSACTIONS.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: borderRadius.full,
                    background: tx.type === 'credit' ? '#34d39920' : `${colors.error}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft size={14} color="#34d399" />
                  ) : (
                    <ArrowUpRight size={14} color={colors.error} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontSize: 14 }}>
                    {tx.label}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                    {tx.date}
                  </Typography>
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: tx.type === 'credit' ? '#34d399' : colors.error,
                    marginLeft: spacing.md,
                  }}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
}
