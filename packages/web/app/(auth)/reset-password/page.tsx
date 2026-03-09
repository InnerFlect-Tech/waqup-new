'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { Logo, PageShell, GlassCard } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { resetPasswordSchema } from '@waqup/shared/schemas';
import { useAuthStore } from '@/stores';
import { createAuthService } from '@waqup/shared/services';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { ResetPasswordFormData } from '@waqup/shared/schemas';

export default function ResetPasswordPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { resetPassword, isLoading, error, setError } = useAuthStore();
  const authService = createAuthService(supabase);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);

  // The shared Supabase client has detectSessionInUrl: false (required for mobile).
  // On web, password reset links deliver tokens in the URL hash, so we parse them
  // manually and call setSession — the same pattern used in login/page.tsx for
  // OAuth implicit-flow fallback.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash?.replace(/^#/, '');
    if (hash) {
      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');

      if (access_token && (type === 'recovery' || type === 'signup')) {
        let cancelled = false;
        (async () => {
          try {
            if (!supabase) return;
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token: refresh_token ?? '',
            });
            if (cancelled) return;
            if (!sessionError && data?.session) {
              useAuthStore.getState().setSession(data.session);
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
              setHasValidSession(true);
            }
          } catch {
            // fall through — hasValidSession stays false, shows invalid link screen
          }
        })();
        return () => { cancelled = true; };
      }
    }

    // No hash tokens — check if there's already an active session (e.g. page refresh)
    authService.getCurrentSession().then((result) => {
      setHasValidSession(!!result.data);
    });
  // authService is recreated on every render; only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: '', // Token handled by Supabase from URL hash
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!hasValidSession) {
      setError('Invalid or expired reset link. Please request a new password reset.');
      return;
    }

    setError(null);
    // Supabase handles token from URL hash fragments automatically
    const result = await resetPassword(data.password);
    
    if (result.success) {
      router.push('/login?message=Password reset successful. Please sign in with your new password.');
    }
    // Error is already set in the store
  };

  if (!hasValidSession) {
    return (
      <PageShell intensity="medium" maxWidth={480} centered plain>
        <div style={{ width: '100%' }}>
          <GlassCard variant="auth" style={{ textAlign: 'center' }}>
              <AlertCircle size={64} color={colors.error} style={{ margin: '0 auto', marginBottom: spacing.lg }} />
              <Typography variant="h2" style={{ color: colors.error, marginBottom: spacing.md }}>
                Invalid Reset Link
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, lineHeight: '24px' }}>
                This password reset link is invalid or has expired. Please request a new password reset.
              </Typography>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => router.push('/forgot-password')}
                style={{
                  background: colors.gradients.primary,
                  marginBottom: spacing.md,
                }}
              >
                Request New Reset Link
              </Button>
          </GlassCard>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell intensity="medium" maxWidth={480} centered plain>
      <div style={{ width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size="lg" showIcon={false} href={undefined} />
          </Link>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '18px', marginTop: spacing.md }}>
            Create new password
          </Typography>
        </div>

        {/* Reset Password Form Card */}
        <GlassCard variant="auth">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md, textAlign: 'center' }}>
                Reset Password
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

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    placeholder="Enter new password"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    leftIcon={<Lock size={20} color={colors.text.secondary} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: spacing.xs,
                        }}
                      >
                        {showPassword ? (
                          <EyeOff size={20} color={colors.text.secondary} />
                        ) : (
                          <Eye size={20} color={colors.text.secondary} />
                        )}
                      </button>
                    }
                    error={errors.password?.message}
                    helperText="Must contain uppercase, lowercase, and number"
                    containerStyle={{
                      background: colors.glass.transparent,
                      marginBottom: spacing.lg,
                    }}
                    style={{ color: colors.text.primary }}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    leftIcon={<Lock size={20} color={colors.text.secondary} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: spacing.xs,
                        }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} color={colors.text.secondary} />
                        ) : (
                          <Eye size={20} color={colors.text.secondary} />
                        )}
                      </button>
                    }
                    error={errors.confirmPassword?.message}
                    containerStyle={{
                      background: colors.glass.transparent,
                      marginBottom: spacing.md,
                    }}
                    style={{ color: colors.text.primary }}
                  />
                )}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
                style={{
                  background: colors.gradients.primary,
                  marginBottom: spacing.lg,
                  height: '52px',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                {isSubmitting ? 'Resetting password...' : 'Reset Password'}
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
