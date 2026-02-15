'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { Logo, PageShell, GlassCard } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { forgotPasswordSchema } from '@waqup/shared/schemas';
import { useAuthStore } from '@/stores';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ForgotPasswordFormData } from '@waqup/shared/schemas';

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { requestPasswordReset, isLoading, error, setError } = useAuthStore();
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    // For web, use the reset password page URL
    const redirectTo = `${window.location.origin}/reset-password`;
    const result = await requestPasswordReset(data.email, redirectTo);
    
    if (result.success) {
      setUserEmail(data.email);
      setEmailSent(true);
    }
    // Error is already set in the store
  };

  if (emailSent) {
    return (
      <PageShell intensity="medium" maxWidth={480} centered>
        <div style={{ width: '100%' }}>
          <GlassCard variant="auth" style={{ textAlign: 'center' }}>
              <CheckCircle2 size={64} color={colors.success} style={{ margin: '0 auto', marginBottom: spacing.lg }} />
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                Check Your Email
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, lineHeight: '24px' }}>
                We've sent a password reset link to <strong>{userEmail}</strong>. Please check your inbox and follow the instructions to reset your password.
              </Typography>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => router.push('/login')}
                style={{
                  background: colors.gradients.primary,
                  marginBottom: spacing.md,
                }}
              >
                Back to Login
              </Button>
          </GlassCard>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell intensity="medium" maxWidth={480} centered>
      <div style={{ width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size="lg" showIcon={false} href={undefined} />
          </Link>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '18px', marginTop: spacing.md }}>
            Reset your password
          </Typography>
        </div>

        {/* Forgot Password Form Card */}
        <GlassCard variant="auth">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md, textAlign: 'center' }}>
                Forgot Password
              </Typography>

              {error && (
                <div
                  style={{
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    background: `${colors.error}20`,
                    border: `1px solid ${colors.error}`,
                    marginBottom: spacing.lg,
                  }}
                >
                  <Typography variant="body" style={{ color: colors.error }}>
                    {error}
                  </Typography>
                </div>
              )}

              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, textAlign: 'center', lineHeight: '24px' }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type="email"
                    label="Email"
                    placeholder="your@email.com"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    leftIcon={<Mail size={20} color={colors.text.secondary} />}
                    error={errors.email?.message}
                    containerStyle={{
                      background: colors.glass.transparent,
                      marginBottom: spacing.lg,
                    }}
                    style={{ color: colors.text.primary }}
                  />
                )}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                fullWidth
                style={{
                  background: colors.gradients.primary,
                  marginBottom: spacing.lg,
                  height: '52px',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div style={{ textAlign: 'center', marginTop: spacing.lg }}>
                <Link
                  href="/login"
                  style={{
                    color: colors.accent.primary,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Back to Login
                </Link>
              </div>
            </form>
        </GlassCard>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: spacing.xl }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.sm,
              color: colors.text.secondary,
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            <ArrowRight size={16} color={colors.text.secondary} style={{ transform: 'rotate(180deg)' }} />
            Back to home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
