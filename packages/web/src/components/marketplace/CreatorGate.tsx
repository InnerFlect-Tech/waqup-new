'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Sparkles,
  TrendingUp,
  Coins,
  Users,
  Instagram,
  Send,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { Typography, Button, Card, Badge } from '@/components';
import { UserProgressCard } from '@/components/user';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import type { ProgressStats } from '@waqup/shared/types';
import { LEVEL_THRESHOLDS } from '@waqup/shared/types';
import { createProgressService } from '@waqup/shared/services';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import { supabase } from '@/lib/supabase';
import { useRoleOverrideStore } from '@/stores';
import { useSuperAdmin } from '@/hooks';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProposalFormData {
  name: string;
  email: string;
  contentTypes: string[];
  bio: string;
  instagram: string;
  tiktok: string;
}

const EMPTY_FORM: ProposalFormData = {
  name: '',
  email: '',
  contentTypes: [],
  bio: '',
  instagram: '',
  tiktok: '',
};

const CONTENT_TYPE_OPTIONS = [
  { id: 'affirmation', label: 'Affirmations', color: CONTENT_TYPE_COLORS.affirmation },
  { id: 'meditation', label: 'Meditations', color: CONTENT_TYPE_COLORS.meditation },
  { id: 'ritual', label: 'Rituals', color: CONTENT_TYPE_COLORS.ritual },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CreatorGateProps {
  children: React.ReactNode;
  /** Pre-loaded stats — skip fetching if provided */
  stats?: ProgressStats | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Wraps the Creator Marketplace page. If the user has not reached
 * Practitioner level (150 XP) it renders a locked overlay with a
 * blurred/greyed-out preview of the children content and a
 * proposal submission form.
 */
export function CreatorGate({ children, stats: externalStats }: CreatorGateProps) {
  const viewAsRole = useRoleOverrideStore((s) => s.viewAsRole);
  const { actualIsSuperAdmin } = useSuperAdmin();
  const [stats, setStats] = useState<ProgressStats | null>(externalStats ?? null);
  const [loading, setLoading] = useState(externalStats === undefined);

  useEffect(() => {
    if (externalStats !== undefined) return;

    const progressService = createProgressService(supabase);
    progressService.getProgressStats().then(({ data }) => {
      setStats(data);
      setLoading(false);
    });
  }, [externalStats]);

  const xpUnlocked =
    !loading &&
    stats !== null &&
    stats.totalXp >= LEVEL_THRESHOLDS.practitioner;

  const viewAsCreatorBypass = viewAsRole === 'creator' && actualIsSuperAdmin;
  const isUnlocked = xpUnlocked || viewAsCreatorBypass;

  if (loading && !viewAsCreatorBypass) {
    return <GateSkeleton>{children}</GateSkeleton>;
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return <LockedState stats={stats}>{children}</LockedState>;
}

// ─── Locked state ─────────────────────────────────────────────────────────────

function LockedState({
  stats,
  children,
}: {
  stats: ProgressStats | null;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [formData, setFormData] = useState<ProposalFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const xpNeeded = stats
    ? Math.max(0, LEVEL_THRESHOLDS.practitioner - stats.totalXp)
    : LEVEL_THRESHOLDS.practitioner;

  const toggleContentType = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(id)
        ? prev.contentTypes.filter((t) => t !== id)
        : [...prev.contentTypes, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/marketplace/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* ── Blurred background — actual creator content ─────────────────── */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.12,
          filter: 'blur(3px) saturate(0.4)',
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      {/* ── Dark gradient overlay ────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 90% 60% at 50% 30%, ${colors.background.primary}cc 0%, ${colors.background.primary}f5 55%, ${colors.background.primary} 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Locked overlay content ───────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: `${spacing.xl} ${spacing.lg}`,
          maxWidth: 680,
          margin: '0 auto',
          gap: spacing.xl,
        }}
      >
        {/* Lock icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: borderRadius.full,
            background: 'linear-gradient(135deg, #a78bfa22, #7c3aed22)',
            border: '1.5px solid #a78bfa44',
            boxShadow: '0 0 32px #a78bfa22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lock size={30} color="#a78bfa" />
        </motion.div>

        {/* Heading + badge */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.sm }}>
          <Badge variant="outline" style={{ borderColor: '#a78bfa44', marginBottom: spacing.xs, alignSelf: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={10} color="#a78bfa" />
              <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Available Soon
              </span>
            </span>
          </Badge>
          <Typography variant="h2" style={{ fontWeight: 800 }}>Creator Marketplace</Typography>
          <Typography variant="body" color="secondary" style={{ maxWidth: 480, lineHeight: 1.6 }}>
            Publish your affirmations, meditations, and rituals to the world.
            Earn <strong style={{ color: '#a78bfa' }}>Q credits</strong> every time someone shares your work.
          </Typography>
        </div>

        {/* Feature highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: spacing.md,
            width: '100%',
          }}
        >
          {[
            { icon: <TrendingUp size={18} />, color: '#34d399', title: 'Reach thousands', body: 'Your content surfaces in the discovery feed to all users' },
            { icon: <Coins size={18} />, color: '#f59e0b', title: 'Earn Q credits', body: '+1 Q every time someone shares your content' },
            { icon: <Users size={18} />, color: '#60a5fa', title: 'Build an audience', body: 'Track plays, shares, and followers per creation' },
          ].map(({ icon, color, title, body }) => (
            <div
              key={title}
              style={{
                borderRadius: borderRadius.lg,
                background: colors.glass.light,
                backdropFilter: BLUR.md,
                WebkitBackdropFilter: BLUR.md,
                border: `1px solid ${colors.border.light}`,
                padding: spacing.md,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xs,
              }}
            >
              <div style={{ color, marginBottom: 2 }}>{icon}</div>
              <Typography variant="bodyBold" style={{ fontWeight: 700 }}>{title}</Typography>
              <Typography variant="small" color="secondary">{body}</Typography>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div style={{ width: '100%' }}>
          <Typography variant="body" color="secondary" style={{ marginBottom: spacing.sm, textAlign: 'center' }}>
            {xpNeeded > 0
              ? `Practice ${xpNeeded} more XP to unlock the Creator Marketplace`
              : 'You\'re almost there — keep practising!'}
          </Typography>
          <UserProgressCard mini stats={stats ?? undefined} />
        </div>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
          }}
        >
          <div style={{ flex: 1, height: 1, background: colors.border.light }} />
          <Typography variant="small" color="tertiary">or apply early</Typography>
          <div style={{ flex: 1, height: 1, background: colors.border.light }} />
        </div>

        {/* Proposal form */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                width: '100%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.md,
                padding: `${spacing.xl} ${spacing.lg}`,
                borderRadius: borderRadius.xl,
                background: 'linear-gradient(135deg, #10b98115, #10b98108)',
                border: '1px solid #10b98130',
              }}
            >
              <CheckCircle2 size={36} color="#10b981" />
              <Typography variant="h4" style={{ fontWeight: 700 }}>Proposal submitted</Typography>
              <Typography variant="body" color="secondary">
                We&apos;ll be in touch when the Creator Marketplace opens.
                Keep practising to unlock early access.
              </Typography>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
              <ProposalForm
                formData={formData}
                setFormData={setFormData}
                submitting={submitting}
                error={error}
                onSubmit={handleSubmit}
                toggleContentType={toggleContentType}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Proposal form ─────────────────────────────────────────────────────────────

interface ProposalFormProps {
  formData: ProposalFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProposalFormData>>;
  submitting: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  toggleContentType: (id: string) => void;
}

function ProposalForm({
  formData,
  setFormData,
  submitting,
  error,
  onSubmit,
  toggleContentType,
}: ProposalFormProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    minHeight: 44,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.md,
    background: colors.glass.light,
    backdropFilter: BLUR.md,
    WebkitBackdropFilter: BLUR.md,
    border: `1px solid ${colors.border.light}`,
    color: colors.text.primary,
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <Card
      style={{
        padding: spacing.xl,
        background: `${colors.glass.light}`,
      }}
    >
      <div style={{ marginBottom: spacing.lg }}>
        <Typography variant="h4" style={{ fontWeight: 700 }}>
          Submit a creator proposal
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginTop: spacing.xs }}>
          Tell us about the content you&apos;d create. We&apos;ll reach out with early access.
        </Typography>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {/* Name + Email row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
          <Field label="Full name *">
            <input
              style={inputStyle}
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </Field>
          <Field label="Email *">
            <input
              style={inputStyle}
              type="email"
              placeholder="you@email.com"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </Field>
        </div>

        {/* Content types */}
        <Field label="What would you create?">
          <div style={{ display: 'flex', gap: spacing.sm }}>
            {CONTENT_TYPE_OPTIONS.map(({ id, label, color }) => {
              const active = formData.contentTypes.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleContentType(id)}
                  style={{
                    flex: 1,
                    padding: spacing.sm,
                    borderRadius: borderRadius.md,
                    border: `1.5px solid ${active ? color : colors.border.light}`,
                    background: active ? `${color}18` : colors.glass.transparent,
                    color: active ? color : colors.text.secondary,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    fontFamily: 'inherit',
                  }}
                >
                  {active && <CheckCircle2 size={12} />}
                  {label}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Bio */}
        <Field label="Why do you want to create? (280 chars)">
          <textarea
            style={{
              ...inputStyle,
              minHeight: 80,
              resize: 'vertical',
            }}
            placeholder="Tell us about your background, your mission, the transformation you want to create…"
            maxLength={280}
            value={formData.bio}
            onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
          />
          <Typography variant="small" color="tertiary" style={{ marginTop: spacing.xs, textAlign: 'right' }}>
            {formData.bio.length} / 280
          </Typography>
        </Field>

        {/* Social handles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
          <Field label="Instagram (optional)">
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle, paddingLeft: 36 }}
                placeholder="@handle"
                value={formData.instagram}
                onChange={(e) => setFormData((p) => ({ ...p, instagram: e.target.value }))}
              />
              <Instagram
                size={15}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.text.tertiary }}
              />
            </div>
          </Field>
          <Field label="TikTok (optional)">
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle, paddingLeft: 36 }}
                placeholder="@handle"
                value={formData.tiktok}
                onChange={(e) => setFormData((p) => ({ ...p, tiktok: e.target.value }))}
              />
              {/* TikTok doesn't have a lucide icon — use a styled placeholder */}
              <span
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 13,
                  fontWeight: 800,
                  color: colors.text.tertiary,
                  lineHeight: 1,
                  fontFamily: 'inherit',
                }}
              >
                T
              </span>
            </div>
          </Field>
        </div>

        {error && (
          <Typography variant="small" style={{ color: colors.error }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          loading={submitting}
          disabled={!formData.name.trim() || !formData.email.trim() || submitting}
          style={{ marginTop: spacing.xs }}
        >
          <Send size={16} />
          Submit proposal
        </Button>
      </form>
    </Card>
  );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
      <Typography
        variant="small"
        color="secondary"
        style={{ fontWeight: 600, marginBottom: 2 }}
      >
        {label}
      </Typography>
      {children}
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function GateSkeleton({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div
        aria-hidden="true"
        style={{ opacity: 0.08, filter: 'blur(4px)', position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        {children}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `${colors.background.primary}e0`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: borderRadius.full,
            background: colors.glass.light,
            animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
          }}
        />
      </div>
    </div>
  );
}
