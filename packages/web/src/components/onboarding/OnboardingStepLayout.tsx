'use client';

import React from 'react';
import { useTheme, spacing, borderRadius, BLUR } from '@/theme';
import { PageShell, GlassCard } from '@/components';
import { Typography, Button } from '@/components';
import { Link } from '@/i18n/navigation';

export interface OnboardingStepLayoutProps {
  /** 1=intention, 2=profile, 3=role, 4=preferences, 5=guide */
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle?: string;
  illustration?: React.ReactNode;
  children: React.ReactNode;
  primaryLabel: string;
  primaryHref?: string;
  onSubmit?: () => void | Promise<void>;
  loading?: boolean;
  /** Disable primary button (e.g. when no selection) */
  primaryDisabled?: boolean;
  skipHref?: string;
  skipLabel?: string;
}

export function OnboardingStepLayout({
  step,
  title,
  subtitle,
  illustration,
  children,
  primaryLabel,
  primaryHref,
  onSubmit,
  loading = false,
  primaryDisabled = false,
  skipHref,
  skipLabel = 'Skip for now',
}: OnboardingStepLayoutProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const showSkip = skipHref != null;

  return (
    <PageShell intensity="strong" maxWidth={520}>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: spacing.xl,
          paddingBottom: spacing.xxxl,
          gap: spacing.xl,
        }}
      >
        {/* Progress indicator — 5 dots */}
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            paddingTop: spacing.md,
          }}
        >
          {([1, 2, 3, 4, 5] as const).map((i) => {
            const isActive = i <= step;
            return (
              <div
                key={i}
                style={{
                  height: '3px',
                  width: '32px',
                  borderRadius: borderRadius.full,
                  background: isActive ? colors.accent.primary : `${colors.accent.primary}30`,
                  transition: 'background 0.3s ease',
                }}
              />
            );
          })}
        </div>

        {/* Header */}
        <GlassCard
          style={{
            textAlign: 'center',
            padding: `${spacing.xxl} ${spacing.xl}`,
            width: '100%',
          }}
        >
          {illustration && (
            <div style={{ marginBottom: spacing.md }}>{illustration}</div>
          )}
          <Typography
            variant="h1"
            style={{
              color: colors.text.primary,
              fontSize: 'clamp(22px, 5vw, 30px)',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: subtitle ? spacing.md : 0,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                fontSize: '15px',
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </GlassCard>

        {/* Main content */}
        <div style={{ width: '100%' }}>{children}</div>

        {/* CTA + Skip */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
            alignItems: 'center',
          }}
        >
          {primaryHref ? (
            <Link
              href={primaryHref}
              style={{
                width: '100%',
                textDecoration: 'none',
                pointerEvents: primaryDisabled ? 'none' : undefined,
              }}
            >
              <Button
                variant="primary"
                size="lg"
                disabled={loading || primaryDisabled}
                data-testid="onboarding-continue-button"
                style={{
                  width: '100%',
                  minHeight: '56px',
                  fontSize: '17px',
                  fontWeight: 700,
                }}
              >
                {loading ? '…' : primaryLabel}
              </Button>
            </Link>
          ) : (
            <Button
              variant="primary"
              size="lg"
              disabled={loading || primaryDisabled}
              onClick={onSubmit}
              data-testid="onboarding-continue-button"
              style={{
                width: '100%',
                minHeight: '56px',
                fontSize: '17px',
                fontWeight: 700,
              }}
            >
              {loading ? '…' : primaryLabel}
            </Button>
          )}

          {showSkip && (
            <Link
              href={skipHref}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: `${spacing.sm} 0`,
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body"
                style={{
                  color: colors.text.secondary,
                  fontSize: '13px',
                  opacity: 0.55,
                }}
              >
                {skipLabel}
              </Typography>
            </Link>
          )}
        </div>
      </div>
    </PageShell>
  );
}
