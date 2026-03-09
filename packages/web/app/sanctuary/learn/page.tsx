'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { spacing as sp } from '@waqup/shared/theme';
import Link from 'next/link';
import { Brain, Zap, Mic, Eye, Moon, Music, Target, ChevronDown } from 'lucide-react';

interface Topic {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  tagline: string;
  color: string;
  keyInsight: string;
  content: string[];
}

const TOPICS: Topic[] = [
  {
    icon: Brain,
    title: 'Neuroplasticity',
    tagline: 'Your brain rewires with every repetition',
    color: '#c084fc',
    keyInsight: 'Every thought you repeat is a vote for who you\'re becoming — the brain literally reshapes its architecture around consistent patterns.',
    content: [
      'Neuroplasticity is the brain\'s ability to reorganize itself by forming new neural connections throughout life. Every time you practice an affirmation or meditation, you\'re literally reshaping neural pathways.',
      'Repetition is the key mechanism. Hebb\'s law (1949) captures it simply: neurons that fire together, wire together — creating stronger, more automatic patterns over time. The more frequently a circuit is activated, the more efficiently it transmits.',
      'Voice activates this process more powerfully than silent reading. Hearing yourself speak positive statements engages auditory, motor, and emotional regions simultaneously, deepening the encoding across multiple neural networks at once.',
    ],
  },
  {
    icon: Zap,
    title: 'Habit Formation',
    tagline: 'Consistency over intensity, always',
    color: '#f97316',
    keyInsight: 'Small daily actions compound into identity — not because of willpower, but because of how the brain automates what it repeats.',
    content: [
      'Habits form through a simple loop: cue → routine → reward. Rituals work by creating a consistent cue (time of day, location) and a deeply meaningful routine that the brain learns to anticipate and crave.',
      'Research by Lally et al. (2010, European Journal of Social Psychology) found it takes between 18 and 254 days to form a habit, with the average around 66 days — not 21 as commonly cited. Short daily practices of 5–10 minutes are more effective than occasional long sessions.',
      'The subconscious mind is most receptive during transitional states — waking up, falling asleep, or entering flow. This is why morning and evening rituals are particularly potent for encoding new patterns.',
    ],
  },
  {
    icon: Mic,
    title: 'Voice & Identity',
    tagline: 'Your voice is your most powerful tool',
    color: '#60a5fa',
    keyInsight: 'When you hear your own voice making a statement about yourself, your brain processes it as a direct signal about identity — not aspiration.',
    content: [
      'The human voice is uniquely tied to identity and self-concept. When you hear yourself making affirmations, the brain processes it as a direct signal about who you are — not who you\'re trying to be. This is the self-reference effect: words processed in relation to the self are encoded 30–40% more strongly (Rogers, Kuiper & Kirker, 1977).',
      'Research on self-affirmation theory (Steele, 1988) shows that reflecting on core values through speech reduces defensive resistance and opens the mind to change. The brain lowers its guard when the signal comes from within.',
      'Voice cloning takes this further: your future self speaking to your present self creates a compelling psychological bridge, making the transformation feel real and achievable rather than distant.',
    ],
  },
  {
    icon: Eye,
    title: 'Visualization',
    tagline: 'The mind cannot distinguish vividly imagined from real',
    color: '#34d399',
    keyInsight: 'The brain rehearsing a perfect outcome and the brain experiencing it activate nearly identical neural circuits — making visualization a form of real practice.',
    content: [
      'Mental simulation activates the same neural networks as actually performing an action. A meta-analysis by Driskell et al. (1994) found mental rehearsal to be approximately 67% as effective as physical practice — not a replacement, but a powerful multiplier.',
      'Guided meditation combines visualization with relaxation induction, making the imagery more vivid and the emotional imprinting deeper. The relaxed state reduces the critical mind\'s resistance, allowing new patterns to be written more directly.',
      'Emotions are the accelerant. Visualization paired with genuine feeling (gratitude, excitement, love) creates much stronger memory traces than purely cognitive rehearsal. The limbic system encodes the emotion as a real event.',
    ],
  },
  {
    icon: Moon,
    title: 'Sleep & Subconscious',
    tagline: 'Sleep is when transformation consolidates',
    color: '#a78bfa',
    keyInsight: 'The hours around sleep are the most direct channel to the subconscious — when the analytical gatekeeper steps aside.',
    content: [
      'During sleep — especially REM — the brain consolidates memories and emotional experiences from the day. Stickgold et al. (2000) demonstrated that this sleep-dependent consolidation is not passive storage but active reprocessing: the brain strengthens what mattered and prunes what didn\'t.',
      'The hypnagogic state (just before sleep) and hypnopompic state (just after waking) are characterized by theta brainwave activity and reduced critical mind engagement, making them ideal windows for planting new beliefs without analytical resistance.',
      'Sleep meditations that guide the listener from wakefulness through relaxation into sleep act as a direct channel to the subconscious — the same mechanism used in clinical hypnotherapy, now available as a personal practice.',
    ],
  },
  {
    icon: Music,
    title: 'Sacred Frequencies',
    tagline: 'Sound shapes consciousness',
    color: '#fb7185',
    keyInsight: 'The brain doesn\'t just hear sound — it synchronizes to it, entraining neural oscillations toward the frequency being presented.',
    content: [
      'Binaural beats occur when two slightly different frequencies are played in each ear. The brain perceives a third "beat" at the difference frequency, entraining neural activity toward that frequency (Oster, 1973). This phenomenon — known as the frequency-following response — is measurable on EEG.',
      'Delta waves (0.5–4 Hz) promote deep sleep and healing. Theta (4–8 Hz) supports meditation and creativity. Alpha (8–14 Hz) brings calm focus. Gamma (>30 Hz) is associated with peak states and heightened perception. Theta binaural beats have been shown to enhance memory consolidation (Chaieb et al., 2015).',
      'Sacred solfeggio frequencies (396 Hz, 528 Hz, 741 Hz, etc.) have historical roots in Gregorian chant and are used in sound healing. While scientific research is still emerging, their use as intentional anchors during practice creates powerful conditioning through consistent association.',
    ],
  },
  {
    icon: Target,
    title: 'Reticular Activating System',
    tagline: 'Your brain finds what it\'s been primed to look for',
    color: '#fbbf24',
    keyInsight: 'Setting an intention doesn\'t attract new opportunities — it recalibrates the filter that decides which opportunities your conscious mind notices at all.',
    content: [
      'The reticular activating system (RAS) is a bundle of neurons in the brainstem that acts as a relevance filter, scanning the constant flood of sensory information and surfacing only what you\'ve primed it to find. Without this filter, the brain would be overwhelmed — roughly 11 million bits of data per second reduced to 40 consciously processed.',
      'This is why goals written down and repeated daily seem to "attract" aligned opportunities. The opportunities haven\'t increased; your capacity to perceive them has. The RAS has been briefed on what to flag as relevant.',
      'Rituals work precisely because they create daily re-priming of the RAS. Each repetition of your core intention — spoken aloud, felt emotionally, visualized vividly — strengthens the signal telling your brain what matters, and therefore what to surface from the noise.',
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

        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300, textAlign: 'center' }}>
          The Science of Transformation
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textAlign: 'center' }}>
          The mind encodes what it repeatedly experiences as real. These are the mechanisms.
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
                    padding: spacing.lg,
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
                      width: 40,
                      height: 40,
                      borderRadius: borderRadius.md,
                      background: `${topic.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={topic.color} strokeWidth={2} />
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
                          padding: `0 ${spacing.xl} ${spacing.xl}`,
                          paddingLeft: `${sp.xl + 48 + sp.md}px`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: spacing.md,
                        }}
                      >
                        {/* Key insight callout */}
                        <div
                          style={{
                            borderLeft: `3px solid ${topic.color}`,
                            background: `${topic.color}08`,
                            padding: `${spacing.sm} ${spacing.md}`,
                            borderRadius: `0 ${borderRadius.sm} ${borderRadius.sm} 0`,
                          }}
                        >
                          <Typography
                            variant="body"
                            style={{
                              color: colors.text.primary,
                              fontStyle: 'italic',
                              lineHeight: 1.6,
                              margin: 0,
                              opacity: 0.9,
                            }}
                          >
                            {topic.keyInsight}
                          </Typography>
                        </div>

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
