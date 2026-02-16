'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography, Button, Input, Loading } from '@/components';
import { useTheme } from '@/theme';
import { Logo, PageShell, GlassCard, TestLoginButton } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { loginSchema } from '@waqup/shared/schemas';
import { useAuthStore } from '@/stores';
import { applyOverrideLogin } from '@/lib/auth-override';
import { supabase } from '@/lib/supabase';
import { normalizeAuthError } from '@/lib/auth-errors';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import type { LoginFormData } from '@waqup/shared/schemas';

function GoogleIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden style={{ width: 20, height: 20, color: 'currentColor', ...style }}>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, setError } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const message = searchParams.get('message');
  const errorParam = searchParams.get('error');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      if (!supabase) throw new Error('Authentication service unavailable');
      const returnUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('next') || '/home' : '/home';
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=${encodeURIComponent(returnUrl)}`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      console.error('Google Sign In error:', err);
      setError(normalizeAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    const result = await login(data.email, data.password);

    if (result.success) {
      router.push('/home');
      return;
    }

    // Try override login (env-configured admin/dev credentials)
    try {
      const res = await fetch('/api/auth/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const json = res.ok ? await res.json() : null;
      if (json?.ok) {
        const overrideUser = applyOverrideLogin(data.email);
        useAuthStore.getState().setUser(overrideUser);
        useAuthStore.getState().setSession(null);
        useAuthStore.getState().setError(null);
        router.push('/home');
        return;
      }
    } catch {
      // fall through to existing error
    }
    // Error is already set in the store from Supabase login
  };

  return (
    <PageShell intensity="medium" maxWidth={480} centered>
      <div style={{ width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size="lg" showIcon={false} href={undefined} />
          </Link>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '18px', marginTop: spacing.md }}>
            Welcome back. Transform your mind through voice.
          </Typography>
        </div>

        {/* Login Form Card */}
        <GlassCard variant="auth">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md, textAlign: 'center' }}>
                Sign In
              </Typography>

              {message && (
                <div
                  style={{
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    background: `${colors.success}20`,
                    border: `1px solid ${colors.success}`,
                    marginBottom: spacing.lg,
                  }}
                >
                  <Typography variant="body" style={{ color: colors.success }}>
                    {message}
                  </Typography>
                </div>
              )}

              {(error || errorParam === 'callback_failed') && (
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
                    {error || (errorParam === 'callback_failed' ? 'Sign in with Google failed. Please try again or use email and password.' : null)}
                  </Typography>
                </div>
              )}

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

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
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
                    containerStyle={{
                      background: colors.glass.transparent,
                      marginBottom: spacing.md,
                    }}
                    style={{ color: colors.text.primary }}
                  />
                )}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: spacing.xl }}>
                <Link
                  href="/forgot-password"
                  style={{
                    textDecoration: 'none',
                    color: colors.accent.primary,
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                fullWidth
                disabled={googleLoading}
                style={{
                  background: colors.gradients.primary,
                  marginBottom: spacing.lg,
                  height: '52px',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Or continue with divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: spacing.lg,
                  gap: spacing.md,
                }}
              >
                <div style={{ flex: 1, height: 1, background: colors.glass.border }} />
                <Typography variant="caption" style={{ color: colors.text.tertiary ?? colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Or continue with
                </Typography>
                <div style={{ flex: 1, height: 1, background: colors.glass.border }} />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="lg"
                fullWidth
                disabled={isLoading || googleLoading}
                onClick={handleGoogleSignIn}
                style={{
                  background: colors.glass.transparent,
                  border: `1px solid ${colors.glass.border}`,
                  marginBottom: spacing.lg,
                  height: '52px',
                  fontSize: '16px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.sm,
                }}
              >
                {googleLoading ? (
                  <>
                    <Loading variant="spinner" size="sm" color="primary" />
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google
                  </>
                )}
              </Button>

              <div style={{ textAlign: 'center', marginTop: spacing.lg }}>
                <Typography variant="body" style={{ color: colors.text.secondary }}>
                  Don't have an account?{' '}
                  <Link
                    href="/signup"
                    style={{
                      color: colors.accent.primary,
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </div>
            </form>
        </GlassCard>

        {/* Test login (no DB) - only when NEXT_PUBLIC_ENABLE_TEST_LOGIN=true */}
        <div style={{ textAlign: 'center', marginTop: spacing.lg }}>
          <TestLoginButton />
        </div>

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
