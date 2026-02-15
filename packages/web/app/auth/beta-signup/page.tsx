'use client';

import React, { useState } from 'react';
import { Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { Logo, PageShell, GlassCard } from '@/components';
import { spacing } from '@/theme';
import Link from 'next/link';
import { Mail, Sparkles } from 'lucide-react';

export default function BetaSignupPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with beta waitlist API
    setSubmitted(true);
  };

  return (
    <PageShell intensity="medium" maxWidth={480} centered>
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size="lg" showIcon={false} href={undefined} />
          </Link>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '18px', marginTop: spacing.md }}>
            Join the waQup beta
          </Typography>
        </div>
        <GlassCard variant="auth">
            {submitted ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
                  <Sparkles size={48} color={colors.accent.primary} />
                </div>
                <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md, textAlign: 'center' }}>
                  You're on the list
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>
                  We'll notify you when the beta opens.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md, textAlign: 'center' }}>
                  Beta Signup
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl }}>
                  Enter your email to join the waitlist for early access.
                </Typography>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: spacing.lg }}>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>
                  <Button type="submit" variant="primary" fullWidth size="lg" style={{ background: colors.gradients.primary }}>
                    Join Waitlist
                  </Button>
                </form>
              </>
            )}
            <div style={{ marginTop: spacing.xl, textAlign: 'center' }}>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Typography variant="small" style={{ color: colors.accent.primary }}>
                  Already have access? Sign up
                </Typography>
              </Link>
            </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
