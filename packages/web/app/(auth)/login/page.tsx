'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { AnimatedBackground, Logo } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { loginSchema } from '@waqup/shared/schemas';
import { useAuthStore } from '@/stores';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import type { LoginFormData } from '@waqup/shared/schemas';

export default function LoginPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, setError } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const message = searchParams.get('message');

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

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    const result = await login(data.email, data.password);
    
    if (result.success) {
      router.push('/home');
    }
    // Error is already set in the store
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground intensity="medium" color="primary" />
      
      {/* Mystical Radial Gradient Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: colors.gradients.mystical,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
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
          <div
            style={{
              padding: spacing.xxxl,
              borderRadius: borderRadius.xl,
              background: colors.glass.opaque,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.glass.border}`,
              boxShadow: `0 16px 64px ${colors.mystical.glow}40`,
            }}
          >
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
      </div>
    </div>
  );
}
