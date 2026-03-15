'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { spacing, borderRadius, BLUR } from '@/theme';
import { useAuthStore } from '@/stores';
import { useContent, useReminders } from '@/hooks';
import { getProgressStats } from '@/lib/api-client';
import { Analytics } from '@waqup/shared/utils';
import { getContentDetailHref } from '@/components/content';
import { getContentTypeIcon } from '@/lib';
import {
  Library,
  Flame,
  ChevronRight,
  BookOpen,
  Plus,
  Play,
  Settings,
  Mic,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  ELEVATED_BADGE_COLOR_SECONDARY,
  getContentTypeColor,
  CONTENT_TYPE_COLORS,
  CONTENT_TYPE_COPY,
} from '@waqup/shared/constants';
import { toDisplayTitle } from '@waqup/shared/utils';
import { AudioWaveform } from '@/components/audio';
import type { UserReminder } from '@waqup/shared/types';
import type { ContentItemType } from '@waqup/shared/types';

const STREAK_COLOR = ELEVATED_BADGE_COLOR_SECONDARY;
const LIBRARY_COLOR = getContentTypeColor('affirmation');

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Time-of-day greeting key for contextual intelligence */
function getGreetingKey(): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' | 'greetingNight' {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'greetingMorning';
  if (h >= 12 && h < 17) return 'greetingAfternoon';
  if (h >= 17 && h < 21) return 'greetingEvening';
  return 'greetingNight';
}

/** Prefix-only key for greeting (phrase before name) — enables gradient name treatment */
function getGreetingPrefixKey(): 'greetingMorningPrefix' | 'greetingAfternoonPrefix' | 'greetingEveningPrefix' | 'greetingNightPrefix' {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'greetingMorningPrefix';
  if (h >= 12 && h < 17) return 'greetingAfternoonPrefix';
  if (h >= 17 && h < 21) return 'greetingEveningPrefix';
  return 'greetingNightPrefix';
}

/** Contextual "best for" label for featured track */
function getBestForKey(): 'bestForMorning' | 'bestForEvening' | 'bestForTonight' | null {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'bestForMorning';
  if (h >= 17 && h < 22) return 'bestForEvening';
  if (h >= 22 || h < 5) return 'bestForTonight';
  return null;
}

function formatTimeForDisplay(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  if (h === 0) return `12:${String(m).padStart(2, '0')} AM`;
  if (h === 12) return `12:${String(m).padStart(2, '0')} PM`;
  if (h < 12) return `${h}:${String(m).padStart(2, '0')} AM`;
  return `${h - 12}:${String(m).padStart(2, '0')} PM`;
}

function computeNextReminder(
  reminders: UserReminder[],
  t: (key: string, values?: Record<string, string | number>) => string
): { label: string; href: string } | null {
  const enabled = reminders.filter((r) => r.enabled && r.daysOfWeek.length > 0);
  if (enabled.length === 0) return null;

  const now = new Date();
  const nowDay = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const minsPerDay = 24 * 60;

  let soonest: { dayOffset: number; time: string; dayName: string } | null = null;
  let soonestMinutesFromNow = Infinity;

  for (const r of enabled) {
    const [h, m] = r.time.split(':').map(Number);
    const reminderMinutes = h * 60 + m;

    for (let offset = 0; offset < 8; offset++) {
      const checkDay = (nowDay + offset) % 7;
      if (!r.daysOfWeek.includes(checkDay)) continue;

      const isToday = offset === 0;
      if (isToday && nowMinutes >= reminderMinutes) continue;

      const minutesFromNow =
        offset === 0
          ? reminderMinutes - nowMinutes
          : (minsPerDay - nowMinutes) + (offset - 1) * minsPerDay + reminderMinutes;

      if (minutesFromNow < soonestMinutesFromNow) {
        soonestMinutesFromNow = minutesFromNow;
        soonest = {
          dayOffset: offset,
          time: r.time,
          dayName: DAY_NAMES[checkDay],
        };
      }
      break;
    }
  }

  if (!soonest) return null;

  const displayTime = formatTimeForDisplay(soonest.time);
  let label: string;
  if (soonest.dayOffset === 0) {
    label = t('todayAt', { time: displayTime });
  } else if (soonest.dayOffset === 1) {
    label = t('tomorrowAt', { time: displayTime });
  } else {
    label = t('dayAt', { day: soonest.dayName, time: displayTime });
  }
  return { label, href: '/sanctuary/reminders' };
}

