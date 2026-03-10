'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { Flame, Zap, Clock, BookOpen, Send, ChevronDown, ChevronUp, Sparkles, Brain, Moon, Star, Activity } from 'lucide-react';
import { Typography } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import type { ProgressStats, ProgressHeatmap, RecentSession, ReflectionEntry, ReflectionMessage } from '@waqup/shared/types';
import { LEVEL_TAGLINES, xpProgressPercent } from '@waqup/shared/types';
import { getProgressStats, reflectionChat, saveReflection, generateWeeklySynthesis } from '@/lib/api-client';
import { getContentTypeColor } from '@waqup/shared/constants';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PageData {
  stats: ProgressStats | null;
  heatmap: ProgressHeatmap | null;
  recentSessions: RecentSession[];
  reflections: ReflectionEntry[];
  weeklySynthesis: string | null;
}

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ENERGY_STATES = [
  { value: 1, emoji: '😴', label: 'Drained' },
  { value: 2, emoji: '😐', label: 'Neutral' },
  { value: 3, emoji: '🙂', label: 'Steady' },
  { value: 4, emoji: '✨', label: 'Energised' },
  { value: 5, emoji: '🔥', label: 'Electric' },
];

const LEVEL_COLORS = {
  seeker: '#60a5fa',
  practitioner: '#a78bfa',
  alchemist: '#f59e0b',
  master: '#10b981',
};

