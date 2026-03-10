'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button, Loading } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { Link } from '@/i18n/navigation';
import {
  Bell,
  Plus,
  Trash2,
  Pencil,
  Clock,
  Moon,
  Sunrise,
  Check,
  BookOpen,
} from 'lucide-react';
import { useReminders } from '@/hooks';
import type { UserReminder, CreateReminderInput } from '@waqup/shared/types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

const TIME_PRESETS = [
  { label: 'After waking', time: '07:00' },
  { label: 'Mid-morning', time: '09:00' },
  { label: 'Midday', time: '12:00' },
  { label: 'Afternoon', time: '15:00' },
  { label: 'Before sleep', time: '21:30' },
];

interface RecommendedSession {
  id: string;
  title: string;
  timeLabel: string;
  time: string;
  label: string;
  science: string;
  durations: string[];
  color: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}

const RECOMMENDED_SESSIONS: RecommendedSession[] = [
  {
    id: 'morning',
    title: 'Morning Practice',
    timeLabel: 'After waking · 7:00 AM',
    time: '07:00',
    label: 'Morning practice',
    science:
      'Just after waking, your critical mind is still quiet — the ideal window for planting new beliefs.',
    durations: ['20 min', '40 min', '1 hr'],
    color: '#f97316',
    Icon: Sunrise,
  },
  {
    id: 'evening',
    title: 'Evening Practice',
    timeLabel: 'Before sleep · 9:30 PM',
    time: '21:30',
    label: 'Evening practice',
    science:
      'Sleep consolidates what you hear last. Content before sleep has disproportionate influence on encoding.',
    durations: ['20 min', '40 min', '1 hr'],
    color: '#a78bfa',
    Icon: Moon,
  },
];

function formatDays(days: number[]): string {
  if (days.length === 7) return 'Every day';
  if (days.length === 5 && [1, 2, 3, 4, 5].every((d) => days.includes(d))) return 'Weekdays';
  if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
  return days.map((d) => DAY_LABELS[d]).join(', ');
}

function formatTime12h(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const hour = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        background: value ? colors.gradients.primary : colors.glass.medium,
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s ease',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute',
          top: 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  );
}

const NOTIFICATION_FIRED_KEY = 'waqup_reminder_fired';

function useNotificationChecker(reminders: UserReminder[]) {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const p = Notification.permission;
    queueMicrotask(() => setPermission(p));
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const p = await Notification.requestPermission();
    setPermission(p);
    return p;
  }, []);

  useEffect(() => {
    if (permission !== 'granted' || reminders.length === 0) return;

    const check = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const today = now.toISOString().slice(0, 10);

      for (const r of reminders) {
        if (!r.enabled || !r.daysOfWeek.includes(day)) continue;
        const [h, m] = r.time.split(':').map(Number);
        if (h !== hour || m !== minute) continue;

        const key = `${NOTIFICATION_FIRED_KEY}_${r.id}_${today}`;
        if (typeof localStorage !== 'undefined' && localStorage.getItem(key)) continue;

        try {
          new Notification(r.label || 'Practice reminder', {
            body: 'Time for your practice. Open waQup to continue.',
            icon: '/favicon.ico',
          });
          localStorage.setItem(key, '1');
        } catch {
          // ignore
        }
      }
    };

    const id = setInterval(check, 60_000);
    check();
    return () => clearInterval(id);
  }, [permission, reminders]);

  return { permission, requestPermission };
}

