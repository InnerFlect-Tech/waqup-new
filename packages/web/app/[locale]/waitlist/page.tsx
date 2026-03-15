'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button, Input } from '@/components';
import { useTheme } from '@/theme';
import { Logo, PageShell, GlassCard } from '@/components';
import { spacing, borderRadius, PAGE_TOP_PADDING, PAGE_PADDING } from '@/theme';
import { Link } from '@/i18n/navigation';
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
import { Analytics } from '@waqup/shared/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Intention {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

// ── Data (ids only — labels/descriptions from i18n) ─────────────────────────────

const INTENTION_IDS: { id: string; icon: typeof Mic }[] = [
  { id: 'create', icon: Mic },
  { id: 'practice', icon: RefreshCw },
  { id: 'share', icon: Users },
  { id: 'monetise', icon: DollarSign },
  { id: 'gift', icon: Gift },
  { id: 'research', icon: FlaskConical },
  { id: 'reflect', icon: BookOpen },
  { id: 'curious', icon: Smile },
];

const REFERRAL_OPTION_KEYS = ['socialMedia', 'friendFamily', 'newsletter', 'podcast', 'search', 'other'] as const;

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
              ? colors.gradients.primary
              : i < current
                ? `${colors.accent.primary}80`
                : `${colors.text.primary}1f`,
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
        background: selected ? `${colors.accent.primary}26` : colors.glass.light,
        border: `1px solid ${selected ? `${colors.accent.primary}99` : colors.glass.border}`,
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
            background: selected ? `${colors.accent.primary}4d` : colors.glass.dark,
            border: `1px solid ${selected ? `${colors.accent.primary}80` : colors.glass.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={16} color={selected ? colors.accent.primary : colors.text.secondary} />
        </div>
        {selected && (
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: colors.gradients.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={12} color={colors.text.onDark} />
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: selected ? colors.text.primary : colors.text.secondary, lineHeight: 1.2, marginBottom: 3 }}>
          {intention.label}
        </div>
        <div style={{ fontSize: 11, color: colors.text.tertiary, lineHeight: 1.4 }}>
          {intention.description}
        </div>
      </div>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WaitlistPage() {
  const t = useTranslations('marketing.waitlist');
  const { theme } = useTheme();
  const colors = theme.colors;

  const intentions: Intention[] = INTENTION_IDS.map(({ id, icon }) => ({
    id,
    icon,
    label: t(`intentions.${id}.label`),
    description: t(`intentions.${id}.description`),
  }));

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Step 1
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      if (!firstName.trim()) { setError(t('errors.firstNameRequired')); return; }
      if (!lastName.trim()) { setError(t('errors.lastNameRequired')); return; }
      if (!email.trim() || !email.includes('@')) { setError(t('errors.emailInvalid')); return; }
    }
    if (step === 1 && selectedIntentions.length === 0) {
      setError(t('errors.intentionRequired')); return;
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
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email: email.trim().toLowerCase(),
          intentions: selectedIntentions,
          is_beta_tester: isBetaTester,
          referral_source: referralSource || null,
          message: message.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t('errors.generic'));
        return;
      }
      Analytics.waitlistJoined();
      setSubmitted(true);
    } catch {
      setError(t('errors.networkError'));
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
    <PageShell intensity="medium" maxWidth={560} centered allowDocumentScroll bare>
      <div style={{ position: 'relative', width: '100%', minHeight: '100dvh', padding: `${PAGE_TOP_PADDING} ${PAGE_PADDING} ${spacing.xl}` }}>
        {/* Full viewport background — fixed to avoid dark side bars */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Image
            src="/images/waitlist-bg.png"
            alt=""
            fill
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,2,20,0.75)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xxxl }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size="lg" showIcon={false} href={undefined} />
          </Link>
          <Typography
            variant="body"
            style={{ color: colors.text.secondary, fontSize: '16px', marginTop: spacing.sm }}
          >
            {submitted ? t('page.welcomeFamily') : t('page.reserveSpot')}
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
                  background: `linear-gradient(135deg, ${colors.accent.primary}40, ${colors.accent.secondary}40)`,
                  border: `1px solid ${colors.accent.primary}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  marginBottom: spacing.xl,
                }}
              >
                <Sparkles size={36} color={colors.accent.primary} />
              </div>
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                {t('page.onTheList')}
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, lineHeight: 1.6 }}>
                {t('page.reachOut')}{' '}
                {isBetaTester && t('page.betaFirstAccess')}
              </Typography>
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: borderRadius.md,
                  background: `${colors.accent.primary}14`,
                  border: `1px solid ${colors.accent.primary}33`,
                  marginBottom: spacing.xl,
                }}
              >
                <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: 4 }}>
                  {t('page.reservedFor')}
                </Typography>
                <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500 }}>
                  {email}
                </Typography>
              </div>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Button variant="outline" fullWidth>
                  {t('page.backToHome')}
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
                        {t('page.joinTitle')}
                      </Typography>
                      <Typography
                        variant="body"
                        style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 1.6 }}
                      >
                        {t('page.subtitle')}
                      </Typography>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                        <Input
                          placeholder={t('firstNamePlaceholder')}
                          value={firstName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                          autoComplete="given-name"
                          style={{ width: '100%' }}
                        />
                        <Input
                          placeholder={t('lastNamePlaceholder')}
                          value={lastName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                          autoComplete="family-name"
                          style={{ width: '100%' }}
                        />
                        <Input
                          type="email"
                          placeholder={t('emailPlaceholder')}
                          value={email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                        {t('page.howWillYouUse')}
                      </Typography>
                      <Typography
                        variant="body"
                        style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 1.6 }}
                      >
                        {t('page.selectResonates')}
                      </Typography>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: spacing.sm,
                          marginBottom: spacing.md,
                        }}
                      >
                        {intentions.map((intention) => (
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
                          style={{ color: colors.accent.primary, textAlign: 'center' }}
                        >
                          {t('page.selectedCount', { count: selectedIntentions.length })}
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
                        {t('page.fewMoreThings')}
                      </Typography>
                      <Typography
                        variant="body"
                        style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 1.6 }}
                      >
                        {t('page.helpUsUnderstand')}
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
                          background: isBetaTester ? `${colors.accent.primary}1f` : colors.glass.light,
                          border: `1px solid ${isBetaTester ? `${colors.accent.primary}80` : colors.glass.border}`,
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
                            background: isBetaTester ? colors.gradients.primary : colors.glass.dark,
                            border: `1px solid ${isBetaTester ? 'transparent' : colors.glass.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 1,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {isBetaTester && <Check size={13} color={colors.text.onDark} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: colors.text.primary, marginBottom: 3 }}>
                            {t('page.betaTester')}
                          </div>
                          <div style={{ fontSize: 12, color: colors.text.secondary, lineHeight: 1.5 }}>
                            {t('page.betaTesterDesc')}
                          </div>
                        </div>
                      </button>

                      {/* Referral source */}
                      <div style={{ marginBottom: spacing.lg, position: 'relative' }}>
                        <Typography
                          variant="small"
                          style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}
                        >
                          {t('page.howDidYouHear')}
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
                          <span>{referralSource || t('page.selectOption')}</span>
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
                            {REFERRAL_OPTION_KEYS.map((key) => {
                            const opt = t(`referralOptions.${key}`);
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => { setReferralSource(opt); setReferralOpen(false); }}
                                style={{
                                  width: '100%',
                                  padding: '11px 16px',
                                  background: referralSource === opt ? `${colors.accent.primary}26` : 'transparent',
                                  border: 'none',
                                  borderBottom: `1px solid ${colors.glass.border}`,
                                  cursor: 'pointer',
                                  color: referralSource === opt ? colors.accent.primary : colors.text.secondary,
                                  fontSize: 14,
                                  textAlign: 'left',
                                  transition: 'background 0.15s',
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                          </div>
                        )}
                      </div>

                      {/* Optional message */}
                      <div style={{ marginBottom: spacing.xl }}>
                        <Typography
                          variant="small"
                          style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}
                        >
                          {t('page.anythingElse')} <span style={{ color: 'rgba(255,255,255,0.25)' }}>{t('page.optional')}</span>
                        </Typography>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={t('page.messagePlaceholder')}
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
                          style={{ color: colors.error, marginBottom: spacing.lg, textAlign: 'center', display: 'block' }}
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
                        {submitting ? t('page.reservingSpot') : t('page.reserveMySpot')}
                      </Button>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Error (steps 0 & 1) */}
              {step < 2 && error && (
                <Typography
                  variant="small"
                  style={{ color: colors.error, marginTop: spacing.md, textAlign: 'center', display: 'block' }}
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
                      <>{t('page.continue')} <ArrowRight size={16} style={{ marginLeft: 6 }} /></>
                    ) : (
                      <>{t('page.next')} <ArrowRight size={16} style={{ marginLeft: 6 }} /></>
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
                    color: colors.text.tertiary,
                    fontSize: 13,
                    padding: 0,
                    margin: `${spacing.lg} auto 0`,
                  }}
                >
                  <ArrowLeft size={13} />
                  {t('page.back')}
                </button>
              )}
            </div>
          )}
        </GlassCard>

        {/* Footer hint */}
        {!submitted && (
          <div style={{ textAlign: 'center', marginTop: spacing.xl }}>
            <Typography variant="small" style={{ color: colors.text.tertiary }}>
              {t('page.alreadyHaveAccess')}{' '}
              <Link href="/login" style={{ color: colors.accent.primary, textDecoration: 'none' }}>
                {t('page.signIn')}
              </Link>
            </Typography>
          </div>
        )}
        </div>
      </div>
    </PageShell>
  );
}
