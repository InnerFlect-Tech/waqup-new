'use client';

import React, { useState } from 'react';
import { Container, Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { AnimatedBackground, Logo } from '@/components';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // TODO: Implement actual login logic with Supabase
    setTimeout(() => {
      setIsLoading(false);
      // For now, just show error if fields are empty
      if (!email || !password) {
        setError('Please fill in all fields');
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
              Welcome back. Transform your mind through voice.
            </Typography>
          </div>

          {/* Login Form Card */}
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
            <form onSubmit={handleSubmit}>
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md, textAlign: 'center' }}>
                Sign In
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
                  marginBottom: spacing.lg,
                }}
                style={{ color: colors.text.primary }}
              />

              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                containerStyle={{
                  background: colors.glass.transparent,
                  marginBottom: spacing.md,
                }}
                style={{ color: colors.text.primary }}
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
