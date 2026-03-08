'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { Logo, PageShell, GlassCard } from '@/components';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import {
  Sparkles,
  Shield,
  Zap,
  Crown,
  Check,
  ArrowRight,
  Users,
  Lock,
  Star,
  Gift,
} from 'lucide-react';

const PERKS = [
  {
    icon: Crown,
    title: 'Founding Member badge',
    description: 'Permanent recognition on your profile — locked in forever.',
    color: '#f59e0b',
  },
  {
    icon: Zap,
    title: '500 Qs on joining',
    description: 'Enough to create hundreds of affirmations, meditations, and rituals.',
    color: '#c084fc',
  },
  {
    icon: Lock,
    title: 'Locked-in pricing',
    description: 'Your price never increases, even as we raise rates for new members.',
    color: '#34d399',
  },
  {
    icon: Star,
    title: 'Early access to every feature',
    description: 'AI voice cloning, rituals engine, and marketplace — before anyone else.',
    color: '#60a5fa',
  },
  {
    icon: Users,
    title: 'Direct line to the founders',
    description: 'Private channel for feedback, requests, and early previews.',
    color: '#fb7185',
  },
  {
    icon: Gift,
    title: '3 months free',
    description: 'No charge for your first 3 months — no credit card required to start.',
    color: '#f97316',
  },
];

const SOCIAL_PROOF = [
  { initials: 'SK', name: 'Sarah K.', text: '"Finally a voice-first practice tool that actually works."' },
  { initials: 'MR', name: 'Marcus R.', text: '"I\'ve tried every meditation app. This is different. It\'s mine."' },
  { initials: 'AJ', name: 'Aisha J.', text: '"Hearing my own affirmations back changed everything."' },
];

