'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { ScienceInsight } from './ScienceInsight';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import type { ContentType } from '@/lib/contexts/ContentCreationContext';
import type { ScienceTopic } from './ScienceInsight';
import { Sun, Moon, Clock, MapPin, ChevronLeft } from 'lucide-react';

const TIME_OPTIONS = [
  { id: 'morning', label: 'Morning', icon: Sun, color: '#f59e0b' },
  { id: 'midday', label: 'Midday', icon: Clock, color: '#60a5fa' },
  { id: 'evening', label: 'Evening', icon: Moon, color: '#a78bfa' },
  { id: 'before-sleep', label: 'Before Sleep', icon: Moon, color: '#6366f1' },
  { id: 'anytime', label: 'Anytime', icon: MapPin, color: '#34d399' },
];

const TYPE_COPY: Record<ContentType, { heading: string; placeholder: string; scienceTopic: ScienceTopic; scienceInsight: string }> = {
  affirmation: {
    heading: 'When will you practice this?',
    placeholder: 'e.g. Every morning before I check my phone, while making coffee…',
    scienceTopic: 'habit-formation',
    scienceInsight: 'Consistent cues — time, place, sensation — train the brain to enter the practice state automatically.',
  },
  meditation: {
    heading: 'When and where will you meditate?',
    placeholder: 'e.g. In bed just before sleep with headphones, in a quiet corner of my office at lunch…',
    scienceTopic: 'sleep-subconscious',
    scienceInsight: 'Transitional states — waking and falling asleep — dramatically lower the critical mind\'s resistance. Timing is everything.',
  },
  ritual: {
    heading: 'When will you perform this ritual?',
    placeholder: 'e.g. Every morning after brushing my teeth, before I open any screens…',
    scienceTopic: 'habit-formation',
    scienceInsight: 'Rituals need a reliable cue. Anchoring to an existing habit ("habit stacking") makes the new pattern automatic within weeks.',
  },
};

export interface ContentContextStepProps {
  backHref: string;
  nextHref: string;
}

export function ContentContextStep({ backHref, nextHref }: ContentContextStepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { contentType, context, setContext, setCurrentStep } = useContentCreation();

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [details, setDetails] = useState(context);
  const copy = TYPE_COPY[contentType];

  const handleContinue = () => {
    const fullContext = [selectedTime ? `Time: ${selectedTime}` : '', details.trim()].filter(Boolean).join('. ');
    setContext(fullContext);
    setCurrentStep('context');
    router.push(nextHref);
  };

  const canContinue = selectedTime !== null || details.trim().length >= 5;

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: spacing.xl, textAlign: 'center' }}
      >
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          {copy.heading}
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary }}>
          Consistency is built on context — tell us when this fits your life.
        </Typography>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: spacing.lg }}>
        <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.md, fontWeight: 400, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Best time
        </Typography>
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          {TIME_OPTIONS.map(({ id, label, icon: Icon, color }) => {
            const selected = selectedTime === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedTime(selected ? null : id)}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${selected ? color + '80' : colors.glass.border}`,
                  background: selected ? `${color}18` : 'transparent',
                  color: selected ? color : colors.text.secondary,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={13} strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: spacing.xl }}>
        <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontWeight: 400, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          More detail (optional)
        </Typography>
        <div
          style={{
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${details.length > 0 ? colors.accent.primary + '50' : colors.glass.border}`,
            padding: spacing.lg,
            transition: 'border-color 0.2s',
          }}
        >
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value.slice(0, 250))}
            placeholder={copy.placeholder}
            rows={3}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 15,
              lineHeight: 1.7,
              color: colors.text.primary,
              fontFamily: 'inherit',
            }}
          />
        </div>

        <ScienceInsight topic={copy.scienceTopic} insight={copy.scienceInsight} />
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href={backHref} style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="md" style={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} /> Back
          </Button>
        </Link>
        <Button variant="primary" size="lg" disabled={!canContinue} onClick={handleContinue}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
