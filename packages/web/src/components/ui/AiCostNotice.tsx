'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { Typography } from './Typography';
import { Button } from './Button';
import { QCoin } from './QCoin';

export interface AiCostNoticeProps {
  /**
   * Number of Qs that will be charged. Pass 0 for an informational notice
   * (e.g. ElevenLabs external cost with no Q deduction).
   */
  cost: number;
  /** Short label shown next to the cost, e.g. "per reply" or "flat fee" */
  costLabel?: string;
  /** Human-readable description of what the AI action does */
  description?: string;
  /**
   * When provided, renders confirm/cancel buttons for one-shot gated actions.
   * When omitted, the notice is purely informational (no buttons).
   */
  onConfirm?: () => void;
  onCancel?: () => void;
  /** Label for the confirm button — defaults to "Proceed" */
  confirmLabel?: string;
  /** Whether the confirm action is currently in-flight */
  loading?: boolean;
  /** Optional extra style for the wrapper */
  style?: React.CSSProperties;
}

/**
 * AiCostNotice — shown before any token-consuming AI action.
 *
 * Two modes:
 *  - **Informational** (no onConfirm): amber banner showing what will be spent.
 *  - **Confirmation gate** (with onConfirm): shows Proceed / Cancel buttons.
 */
export function AiCostNotice({
  cost,
  costLabel,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Proceed',
  loading = false,
  style,
}: AiCostNoticeProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const isGate = Boolean(onConfirm);
  const accentColor = cost === 0 ? colors.info : colors.accent.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      style={{
        padding: `${spacing.sm} ${spacing.md}`,
        borderRadius: borderRadius.lg,
        background: `${accentColor}14`,
        border: `1px solid ${accentColor}40`,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {/* Icon */}
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {cost > 0 ? (
          <QCoin size="sm" />
        ) : (
          <Zap size={16} color={accentColor} strokeWidth={2} />
        )}
      </span>

      {/* Cost label */}
      {cost > 0 && (
        <Typography
          variant="small"
          style={{
            color: accentColor,
            fontWeight: 600,
            fontSize: 12,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {cost} Q{cost !== 1 ? 's' : ''}{costLabel ? ` ${costLabel}` : ''}
        </Typography>
      )}

      {/* Separator */}
      {cost > 0 && description && (
        <span style={{ color: `${accentColor}80`, fontSize: 11 }}>·</span>
      )}

      {/* Description */}
      {description && (
        <Typography
          variant="small"
          style={{ color: colors.text.secondary, fontSize: 12, flex: 1, minWidth: 0 }}
        >
          {description}
        </Typography>
      )}

      {/* Confirmation buttons */}
      {isGate && (
        <div
          style={{
            display: 'flex',
            gap: spacing.xs,
            marginLeft: 'auto',
            flexShrink: 0,
          }}
        >
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={loading}
              style={{ fontSize: 12, color: colors.text.secondary, padding: '4px 10px' }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            loading={loading}
            style={{ fontSize: 12, padding: '4px 14px' }}
          >
            {confirmLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
