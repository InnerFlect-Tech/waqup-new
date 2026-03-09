'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Typography, Button, QCoin } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import type { LucideIcon } from 'lucide-react';

export interface CreateFlowStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface CreateFlowInitStepProps {
  title: string;
  description: string;
  steps: CreateFlowStep[];
  tips?: string[];
  nextHref?: string;
  nextLabel?: string;
  /** Credit cost range, e.g. "1–2 Qs" (base with AI) */
  creditRange?: string;
  /** Called when user clicks Begin (e.g. to mark init as seen) */
  onBegin?: () => void;
  /** If provided, replaces the default Begin button row */
  footer?: React.ReactNode;
}

export function CreateFlowInitStep({
  title,
  description,
  steps,
  tips,
  nextHref,
  nextLabel = 'Begin Journey →',
  creditRange,
  onBegin,
  footer,
}: CreateFlowInitStepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();

  const handleBegin = () => {
    onBegin?.();
    if (nextHref) router.push(nextHref);
  };

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: spacing.lg, textAlign: 'center' }}
      >
        <Typography variant="h1" style={{ marginBottom: spacing.md, color: colors.text.primary, fontWeight: 300 }}>
          {title}
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary }}>
          {description}
        </Typography>
        {creditRange && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xs,
              marginTop: spacing.md,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              background: `${colors.accent.primary}20`,
              border: `1px solid ${colors.accent.primary}40`,
            }}
          >
            <QCoin size="sm" />
            <Typography variant="small" style={{ color: colors.accent.primary, fontWeight: 600 }}>
              {creditRange}
            </Typography>
          </div>
        )}
      </motion.div>

      <div style={{ marginBottom: spacing.lg }}>
        <div
          style={{
            padding: spacing.lg,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ display: 'flex', gap: spacing.md, alignItems: 'flex-start' }}
              >
                <div style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: borderRadius.full,
                      background: `${colors.accent.tertiary}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <step.icon size={18} color={colors.accent.tertiary} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <Typography variant="h4" style={{ marginBottom: 2, color: colors.text.primary, fontWeight: 500 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>
                    {step.description}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </div>

          {tips && tips.slice(0, 4).length > 0 && (
            <div
              style={{
                marginTop: spacing.lg,
                padding: spacing.sm,
                borderRadius: borderRadius.lg,
                background: colors.glass.transparent,
              }}
            >
              <Typography variant="captionBold" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
                Before You Begin:
              </Typography>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: spacing.lg,
                  color: colors.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {tips.slice(0, 4).map((tip, i) => (
                  <li key={i}>
                    <Typography variant="caption" style={{ color: colors.text.secondary }}>
                      {tip}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {footer !== undefined ? (
        footer
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {onBegin ? (
            <Button variant="primary" size="lg" onClick={handleBegin}>
              {nextLabel}
            </Button>
          ) : nextHref ? (
            <Link href={nextHref} style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg">
                {nextLabel}
              </Button>
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
