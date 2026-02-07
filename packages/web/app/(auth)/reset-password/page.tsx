'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { AnimatedBackground, Logo } from '@/components';
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
  
  // Check for Supabase session from hash fragments (handled automatically by Supabase)
  useEffect(() => {
    const checkSession = async () => {
      // Supabase automatically processes hash fragments and creates a session
      // We just need to check if we have a session
      const sessionResult = await authService.getCurrentSession();
      setHasValidSession(!!sessionResult.data);
    };
    
    checkSession();
  }, [authService]);

  const {
    control,
    handleSubmit,
    formState: { errors },
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
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <AnimatedBackground intensity="medium" color="primary" />
        
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
            <div
              style={{
                padding: spacing.xl * 2,
                borderRadius: borderRadius.xl,
                background: colors.glass.opaque,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${colors.glass.border}`,
                boxShadow: `0 16px 64px ${colors.mystical.glow}40`,
                textAlign: 'center',
              }}
            >
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
                onPress={() => router.push('/forgot-password')}
                style={{
                  background: colors.gradients.primary,
                  marginBottom: spacing.md,
                }}
              >
                Request New Reset Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div style={{ textAlign: 'center', marginBottom: spacing.xl * 2 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <Logo size="lg" showIcon={false} href={undefined} />
            </Link>
            <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '18px', marginTop: spacing.md }}>
              Create new password
            </Typography>
          </div>

          {/* Reset Password Form Card */}
          <div
            style={{
              padding: spacing.xl * 2,
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
                {isLoading ? 'Resetting password...' : 'Reset Password'}
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