export default function SanctuaryRemindersPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const {
    reminders,
    isLoading,
    error,
    refetch,
    createReminder,
    updateReminder,
    deleteReminder,
  } = useReminders();

  const { permission, requestPermission } = useNotificationChecker(reminders);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState('Practice reminder');
  const [formTime, setFormTime] = useState('09:00');
  const [formDays, setFormDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [formEnabled, setFormEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [quickAddingId, setQuickAddingId] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormLabel('Practice reminder');
    setFormTime('09:00');
    setFormDays([1, 2, 3, 4, 5]);
    setFormEnabled(true);
    setShowAddForm(false);
    setEditingId(null);
    setDeletingId(null);
  }, []);

  const toggleDay = (d: number) => {
    setFormDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b)
    );
  };

  const handleSubmit = async () => {
    if (formDays.length === 0) return;
    setIsSubmitting(true);
    const input: CreateReminderInput = {
      label: formLabel.trim() || 'Practice reminder',
      time: formTime,
      daysOfWeek: formDays,
      enabled: formEnabled,
    };
    if (editingId) {
      const ok = await updateReminder(editingId, input);
      if (ok) resetForm();
    } else {
      const ok = await createReminder(input);
      if (ok) resetForm();
    }
    setIsSubmitting(false);
  };

  const startEdit = (r: UserReminder) => {
    setDeletingId(null);
    setEditingId(r.id);
    setFormLabel(r.label);
    setFormTime(r.time);
    setFormDays(r.daysOfWeek);
    setFormEnabled(r.enabled);
    setShowAddForm(false);
  };

  const handleQuickAdd = async (session: RecommendedSession) => {
    setQuickAddingId(session.id);
    await createReminder({
      label: session.label,
      time: session.time,
      daysOfWeek: ALL_DAYS,
      enabled: true,
    });
    setQuickAddingId(null);
  };

  const isSessionActive = (session: RecommendedSession) =>
    reminders.some((r) => r.time === session.time && r.enabled);

  const sectionStyle: React.CSSProperties = {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    background: colors.glass.light,
    backdropFilter: BLUR.lg,
    WebkitBackdropFilter: BLUR.lg,
    border: `1px solid ${colors.glass.border}`,
    marginBottom: spacing.md,
  };

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        {/* Headline */}
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 300, textAlign: 'center' }}>
          Time your practice well
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textAlign: 'center' }}>
          Consistency matters more than duration. Two short sessions daily — at the right moments — rewire your brain faster than anything else.
        </Typography>

        {/* Notification permission */}
        {permission !== 'granted' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              ...sectionStyle,
              background: permission === 'denied'
                ? `${colors.text.secondary}15`
                : `${colors.accent.primary}15`,
              border: `1px solid ${permission === 'denied' ? colors.glass.border : `${colors.accent.primary}35`}`,
            }}
          >
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
              {permission === 'denied' ? 'Notifications blocked' : 'Enable notifications'}
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md, fontSize: 14 }}>
              {permission === 'denied'
                ? 'You previously blocked notifications. Enable them in your browser settings to receive reminders.'
                : 'Allow browser notifications to receive reminders when the app is open.'}
            </Typography>
            {permission !== 'denied' && (
              <Button
                variant="primary"
                size="md"
                onClick={async () => {
                  const p = await requestPermission();
                  if (p === 'granted') refetch();
                }}
              >
                <Bell size={16} />
                Enable notifications
              </Button>
            )}
          </motion.div>
        )}

        {/* Recommended sessions */}
        <div style={{ marginBottom: spacing.md }}>
          <Typography
            variant="h4"
            style={{
              color: colors.text.secondary,
              marginBottom: spacing.md,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: 11,
            }}
          >
            Recommended sessions
          </Typography>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: spacing.md,
              marginBottom: spacing.md,
            }}
          >
            {RECOMMENDED_SESSIONS.map((session, index) => {
              const active = isSessionActive(session);
              const loading = quickAddingId === session.id;
              const SessionIcon = session.Icon;

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  style={{
                    padding: spacing.md,
                    borderRadius: borderRadius.xl,
                    background: active
                      ? `linear-gradient(145deg, ${session.color}18, ${colors.glass.light})`
                      : colors.glass.light,
                    backdropFilter: BLUR.lg,
                    WebkitBackdropFilter: BLUR.lg,
                    border: `1px solid ${active ? session.color + '50' : colors.glass.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  {/* Icon + title row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: borderRadius.md,
                        background: `${session.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <SessionIcon size={18} color={session.color} strokeWidth={1.8} />
                    </div>
                    {active && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: `${spacing.xs} ${spacing.sm}`,
                          borderRadius: borderRadius.full,
                          background: `${session.color}20`,
                          border: `1px solid ${session.color}40`,
                        }}
                      >
                        <Check size={11} color={session.color} strokeWidth={2.5} />
                        <Typography
                          variant="small"
                          style={{ color: session.color, fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}
                        >
                          Active
                        </Typography>
                      </div>
                    )}
                  </div>

                  {/* Title + time */}
                  <div>
                    <Typography variant="h4" style={{ color: colors.text.primary, margin: 0, marginBottom: spacing.xs, fontWeight: 600 }}>
                      {session.title}
                    </Typography>
                    <Typography variant="small" style={{ color: session.color, margin: 0, fontWeight: 500, opacity: 0.9 }}>
                      {session.timeLabel}
                    </Typography>
                  </div>

                  {/* Science blurb */}
                  <Typography
                    variant="small"
                    style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.55, fontSize: 13 }}
                  >
                    {session.science}
                  </Typography>

                  {/* Duration hints */}
                  <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                    {session.durations.map((d) => (
                      <span
                        key={d}
                        style={{
                          padding: `3px ${spacing.sm}`,
                          borderRadius: borderRadius.full,
                          background: `${session.color}12`,
                          border: `1px solid ${session.color}25`,
                          color: session.color,
                          fontSize: 11,
                          fontWeight: 500,
                          opacity: 0.85,
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    disabled={active || loading}
                    onClick={() => handleQuickAdd(session)}
                    style={{
                      marginTop: spacing.xs,
                      padding: `${spacing.sm} ${spacing.md}`,
                      borderRadius: borderRadius.lg,
                      border: `1px solid ${active ? session.color + '30' : session.color + '60'}`,
                      background: active ? `${session.color}10` : `${session.color}20`,
                      color: active ? session.color : colors.text.primary,
                      cursor: active ? 'default' : 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing.xs,
                      transition: 'background 0.2s, opacity 0.2s',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {active ? (
                      <>
                        <Check size={14} color={session.color} strokeWidth={2} />
                        <span style={{ color: session.color }}>Reminder set</span>
                      </>
                    ) : loading ? (
                      <span>Adding…</span>
                    ) : (
                      <>
                        <Plus size={14} strokeWidth={2} />
                        Add {session.id} reminder
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Science callout strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: `${spacing.md} ${spacing.lg}`,
              borderRadius: borderRadius.lg,
              background: `${colors.accent.primary}0A`,
              border: `1px solid ${colors.accent.primary}20`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            <BookOpen size={16} color={colors.accent.primary} strokeWidth={1.8} style={{ flexShrink: 0, opacity: 0.8 }} />
            <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.5, fontSize: 13 }}>
              The moments just after waking and before sleep are your brain&#39;s most receptive windows for new beliefs.{' '}
              <Link
                href="/sanctuary/learn"
                style={{ color: colors.accent.primary, textDecoration: 'none', fontWeight: 500 }}
                className="hover:opacity-80"
              >
                Learn the science →
              </Link>
            </Typography>
          </motion.div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ ...sectionStyle, borderColor: colors.error, background: `${colors.error}15` }}>
            <Typography variant="body" style={{ color: colors.error }}>{error}</Typography>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={{ ...sectionStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.md, minHeight: 120 }}>
            <Loading variant="spinner" size="lg" color="primary" />
            <Typography variant="body" style={{ color: colors.text.secondary }}>Loading reminders…</Typography>
          </div>
        )}

        {/* Reminders list */}
        {!isLoading && reminders.length > 0 && (
          <div style={{ marginBottom: spacing.md }}>
            <Typography
              variant="h4"
              style={{ color: colors.text.secondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}
            >
              Your reminders
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {reminders.map((r, index) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    padding: spacing.lg,
                    borderRadius: borderRadius.lg,
                    background: colors.glass.light,
                    backdropFilter: BLUR.lg,
                    border: `1px solid ${colors.glass.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    opacity: r.enabled ? 1 : 0.6,
                  }}
                >
                  <Bell size={20} color={colors.accent.primary} strokeWidth={2} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontWeight: 500 }}>
                      {r.label}
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                      {formatTime12h(r.time)} · {formatDays(r.daysOfWeek)}
                      {!r.enabled && (
                        <span
                          style={{
                            marginLeft: spacing.sm,
                            fontSize: 10,
                            fontWeight: 600,
                            color: colors.text.secondary,
                            opacity: 0.8,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Paused
                        </span>
                      )}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <Toggle
                      value={r.enabled}
                      onChange={(v) => updateReminder(r.id, { enabled: v })}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(r)}
                      style={{ padding: spacing.sm }}
                      aria-label="Edit reminder"
                    >
                      <Pencil size={18} style={{ color: colors.text.secondary }} />
                    </Button>
                    {deletingId === r.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>Delete?</Typography>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            await deleteReminder(r.id);
                            setDeletingId(null);
                          }}
                          style={{ color: colors.error, padding: `${spacing.xs} ${spacing.sm}` }}
                        >
                          Yes
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingId(null)}
                          style={{ padding: `${spacing.xs} ${spacing.sm}` }}
                        >
                          No
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(r.id)}
                        style={{ padding: spacing.sm, color: colors.error }}
                        aria-label="Delete reminder"
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state — only shown when no reminders and no form open */}
        {!isLoading && reminders.length === 0 && !showAddForm && !editingId && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.lg,
              WebkitBackdropFilter: BLUR.lg,
              border: `1px solid ${colors.glass.border}`,
              textAlign: 'center',
              marginBottom: spacing.md,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: borderRadius.full,
                background: `${colors.accent.primary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing.sm,
              }}
            >
              <Bell size={24} color={colors.accent.primary} strokeWidth={1.5} style={{ opacity: 0.8 }} />
            </div>
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
              No reminders yet
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14, marginBottom: spacing.xs }}>
              Use the recommended sessions above, or add a custom one.
            </Typography>
          </motion.div>
        )}

        {/* Custom reminder entry — secondary action */}
        {!showAddForm && !editingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: spacing.md }}
          >
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowAddForm(true)}
              style={{
                border: `1px dashed ${colors.glass.border}`,
                color: colors.text.secondary,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <Plus size={16} />
              Add custom reminder
            </Button>
          </motion.div>
        )}

        {/* Add/Edit form */}
        <AnimatePresence>
          {(showAddForm || editingId) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={sectionStyle}
            >
              <Typography
                variant="h4"
                style={{
                  color: colors.text.secondary,
                  marginBottom: spacing.lg,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: 11,
                }}
              >
                {editingId ? 'Edit reminder' : 'Custom reminder'}
              </Typography>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                <div>
                  <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.xs, display: 'block' }}>
                    Label
                  </Typography>
                  <input
                    type="text"
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="Practice reminder"
                    style={{
                      width: '100%',
                      padding: `${spacing.md} ${spacing.lg}`,
                      borderRadius: borderRadius.lg,
                      border: `1px solid ${colors.glass.border}`,
                      background: colors.glass.medium,
                      color: colors.text.primary,
                      fontSize: 14,
                    }}
                  />
                </div>

                <div>
                  <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.xs, display: 'block' }}>
                    Time
                  </Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm }}>
                    {TIME_PRESETS.map((p) => (
                      <button
                        key={p.time}
                        type="button"
                        onClick={() => setFormTime(p.time)}
                        style={{
                          padding: `${spacing.xs} ${spacing.md}`,
                          borderRadius: borderRadius.full,
                          border: `1px solid ${formTime === p.time ? colors.accent.primary : colors.glass.border}`,
                          background: formTime === p.time ? `${colors.accent.primary}25` : 'transparent',
                          color: formTime === p.time ? colors.accent.primary : colors.text.secondary,
                          cursor: 'pointer',
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.xs,
                        }}
                      >
                        <Clock size={12} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="time"
                    id="reminder-time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    aria-label="Reminder time"
                    style={{
                      width: '100%',
                      padding: `${spacing.md} ${spacing.lg}`,
                      borderRadius: borderRadius.lg,
                      border: `1px solid ${colors.glass.border}`,
                      background: colors.glass.medium,
                      color: colors.text.primary,
                      fontSize: 14,
                    }}
                  />
                </div>

                <div>
                  <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}>
                    Days
                  </Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm }}>
                    {[
                      { label: 'Weekdays', days: [1, 2, 3, 4, 5] },
                      { label: 'Weekends', days: [0, 6] },
                      { label: 'Every day', days: [0, 1, 2, 3, 4, 5, 6] },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormDays(preset.days)}
                        style={{
                          padding: `${spacing.xs} ${spacing.sm}`,
                          borderRadius: borderRadius.full,
                          border: `1px solid ${colors.glass.border}`,
                          background: 'transparent',
                          color: colors.text.secondary,
                          cursor: 'pointer',
                          fontSize: 11,
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  {formDays.length === 0 && (
                    <Typography variant="small" style={{ color: colors.error, marginBottom: spacing.sm, fontSize: 12 }}>
                      Select at least one day
                    </Typography>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                    {DAY_LABELS.map((label, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleDay(i)}
                        style={{
                          padding: `${spacing.sm} ${spacing.md}`,
                          borderRadius: borderRadius.full,
                          border: `1px solid ${formDays.includes(i) ? colors.accent.primary : colors.glass.border}`,
                          background: formDays.includes(i) ? `${colors.accent.primary}25` : 'transparent',
                          color: formDays.includes(i) ? colors.accent.primary : colors.text.secondary,
                          cursor: 'pointer',
                          fontSize: 13,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body" style={{ color: colors.text.primary }}>
                    Enabled
                  </Typography>
                  <Toggle value={formEnabled} onChange={setFormEnabled} />
                </div>

                <div style={{ display: 'flex', gap: spacing.md }}>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSubmit}
                    disabled={isSubmitting || formDays.length === 0}
                    loading={isSubmitting}
                  >
                    {editingId ? 'Save' : 'Add reminder'}
                  </Button>
                  <Button variant="ghost" size="md" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageContent>
    </PageShell>
  );
}
