'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, GlassCard } from '@/components';
import { spacing, borderRadius, BLUR, NAV_TOP_OFFSET } from '@/theme';
import { useFoundingMembersRemaining } from '@/hooks';
import { Link } from '@/i18n/navigation';
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
    title: '50 credits on joining',
    description: 'Enough to create affirmations, meditations, and rituals right away.',
    color: '#c084fc',
  },
  {
    icon: Lock,
    title: 'Lifetime €6.99/month',
    description: 'Locked forever — your price never increases, even as we raise rates for new members.',
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
    title: '1 month free',
    description: 'No charge for your first month — no credit card required to start.',
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
  const { remaining, loading: remainingLoading, refetch: refetchRemaining } = useFoundingMembersRemaining();

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
    try {
      const res = await fetch('/api/founding-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Failed to claim your spot. Please try again.');
        setSubmitting(false);
        return;
      }
      await refetchRemaining();
      setStep('success');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <PageShell intensity="strong" maxWidth={520} centered allowDocumentScroll>
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
                  {['50 credits on activation', 'Founding Member badge — permanent', '1 month free, then €6.99/month forever'].map((perk) => (
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
    <PageShell intensity="strong" allowDocumentScroll>
      <div
        className="join-page-grid"
        style={{
          '--join-viewport-height': `calc(100dvh - ${NAV_TOP_OFFSET})`,
        } as React.CSSProperties}
      >
        <div className="join-page-inner" style={{ maxWidth: 1080, margin: '0 auto', padding: `${spacing.lg} ${spacing.lg}`, display: 'flex', flexWrap: 'wrap', gap: spacing.xxl, alignItems: 'flex-start', minHeight: 0 }}>
          {/* Left: headline + perks — scrolls on desktop */}
          <div className="join-page-left" style={{ flex: '1 1 320px', minWidth: 0 }}>
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
                    backdropFilter: BLUR.lg,
                    WebkitBackdropFilter: BLUR.lg,
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

          {/* Right: signup form — stays visible (left column scrolls, form doesn't) */}
          <div className="join-page-form" style={{ flex: '0 0 380px', minWidth: 320, maxWidth: '100%' }}>
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
                  <div style={{ marginTop: spacing.sm, fontSize: 20, fontWeight: 600, color: colors.accent.primary }}>
                    €6.99/month · locked for life
                  </div>
                </div>

                {/* Spots counter */}
                <div
                  style={{
                    marginBottom: spacing.xl,
                    padding: `${spacing.sm} ${spacing.md}`,
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
                    {remainingLoading ? (
                      <span style={{ color: colors.text.tertiary }}>Checking spots...</span>
                    ) : remaining !== null ? (
                      <>
                        <span style={{ color: colors.accent.primary, fontWeight: 700 }}>{remaining} spots</span> remaining at founding price
                      </>
                    ) : (
                      <span style={{ color: colors.text.tertiary }}>Limited spots at founding price</span>
                    )}
                  </Typography>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.lg }}>
                    <Input
                      type="text"
                      label="First name"
                      placeholder="Your first name"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      style={{ color: colors.text.primary }}
                    />
                    <Input
                      type="email"
                      label="Email address"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                    No credit card required. 1 month free, then €6.99/month forever — price locked for life.
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
        /* Desktop: fixed-height layout so left column scrolls and form stays on screen */
        @media (min-width: 900px) {
          .join-page-grid {
            height: var(--join-viewport-height, calc(100dvh - 80px));
            min-height: 600px;
            display: flex;
            flex-direction: column;
          }
          .join-page-inner {
            flex: 1;
            min-height: 0;
            overflow: hidden;
            flex-wrap: nowrap !important;
          }
          .join-page-left {
            flex: 1 1 auto !important;
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
          }
          .join-page-form {
            flex: 0 0 380px !important;
          }
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
