'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { spacing, borderRadius, BLUR } from '@/theme';
import { SANCTUARY_QUICK_ACTIONS, SANCTUARY_MENU_ITEMS } from '@/lib';
import { useAuthStore } from '@/stores';
import { useContent } from '@/hooks';
import { getProgressStats } from '@/lib/api-client';
import { Analytics } from '@waqup/shared/utils';
import { Library, Flame, ChevronRight, Bell, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ELEVATED_BADGE_COLOR_SECONDARY, getContentTypeColor } from '@waqup/shared/constants';

const STREAK_COLOR = ELEVATED_BADGE_COLOR_SECONDARY;
const LIBRARY_COLOR = getContentTypeColor('affirmation');

export default function SanctuaryHomePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuthStore();
  const t = useTranslations('sanctuary.home');
  const searchParams = useSearchParams();
  const { items: libraryItems } = useContent();

  const [streak, setStreak] = useState<number | null>(null);
  const [streakError, setStreakError] = useState(false);

  const fetchStreak = useCallback(() => {
    let cancelled = false;
    setStreakError(false);
    getProgressStats()
      .then((res) => {
        if (cancelled) return;
        if (res?.stats) {
          setStreak(res.stats.streak ?? 0);
        } else {
          setStreakError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setStreakError(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (searchParams.get('checkout') !== 'success') return;
    if (!user?.id) return;
    const planId = searchParams.get('plan') ?? 'unknown';
    Analytics.subscriptionStarted(planId, 0, 'USD', user.id);
    Analytics.funnelPaidConversion('subscription', 0, user.id);
  // searchParams is stable; user?.id is the only value that may arrive late
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    return fetchStreak();
  }, [fetchStreak]);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Seeker';

  const createAction = SANCTUARY_QUICK_ACTIONS[0];
  const libraryCount = libraryItems?.length ?? 0;
  const displayStreak = streak ?? 0;

  // Grouped list: Practice tools (Reminders, Learn) | Account (Voice, Progress, Qs, Settings)
  const practiceItems = [
    SANCTUARY_QUICK_ACTIONS.find((a) => a.href.includes('reminders')) ?? { name: 'Set Reminder', description: 'Schedule your practice', icon: Bell, href: '/sanctuary/reminders' },
    SANCTUARY_QUICK_ACTIONS.find((a) => a.href.includes('learn')) ?? { name: 'Learn & Transform', description: 'Understand the science', icon: BookOpen, href: '/sanctuary/learn' },
  ];
  const accountItems = [
    ...SANCTUARY_MENU_ITEMS.filter((m) => m.href !== '/library'),
  ];

  return (
    <PageShell intensity="medium" centerVertically>
      <PageContent>
        {/* Welcome — Qs badge is in header only */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: spacing.xl }}
        >
          <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary, fontWeight: 300 }}>
            {t('welcomeBack', { name: '' })}<span style={{ background: colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{displayName}</span>
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14 }}>
            {t('practiceHub')}
          </Typography>
        </motion.div>

        {/* Hero CTA — Create */}
        <Link href={createAction.href} style={{ textDecoration: 'none', display: 'block', marginBottom: spacing.xl }}>
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
              <createAction.icon size={24} color={colors.text.onDark} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                {createAction.name}
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
                {createAction.description}
              </Typography>
            </div>
            <ChevronRight size={20} color={colors.text.secondary} style={{ opacity: 0.6, flexShrink: 0 }} />
          </motion.div>
        </Link>

        {/* Prominent cards — Streak + Library */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: spacing.lg,
            marginBottom: spacing.xxl,
          }}
        >
          {/* Streak card — motivational, deserving of presence */}
          <Link href="/sanctuary/progress" style={{ textDecoration: 'none' }}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              whileHover={{ scale: 1.02, y: -2 }}
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: `linear-gradient(145deg, ${STREAK_COLOR}18, ${STREAK_COLOR}08)`,
                backdropFilter: BLUR.lg,
                WebkitBackdropFilter: BLUR.lg,
                border: `1px solid ${STREAK_COLOR}40`,
                boxShadow: `0 8px 24px ${STREAK_COLOR}20`,
                cursor: 'pointer',
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: borderRadius.lg,
                    background: `${STREAK_COLOR}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Flame size={24} color={STREAK_COLOR} strokeWidth={2.5} fill={displayStreak > 0 ? STREAK_COLOR : 'none'} />
                </div>
                <div>
                  <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontSize: 22 }}>
                    {t('streakDays', { count: displayStreak })}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 13 }}>
                    {t('streak')}
                  </Typography>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: spacing.md }}>
                {streakError ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      fetchStreak();
                    }}
                    style={{
                      background:  'none',
                      border:      'none',
                      padding:     0,
                      cursor:      'pointer',
                      color:       colors.error,
                      fontSize:    12,
                      fontWeight:  600,
                      letterSpacing: '0.02em',
                    }}
                  >
                    Retry →
                  </button>
                ) : (
                  <>
                    <Typography variant="captionBold" style={{ color: STREAK_COLOR }}>
                      {t('viewProgress')}
                    </Typography>
                    <ChevronRight size={14} color={STREAK_COLOR} />
                  </>
                )}
              </div>
            </motion.div>
          </Link>

          {/* Library card — your content home */}
          <Link href="/library" style={{ textDecoration: 'none' }}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.35 }}
              whileHover={{ scale: 1.02, y: -2 }}
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: `linear-gradient(145deg, ${LIBRARY_COLOR}18, ${LIBRARY_COLOR}08)`,
                backdropFilter: BLUR.lg,
                WebkitBackdropFilter: BLUR.lg,
                border: `1px solid ${LIBRARY_COLOR}40`,
                boxShadow: `0 8px 24px ${LIBRARY_COLOR}20`,
                cursor: 'pointer',
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: borderRadius.lg,
                    background: `${LIBRARY_COLOR}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Library size={24} color={LIBRARY_COLOR} strokeWidth={2} />
                </div>
                <div>
                  <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontSize: 22 }}>
                    {t('practices', { count: libraryCount })}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 13 }}>
                    {t('inYourLibrary')}
                  </Typography>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: spacing.md }}>
                <Typography variant="captionBold" style={{ color: LIBRARY_COLOR }}>
                  {t('openLibrary')}
                </Typography>
                <ChevronRight size={14} color={LIBRARY_COLOR} />
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Grouped list — Practice + Account */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          {/* Practice section */}
          <div>
            <Typography variant="small" style={{ color: colors.text.tertiary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('practiceSection')}
            </Typography>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                borderRadius: borderRadius.lg,
                overflow: 'hidden',
                background: colors.glass.light,
                backdropFilter: BLUR.lg,
                WebkitBackdropFilter: BLUR.lg,
                border: `1px solid ${colors.glass.border}`,
              }}
            >
              {practiceItems.map((item, index) => (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.22 + index * 0.04 }}
                    whileHover={{ backgroundColor: colors.glass.medium }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.md,
                      padding: `${spacing.md} ${spacing.lg}`,
                      borderBottom: index < practiceItems.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: borderRadius.md, background: colors.glass.medium, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={18} color={colors.accent.primary} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h4" style={{ color: colors.text.primary, margin: 0, fontSize: 15 }}>{item.name}</Typography>
                      <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 12 }}>{item.description}</Typography>
                    </div>
                    <ChevronRight size={18} color={colors.text.secondary} style={{ opacity: 0.5 }} />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Account section */}
          <div>
            <Typography variant="small" style={{ color: colors.text.tertiary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('accountSection')}
            </Typography>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                borderRadius: borderRadius.lg,
                overflow: 'hidden',
                background: colors.glass.light,
                backdropFilter: BLUR.lg,
                WebkitBackdropFilter: BLUR.lg,
                border: `1px solid ${colors.glass.border}`,
              }}
            >
              {accountItems.map((item, index) => (
                  <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.28 + index * 0.04 }}
                      whileHover={{ backgroundColor: colors.glass.medium }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: `${spacing.md} ${spacing.lg}`,
                        borderBottom: index < accountItems.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: borderRadius.md, background: colors.glass.medium, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {'iconNode' in item && item.iconNode ? item.iconNode : <item.icon size={18} color={colors.accent.primary} strokeWidth={2} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h4" style={{ color: colors.text.primary, margin: 0, fontSize: 15 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 12 }}>{item.description}</Typography>
                      </div>
                      <ChevronRight size={18} color={colors.text.secondary} style={{ opacity: 0.5 }} />
                    </motion.div>
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
}
