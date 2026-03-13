'use client';

import React, { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { ScienceInsight } from './ScienceInsight';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { CONTENT_TYPE_META } from '@/lib/creation-steps';
import { createContentService } from '@waqup/shared/services';
import { supabase } from '@/lib/supabase';
import { Eye, Target, FileText, Mic, Music, ArrowRight, Edit3, Loader2, CheckCircle, ChevronLeft } from 'lucide-react';
import { getAtmospherePreset, getBinauralPreset } from '@waqup/shared/constants';

interface ReviewSection {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  value: string | null | undefined;
  editHref: string;
}

export interface ContentReviewStepProps {
  backHref: string;
  completeHref: string;
  intentEditHref: string;
  scriptEditHref: string;
  voiceEditHref: string;
  audioEditHref: string;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function ContentReviewStep({
  backHref,
  completeHref,
  intentEditHref,
  scriptEditHref,
  voiceEditHref,
  audioEditHref,
}: ContentReviewStepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const locale = useLocale();
  const { contentType, intent, context, personalization, script, voiceId, voiceType, ownVoiceUrl, audioSettings, setCurrentStep } = useContentCreation();

  const meta = CONTENT_TYPE_META[contentType];
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const sections: ReviewSection[] = [
    {
      icon: Target,
      label: 'Intent',
      value: intent || null,
      editHref: intentEditHref,
    },
    ...(context
      ? [
          {
            icon: FileText as React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>,
            label: 'Context',
            value: context,
            editHref: intentEditHref,
          },
        ]
      : []),
    ...(personalization && Object.keys(personalization).length > 0
      ? [
          {
            icon: Target as React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>,
            label: 'Personalization',
            value: [
              personalization.name ? `Name: ${personalization.name}` : null,
              personalization.coreValues?.length ? `Values: ${personalization.coreValues.join(', ')}` : null,
              personalization.whyThisMatters ? `Why: ${personalization.whyThisMatters}` : null,
            ]
              .filter(Boolean)
              .join('\n') || null,
            editHref: intentEditHref,
          },
        ]
      : []),
    {
      icon: FileText,
      label: 'Script',
      value: script
        ? contentType === 'affirmation'
          ? script
          : script.slice(0, 300) + (script.length > 300 ? '…' : '')
        : null,
      editHref: scriptEditHref,
    },
    {
      icon: Mic,
      label: 'Voice',
      value: voiceId ? `Voice ID: …${voiceId.slice(-6)}` : 'Voice selected',
      editHref: voiceEditHref,
    },
    {
      icon: Music,
      label: 'Audio mix',
      value: audioSettings
        ? [
            `Voice ${audioSettings.volumeVoice}%`,
            audioSettings.binauralPresetId !== 'none'
              ? `${getBinauralPreset(audioSettings.binauralPresetId).label} binaural ${audioSettings.volumeBinaural}%`
              : null,
            audioSettings.atmospherePresetId !== 'none'
              ? `${getAtmospherePreset(audioSettings.atmospherePresetId).label} ${audioSettings.volumeAmbient}%`
              : null,
          ].filter(Boolean).join(' · ')
        : 'Audio settings configured',
      editHref: audioEditHref,
    },
  ];

  const handleSave = useCallback(async () => {
    setSaveState('saving');
    setErrorMsg('');
    try {
      const title = intent.split(/[.!?]/)[0].trim().slice(0, 60) || `My ${contentType}`;

      // Resolve atmosphere URL from preset if selected
      const atmospherePreset = audioSettings?.atmospherePresetId
        ? getAtmospherePreset(audioSettings.atmospherePresetId)
        : null;
      const ambientUrl = atmospherePreset?.fileUrl ?? null;

      const result = await createContentService(supabase).createContent({
        type: contentType,
        title,
        description: intent || '',
        script: script || undefined,
        status: 'draft',
        voiceType: voiceType === 'ai' ? 'ai' : voiceType === 'own' ? 'recorded' : undefined,
        audioSettings: audioSettings ?? undefined,
        ambientUrl: ambientUrl ?? undefined,
      });
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Failed to save content');
      }
      const savedId = result.data.id;

      // Kick off render: AI or Library voice (voiceId) → TTS; own recorded voice (ownVoiceUrl) → no TTS
      if (voiceId && script) {
        // AI voice OR Library voice (IVC) — both use ElevenLabs TTS
        fetch('/api/ai/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentId: savedId, text: script, voiceId, locale }),
        }).catch(() => {
          // Render failure is non-fatal — user can retry from Audio Studio
        });
      } else if (ownVoiceUrl && script) {
        // Own recorded voice — use uploaded recording URL directly, no TTS
        fetch('/api/ai/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentId: savedId, text: script, ownVoiceUrl, locale }),
        }).catch(() => {
          // Render failure is non-fatal — user can retry from Audio Studio
        });
      }

      setSaveState('saved');
      setCurrentStep('complete');
      setTimeout(() => router.push(`${completeHref}?id=${savedId}`), 600);
    } catch (err) {
      setSaveState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong saving your content. Please try again.');
    }
  }, [contentType, completeHref, intent, locale, script, voiceId, voiceType, ownVoiceUrl, audioSettings, router, setCurrentStep]);

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: spacing.xl, textAlign: 'center' }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `${meta.color}18`,
            border: `1px solid ${meta.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing.md}`,
          }}
        >
          <Eye size={24} color={meta.color} />
        </div>
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          {contentType === 'affirmation'
            ? 'Review your identity affirmations'
            : contentType === 'meditation'
            ? 'Review your meditation'
            : contentType === 'ritual'
            ? 'Review your daily conditioning sequence'
            : `Review your ${contentType}`}
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary }}>
          {contentType === 'affirmation'
            ? 'These lines will deepen your identity loop. Save when ready.'
            : contentType === 'meditation'
            ? 'A short practice for state regulation. Save when ready.'
            : contentType === 'ritual'
            ? 'Your repeatable daily practice. Save when ready.'
            : 'Everything looks good? Save it to your sanctuary.'}
        </Typography>
      </motion.div>

      {/* Review sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.xl }}>
        {sections.map(({ icon: Icon, label, value, editHref }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${value ? meta.color + '25' : colors.glass.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.md, flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: borderRadius.md,
                    background: `${meta.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <Icon size={17} color={meta.color} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
                    {label}
                  </Typography>
                  {value ? (
                    <Typography variant="body" style={{ color: colors.text.primary, lineHeight: 1.6, fontSize: 14, whiteSpace: 'pre-wrap' }}>
                      {value}
                    </Typography>
                  ) : (
                    <Typography variant="small" style={{ color: colors.text.secondary, opacity: 0.5, fontStyle: 'italic', fontSize: 13 }}>
                      Not set
                    </Typography>
                  )}
                </div>
              </div>
              <Link href={editHref} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: borderRadius.md,
                    background: 'transparent',
                    border: `1px solid ${colors.glass.border}`,
                    cursor: 'pointer',
                    color: colors.text.secondary,
                    fontSize: 12,
                    transition: 'all 0.15s',
                  }}
                >
                  <Edit3 size={11} />
                  Edit
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {saveState === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: spacing.md,
            borderRadius: borderRadius.lg,
            background: '#ef444415',
            border: '1px solid #ef444440',
            marginBottom: spacing.lg,
          }}
        >
          <Typography variant="small" style={{ color: '#ef4444', fontSize: 13 }}>
            {errorMsg}
          </Typography>
        </motion.div>
      )}

      <ScienceInsight
        topic="neuroplasticity"
        insight="The moment of saving is the moment of commitment. Each time you return to this practice, you reinforce the neural pathway it creates."
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl }}>
        <Link href={backHref} style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="md" style={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} /> Back
          </Button>
        </Link>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          disabled={saveState === 'saving' || saveState === 'saved'}
          style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}
        >
          {saveState === 'saving' && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Loader2 size={16} />
            </motion.div>
          )}
          {saveState === 'saved' && <CheckCircle size={16} />}
          {saveState === 'idle' || saveState === 'error' ? (
            <>
              Save to Sanctuary
              <ArrowRight size={16} />
            </>
          ) : saveState === 'saving' ? (
            'Saving…'
          ) : (
            'Saved!'
          )}
        </Button>
      </div>
    </div>
  );
}
