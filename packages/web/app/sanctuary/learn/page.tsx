'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { Brain, Zap, Mic, Eye, Moon, Music, ChevronDown } from 'lucide-react';

interface Topic {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  tagline: string;
  color: string;
  content: string[];
}

const TOPICS: Topic[] = [
  {
    icon: Brain,
    title: 'Neuroplasticity',
    tagline: 'Your brain rewires with every repetition',
    color: '#c084fc',
    content: [
      'Neuroplasticity is the brain\'s ability to reorganize itself by forming new neural connections throughout life. Every time you practice an affirmation or meditation, you\'re literally reshaping neural pathways.',
      'Repetition is the key mechanism. When a thought or sensation fires repeatedly, the neurons that fire together wire together — creating stronger, more automatic patterns over time.',
      'Voice activates this process more powerfully than silent reading. Hearing yourself speak positive statements engages auditory, motor, and emotional regions simultaneously, deepening the encoding.',
    ],
  },
  {
    icon: Zap,
    title: 'Habit Formation',
    tagline: 'Consistency over intensity, always',
    color: '#f97316',
    content: [
      'Habits form through a simple loop: cue → routine → reward. Rituals work by creating a consistent cue (time of day, location) and a deeply meaningful routine that the brain learns to anticipate and crave.',
      'Research shows it takes between 18 and 254 days to form a habit, with the average around 66 days. Short daily practices of 5–10 minutes are more effective than occasional long sessions.',
      'The subconscious mind is most receptive during transitional states — waking up, falling asleep, or entering flow. This is why morning and evening rituals are particularly potent.',
    ],
  },
  {
    icon: Mic,
    title: 'Voice & Identity',
    tagline: 'Your voice is your most powerful tool',
    color: '#60a5fa',
    content: [
      'The human voice is uniquely tied to identity and self-concept. When you hear your own voice making affirmations, the brain processes it as a direct signal about who you are — not who you\'re trying to be.',
      'Research on self-affirmation theory (Steele, 1988) shows that reflecting on core values through speech reduces defensive resistance and opens the mind to change.',
      'Voice cloning takes this further: your future self speaking to your present self creates a compelling psychological bridge, making the transformation feel real and achievable.',
    ],
  },
  {
    icon: Eye,
    title: 'Visualization',
    tagline: 'The mind cannot distinguish vividly imagined from real',
    color: '#34d399',
    content: [
      'Mental simulation activates the same neural networks as actually performing an action. Athletes have used this for decades to rehearse perfect performance without physical movement.',
      'Guided meditation combines visualization with relaxation induction, making the imagery more vivid and the emotional imprinting deeper. The relaxed state reduces the critical mind\'s resistance.',
      'Emotions are the accelerant. Visualization paired with genuine feeling (gratitude, excitement, love) creates much stronger memory traces than purely cognitive rehearsal.',
    ],
  },
  {
    icon: Moon,
    title: 'Sleep & Subconscious',
    tagline: 'Sleep is when transformation consolidates',
    color: '#a78bfa',
    content: [
      'During sleep — especially REM — the brain consolidates memories and emotional experiences from the day. Content consumed close to sleep has a disproportionate influence on what gets encoded.',
      'The hypnagogic state (just before sleep) and hypnopompic state (just after waking) are characterized by reduced critical mind activity, making them ideal windows for planting new beliefs.',
      'Sleep meditations that guide the listener from wakefulness through relaxation into sleep act as a direct channel to the subconscious, bypassing the analytical resistance of the waking mind.',
    ],
  },
  {
    icon: Music,
    title: 'Sacred Frequencies',
    tagline: 'Sound shapes consciousness',
    color: '#fb7185',
    content: [
      'Binaural beats occur when two slightly different frequencies are played in each ear. The brain perceives a third "beat" at the difference frequency, entraining neural activity toward that frequency.',
      'Delta waves (0.5–4 Hz) promote deep sleep and healing. Theta (4–8 Hz) supports meditation and creativity. Alpha (8–14 Hz) brings calm focus. Gamma (>30 Hz) is associated with peak states.',
      'Sacred solfeggio frequencies (396 Hz, 528 Hz, 741 Hz, etc.) have historical roots in Gregorian chant and are used in sound healing. While scientific research is emerging, many practitioners report pronounced effects on mood and wellbeing.',
    ],
  },
];

export default function LearnPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <PageShell intensity="medium">
      <PageContent>
        <Link href="/sanctuary" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.xl }}>
          <Typography variant="small" style={{ color: colors.text.secondary }}>
            ← Sanctuary
          </Typography>
        </Link>

        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          The Science of Transformation
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xxl }}>
          Understanding why these practices work makes them work even better.
        </Typography>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {TOPICS.map((topic, index) => {
            const isOpen = expanded === topic.title;
            const Icon = topic.icon;

            return (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                style={{
                  borderRadius: borderRadius.xl,
                  background: isOpen ? `linear-gradient(145deg, ${topic.color}12, ${colors.glass.light})` : colors.glass.light,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid ${isOpen ? topic.color + '40' : colors.glass.border}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : topic.title)}
                  style={{
                    width: '100%',
                    padding: spacing.xl,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: borderRadius.md,
                      background: `${topic.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} color={topic.color} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, marginBottom: spacing.xs }}>
                      {topic.title}
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                      {topic.tagline}
                    </Typography>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={20} color={colors.text.secondary} style={{ opacity: 0.6 }} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          padding: `0 ${spacing.xl}px ${spacing.xl}px`,
                          paddingLeft: `${spacing.xl + 48 + spacing.md}px`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: spacing.md,
                        }}
                      >
                        {topic.content.map((para, i) => (
                          <Typography key={i} variant="body" style={{ color: colors.text.secondary, lineHeight: 1.7, margin: 0 }}>
                            {para}
                          </Typography>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </PageContent>
    </PageShell>
  );
}
