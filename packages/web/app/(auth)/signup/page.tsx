'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Container, Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { AnimatedBackground, Logo } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { signupSchema } from '@waqup/shared/schemas';
import { useAuthStore } from '@/stores';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import type { SignupFormData } from '@waqup/shared/schemas';

export default function SignupPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { signup, isLoading, error, setError, resendVerificationEmail } = useAuthStore();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    const result = await signup(data.email, data.password);
    
    if (result.success) {
      setUserEmail(data.email);
      setSignupSuccess(true);
    }
    // Error is already set in the store
  };

  const handleResendVerification = async () => {
    if (userEmail) {
      await resendVerificationEmail(userEmail);
    }
  };

  if (signupSuccess) {
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
                padding: spacing.xxxl,
                borderRadius: borderRadius.xl,
                background: colors.glass.opaque,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${colors.glass.border}`,
                boxShadow: `0 16px 64px ${colors.mystical.glow}40`,
                textAlign: 'center',
              }}
            >
              <CheckCircle2 size={64} color={colors.success} style={{ margin: '0 auto', marginBottom: spacing.lg }} />
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                Check Your Email
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, lineHeight: '24px' }}>
                We've sent a verification email to <strong>{userEmail}</strong>. Please check your inbox and click the verification link to activate your account.
              </Typography>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={handleResendVerification}
                style={{
                  background: colors.gradients.primary,
                  marginBottom: spacing.md,
                }}
              >
                Resend Verification Email
              </Button>
              <Link
                href="/login"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  color: colors.accent.tertiary,
                  textDecoration: 'none',
                  fontWeight: 600,
                  marginTop: spacing.md,
                }}
              >
                Back to Login
              </Link>
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
          <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <Logo size="lg" showIcon={false} href={undefined} />
            </Link>
            <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '18px', marginTop: spacing.md }}>
              Start your transformation journey today
            </Typography>
          </div>

          {/* Signup Form Card */}
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
                Create Account
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
                    placeholder="Create a password"
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
                    label="Confirm Password"
                    placeholder="Confirm your password"
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

              <Controller
                control={control}
                name="acceptTerms"
                render={({ field: { onChange, value } }) => (
                  <div style={{ marginBottom: spacing.md }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        gap: spacing.sm,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: colors.accent.primary,
                        }}
                      />
                      <Typography variant="caption" style={{ color: colors.text.secondary }}>
                        I accept the{' '}
                        <Link href="/terms" style={{ color: colors.accent.tertiary, textDecoration: 'none' }}>
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" style={{ color: colors.accent.tertiary, textDecoration: 'none' }}>
                          Privacy Policy
                        </Link>
                      </Typography>
                    </label>
                    {errors.acceptTerms && (
                      <Typography variant="small" style={{ color: colors.error, marginTop: spacing.xs }}>
                        {errors.acceptTerms.message}
                      </Typography>
                    )}
                  </div>
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
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <div style={{ textAlign: 'center', marginTop: spacing.lg }}>
                <Typography variant="body" style={{ color: colors.text.secondary }}>
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    style={{
                      color: colors.accent.primary,
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign in
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
