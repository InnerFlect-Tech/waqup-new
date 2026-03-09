'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Typography, Button, QCoin } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { Sparkles, Users, Zap, Plus, ArrowDownLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useCreditBalance } from '@/hooks';
import { createCreditsService } from '@waqup/shared/services';
import type { CreditTransaction } from '@waqup/shared/types';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@waqup/shared/utils';
import { useAuthStore } from '@/stores';

const EARN_METHODS = [
  {
    icon: Sparkles,
    title: 'Create content',
    description: 'Earn 2 Qs back when you create and publish an affirmation, meditation, or ritual.',
    credits: '+2',
  },
  {
    icon: Users,
    title: 'Refer a friend',
    description: 'You and your friend each get 10 Qs when they join and complete onboarding.',
    credits: '+10',
  },
  {
    icon: Zap,
    title: 'Practice streak',
    description: 'Keep a 7-day streak to earn a 5 Qs bonus. Streaks reset at midnight.',
    credits: '+5',
  },
];

const creditsService = createCreditsService(supabase);

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function CreditsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { balance, isLoading } = useCreditBalance();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const loadTransactions = useCallback(async () => {
    setTxLoading(true);
    const result = await creditsService.getTransactionHistory(5);
    if (result.success) {
      setTransactions(result.transactions);
    }
    setTxLoading(false);
  }, []);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  // Fire analytics event when Stripe redirects back after a successful credit purchase.
  // Stripe appends ?checkout=success&pack=<packId>&credits=<amount> to the success_url.
  useEffect(() => {
    if (searchParams.get('checkout') !== 'success') return;
    const packId = searchParams.get('pack') ?? 'unknown';
    const credits = Number(searchParams.get('credits') ?? 0);
    Analytics.creditsPurchased(packId, credits, 'USD', user?.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <div style={{ textAlign: 'center', marginBottom: spacing.md }}>
          <Typography variant="h3" style={{ color: colors.text.primary, fontWeight: 300, marginBottom: 4 }}>
            Your Qs
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary }}>
            Qs power creation. Practice is always free.
          </Typography>
        </div>

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: `${spacing.lg} ${spacing.xl}`,
            borderRadius: borderRadius.xl,
            background: `linear-gradient(145deg, ${colors.accent.primary}18, ${colors.accent.secondary}0d)`,
            border: `1px solid ${colors.accent.primary}30`,
            boxShadow: `0 8px 32px ${colors.accent.primary}18`,
            marginBottom: spacing.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.lg,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <QCoin size="md" />
            <div>
              <div style={{ fontSize: 36, fontWeight: 200, color: colors.text.primary, lineHeight: 1 }}>
                {isLoading ? '–' : balance}
              </div>
              <div style={{ fontSize: 11, color: colors.text.secondary, marginTop: 2, letterSpacing: '0.04em' }}>
                Qs available
              </div>
            </div>
          </div>
          <Link href="/sanctuary/credits/buy" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Button variant="primary" size="sm">
              <Plus size={14} />
              Get Qs
            </Button>
          </Link>
        </motion.div>

        {/* How to earn */}
        <div style={{ marginBottom: spacing.md }}>
          <Typography
            variant="h4"
            style={{ color: colors.text.secondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10 }}
          >
            How to earn
          </Typography>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.sm }}>
            {EARN_METHODS.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.06 }}
                style={{
                  padding: spacing.md,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid ${colors.glass.border}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.sm,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: borderRadius.sm,
                    background: `${colors.accent.primary}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <method.icon size={14} color={colors.accent.primary} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: colors.text.primary, marginBottom: 2 }}>
                    {method.title}
                  </div>
                  <div style={{ fontSize: 11, color: colors.text.secondary, lineHeight: 1.45 }}>
                    {method.description}
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399', flexShrink: 0, paddingTop: 1 }}>
                  {method.credits}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Transaction history */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <Typography
              variant="h4"
              style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10, margin: 0 }}
            >
              Recent
            </Typography>
            <Link href="/sanctuary/credits/transactions" style={{ textDecoration: 'none' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: colors.accent.tertiary, fontSize: 11 }}>
                View all <ArrowRight size={11} />
              </span>
            </Link>
          </div>
          <div
            style={{
              borderRadius: borderRadius.lg,
              background: colors.glass.light,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${colors.glass.border}`,
              overflow: 'hidden',
            }}
          >
            {txLoading ? (
              <div style={{ padding: spacing.lg, textAlign: 'center' }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>Loading...</Typography>
              </div>
            ) : transactions.length === 0 ? (
              <div style={{ padding: spacing.lg, textAlign: 'center' }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>
                  No transactions yet. Start creating to earn and spend Qs.
                </Typography>
              </div>
            ) : (
              transactions.map((tx, index) => (
                <div
                  key={tx.id}
                  style={{
                    padding: `10px ${spacing.md}`,
                    borderBottom: index < transactions.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: borderRadius.full,
                      background: tx.type === 'credit' ? `${colors.success}18` : `${colors.error}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft size={12} color={colors.success} />
                    ) : (
                      <ArrowUpRight size={12} color={colors.error} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: colors.text.primary, lineHeight: 1.3 }}>
                      {tx.description || (tx.type === 'credit' ? 'Credit' : 'Debit')}
                    </div>
                    <div style={{ fontSize: 11, color: colors.text.secondary, marginTop: 1 }}>
                      {formatDate(tx.created_at)}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: tx.type === 'credit' ? colors.success : colors.error,
                      flexShrink: 0,
                    }}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
}
