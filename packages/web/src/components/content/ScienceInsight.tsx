'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { FlaskConical, ExternalLink } from 'lucide-react';

export type ScienceTopic =
  | 'neuroplasticity'
  | 'habit-formation'
  | 'voice-identity'
  | 'visualization'
  | 'sleep-subconscious'
  | 'sacred-frequencies';

const TOPIC_META: Record<ScienceTopic, { label: string; color: string }> = {
  'neuroplasticity': { label: 'Neuroplasticity', color: '#c084fc' },
  'habit-formation': { label: 'Habit Formation', color: '#f97316' },
  'voice-identity': { label: 'Voice & Identity', color: '#60a5fa' },
  'visualization': { label: 'Visualization', color: '#34d399' },
  'sleep-subconscious': { label: 'Sleep & Subconscious', color: '#a78bfa' },
  'sacred-frequencies': { label: 'Sacred Frequencies', color: '#fb7185' },
};

export interface ScienceInsightProps {
  topic: ScienceTopic;
  insight: string;
  /** Additional topics to badge alongside the primary */
  additionalTopics?: ScienceTopic[];
}

export function ScienceInsight({ topic, insight, additionalTopics = [] }: ScienceInsightProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const meta = TOPIC_META[topic];

  const allTopics = [topic, ...additionalTopics];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        marginTop: spacing.lg,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        background: `${meta.color}0d`,
        border: `1px solid ${meta.color}30`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing.sm,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: borderRadius.sm,
          background: `${meta.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        <FlaskConical size={14} color={meta.color} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.xs }}>
          {allTopics.map((t) => {
            const m = TOPIC_META[t];
            return (
              <span
                key={t}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: m.color,
                  background: `${m.color}18`,
                  padding: `2px ${spacing.xs}`,
                  borderRadius: borderRadius.full,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {m.label}
              </span>
            );
          })}
        </div>
        <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
          {insight}
        </Typography>
      </div>
      <Link
        href="/sanctuary/learn"
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          color: colors.text.secondary,
          textDecoration: 'none',
          fontSize: 11,
          opacity: 0.6,
          transition: 'opacity 0.15s',
        }}
        title="Learn more"
      >
        <ExternalLink size={12} />
      </Link>
    </motion.div>
  );
}
