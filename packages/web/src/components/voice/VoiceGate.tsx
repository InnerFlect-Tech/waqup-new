'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles } from 'lucide-react';
import { Typography } from '@/components';
import { UserProgressCard } from '@/components/user';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import { withOpacity } from '@waqup/shared/theme';
import type { ProgressStats } from '@waqup/shared/types';
import { UNLOCK_THRESHOLDS } from '@waqup/shared/types';
import { createProgressService } from '@waqup/shared/services';
import { supabase } from '@/lib/supabase';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface VoiceGateProps {
  children: React.ReactNode;
  /** Pre-loaded stats — skip fetching if provided */
  stats?: ProgressStats | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Wraps the Voice (IVC) setup page. If the user has not reached
 * Initiate level (25 XP) it renders a locked overlay.
 */
export function VoiceGate({ children, stats: externalStats }: VoiceGateProps) {
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
    stats.totalXp >= UNLOCK_THRESHOLDS.ivc;

  if (loading) {
    return <GateSkeleton>{children}</GateSkeleton>;
  }

  if (xpUnlocked) {
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

  const xpNeeded = stats
    ? Math.max(0, UNLOCK_THRESHOLDS.ivc - stats.totalXp)
    : UNLOCK_THRESHOLDS.ivc;

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Blurred background */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.12,
          filter: `${BLUR.sm} saturate(0.4)`,
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      {/* Dark gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 90% 60% at 50% 30%, ${colors.background.primary}cc 0%, ${colors.background.primary}f5 55%, ${colors.background.primary} 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Locked overlay content */}
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
          maxWidth: 520,
          margin: '0 auto',
          gap: spacing.xl,
        }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: borderRadius.full,
            background: `linear-gradient(135deg, ${withOpacity(CONTENT_TYPE_COLORS.meditation, 0.15)}, ${withOpacity(CONTENT_TYPE_COLORS.meditation, 0.1)})`,
            border: `1.5px solid ${withOpacity(CONTENT_TYPE_COLORS.meditation, 0.3)}`,
            boxShadow: `0 0 32px ${withOpacity(CONTENT_TYPE_COLORS.meditation, 0.15)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Mic size={30} color={CONTENT_TYPE_COLORS.meditation} />
        </motion.div>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.sm }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: borderRadius.full,
            border: `1px solid ${withOpacity(CONTENT_TYPE_COLORS.meditation, 0.3)}`,
            marginBottom: spacing.xs,
            }}
          >
            <Sparkles size={10} color={CONTENT_TYPE_COLORS.meditation} />
            <span style={{ color: CONTENT_TYPE_COLORS.meditation, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Unlock at Initiate
            </span>
          </span>
          <Typography variant="h2" style={{ fontWeight: 800 }}>
            Voice Cloning
          </Typography>
          <Typography variant="body" color="secondary" style={{ maxWidth: 400, lineHeight: 1.6 }}>
            Practice 5 affirmations or 2–3 meditations to unlock your own cloned voice for personalized content.
          </Typography>
        </div>

        <div style={{ width: '100%' }}>
          <Typography variant="body" color="secondary" style={{ marginBottom: spacing.sm, textAlign: 'center' }}>
            {xpNeeded > 0
              ? `Practice ${xpNeeded} more XP to unlock voice cloning`
              : "You're almost there — keep practising!"}
          </Typography>
          <UserProgressCard mini stats={stats ?? undefined} />
        </div>
      </div>
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
        style={{
          opacity: 0.08,
          filter: BLUR.sm,
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
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
