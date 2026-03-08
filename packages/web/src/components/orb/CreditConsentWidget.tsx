'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, X } from 'lucide-react';
import { QCoin } from '@/components/ui/QCoin';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import type { CreditAction } from '@waqup/shared/types';

export interface CreditConsentWidgetProps {
  actions: CreditAction[];
  totalCostQs: number;
  balance: number;
  onConfirm: () => void;
  onSkip: () => void;
  isLoading?: boolean;
}

/**
 * CreditConsentWidget
 *
 * Appears as an assistant-side message bubble inside the Orb conversation.
 * Shows what the Orb wants to do, the Q cost, and Yes/Skip buttons.
 * The user must explicitly confirm before any credits are spent or LLM called.
 */
export function CreditConsentWidget({
  actions,
  totalCostQs,
  balance,
  onConfirm,
  onSkip,
  isLoading = false,
}: CreditConsentWidgetProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const canAfford = balance >= totalCostQs;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        alignSelf: 'flex-start',
        maxWidth: '82%',
        borderRadius: `${borderRadius.xl} ${borderRadius.xl} ${borderRadius.xl} ${spacing.xs}`,
        background: colors.glass.light,
        border: `1px solid ${colors.mystical?.glow ?? colors.glass.border}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: `${spacing.md} ${spacing.lg} ${spacing.sm}`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          borderBottom: `1px solid ${colors.glass.border}`,
        }}
      >
        <Sparkles size={14} color={colors.accent.primary} strokeWidth={2} />
        <span style={{ fontSize: 13, color: colors.text.secondary, fontWeight: 500 }}>
          The Orb wants to
        </span>
      </div>

      {/* Actions list */}
      <div
        style={{
          padding: `${spacing.sm} ${spacing.lg}`,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.xs,
        }}
      >
        {actions.map((action) => (
          <div
            key={action.addonKey}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.md,
              padding: `${spacing.xs} 0`,
            }}
          >
            <span style={{ fontSize: 14, color: colors.text.primary, lineHeight: 1.4 }}>
              {action.label}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
              }}
            >
              <QCoin size="sm" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.accent.tertiary ?? colors.accent.primary,
                }}
              >
                {action.costQs}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total + balance */}
      <div
        style={{
          margin: `0 ${spacing.lg}`,
          padding: `${spacing.sm} 0`,
          borderTop: `1px solid ${colors.glass.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <span style={{ fontSize: 13, color: colors.text.secondary }}>Total</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <QCoin size="sm" />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: canAfford
                ? (colors.accent.tertiary ?? colors.accent.primary)
                : colors.error,
            }}
          >
            {totalCostQs} Qs
          </span>
          <span style={{ fontSize: 11, color: colors.text.secondary, marginLeft: 4 }}>
            ({balance} available)
          </span>
        </div>
      </div>

      {/* Error: insufficient credits */}
      {!canAfford && (
        <div
          style={{
            margin: `${spacing.xs} ${spacing.lg}`,
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.md,
            background: `${colors.error}18`,
            border: `1px solid ${colors.error}30`,
          }}
        >
          <span style={{ fontSize: 12, color: colors.error }}>
            Not enough Qs. Visit the credits page to get more.
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div
        style={{
          padding: spacing.md,
          display: 'flex',
          gap: spacing.sm,
        }}
      >
        <button
          onClick={onConfirm}
          disabled={!canAfford || isLoading}
          style={{
            flex: 1,
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: borderRadius.lg,
            border: 'none',
            background:
              canAfford && !isLoading
                ? colors.gradients?.primary ?? colors.accent.primary
                : colors.glass.medium,
            color: canAfford && !isLoading ? '#fff' : colors.text.secondary,
            fontSize: 13,
            fontWeight: 600,
            cursor: canAfford && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
            transition: 'all 0.2s',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <Check size={14} strokeWidth={2.5} />
          {isLoading ? 'Thinking…' : `Yes, spend ${totalCostQs} Qs`}
        </button>

        <button
          onClick={onSkip}
          disabled={isLoading}
          style={{
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.glass.border}`,
            background: 'transparent',
            color: colors.text.secondary,
            fontSize: 13,
            fontWeight: 500,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
            transition: 'all 0.2s',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          <X size={14} strokeWidth={2} />
          Skip
        </button>
      </div>
    </motion.div>
  );
}