const DEPTH_INFO = {
  affirmation: {
    label: 'Affirmations',
    icon: Star,
    depth: 'Cognitive re-patterning',
    color: '#c084fc',
    nudge: 'Repetition rewires your default thoughts.',
  },
  meditation: {
    label: 'Meditations',
    icon: Moon,
    depth: 'State induction',
    color: '#60a5fa',
    nudge: 'Alpha states open the door to deep suggestion.',
  },
  ritual: {
    label: 'Rituals',
    icon: Brain,
    depth: 'Identity encoding',
    color: '#f59e0b',
    nudge: 'Rituals encode identity at the deepest level.',
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function XPRing({
  percent,
  size = 120,
  strokeWidth = 8,
  color,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`${color}22`}
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
        style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
    </svg>
  );
}

function MiniRing({
  percent,
  size = 64,
  color,
}: {
  percent: number;
  size?: number;
  color: string;
}) {
  return <XPRing percent={percent} size={size} strokeWidth={5} color={color} />;
}

function SkeletonBlock({ w, h }: { w: string; h: string }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.06)',
        animation: 'pulse 1.8s ease-in-out infinite',
      }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [data, setData] = useState<PageData>({
    stats: null,
    heatmap: null,
    recentSessions: [],
    reflections: [],
    weeklySynthesis: null,
  });
  const [loading, setLoading] = useState(true);
  const [synthesisLoading, setSynthesisLoading] = useState(false);

  // Reflection chat state
  const [messages, setMessages] = useState<ReflectionMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [readyToSummarize, setReadyToSummarize] = useState(false);
  const [pendingAiSummary, setPendingAiSummary] = useState<string | null>(null);
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Journal notes state
  const [noteText, setNoteText] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  // ─── Load stats + heatmap ───────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const result = await getProgressStats();
        if (result) {
          setData(prev => ({ ...prev, stats: result.stats, heatmap: result.heatmap, recentSessions: result.recentSessions ?? [] }));
        }
      } catch {
        // silently keep null state — empty state UI handles it
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  // ─── Weekly synthesis ───────────────────────────────────────────────────────
  const handleGenerateWeeklySynthesis = useCallback(async (summaries: string[]) => {
    if (summaries.length === 0) return;
    setSynthesisLoading(true);
    try {
      const synthesis = await generateWeeklySynthesis(summaries);
      if (synthesis) setData(prev => ({ ...prev, weeklySynthesis: synthesis }));
    } catch {
      // non-fatal
    } finally {
      setSynthesisLoading(false);
    }
  }, []);

  // ─── Chat: send message ─────────────────────────────────────────────────────
  async function sendMessage() {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;

    const userMsg: ReflectionMessage = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const json = await reflectionChat(nextMessages, energyLevel);
      setMessages(prev => [...prev, { role: 'assistant', content: json.reply }]);
      if (json.readyToSummarize) {
        setReadyToSummarize(true);
        setPendingAiSummary(json.aiSummary);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting right now. Try again in a moment." },
      ]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }

  // ─── Chat: start session with AI greeting ──────────────────────────────────
  async function startReflection() {
    setChatOpen(true);
    if (messages.length > 0) return;
    setChatLoading(true);
    try {
      const greeting: ReflectionMessage = { role: 'user', content: 'I just finished my practice.' };
      const json = await reflectionChat([greeting]);
      setMessages([greeting, { role: 'assistant', content: json.reply }]);
    } catch {
      setMessages([{
        role: 'assistant',
        content: "Welcome back. How did today's practice feel?",
      }]);
    } finally {
      setChatLoading(false);
    }
  }

  // ─── Save reflection ────────────────────────────────────────────────────────
  async function handleSaveReflection() {
    try {
      await saveReflection({
        messages,
        energyLevel: energyLevel ?? undefined,
        notes: noteText || undefined,
        aiSummary: pendingAiSummary ?? undefined,
      });
      setReflectionSaved(true);
      if (pendingAiSummary) {
        void handleGenerateWeeklySynthesis([pendingAiSummary]);
      }
    } catch {
      // non-fatal
    }
  }

  // ─── Save standalone note ───────────────────────────────────────────────────
  async function saveNote() {
    if (!noteText.trim()) return;
    setNoteSaving(true);
    try {
      await saveReflection({ messages: [], notes: noteText.trim() });
      setNoteSaved(true);
      setNoteText('');
      setTimeout(() => setNoteSaved(false), 3000);
    } catch {
      // non-fatal
    } finally {
      setNoteSaving(false);
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const TYPE_COLORS = {
    affirmation: getContentTypeColor('affirmation'),
    meditation: getContentTypeColor('meditation'),
    ritual: getContentTypeColor('ritual'),
  } as const;

  function heatCellColor(intensity: 0 | 1 | 2 | 3 | 4, dominantType?: string | null): string {
    if (intensity === 0) return `${colors.accent.primary}0f`;
    const base = dominantType && dominantType in TYPE_COLORS
      ? TYPE_COLORS[dominantType as keyof typeof TYPE_COLORS]
      : colors.accent.primary;
    const alpha = [0, 0.28, 0.52, 0.76, 1][intensity];
    return `${base}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  }

  function formatRelativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric' });
  }

  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.round(seconds / 60)}m`;
  }

  function thisWeekSessions(): number {
    if (!data.heatmap) return 0;
    const lastWeek = data.heatmap.weeks[data.heatmap.weeks.length - 1];
    return lastWeek?.reduce((sum, d) => sum + d.count, 0) ?? 0;
  }

  const level = data.stats?.level ?? 'seeker';
  const levelColor = LEVEL_COLORS[level];
  const xpPct = data.stats ? xpProgressPercent(data.stats.totalXp) : 0;
  const totalXpSessions = (data.stats?.affirmationXp ?? 0) + (data.stats?.meditationXp ?? 0) + (data.stats?.ritualXp ?? 0);

  const depthPercent = (xp: number) =>
    totalXpSessions === 0 ? 0 : Math.round((xp / totalXpSessions) * 100);

  // ─── Render ─────────────────────────────────────────────────────────────────

  const glassCard: React.CSSProperties = {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    background: colors.glass.light,
    backdropFilter: BLUR.lg,
    WebkitBackdropFilter: BLUR.lg,
    border: `1px solid ${colors.glass.border}`,
  };

  return (
    <PageShell intensity="medium">
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes flamePulse { 0%,100%{transform:scale(1) rotate(-3deg)} 50%{transform:scale(1.12) rotate(3deg)} }
      `}</style>

      <PageContent>

        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 300, textAlign: 'center' }}>
          Your Journey
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textAlign: 'center' }}>
          Consistency compounds. Your subconscious is listening.
        </Typography>

        {/* ── Section 1: Identity Level Hero ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            ...glassCard,
            background: `linear-gradient(135deg, ${levelColor}18, ${colors.glass.light})`,
            border: `1px solid ${levelColor}35`,
            marginBottom: spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            flexWrap: 'wrap',
          }}
        >
          {/* XP Ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <XPRing percent={xpPct} size={96} color={levelColor} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              {loading ? (
                <SkeletonBlock w="40px" h="14px" />
              ) : (
                <>
                  <Typography
                    variant="small"
                    style={{
                      color: levelColor,
                      fontWeight: 700,
                      fontSize: 10,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      margin: 0,
                    }}
                  >
                    {data.stats?.totalXp ?? 0} XP
                  </Typography>
                </>
              )}
            </div>
          </div>

          {/* Level info */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
              {loading ? (
                <SkeletonBlock w="120px" h="28px" />
              ) : (
                <>
                  <Typography
                    variant="h2"
                    style={{
                      color: colors.text.primary,
                      margin: 0,
                      fontWeight: 300,
                      textTransform: 'capitalize',
                    }}
                  >
                    {level}
                  </Typography>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: levelColor,
                      background: `${levelColor}20`,
                      padding: `3px 10px`,
                      borderRadius: borderRadius.full,
                      border: `1px solid ${levelColor}40`,
                    }}
                  >
                    {level === 'master' ? 'MAX' : `${data.stats?.xpToNext ?? 0} XP to next`}
                  </span>
                </>
              )}
            </div>
            <Typography
              variant="body"
              style={{ color: colors.text.secondary, margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}
            >
              {LEVEL_TAGLINES[level]}
            </Typography>
          </div>

          {/* Streak flame */}
          {(data.stats?.streak ?? 0) > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  fontSize: 32,
                  animation: 'flamePulse 2.2s ease-in-out infinite',
                  display: 'block',
                  filter: 'drop-shadow(0 0 8px #f9731688)',
                }}
              >
                🔥
              </span>
              <Typography variant="h3" style={{ color: '#f97316', margin: 0, fontWeight: 700 }}>
                {data.stats?.streak}
              </Typography>
              <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 10 }}>
                day streak
              </Typography>
            </div>
          )}
        </motion.div>

        {/* ── Section 2: Stats Row ────────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: spacing.sm,
            marginBottom: spacing.md,
          }}
        >
          {[
            { label: 'Day Streak', icon: Flame, color: '#f97316', value: data.stats?.streak ?? null },
            { label: 'Sessions', icon: Zap, color: '#c084fc', value: data.stats?.totalSessions ?? null },
            { label: 'Minutes', icon: Clock, color: '#60a5fa', value: data.stats?.minutesPracticed ?? null },
            { label: 'Created', icon: BookOpen, color: '#34d399', value: data.stats?.contentCreated ?? null },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              style={{
                ...glassCard,
                padding: spacing.md,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.sm,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: borderRadius.md,
                  background: `${stat.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <stat.icon size={18} color={stat.color} strokeWidth={2} />
              </div>
              {loading ? (
                <SkeletonBlock w="40px" h="24px" />
              ) : (
                <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontWeight: 600 }}>
                  {stat.value ?? 0}
                </Typography>
              )}
              <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                {stat.label}
              </Typography>
            </motion.div>
          ))}
        </div>

        {/* ── Section 3: Practice Activity ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ ...glassCard, marginBottom: spacing.lg }}
        >
          {/* Card header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.lg, flexWrap: 'wrap', gap: spacing.sm }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: 4 }}>
                <Activity size={16} color={colors.accent.primary} strokeWidth={2} />
                <Typography variant="h4" style={{ color: colors.text.primary, margin: 0 }}>
                  Practice activity
                </Typography>
              </div>
              {!loading && data.heatmap && (
                <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                  {thisWeekSessions()} session{thisWeekSessions() !== 1 ? 's' : ''} this week
                  {(data.stats?.streak ?? 0) > 0 && (
                    <span style={{ marginLeft: 8, color: '#f97316' }}>
                      · {data.stats?.streak}-day streak 🔥
                    </span>
                  )}
                </Typography>
              )}
            </div>
            {/* Type legend */}
            {!loading && data.heatmap && (
              <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                {(Object.entries(TYPE_COLORS) as [string, string][]).map(([type, color]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                    <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 11, textTransform: 'capitalize' }}>
                      {type}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Heatmap grid */}
          <div style={{ overflowX: 'auto', paddingBottom: spacing.xs }}>
            {loading ? (
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <div key={j} style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
                    ))}
                  </div>
                ))}
              </div>
            ) : data.heatmap ? (
              <div style={{ display: 'flex', gap: spacing.xs }}>
                {/* Day labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 20, marginRight: 4 }}>
                  {WEEK_LABELS.map((label, i) => (
                    <div
                      key={label}
                      style={{
                        height: 16,
                        fontSize: 10,
                        color: colors.text.secondary,
                        opacity: 0.6,
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1,
                        // only show Mon, Wed, Fri to avoid crowding
                        visibility: i % 2 === 0 ? 'visible' : 'hidden',
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Weeks */}
                <div>
                  {/* Month labels row */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {data.heatmap.weeks.map((week, wi) => (
                      <div key={wi} style={{ width: 16, fontSize: 9, color: colors.text.secondary, textAlign: 'center', opacity: 0.55, lineHeight: 1.2 }}>
                        {wi % 4 === 0
                          ? new Date(data.heatmap!.weeks[wi][0].date).toLocaleDateString('en', { month: 'short' })
                          : ''}
                      </div>
                    ))}
                  </div>
                  {/* Cell grid */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {data.heatmap.weeks.map((week, wi) => (
                      <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {week.map((day, di) => (
                          <div
                            key={di}
                            title={`${new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}: ${day.count} session${day.count !== 1 ? 's' : ''}${day.dominantType ? ` · mostly ${day.dominantType}` : ''}`}
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: 4,
                              background: heatCellColor(day.intensity, day.dominantType),
                              cursor: day.count > 0 ? 'pointer' : 'default',
                              transition: 'transform 0.1s, box-shadow 0.1s',
                              border: day.count > 0 ? `1px solid ${heatCellColor(day.intensity, day.dominantType)}88` : '1px solid transparent',
                            }}
                            onMouseEnter={e => {
                              const el = e.target as HTMLElement;
                              el.style.transform = 'scale(1.3)';
                              if (day.count > 0) el.style.boxShadow = `0 0 6px ${heatCellColor(day.intensity, day.dominantType)}`;
                            }}
                            onMouseLeave={e => {
                              const el = e.target as HTMLElement;
                              el.style.transform = 'scale(1)';
                              el.style.boxShadow = 'none';
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: `${spacing.xl} 0` }}>
                <Typography variant="body" style={{ color: colors.text.secondary, fontStyle: 'italic' }}>
                  Start practicing to fill your activity map.
                </Typography>
              </div>
            )}
          </div>

          {/* Intensity legend */}
          {!loading && data.heatmap && (
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md }}>
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>Less</Typography>
              {([0, 1, 2, 3, 4] as const).map(lvl => (
                <div key={lvl} style={{ width: 12, height: 12, borderRadius: 3, background: heatCellColor(lvl, 'affirmation') }} />
              ))}
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>More</Typography>
            </div>
          )}

          {/* Recent sessions */}
          {!loading && data.recentSessions.length > 0 && (
            <div style={{ marginTop: spacing.xl, borderTop: `1px solid ${colors.glass.border}`, paddingTop: spacing.lg }}>
              <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.md, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11 }}>
                Recent sessions
              </Typography>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {data.recentSessions.map((session, i) => {
                  const typeColor = TYPE_COLORS[session.contentType] ?? colors.accent.primary;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderRadius: borderRadius.md,
                        background: `${typeColor}0c`,
                        border: `1px solid ${typeColor}20`,
                      }}
                    >
                      {/* Type badge */}
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: typeColor,
                          background: `${typeColor}20`,
                          padding: '2px 8px',
                          borderRadius: borderRadius.full,
                          textTransform: 'capitalize',
                          flexShrink: 0,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {session.contentType}
                      </span>
                      {/* Title */}
                      <Typography
                        variant="small"
                        style={{
                          color: colors.text.primary,
                          margin: 0,
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: 13,
                        }}
                      >
                        {session.title ?? `${session.contentType.charAt(0).toUpperCase() + session.contentType.slice(1)} session`}
                      </Typography>
                      {/* Duration + time */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexShrink: 0 }}>
                        <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 11 }}>
                          {formatDuration(session.durationSeconds)}
                        </Typography>
                        <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 11, opacity: 0.6 }}>
                          {formatRelativeTime(session.playedAt)}
                        </Typography>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Section 4: Depth Breakdown ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          style={{ ...glassCard, marginBottom: spacing.lg }}
        >
          <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
            Practice depth
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.md, display: 'block' }}>
            How you&apos;re shaping your subconscious mind
          </Typography>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: spacing.md,
            }}
          >
            {(
              [
                { key: 'affirmation', xp: data.stats?.affirmationXp ?? 0 },
                { key: 'meditation', xp: data.stats?.meditationXp ?? 0 },
                { key: 'ritual', xp: data.stats?.ritualXp ?? 0 },
              ] as const
            ).map(({ key, xp }) => {
              const info = DEPTH_INFO[key];
              const pct = depthPercent(xp);
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: spacing.md,
                    borderRadius: borderRadius.lg,
                    background: `${info.color}10`,
                    border: `1px solid ${info.color}25`,
                    cursor: 'default',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <MiniRing percent={pct} color={info.color} />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <info.icon size={20} color={info.color} strokeWidth={1.5} />
                    </div>
                  </div>
                  <Typography variant="h4" style={{ color: colors.text.primary, margin: 0 }}>
                    {info.label}
                  </Typography>
                  <Typography
                    variant="small"
                    style={{ color: info.color, margin: 0, fontWeight: 600, fontSize: 11 }}
                  >
                    {pct}% · {xp} XP
                  </Typography>
                  <Typography
                    variant="small"
                    style={{
                      color: colors.text.secondary,
                      margin: 0,
                      fontSize: 11,
                      textAlign: 'center',
                      lineHeight: 1.4,
                      fontStyle: 'italic',
                    }}
                  >
                    {info.nudge}
                  </Typography>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Section 5: Reflection Chat ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            ...glassCard,
            marginBottom: spacing.lg,
            background: `linear-gradient(135deg, ${colors.accent.primary}0a, ${colors.glass.light})`,
            border: `1px solid ${colors.accent.primary}22`,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: chatOpen ? spacing.xl : 0,
              cursor: 'pointer',
            }}
            onClick={() => !chatOpen && startReflection()}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Sparkles size={18} color={colors.accent.primary} />
                <Typography variant="h4" style={{ color: colors.text.primary, margin: 0 }}>
                  Reflect on today
                </Typography>
              </div>
              {!chatOpen && (
                <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, marginTop: 4 }}>
                  Process your practice with a guided AI dialogue
                </Typography>
              )}
            </div>
            {chatOpen ? (
              <button
                onClick={e => { e.stopPropagation(); setChatOpen(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text.secondary }}
              >
                <ChevronUp size={18} />
              </button>
            ) : (
              <button
                onClick={e => { e.stopPropagation(); startReflection(); }}
                style={{
                  background: colors.accent.primary,
                  border: 'none',
                  borderRadius: borderRadius.full,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  color: colors.text.onDark,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Start
              </button>
            )}
          </div>

          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Energy picker */}
                {!reflectionSaved && (
                  <div style={{ marginBottom: spacing.lg }}>
                    <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}>
                      How&apos;s your energy right now?
                    </Typography>
                    <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                      {ENERGY_STATES.map(e => (
                        <button
                          key={e.value}
                          onClick={() => setEnergyLevel(e.value)}
                          style={{
                            background: energyLevel === e.value ? `${colors.accent.primary}25` : 'transparent',
                            border: `1px solid ${energyLevel === e.value ? colors.accent.primary : colors.glass.border}`,
                            borderRadius: borderRadius.full,
                            padding: `${spacing.xs} ${spacing.md}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.xs,
                            transition: 'all 0.15s',
                          }}
                        >
                          <span style={{ fontSize: 16 }}>{e.emoji}</span>
                          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 11 }}>
                            {e.label}
                          </Typography>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message list */}
                <div
                  style={{
                    maxHeight: 320,
                    overflowY: 'auto',
                    marginBottom: spacing.md,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                  }}
                >
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        maxWidth: '80%',
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderRadius: msg.role === 'user'
                          ? `${borderRadius.lg} ${borderRadius.lg} ${borderRadius.sm} ${borderRadius.lg}`
                          : `${borderRadius.lg} ${borderRadius.lg} ${borderRadius.lg} ${borderRadius.sm}`,
                        background: msg.role === 'user'
                          ? `${colors.accent.primary}30`
                          : colors.glass.medium,
                        border: `1px solid ${msg.role === 'user' ? colors.accent.primary + '40' : colors.glass.border}`,
                      }}
                    >
                      <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                        {msg.content}
                      </Typography>
                    </motion.div>
                  ))}
                  {chatLoading && (
                    <div
                      style={{
                        alignSelf: 'flex-start',
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderRadius: borderRadius.lg,
                        background: colors.glass.medium,
                        border: `1px solid ${colors.glass.border}`,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            style={{
                              width: 6, height: 6, borderRadius: '50%',
                              background: colors.text.secondary,
                              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                {!reflectionSaved && (
                  <div style={{ display: 'flex', gap: spacing.sm }}>
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }}
                      placeholder="Share how your practice felt..."
                      disabled={chatLoading}
                      style={{
                        flex: 1,
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderRadius: borderRadius.lg,
                        background: colors.glass.medium,
                        border: `1px solid ${colors.glass.border}`,
                        color: colors.text.primary,
                        fontSize: 14,
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                    <button
                      onClick={() => void sendMessage()}
                      disabled={chatLoading || !chatInput.trim()}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: borderRadius.full,
                        background: chatInput.trim() ? colors.accent.primary : colors.glass.medium,
                        border: 'none',
                        cursor: chatInput.trim() ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <Send size={16} color={chatInput.trim() ? colors.text.onDark : colors.text.secondary} />
                    </button>
                  </div>
                )}

                {/* Save / summary */}
                {readyToSummarize && !reflectionSaved && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: spacing.lg,
                      padding: spacing.md,
                      borderRadius: borderRadius.lg,
                      background: `${colors.accent.primary}12`,
                      border: `1px solid ${colors.accent.primary}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: spacing.md,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                      Reflection complete — save it to your journey?
                    </Typography>
                    <button
                      onClick={() => void handleSaveReflection()}
                      style={{
                        background: colors.accent.primary,
                        border: 'none',
                        borderRadius: borderRadius.full,
                        padding: `${spacing.xs} ${spacing.lg}`,
                        color: colors.text.onDark,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Save reflection
                    </button>
                  </motion.div>
                )}

                {reflectionSaved && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      marginTop: spacing.lg,
                      padding: spacing.md,
                      borderRadius: borderRadius.lg,
                      background: `#10b98115`,
                      border: `1px solid #10b98130`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="small" style={{ color: '#10b981', margin: 0, fontWeight: 600 }}>
                      ✓ Reflection saved to your journey
                    </Typography>
                  </motion.div>
                )}

                {/* AI summary highlight */}
                {pendingAiSummary && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      marginTop: spacing.md,
                      padding: spacing.md,
                      borderRadius: borderRadius.lg,
                      background: `${levelColor}10`,
                      border: `1px solid ${levelColor}30`,
                    }}
                  >
                    <Typography
                      variant="small"
                      style={{ color: levelColor, fontWeight: 600, margin: 0, marginBottom: 4, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    >
                      Today&apos;s insight
                    </Typography>
                    <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontSize: 14, fontStyle: 'italic' }}>
                      {pendingAiSummary}
                    </Typography>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Section 6: Journal Notes ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52 }}
          style={{ ...glassCard, marginBottom: spacing.lg }}
        >
          <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
            Private notes
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.md, display: 'block' }}>
            Thoughts, observations, and breakthroughs — only visible to you
          </Typography>

          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="What came up today? What are you noticing in your life?..."
            rows={3}
            style={{
              width: '100%',
              padding: spacing.md,
              borderRadius: borderRadius.lg,
              background: colors.glass.medium,
              border: `1px solid ${colors.glass.border}`,
              color: colors.text.primary,
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              lineHeight: 1.6,
              boxSizing: 'border-box',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: spacing.md,
              flexWrap: 'wrap',
              gap: spacing.sm,
            }}
          >
            <AnimatePresence>
              {noteSaved && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Typography variant="small" style={{ color: '#10b981', margin: 0 }}>
                    ✓ Note saved
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => void saveNote()}
              disabled={noteSaving || !noteText.trim()}
              style={{
                background: noteText.trim() ? colors.accent.primary : colors.glass.medium,
                border: 'none',
                borderRadius: borderRadius.full,
                padding: `${spacing.sm} ${spacing.xl}`,
                color: noteText.trim() ? colors.text.onDark : colors.text.secondary,
                cursor: noteText.trim() ? 'pointer' : 'default',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {noteSaving ? 'Saving...' : 'Save note'}
            </button>
          </div>

          {/* Past notes preview */}
          {data.reflections.filter(r => r.notes).length > 0 && (
            <div style={{ marginTop: spacing.xl }}>
              <button
                onClick={() => setNotesExpanded(v => !v)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  color: colors.text.secondary,
                  padding: 0,
                }}
              >
                <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                  Past notes
                </Typography>
                {notesExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <AnimatePresence>
                {notesExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                      {data.reflections
                        .filter(r => r.notes)
                        .slice(0, 5)
                        .map(r => (
                          <div
                            key={r.id}
                            style={{
                              padding: `${spacing.sm} ${spacing.md}`,
                              borderRadius: borderRadius.md,
                              background: colors.glass.medium,
                              border: `1px solid ${colors.glass.border}`,
                            }}
                          >
                            <Typography
                              variant="small"
                              style={{ color: colors.text.secondary, margin: 0, fontSize: 10, marginBottom: 4 }}
                            >
                              {new Date(r.createdAt).toLocaleDateString('en', {
                                weekday: 'short', month: 'short', day: 'numeric',
                              })}
                            </Typography>
                            <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontSize: 13 }}>
                              {(r.notes ?? '').slice(0, 160)}
                              {(r.notes ?? '').length > 160 ? '…' : ''}
                            </Typography>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* ── Section 7: Weekly AI Insights ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58 }}
          style={{
            ...glassCard,
            background: `linear-gradient(135deg, ${levelColor}10, ${colors.glass.light})`,
            border: `1px solid ${levelColor}25`,
            marginBottom: spacing.lg,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
            <Sparkles size={16} color={levelColor} />
            <Typography variant="h4" style={{ color: colors.text.primary, margin: 0 }}>
              Weekly insights
            </Typography>
          </div>

          {synthesisLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <SkeletonBlock w="85%" h="16px" />
              <SkeletonBlock w="70%" h="16px" />
              <SkeletonBlock w="78%" h="16px" />
            </div>
          ) : data.weeklySynthesis ? (
            <Typography
              variant="body"
              style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.7, fontStyle: 'italic', fontSize: 15 }}
            >
              {data.weeklySynthesis}
            </Typography>
          ) : (
            <div>
              <Typography
                variant="body"
                style={{ color: colors.text.secondary, margin: 0, fontStyle: 'italic', lineHeight: 1.6, marginBottom: spacing.lg }}
              >
                Complete at least one reflection dialogue to unlock your weekly synthesis. Your AI guide will analyse patterns across your sessions and illuminate what your subconscious is building toward.
              </Typography>
              <Link href="/library" style={{ textDecoration: 'none' }}>
                <Typography variant="body" style={{ color: colors.accent.primary, fontWeight: 600, fontSize: 14 }}>
                  Go practice now →
                </Typography>
              </Link>
            </div>
          )}
        </motion.div>
      </PageContent>
    </PageShell>
  );
}
