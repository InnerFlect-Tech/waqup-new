'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import type { ConversationStep } from '@waqup/shared/types';

export interface ProgressStep {
  key: string;
  label: string;
  /** All ConversationStep values that map to this high-level step */
  maps: ConversationStep[];
}

const DEFAULT_STEPS: ProgressStep[] = [
  { key: 'intro', label: 'Intro', maps: ['init'] },
  { key: 'create', label: 'Create', maps: ['intent', 'context', 'personalization'] },
  { key: 'generate', label: 'Generate', maps: ['script', 'review'] },
  { key: 'voice', label: 'Voice', maps: ['voice', 'audio'] },
  { key: 'done', label: 'Done', maps: ['complete'] },
];

function resolveIndex(step: ConversationStep, steps: ProgressStep[]): number {
  const idx = steps.findIndex((s) => s.maps.includes(step));
  return idx === -1 ? 0 : idx;
}

interface CreateProgressBarProps {
  currentStep: ConversationStep;
  steps?: ProgressStep[];
}

export function CreateProgressBar({ currentStep, steps = DEFAULT_STEPS }: CreateProgressBarProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const currentIndex = resolveIndex(currentStep, steps);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '48rem',
        margin: `0 auto ${spacing.xl}`,
        padding: `${spacing.md} ${spacing.lg}`,
        borderRadius: borderRadius.xl,
        background: colors.glass.light,
        backdropFilter: BLUR.lg,
        WebkitBackdropFilter: BLUR.lg,
        border: `1px solid ${colors.glass.border}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {steps.map((step, index) => {
          const isPast = index < currentIndex;
          const isActive = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing.sm,
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    boxShadow: isActive ? `0 0 12px ${colors.accent.primary}80` : 'none',
                  }}
                  transition={{ duration: 0.25 }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: borderRadius.full,
                    background: isPast || isActive ? colors.gradients.primary : 'transparent',
                    border: isFuture
                      ? `2px solid ${colors.glass.border}`
                      : `2px solid ${colors.accent.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isPast || isActive ? colors.text.onDark : colors.text.secondary,
                    position: 'relative',
                  }}
                >
                  {isPast ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive
                      ? colors.accent.primary
                      : colors.text.secondary,
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    opacity: isFuture ? 0.5 : 1,
                  }}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    marginBottom: spacing.lg,
                    background: colors.glass.border,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 1,
                    marginLeft: spacing.xs,
                    marginRight: spacing.xs,
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{ width: index < currentIndex ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      background: colors.gradients.primary,
                      borderRadius: 1,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
