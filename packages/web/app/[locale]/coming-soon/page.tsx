'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { PageShell } from '@/components';
import { WaitlistCTA } from '@/components/shared/WaitlistCTA';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';
import { useSuperAdmin } from '@/hooks';
import { Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type WaitlistStatus = 'pending' | 'approved' | 'rejected' | null;

// ── Status badge ──────────────────────────────────────────────────────────────

function WaitlistStatusBadge({ status }: { status: WaitlistStatus }) {
  if (!status) return null;

  const map = {
    pending: { bg: 'rgba(250,204,21,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.25)', icon: Clock, label: "You're on the waitlist — we'll notify you when your access is approved." },
    approved: { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)', icon: CheckCircle, label: "You've been approved! Refresh or click below to enter." },
    rejected: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)', icon: Clock, label: "We're not able to offer you access at this time." },
  };

  const s = map[status];
  const Icon = s.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '16px 20px',
        borderRadius: borderRadius.lg,
        background: s.bg,
        border: `1px solid ${s.border}`,
        marginBottom: spacing.xl,
      }}
    >
      <Icon size={18} color={s.color} style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ margin: 0, fontSize: 14, color: s.color, lineHeight: 1.55 }}>
        {s.label}
      </p>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ComingSoonPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { user } = useAuthStore();
  const { hasAccess, isLoading: profileLoading } = useSuperAdmin();

  const [waitlistStatus, setWaitlistStatus] = useState<WaitlistStatus>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // If user already has access, send them straight in.
  useEffect(() => {
    if (!profileLoading && hasAccess) {
      router.replace('/sanctuary');
    }
  }, [hasAccess, profileLoading, router]);

  // Check if the logged-in user is on the waitlist and what their status is.
  useEffect(() => {
    if (!user?.email) return;
    setStatusLoading(true);
    void Promise.resolve(
      supabase
        .from('waitlist_signups')
        .select('status')
        .eq('email', user.email)
        .maybeSingle()
    )
      .then(({ data }) => {
        setWaitlistStatus((data?.status as WaitlistStatus) ?? null);
        setStatusLoading(false);
      })
      .catch(() => setStatusLoading(false));
  }, [user?.email]);

  return (
    <PageShell intensity="high" bare allowDocumentScroll>
      {/* Hero — centered on page */}
      <div
        style={{
          width: '100%',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${spacing.xxxl} ${spacing.lg}`,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 640,
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 999,
            background: `${colors.accent.primary}15`,
            border: `1px solid ${colors.accent.primary}30`,
            marginBottom: 36,
          }}
        >
          <Sparkles size={13} color={colors.accent.primary} />
          <span style={{ fontSize: 11, color: colors.accent.primary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Early Access
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-2px',
            color: colors.text.primary,
            margin: '0 0 20px',
          }}
        >
          waQup is launching soon.<br />
          <span style={{ background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Voice-first transformation.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          style={{
            fontSize: 18,
            color: colors.text.secondary,
            lineHeight: 1.65,
            margin: '0 0 40px',
            fontWeight: 300,
          }}
        >
          waQup is launching soon. Join the waitlist to get notified, shape the product with your input, and be among the first to experience voice-first transformation.
        </motion.p>

        {/* Waitlist status (for logged-in users already on the list) */}
        {!statusLoading && <WaitlistStatusBadge status={waitlistStatus} />}

        {/* CTA — quick join or full form link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          style={{ width: '100%' }}
        >
          {waitlistStatus ? (
            /* Already on waitlist — offer full form link for more detail */
            <Link
              href="/waitlist"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: borderRadius.lg,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: colors.text.secondary,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              Update your preferences
              <ArrowRight size={14} />
            </Link>
          ) : (
            /* Not yet on waitlist — show quick email capture */
            <WaitlistCTA variant="inline" />
          )}
        </motion.div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', margin: `${spacing.xxxl} 0` }} />

        {/* Secondary links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href="/how-it-works" style={{ fontSize: 13, color: colors.text.tertiary, textDecoration: 'none' }}>
            How it works
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
          {!user && (
            <>
              <Link href="/login" style={{ fontSize: 13, color: colors.text.tertiary, textDecoration: 'none' }}>
                Already have access? Sign in
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
            </>
          )}
          <Link href="/launch" style={{ fontSize: 13, color: colors.text.tertiary, textDecoration: 'none' }}>
            Learn more about waQup
          </Link>
        </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes wqPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
      `}</style>
    </PageShell>
  );
}
