'use client';

import React from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { Logo, PageShell, GlassCard } from '@/components';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function ConfirmEmailPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium" maxWidth={480} centered>
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size="lg" showIcon={false} href={undefined} />
          </Link>
        </div>
        <GlassCard variant="auth">
            <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: borderRadius.full,
                  background: colors.gradients.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <Mail size={32} color={colors.text.onDark} />
              </div>
            </div>
            <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md, textAlign: 'center' }}>
              Check Your Email
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl }}>
              We sent you a confirmation link. Click the link in the email to verify your account.
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button variant="primary" fullWidth size="lg" style={{ background: colors.gradients.primary }}>
                  Back to Sign In
                </Button>
              </Link>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" fullWidth size="md" style={{ color: colors.text.secondary }}>
                  Back to Home
                </Button>
              </Link>
            </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