export default function SanctuaryHomePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuthStore();
  const t = useTranslations('sanctuary.home');
  const searchParams = useSearchParams();
  const { items: libraryItems } = useContent();
  const { reminders } = useReminders();

  const [progressData, setProgressData] = useState<{
    streak: number;
    recentSessions: { contentType: string; title: string | null; durationSeconds: number; playedAt: string }[];
  } | null>(null);
  const [progressError, setProgressError] = useState(false);

  const fetchProgress = useCallback(() => {
    let cancelled = false;
    setProgressError(false);
    getProgressStats()
      .then((res) => {
        if (cancelled) return;
        if (res) {
          setProgressData({
            streak: res.stats?.streak ?? 0,
            recentSessions: res.recentSessions ?? [],
          });
        } else {
          setProgressError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setProgressError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (searchParams.get('checkout') !== 'success') return;
    if (!user?.id) return;
    const planId = searchParams.get('plan') ?? 'unknown';
    Analytics.subscriptionStarted(planId, 0, 'USD', user.id);
    Analytics.funnelPaidConversion('subscription', 0, user.id);
  }, [searchParams, user?.id]);

  useEffect(() => fetchProgress(), [fetchProgress]);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Seeker';

  const libraryCount = libraryItems?.length ?? 0;
  const displayStreak = progressData?.streak ?? 0;
  const replaysThisWeek = progressData?.recentSessions?.length ?? 0;

  const primaryTrack = useMemo(() => {
    if (!libraryItems?.length) return null;
    return libraryItems.find((i) => i.lastPlayed) ?? libraryItems[0];
  }, [libraryItems]);

  const nextReminder = useMemo(
    () => computeNextReminder(reminders, t),
    [reminders, t]
  );

  const typeColor = (type: string) =>
    (CONTENT_TYPE_COLORS as Record<string, string>)[type] ?? colors.accent.primary;

  return (
    <PageShell intensity="medium" centerVertically allowDocumentScroll>
      <PageContent>
        {/* Greeting + subline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: spacing.xl }}
        >
          <Typography
            variant="h1"
            component="p"
            style={{
              marginBottom: spacing.xs,
              color: colors.text.primary,
              fontWeight: 300,
            }}
          >
            {t(getGreetingPrefixKey())}{' '}
            <span
              style={{
                background: colors.gradients.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {displayName}
            </span>
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14 }}>
            {t('subline')}
          </Typography>
        </motion.div>

        {/* Primary card — Cinematic player module */}
        {primaryTrack ? (
          <Link
            href={getContentDetailHref(primaryTrack.type, primaryTrack.id)}
            style={{ textDecoration: 'none', display: 'block', marginBottom: spacing.xl }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              whileHover={{ scale: 1.005 }}
              style={{
                padding: spacing.xxl,
                borderRadius: borderRadius.xl,
                background: `linear-gradient(160deg, ${typeColor(primaryTrack.type)}28 0%, ${typeColor(primaryTrack.type)}08 50%, ${colors.accent.secondary}06 100%)`,
                backdropFilter: BLUR.xl,
                WebkitBackdropFilter: BLUR.xl,
                border: `1px solid ${typeColor(primaryTrack.type)}40`,
                boxShadow: `0 12px 40px ${typeColor(primaryTrack.type)}20, 0 0 0 1px ${typeColor(primaryTrack.type)}15`,
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Subtle waveform accent — focal visual element */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  opacity: 0.35,
                  pointerEvents: 'none',
                }}
              >
                <AudioWaveform
                  isPlaying={false}
                  accentColor={typeColor(primaryTrack.type)}
                  style={{ minHeight: 48, padding: `${spacing.sm} ${spacing.lg}`, gap: 4 }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg, position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: borderRadius.lg,
                    background: `${typeColor(primaryTrack.type)}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 4px 24px ${typeColor(primaryTrack.type)}30`,
                  }}
                >
                  {React.createElement(getContentTypeIcon(primaryTrack.type), {
                    size: 32,
                    color: typeColor(primaryTrack.type),
                    strokeWidth: 2.5,
                  })}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {getBestForKey() && (
                    <Typography variant="micro" style={{ color: typeColor(primaryTrack.type), marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                      {t(getBestForKey()!)}
                    </Typography>
                  )}
                  <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
                    {primaryTrack.lastPlayed ? t('lastPlayed') : t('continueYourShift')}
                  </Typography>
                  <Typography
                    variant="h2"
                    style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 400, letterSpacing: '-0.02em' }}
                  >
                    {toDisplayTitle(primaryTrack.title ?? '')}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontSize: 14, opacity: 0.9 }}>
                    {t('emotionalPromise')}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 12 }}>
                    {CONTENT_TYPE_COPY[primaryTrack.type as ContentItemType].label}
                    {primaryTrack.duration ? ` · ${primaryTrack.duration}` : ''}
                  </Typography>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: spacing.xs,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: borderRadius.full,
                      background: typeColor(primaryTrack.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 20px ${typeColor(primaryTrack.type)}50`,
                    }}
                  >
                    <Play size={22} color={colors.text.onDark} strokeWidth={2.5} style={{ marginLeft: 2 }} />
                  </div>
                  <Typography variant="micro" style={{ color: colors.text.secondary, fontWeight: 600 }}>
                    {t('resumeTrack')}
                  </Typography>
                </div>
              </div>
            </motion.div>
          </Link>
        ) : (
          <Link href="/create" style={{ textDecoration: 'none', display: 'block', marginBottom: spacing.xl }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              whileHover={{ scale: 1.01 }}
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: `linear-gradient(135deg, ${colors.accent.primary}25, ${colors.accent.secondary}12)`,
                backdropFilter: BLUR.xl,
                WebkitBackdropFilter: BLUR.xl,
                border: `1px solid ${colors.accent.primary}50`,
                boxShadow: `0 8px 32px ${colors.accent.primary}25`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.lg,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: borderRadius.lg,
                  background: colors.gradients.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 4px 20px ${colors.accent.primary}50`,
                }}
              >
                <Plus size={24} color={colors.text.onDark} strokeWidth={2.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h3"
                  style={{ color: colors.text.primary, marginBottom: spacing.xs }}
                >
                  {t('createFirstTrack')}
                </Typography>
                <Typography
                  variant="body"
                  style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}
                >
                  {t('createFirstTrackDesc')}
                </Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs, flexShrink: 0 }}>
                <ChevronRight size={20} color={colors.text.secondary} style={{ opacity: 0.8 }} />
                <Typography variant="micro" style={{ color: colors.text.secondary, fontWeight: 600 }}>
                  {t('startCreating')}
                </Typography>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Secondary actions — hierarchy: Create dominates when has tracks, Library lighter. Hide Create when no tracks (primary is Create first). */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
            marginBottom: spacing.xxl,
          }}
        >
          {primaryTrack && (
          <Link href="/create" style={{ textDecoration: 'none' }}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35 }}
              whileHover={{ scale: 1.01, y: -1 }}
              style={{
                padding: spacing.lg,
                borderRadius: borderRadius.xl,
                background: colors.glass.light,
                backdropFilter: BLUR.lg,
                WebkitBackdropFilter: BLUR.lg,
                border: `1px solid ${colors.glass.border}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
              }}
            >
              <Plus size={20} color={colors.accent.primary} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h4" style={{ color: colors.text.primary, margin: 0, fontSize: 15 }}>
                  {libraryCount > 0 ? t('createNextTrack') : t('createNewTrack')}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 12 }}>
                  {libraryCount > 0 ? t('createNextTrackDesc') : t('createNewTrackDesc')}
                </Typography>
              </div>
              <ChevronRight size={18} color={colors.text.secondary} style={{ opacity: 0.6, flexShrink: 0 }} />
            </motion.div>
          </Link>
          )}
          <Link href="/library" style={{ textDecoration: 'none' }}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              whileHover={{ opacity: 0.95 }}
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: borderRadius.lg,
                background: 'transparent',
                border: `1px solid ${colors.glass.border}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                opacity: 0.85,
              }}
            >
              <Library size={18} color={LIBRARY_COLOR} strokeWidth={2} style={{ flexShrink: 0 }} />
              <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 13 }}>
                {t('browseLibrary')} · {libraryCount} {libraryCount === 1 ? 'track' : 'tracks'}
              </Typography>
            </motion.div>
          </Link>
        </div>

        {/* Practice status strip — unified, lighter, consistent alignment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            marginBottom: spacing.xxl,
            borderRadius: borderRadius.lg,
            background: `${colors.glass.light}80`,
            backdropFilter: BLUR.md,
            WebkitBackdropFilter: BLUR.md,
            border: `1px solid ${colors.glass.border}`,
            overflow: 'hidden',
          }}
        >
          <Link
            href="/sanctuary/progress"
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: `${spacing.md} ${spacing.lg}`,
              minHeight: 72,
              borderRight: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="micro" style={{ color: colors.text.secondary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('practiceRhythm')}
            </Typography>
            {progressError ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fetchProgress();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: colors.error,
                  fontSize: 14,
                  fontWeight: 500,
                  margin: 0,
                  textAlign: 'left',
                }}
              >
                Retry
              </button>
            ) : (
              <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontWeight: 500, fontSize: 15 }}>
                {displayStreak === 0 ? t('stayWithPractice') : t('practiceRhythmActive', { count: displayStreak })}
              </Typography>
            )}
          </Link>

          <Link
            href="/sanctuary/progress"
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: `${spacing.md} ${spacing.lg}`,
              minHeight: 72,
              borderRight: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="micro" style={{ color: colors.text.secondary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {replaysThisWeek === 0 ? t('thisWeekOpen') : t('thisWeek')}
            </Typography>
            <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontWeight: 500, fontSize: 15 }}>
              {replaysThisWeek === 0 ? t('startOneToday') : t('replaysCount', { count: replaysThisWeek })}
            </Typography>
          </Link>

          {nextReminder ? (
            <Link
              href={nextReminder.href}
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: `${spacing.md} ${spacing.lg}`,
                minHeight: 72,
              }}
            >
              <Typography variant="micro" style={{ color: colors.text.secondary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('nextReminder')}
              </Typography>
              <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontWeight: 500, fontSize: 15 }}>
                {nextReminder.label}
              </Typography>
            </Link>
          ) : (
            <Link
              href="/sanctuary/reminders"
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: `${spacing.md} ${spacing.lg}`,
                minHeight: 72,
              }}
            >
              <Typography variant="micro" style={{ color: colors.text.secondary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('whenToPractice')}
              </Typography>
              <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontWeight: 500, fontSize: 15 }}>
                {t('schedulePractice')}
              </Typography>
            </Link>
          )}
        </motion.div>

        {/* Secondary nav strip — intentional, integrated */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.lg,
            padding: `${spacing.md} ${spacing.lg}`,
            marginTop: spacing.xl,
            borderRadius: borderRadius.lg,
            background: `${colors.glass.light}40`,
            backdropFilter: BLUR.sm,
            WebkitBackdropFilter: BLUR.sm,
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <Link
            href="/sanctuary/voice"
            style={{
              color: colors.text.secondary,
              fontSize: 13,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              fontWeight: 500,
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: borderRadius.md,
              transition: 'color 0.2s, background 0.2s',
            }}
          >
            <Mic size={14} strokeWidth={2} />
            {t('myVoice')}
          </Link>
          <span style={{ width: 1, height: 14, background: colors.glass.border, borderRadius: 1 }} aria-hidden />
          <Link
            href="/sanctuary/learn"
            style={{
              color: colors.text.secondary,
              fontSize: 13,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              fontWeight: 500,
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: borderRadius.md,
              transition: 'color 0.2s, background 0.2s',
            }}
          >
            <BookOpen size={14} strokeWidth={2} />
            {t('theMethod')}
          </Link>
          <span style={{ width: 1, height: 14, background: colors.glass.border, borderRadius: 1 }} aria-hidden />
          <Link
            href="/sanctuary/settings"
            style={{
              color: colors.text.secondary,
              fontSize: 13,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              fontWeight: 500,
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: borderRadius.md,
              transition: 'color 0.2s, background 0.2s',
            }}
          >
            <Settings size={14} strokeWidth={2} />
            Settings
          </Link>
        </nav>
      </PageContent>
    </PageShell>
  );
}
