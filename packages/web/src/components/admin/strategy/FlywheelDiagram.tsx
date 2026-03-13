'use client';

import React from 'react';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import type { FlywheelStep } from '@/lib/admin/company-strategy-data';

export function FlywheelDiagram({ steps }: { steps: FlywheelStep[] }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                minWidth: 32,
                borderRadius: '50%',
                background: `${colors.accent.primary}25`,
                border: `1px solid ${colors.accent.primary}50`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
                color: colors.accent.primary,
              }}
            >
              {index + 1}
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="bodyBold" style={{ color: colors.text.primary }}>
                {step.label}
              </Typography>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              style={{
                width: 2,
                height: spacing.sm,
                marginLeft: 15,
                background: colors.glass.border,
              }}
            />
          )}
        </React.Fragment>
      ))}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.md,
          marginTop: spacing.sm,
        }}
      >
        <div
          style={{
            padding: `${spacing.xs} ${spacing.md}`,
            borderRadius: borderRadius.full,
            background: `${colors.accent.primary}15`,
            border: `1px dashed ${colors.accent.primary}40`,
          }}
        >
          <Typography variant="small" style={{ color: colors.accent.primary }}>
            → Feeds back into step 1
          </Typography>
        </div>
      </div>
    </div>
  );
}
