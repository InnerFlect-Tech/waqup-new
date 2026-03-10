'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowLeft, Lock } from 'lucide-react';
import { Typography, Button, QCoin } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { Link } from '@/i18n/navigation';
import { PLANS, formatPlanPrice, type Plan } from '@waqup/shared/constants';
import { useAuthStore } from '@/stores';

function PlanCard({
  plan,
  isPopular,
  isCurrent,
  index,
}: {
  plan: Plan;
  isPopular: boolean;
  isCurrent: boolean;
  index: number;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      style={{
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
        background: isCurrent
          ? `linear-gradient(145deg, ${colors.accent.primary}25, ${colors.accent.secondary}15)`
          : isPopular
            ? `linear-gradient(145deg, ${colors.accent.primary}15, ${colors.accent.secondary}08)`
            : colors.glass.light,
        backdropFilter: BLUR.xl,
        WebkitBackdropFilter: BLUR.xl,
        border: isCurrent
          ? `1px solid ${colors.accent.primary}70`
          : isPopular
            ? `1px solid ${colors.accent.primary}40`
            : `1px solid ${colors.glass.border}`,
        boxShadow: isCurrent ? `0 20px 60px ${colors.accent.primary}25` : undefined,
        marginBottom: spacing.md,
        position: 'relative',
      }}
    >
      {isCurrent && (
        <div
          style={{
            position: 'absolute',
            top: spacing.md,
            right: spacing.md,
            background: `${colors.accent.primary}25`,
            border: `1px solid ${colors.accent.primary}50`,
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.full,
            fontSize: 11,
            fontWeight: 600,
            color: colors.accent.tertiary,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Current plan
        </div>
      )}

      {!isCurrent && isPopular && (
        <div
          style={{
            position: 'absolute',
            top: spacing.md,
            right: spacing.md,
            background: colors.gradients.primary,
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.full,
            fontSize: 11,
            fontWeight: 700,
            color: colors.text.onDark,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Most popular
        </div>
      )}

      <div style={{ marginBottom: spacing.lg }}>
        <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 400 }}>
          {plan.name}
        </Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.5 }}>
          {plan.description}
        </Typography>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <QCoin size="sm" />
          <span style={{ fontSize: 36, fontWeight: 200, color: colors.text.primary, lineHeight: 1 }}>
            {plan.creditsPerPeriod}
          </span>
          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, alignSelf: 'flex-end', paddingBottom: 4 }}>
            Qs
          </Typography>
        </div>
        <div
          style={{
            height: 28,
            width: 1,
            background: colors.glass.border,
          }}
        />
        <Typography variant="body" style={{ color: colors.text.secondary, margin: 0 }}>
          {formatPlanPrice(plan)}
        </Typography>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
        {plan.features.map((feature) => (
          <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <Check size={14} color={isCurrent ? colors.accent.primary : colors.text.secondary} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.4 }}>
              {feature}
            </Typography>
          </div>
        ))}
        {plan.trialDays && !isCurrent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <Sparkles size={14} color={colors.accent.tertiary} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <Typography variant="small" style={{ color: colors.accent.tertiary, margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
              {plan.trialDays}-day free trial included
            </Typography>
          </div>
        )}
      </div>

      {isCurrent ? (
        <Button variant="outline" size="lg" fullWidth disabled style={{ opacity: 0.5 }}>
          Active
        </Button>
      ) : (
        <div>
          <Button variant={isPopular ? 'primary' : 'outline'} size="lg" fullWidth disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
            <Lock size={14} />
            {plan.ctaLabel}
          </Button>
          <Typography variant="small" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm, opacity: 0.5, fontSize: 11 }}>
            Payments launching soon
          </Typography>
        </div>
      )}
    </motion.div>
  );
}

export default function PlanPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuthStore();

  const currentPlanId = (user?.user_metadata?.plan_id as string | undefined) ?? null;

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <Link href="/sanctuary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl }}>
          <ArrowLeft size={14} color={colors.text.secondary} />
          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
            Sanctuary
          </Typography>
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
            Your plan
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl }}>
            {currentPlanId
              ? 'You have an active plan. See your options below.'
              : 'No active plan yet. Choose the one that fits your practice.'}
          </Typography>
        </motion.div>

        {PLANS.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isPopular={plan.badge === 'Most Popular'}
            isCurrent={plan.id === currentPlanId}
            index={index}
          />
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ textAlign: 'center', marginTop: spacing.lg }}
        >
          <Typography variant="small" style={{ color: colors.text.secondary, opacity: 0.6, lineHeight: 1.6 }}>
            Billing is managed securely.{' '}
            <a href="mailto:hello@waqup.app" style={{ color: colors.accent.tertiary, textDecoration: 'none' }}>
              Questions about your plan?
            </a>
          </Typography>
        </motion.div>
      </PageContent>
    </PageShell>
  );
}