function JoinPageInner() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email.'); return; }
    setError(null);
    setSubmitting(true);
    // TODO: integrate with Supabase or waitlist API
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <PageShell intensity="strong" maxWidth={520} centered>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              width: 96,
              height: 96,
              borderRadius: borderRadius.full,
              background: colors.gradients.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.xl,
              boxShadow: `0 16px 48px ${colors.accent.primary}50`,
            }}
          >
            <Crown size={44} color={colors.text.onDark} strokeWidth={1.5} />
          </motion.div>

          <GlassCard variant="auth">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md, fontWeight: 300 }}>
                You&apos;re in, {name || 'Founding Member'}
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, lineHeight: 1.7 }}>
                Welcome to the founding circle. We&apos;ll send your activation link to <strong style={{ color: colors.text.primary }}>{email}</strong> — check your inbox.
              </Typography>

              <div
                style={{
                  padding: spacing.lg,
                  borderRadius: borderRadius.lg,
                  background: `${colors.accent.primary}12`,
                  border: `1px solid ${colors.accent.primary}30`,
                  marginBottom: spacing.xl,
                }}
              >
                <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10 }}>
                  Your founding member perks
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  {['500 credits credited on activation', 'Founding Member badge — permanent', '3 months free, price locked forever'].map((perk) => (
                    <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                      <Check size={14} color={colors.accent.primary} strokeWidth={3} />
                      <Typography variant="small" style={{ color: colors.text.primary, margin: 0 }}>
                        {perk}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button variant="primary" fullWidth size="lg" style={{ marginBottom: spacing.md }}>
                  Create your account now
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="small" style={{ color: colors.text.secondary, display: 'block', textAlign: 'center' }}>
                  Already have an account? <span style={{ color: colors.accent.primary }}>Sign in</span>
                </Typography>
              </Link>
            </motion.div>
          </GlassCard>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell intensity="strong">
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: `${spacing.xxl} ${spacing.lg}` }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size="lg" showIcon href={undefined} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: spacing.xxl, alignItems: 'start' }}>
          {/* Left: headline + perks */}
          <div>
            {/* Founding badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: borderRadius.full,
                background: `${colors.accent.primary}15`,
                border: `1px solid ${colors.accent.primary}40`,
                marginBottom: spacing.xl,
              }}
            >
              <Crown size={14} color={colors.accent.primary} strokeWidth={2.5} />
              <Typography variant="small" style={{ color: colors.accent.primary, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11 }}>
                Founding Member
              </Typography>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#34d399',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Typography
                variant="h1"
                style={{
                  color: colors.text.primary,
                  fontWeight: 200,
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  lineHeight: 1.15,
                  marginBottom: spacing.lg,
                }}
              >
                Transform your mind{' '}
                <span
                  style={{
                    background: colors.gradients.primary,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  with your own voice
                </span>
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 18, lineHeight: 1.7, marginBottom: spacing.xxl }}>
                waQup lets you create personalized affirmations, meditations, and rituals — narrated in your own voice, powered by AI, designed around your life.
              </Typography>
            </motion.div>

            {/* Perks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.xxl }}>
              {PERKS.map((perk, index) => (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.07 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: spacing.md,
                    padding: spacing.md,
                    borderRadius: borderRadius.lg,
                    background: colors.glass.light,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${colors.glass.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: borderRadius.md,
                      background: `${perk.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: spacing.xs,
                    }}
                  >
                    <perk.icon size={18} color={perk.color} strokeWidth={2} />
                  </div>
                  <div>
                    <Typography variant="h4" style={{ color: colors.text.primary, margin: 0, marginBottom: spacing.xs }}>
                      {perk.title}
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
                      {perk.description}
                    </Typography>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {SOCIAL_PROOF.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.md }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: colors.gradients.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      color: colors.text.onDark,
                      flexShrink: 0,
                    }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <Typography variant="small" style={{ color: colors.text.primary, margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                      {item.text}
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 11, marginTop: spacing.xs }}>
                      — {item.name}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: signup form */}
          <div style={{ position: 'sticky', top: 100 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <GlassCard variant="auth">
                {/* Referral notice */}
                {refCode && (
                  <div
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      borderRadius: borderRadius.md,
                      background: '#34d39915',
                      border: '1px solid #34d39940',
                      marginBottom: spacing.lg,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                    }}
                  >
                    <Gift size={14} color="#34d399" />
                    <Typography variant="small" style={{ color: '#34d399', margin: 0 }}>
                      Referred by <strong>{refCode}</strong> — extra 10 Qs for you both!
                    </Typography>
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      marginBottom: spacing.md,
                    }}
                  >
                    <Sparkles size={20} color={colors.accent.primary} strokeWidth={2} />
                    <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontWeight: 400 }}>
                      Claim your founding spot
                    </Typography>
                  </div>
                  <Typography variant="small" style={{ color: colors.text.secondary, display: 'block' }}>
                    Limited founding memberships available
                  </Typography>
                </div>

                {/* Spots counter */}
                <div
                  style={{
                    marginBottom: spacing.xl,
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    borderRadius: borderRadius.md,
                    background: `${colors.accent.primary}10`,
                    border: `1px solid ${colors.accent.primary}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing.sm,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.accent.primary }} />
                  <Typography variant="small" style={{ color: colors.text.secondary }}>
                    <span style={{ color: colors.accent.primary, fontWeight: 700 }}>47 spots</span> remaining at founding price
                  </Typography>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.lg }}>
                    <Input
                      type="text"
                      label="First name"
                      placeholder="Your first name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ color: colors.text.primary }}
                    />
                    <Input
                      type="email"
                      label="Email address"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ color: colors.text.primary }}
                    />
                  </div>

                  {error && (
                    <Typography variant="small" style={{ color: colors.error, marginBottom: spacing.md, display: 'block' }}>
                      {error}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    loading={submitting}
                    style={{ marginBottom: spacing.md }}
                  >
                    {submitting ? 'Claiming your spot...' : 'Claim founding membership'}
                    {!submitting && <ArrowRight size={16} />}
                  </Button>

                  <Typography variant="small" style={{ color: colors.text.secondary, textAlign: 'center', display: 'block', marginBottom: spacing.lg, lineHeight: 1.5 }}>
                    No credit card required. 3 months free, then locked at founding price.
                  </Typography>

                  {/* Trust badges */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.xl, paddingTop: spacing.md, borderTop: `1px solid ${colors.glass.border}` }}>
                    {[
                      { icon: Shield, label: 'Secure' },
                      { icon: Lock, label: 'Private' },
                      { icon: Zap, label: 'Instant' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                        <Icon size={16} color={colors.text.secondary} strokeWidth={1.5} style={{ opacity: 0.6 }} />
                        <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 10, opacity: 0.6 }}>
                          {label}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </form>
              </GlassCard>

              <div style={{ textAlign: 'center', marginTop: spacing.lg }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>
                  Already a member?{' '}
                  <Link href="/login" style={{ color: colors.accent.primary, textDecoration: 'none', fontWeight: 600 }}>
                    Sign in
                  </Link>
                </Typography>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </PageShell>
  );
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinPageInner />
    </Suspense>
  );
}
