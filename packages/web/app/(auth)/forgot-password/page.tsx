'use client';

import React, { useState } from 'react';
import { Container, Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { AnimatedBackground, Logo } from '@/components';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // TODO: Implement actual password reset logic with Supabase
    setTimeout(() => {
      setIsLoading(false);
      if (!email) {
        setError('Please enter your email address');
      } else {
        setSuccess(true);
      }
    }, 1000);
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
          <div style={{ textAlign: 'center', marginBottom: spacing.xl * 2 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <Logo size="lg" showIcon={true} href={undefined} />
            </Link>
            <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '18px', marginTop: spacing.md }}>
              Reset your password
            </Typography>
          </div>

          {/* Form Card */}
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
            {success ? (
              <div style={{ textAlign: 'center' }}>
                <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                  Check Your Email
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl }}>
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                </Typography>
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    style={{
                      background: colors.gradients.primary,
                      marginBottom: spacing.lg,
                    }}
                  >
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md, textAlign: 'center' }}>
                  Forgot Password?
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, textAlign: 'center' }}>
                  Enter your email address and we'll send you a link to reset your password.
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

                <Input
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail size={20} color={colors.text.secondary} />}
                  containerStyle={{
                    background: colors.glass.transparent,
                    marginBottom: spacing.xl,
                  }}
                  style={{ color: colors.text.primary }}
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
                      fontSize: '14px',
                    }}
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
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
