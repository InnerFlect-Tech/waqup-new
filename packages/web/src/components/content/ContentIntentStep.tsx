'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { ScienceInsight } from './ScienceInsight';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import type { ContentItemType } from '@waqup/shared/types';
import { ChevronLeft } from 'lucide-react';

const MAX_CHARS = 300;

const TYPE_PROMPTS: Record<ContentItemType, { heading: string; placeholder: string; hint: string }> = {
  affirmation: {
    heading: 'What do you want to change or strengthen?',
    placeholder:
      'e.g. I want to feel genuinely confident in social situations and stop second-guessing myself…',
    hint: 'Focus on a specific area — confidence, abundance, health, relationships. The more specific, the more powerful.',
  },
  meditation: {
    heading: 'What state or outcome are you seeking?',
    placeholder:
      'e.g. I want to fall asleep more easily and wake up feeling genuinely rested…',
    hint: 'Think about the feeling you want — calm, focus, deep sleep, clarity. Describe the experience, not just the goal.',
  },
  ritual: {
    heading: 'What transformation do you intend?',
    placeholder:
      'e.g. I want to start my mornings with purpose and carry that energy through my day…',
    hint: 'Rituals work on identity — describe who you want to become, not just what you want to achieve.',
  },
};

export interface ContentIntentStepProps {
  backHref: string;
  nextHref: string;
  scienceInsightOverride?: React.ReactNode;
}

export function ContentIntentStep({ backHref, nextHref, scienceInsightOverride }: ContentIntentStepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { contentType, intent, setIntent, setCurrentStep } = useContentCreation();

  const [value, setValue] = useState(intent);
  const prompt = TYPE_PROMPTS[contentType];

  const handleContinue = () => {
    setIntent(value.trim());
    setCurrentStep('intent');
    router.push(nextHref);
  };

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: spacing.xl, textAlign: 'center' }}
      >
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          {prompt.heading}
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary }}>
          {prompt.hint}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: spacing.xl }}
      >
        <div
          style={{
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${value.length > 0 ? colors.accent.primary + '50' : colors.glass.border}`,
            padding: spacing.lg,
            transition: 'border-color 0.2s',
          }}
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
            placeholder={prompt.placeholder}
            rows={5}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 16,
              lineHeight: 1.7,
              color: colors.text.primary,
              fontFamily: 'inherit',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: spacing.sm,
            }}
          >
            <Typography
              variant="small"
              style={{
                color: value.length > MAX_CHARS * 0.9 ? '#ef4444' : colors.text.secondary,
                fontSize: 12,
                opacity: 0.7,
              }}
            >
              {value.length}/{MAX_CHARS}
            </Typography>
          </div>
        </div>

        {scienceInsightOverride ?? (
          <ScienceInsight
            topic="neuroplasticity"
            insight="Each time you articulate your intent clearly, you begin forming the neural pathway this practice will reinforce."
          />
        )}
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href={backHref} style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="md" style={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} /> Back
          </Button>
        </Link>
        <Button
          variant="primary"
          size="lg"
          disabled={value.trim().length < 10}
          onClick={handleContinue}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
