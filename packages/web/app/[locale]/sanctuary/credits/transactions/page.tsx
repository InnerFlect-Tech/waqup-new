'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Typography, Button } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { Link } from '@/i18n/navigation';
import { createCreditsService, type CreditTransaction } from '@waqup/shared/services';
import { formatDateRelative } from '@waqup/shared/utils';
import { supabase } from '@/lib/supabase';

const PAGE_SIZE = 20;

const creditsService = createCreditsService(supabase);

export default function TransactionsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (offset: number, append: boolean) => {
    if (offset === 0) setIsLoading(true);
    else setIsLoadingMore(true);

    const result = await creditsService.getTransactionHistory(PAGE_SIZE, offset);

    if (!result.success) {
      setError(result.error);
    } else {
      setTransactions((prev) => (append ? [...prev, ...result.transactions] : result.transactions));
      setHasMore(result.transactions.length === PAGE_SIZE);
    }

    setIsLoading(false);
    setIsLoadingMore(false);
  }, []);

  useEffect(() => {
     
    fetchPage(0, false);
  }, [fetchPage]);

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchPage(transactions.length, true);
    }
  };

  return (
    <PageShell intensity="medium" allowDocumentScroll>
      <PageContent width="narrow">
        <Link href="/sanctuary/credits" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl }}>
          <ArrowLeft size={14} color={colors.text.secondary} />
          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
            Your Qs
          </Typography>
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
            Transactions
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xxl }}>
            Every Q in, every Q out.
          </Typography>
        </motion.div>

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: spacing.xxl }}>
            <Loader2 size={24} color={colors.accent.primary} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {!isLoading && error && (
          <div
            style={{
              padding: spacing.xl,
              borderRadius: borderRadius.lg,
              background: `${colors.error}12`,
              border: `1px solid ${colors.error}30`,
              textAlign: 'center',
            }}
          >
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Couldn&apos;t load transactions. Please try again.
            </Typography>
          </div>
        )}

        {!isLoading && !error && transactions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: spacing.xxl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.lg,
              WebkitBackdropFilter: BLUR.lg,
              border: `1px solid ${colors.glass.border}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
              No transactions yet
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.6, marginBottom: spacing.xl }}>
              Your Q history will appear here once you start creating.
            </Typography>
            <Link href="/sanctuary/credits/buy" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md">Get your first Qs</Button>
            </Link>
          </motion.div>
        )}

        {!isLoading && transactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.lg,
              WebkitBackdropFilter: BLUR.lg,
              border: `1px solid ${colors.glass.border}`,
              overflow: 'hidden',
              marginBottom: spacing.lg,
            }}
          >
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * Math.min(index, 10) }}
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  borderBottom: index < transactions.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.description}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                    {formatDateRelative(tx.created_at)}
                  </Typography>
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: tx.type === 'credit' ? '#34d399' : colors.error,
                    flexShrink: 0,
                    marginLeft: spacing.md,
                  }}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {hasMore && !isLoading && transactions.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: spacing.lg }}>
            <Button
              variant="outline"
              size="md"
              onClick={loadMore}
              style={{ minWidth: 140 }}
            >
              {isLoadingMore ? (
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                'Load more'
              )}
            </Button>
          </div>
        )}

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </PageContent>
    </PageShell>
  );
}
