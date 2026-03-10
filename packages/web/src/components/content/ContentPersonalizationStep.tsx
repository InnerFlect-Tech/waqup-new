'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { ScienceInsight } from './ScienceInsight';
import { useContentCreation, type PersonalizationData } from '@/lib/contexts/ContentCreationContext';
import { Check, ChevronLeft } from 'lucide-react';

const CORE_VALUES = [
  { id: 'courage', label: 'Courage', color: '#f59e0b' },
  { id: 'integrity', label: 'Integrity', color: '#34d399' },
  { id: 'growth', label: 'Growth', color: '#60a5fa' },
  { id: 'love', label: 'Love', color: '#fb7185' },
  { id: 'freedom', label: 'Freedom', color: '#f97316' },
  { id: 'wisdom', label: 'Wisdom', color: '#a78bfa' },
  { id: 'service', label: 'Service', color: '#6ee7b7' },
  { id: 'presence', label: 'Presence', color: '#c084fc' },
  { id: 'discipline', label: 'Discipline', color: '#94a3b8' },
  { id: 'joy', label: 'Joy', color: '#fde68a' },
  { id: 'authenticity', label: 'Authenticity', color: '#67e8f9' },
  { id: 'resilience', label: 'Resilience', color: '#fca5a5' },
];

export interface ContentPersonalizationStepProps {
  backHref: string;
  nextHref: string;
}

export function ContentPersonalizationStep({ backHref, nextHref }: ContentPersonalizationStepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { personalization, setPersonalization, setCurrentStep } = useContentCreation();

  const [selectedValues, setSelectedValues] = useState<string[]>(personalization.coreValues ?? []);
  const [name, setName] = useState(personalization.name ?? '');
  const [whyThisMatters, setWhyThisMatters] = useState(personalization.whyThisMatters ?? '');

  const toggleValue = (id: string) => {
    setSelectedValues((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev
    );
  };

  const handleContinue = () => {
    const data: PersonalizationData = {
      coreValues: selectedValues,
      name: name.trim(),
      whyThisMatters: whyThisMatters.trim(),
    };
    setPersonalization(data);
    setCurrentStep('personalization');
    router.push(nextHref);
  };

  const canContinue = selectedValues.length > 0;

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: spacing.xl, textAlign: 'center' }}
      >
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          Personalise Your Ritual
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary }}>
          Rituals work at the identity level — the more personal, the more powerful.
        </Typography>
      </motion.div>

      {/* Core Values */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: spacing.xl }}>
        <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 400 }}>
          Your core values
        </Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.md, display: 'block' }}>
          Choose up to 3 that resonate most deeply right now
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
          {CORE_VALUES.map(({ id, label, color }) => {
            const selected = selectedValues.includes(id);
            const atMax = selectedValues.length >= 3 && !selected;
            return (
              <button
                key={id}
                onClick={() => !atMax && toggleValue(id)}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${selected ? color + '80' : colors.glass.border}`,
                  background: selected ? `${color}18` : atMax ? 'transparent' : 'transparent',
                  color: selected ? color : atMax ? colors.text.secondary + '50' : colors.text.secondary,
                  fontSize: 13,
                  cursor: atMax ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  transition: 'all 0.15s',
                  opacity: atMax ? 0.4 : 1,
                }}
              >
                {selected && <Check size={12} strokeWidth={3} />}
                {label}
              </button>
            );
          })}
        </div>
        {selectedValues.length === 3 && (
          <Typography variant="small" style={{ color: colors.text.secondary, marginTop: spacing.sm, display: 'block', fontSize: 12 }}>
            {selectedValues.length}/3 selected
          </Typography>
        )}
      </motion.div>

      {/* Name */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: spacing.xl }}>
        <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 400 }}>
          What do you call yourself in this work?
        </Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}>
          Your name, a version of your name, or a title that feels true — e.g. &ldquo;Alex&rdquo;, &ldquo;Future Me&rdquo;, &ldquo;The Builder&rdquo;
        </Typography>
        <div
          style={{
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${name.length > 0 ? colors.accent.primary + '50' : colors.glass.border}`,
            padding: `${spacing.sm} ${spacing.lg}`,
            transition: 'border-color 0.2s',
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            placeholder="Your name or preferred identity"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 16,
              color: colors.text.primary,
              fontFamily: 'inherit',
              padding: `${spacing.sm} 0`,
            }}
          />
        </div>
      </motion.div>

      {/* Why This Matters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: spacing.xl }}>
        <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 400 }}>
          Why does this transformation matter?
        </Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}>
          The deeper the &ldquo;why&rdquo;, the more the ritual resonates. Be honest and personal.
        </Typography>
        <div
          style={{
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${whyThisMatters.length > 0 ? colors.accent.primary + '50' : colors.glass.border}`,
            padding: spacing.lg,
            transition: 'border-color 0.2s',
          }}
        >
          <textarea
            value={whyThisMatters}
            onChange={(e) => setWhyThisMatters(e.target.value.slice(0, 300))}
            placeholder="e.g. Because I want my kids to see what it looks like to truly show up for yourself…"
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

        <ScienceInsight
          topic="voice-identity"
          insight="Rituals that reference your name and core values create a direct signal to the subconscious: this is who I am."
          additionalTopics={['habit-formation']}
        />
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href={backHref} style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="md" style={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} /> Back
          </Button>
        </Link>
        <Button variant="primary" size="lg" disabled={!canContinue} onClick={handleContinue}>
          Generate Script →
        </Button>
      </div>
    </div>
  );
}
