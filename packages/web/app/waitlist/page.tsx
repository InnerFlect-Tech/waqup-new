'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { Logo, PageShell, GlassCard } from '@/components';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Mic,
  RefreshCw,
  Users,
  DollarSign,
  Gift,
  FlaskConical,
  BookOpen,
  Smile,
  Check,
  ChevronDown,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Intention {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const INTENTIONS: Intention[] = [
  { id: 'create', label: 'Create', description: 'Build personalised audio experiences', icon: Mic },
  { id: 'practice', label: 'Practice', description: 'Establish a daily mindfulness routine', icon: RefreshCw },
  { id: 'share', label: 'Share', description: 'Share sessions with family or a community', icon: Users },
  { id: 'monetise', label: 'Monetise', description: 'Build a business around waQup content', icon: DollarSign },
  { id: 'gift', label: 'Gift', description: 'Create something meaningful for a loved one', icon: Gift },
  { id: 'research', label: 'Research', description: 'Explore AI + neuroscience tools', icon: FlaskConical },
  { id: 'reflect', label: 'Reflect', description: 'Use for journaling and deep self-inquiry', icon: BookOpen },
  { id: 'curious', label: 'Just Curious', description: 'See what this is about', icon: Smile },
];

const REFERRAL_OPTIONS = [
  'Social Media',
  'Friend or Family',
  'Newsletter',
  'Podcast',
  'Search',
  'Other',
];

// ── Step indicator ─────────────────────────────────────────────────────────────

function StepDots({ current, total, colors }: { current: number; total: number; colors: ReturnType<typeof useTheme>['theme']['colors'] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: spacing.xl }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 999,
            background: i === current
              ? 'linear-gradient(90deg, #9333EA, #6366F1)'
              : i < current
                ? 'rgba(147, 51, 234, 0.5)'
                : 'rgba(255,255,255,0.12)',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

// ── Intention card ─────────────────────────────────────────────────────────────

function IntentionCard({
  intention,
  selected,
  onToggle,
  colors,
}: {
  intention: Intention;
  selected: boolean;
  onToggle: () => void;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
}) {
  const Icon = intention.icon;
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        padding: '16px',
        borderRadius: borderRadius.lg,
        background: selected ? 'rgba(147,51,234,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${selected ? 'rgba(147,51,234,0.6)' : 'rgba(255,255,255,0.08)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        position: 'relative',
        outline: 'none',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: selected ? 'rgba(147,51,234,0.3)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${selected ? 'rgba(147,51,234,0.5)' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={16} color={selected ? '#A855F7' : 'rgba(255,255,255,0.5)'} />
        </div>
        {selected && (
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #9333EA, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={12} color="#fff" />
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: selected ? '#fff' : 'rgba(255,255,255,0.8)', lineHeight: 1.2, marginBottom: 3 }}>
          {intention.label}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
          {intention.description}
        </div>
      </div>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WaitlistPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Step 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Step 2
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>([]);

  // Step 3
  const [isBetaTester, setIsBetaTester] = useState(false);
  const [referralSource, setReferralSource] = useState('');
  const [message, setMessage] = useState('');
  const [referralOpen, setReferralOpen] = useState(false);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill email from query param (e.g. from WaitlistCTA)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const e = params.get('email');
      if (e) setEmail(e);
    }
  }, []);

  const toggleIntention = (id: string) => {
    setSelectedIntentions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const goNext = () => {
    setError('');
    if (step === 0) {
      if (!name.trim()) { setError('Please enter your name.'); return; }
      if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email.'); return; }
    }
    if (step === 1 && selectedIntentions.length === 0) {
      setError('Please select at least one intention.'); return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setError('');
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          intentions: selectedIntentions,
          is_beta_tester: isBetaTester,
          referral_source: referralSource || null,
          message: message.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <PageShell intensity="medium" maxWidth={560} centered>
      <div style={{ width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size="lg" showIcon={false} href={undefined} />
          </Link>
          <Typography
            variant="body"
            style={{ color: colors.text.secondary, fontSize: '16px', marginTop: spacing.sm }}
          >
            {submitted ? 'Welcome to the family' : 'Reserve your spot'}
          </Typography>
        </div>

        <GlassCard variant="auth">
          {submitted ? (
            // ── Success ─────────────────────────────────────────────────────
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: 'center' }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(147,51,234,0.25), rgba(99,102,241,0.25))',
                  border: '1px solid rgba(147,51,234,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  marginBottom: spacing.xl,
                }}
              >
                <Sparkles size={36} color="#A855F7" />
              </div>
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                You&apos;re on the list
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, lineHeight: 1.6 }}>
                We&apos;ll reach out when your access is ready.{' '}
                {isBetaTester && 'Beta testers get first access — we\'ll be in touch soon.'}
              </Typography>
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: borderRadius.md,
                  background: 'rgba(147,51,234,0.08)',
                  border: '1px solid rgba(147,51,234,0.2)',
                  marginBottom: spacing.xl,
                }}
              >
                <Typography variant="small" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                  Reserved for
                </Typography>
                <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500 }}>
                  {email}
                </Typography>
              </div>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Button variant="outline" fullWidth>
                  Back to home
                </Button>
              </Link>
            </motion.div>
          ) : (
            // ── Form steps ───────────────────────────────────────────────────
            <div>
              <StepDots current={step} total={3} colors={colors} />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  {/* ── Step 0: Name + Email ─────────────────────────────── */}
                  {step === 0 && (
                    <div>
                      <Typography
                        variant="h2"
                        style={{ color: colors.text.primary, marginBottom: spacing.sm, textAlign: 'center' }}
                      >
                        Join the waitlist
                      </Typography>
                      <Typography
                        variant="body"
                        style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 1.6 }}
                      >
                        waQup is a voice-first AI studio for creating personalised audio that rewires how you think, feel, and act.
                      </Typography>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                        <Input
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          autoComplete="name"
                          style={{ width: '100%' }}
                        />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── Step 1: Intentions ───────────────────────────────── */}
                  {step === 1 && (
                    <div>
                      <Typography
                        variant="h2"
                        style={{ color: colors.text.primary, marginBottom: spacing.sm, textAlign: 'center' }}
                      >
                        How will you use it?
                      </Typography>
                      <Typography
                        variant="body"
                        style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 1.6 }}
                      >
                        Select everything that resonates. This helps us personalise your experience.
                      </Typography>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: spacing.sm,
                          marginBottom: spacing.md,
                        }}
                      >
                        {INTENTIONS.map((intention) => (
                          <IntentionCard
                            key={intention.id}
                            intention={intention}
                            selected={selectedIntentions.includes(intention.id)}
                            onToggle={() => toggleIntention(intention.id)}
                            colors={colors}
                          />
                        ))}
                      </div>
                      {selectedIntentions.length > 0 && (
                        <Typography
                          variant="small"
                          style={{ color: 'rgba(147,51,234,0.8)', textAlign: 'center' }}
                        >
                          {selectedIntentions.length} selected
                        </Typography>
                      )}
                    </div>
                  )}

                  {/* ── Step 2: Beta + referral ──────────────────────────── */}
                  {step === 2 && (
                    <form onSubmit={handleSubmit}>
                      <Typography
                        variant="h2"
                        style={{ color: colors.text.primary, marginBottom: spacing.sm, textAlign: 'center' }}
                      >
                        A few more things
                      </Typography>
                      <Typography
                        variant="body"
                        style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 1.6 }}
                      >
                        Help us understand how to serve you best.
                      </Typography>

                      {/* Beta tester toggle */}
                      <button
                        type="button"
                        onClick={() => setIsBetaTester((v) => !v)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 14,
                          width: '100%',
                          padding: '16px',
                          borderRadius: borderRadius.lg,
                          background: isBetaTester ? 'rgba(147,51,234,0.12)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isBetaTester ? 'rgba(147,51,234,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          cursor: 'pointer',
                          textAlign: 'left',
                          marginBottom: spacing.lg,
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            background: isBetaTester ? 'linear-gradient(135deg, #9333EA, #6366F1)' : 'rgba(255,255,255,0.06)',
                            border: `1px solid ${isBetaTester ? 'transparent' : 'rgba(255,255,255,0.15)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 1,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {isBetaTester && <Check size={13} color="#fff" />}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: colors.text.primary, marginBottom: 3 }}>
                            I want to be a beta tester
                          </div>
                          <div style={{ fontSize: 12, color: colors.text.secondary, lineHeight: 1.5 }}>
                            Get early access before public launch. You&apos;ll receive hands-on sessions and help shape the product.
                          </div>
                        </div>
                      </button>

                      {/* Referral source */}
                      <div style={{ marginBottom: spacing.lg, position: 'relative' }}>
                        <Typography
                          variant="small"
                          style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}
                        >
                          How did you hear about waQup?
                        </Typography>
                        <button
                          type="button"
                          onClick={() => setReferralOpen((v) => !v)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: borderRadius.md,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            color: referralSource ? colors.text.primary : colors.text.secondary,
                            fontSize: 14,
                            outline: 'none',
                          }}
                        >
                          <span>{referralSource || 'Select an option'}</span>
                          <ChevronDown
                            size={16}
                            color="rgba(255,255,255,0.4)"
                            style={{ transform: referralOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                          />
                        </button>
                        {referralOpen && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              marginTop: 4,
                              background: '#1a1a1a',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: borderRadius.md,
                              overflow: 'hidden',
                              zIndex: 10,
                            }}
                          >
                            {REFERRAL_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => { setReferralSource(opt); setReferralOpen(false); }}
                                style={{
                                  width: '100%',
                                  padding: '11px 16px',
                                  background: referralSource === opt ? 'rgba(147,51,234,0.15)' : 'transparent',
                                  border: 'none',
                                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                                  cursor: 'pointer',
                                  color: referralSource === opt ? '#A855F7' : 'rgba(255,255,255,0.7)',
                                  fontSize: 14,
                                  textAlign: 'left',
                                  transition: 'background 0.15s',
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Optional message */}
                      <div style={{ marginBottom: spacing.xl }}>
                        <Typography
                          variant="small"
                          style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}
                        >
                          Anything else you&apos;d like us to know? <span style={{ color: 'rgba(255,255,255,0.25)' }}>(optional)</span>
                        </Typography>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Share your vision, use case, or just say hi..."
                          maxLength={1000}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: borderRadius.md,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: colors.text.primary,
                            fontSize: 14,
                            lineHeight: 1.6,
                            resize: 'none',
                            outline: 'none',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      {error && (
                        <Typography
                          variant="small"
                          style={{ color: '#ef4444', marginBottom: spacing.lg, textAlign: 'center', display: 'block' }}
                        >
                          {error}
                        </Typography>
                      )}

                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="lg"
                        disabled={submitting}
                      >
                        {submitting ? 'Reserving your spot…' : 'Reserve my spot'}
                      </Button>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Error (steps 0 & 1) */}
              {step < 2 && error && (
                <Typography
                  variant="small"
                  style={{ color: '#ef4444', marginTop: spacing.md, textAlign: 'center', display: 'block' }}
                >
                  {error}
                </Typography>
              )}

              {/* Navigation (steps 0 & 1) */}
              {step < 2 && (
                <div
                  style={{
                    display: 'flex',
                    gap: spacing.sm,
                    marginTop: spacing.xl,
                    alignItems: 'center',
                  }}
                >
                  {step > 0 && (
                    <Button
                      variant="ghost"
                      onClick={goBack}
                      style={{ flexShrink: 0 }}
                    >
                      <ArrowLeft size={16} />
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={goNext}
                  >
                    {step === 0 ? (
                      <>Continue <ArrowRight size={16} style={{ marginLeft: 6 }} /></>
                    ) : (
                      <>Next <ArrowRight size={16} style={{ marginLeft: 6 }} /></>
                    )}
                  </Button>
                </div>
              )}

              {/* Back button for step 2 */}
              {step === 2 && (
                <button
                  type="button"
                  onClick={goBack}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: spacing.lg,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: 13,
                    padding: 0,
                    margin: `${spacing.lg}px auto 0`,
                  }}
                >
                  <ArrowLeft size={13} />
                  Back
                </button>
              )}
            </div>
          )}
        </GlassCard>

        {/* Footer hint */}
        {!submitted && (
          <div style={{ textAlign: 'center', marginTop: spacing.xl }}>
            <Typography variant="small" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Already have access?{' '}
              <Link href="/login" style={{ color: 'rgba(147,51,234,0.7)', textDecoration: 'none' }}>
                Sign in
              </Link>
            </Typography>
          </div>
        )}
      </div>
    </PageShell>
  );
}
