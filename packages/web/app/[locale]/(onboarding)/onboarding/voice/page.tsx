'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTheme, spacing, borderRadius, BLUR } from '@/theme';
import { PageShell } from '@/components';
import { Typography, Button } from '@/components';
import { Link } from '@/i18n/navigation';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { getVoiceStatus, createVoice } from '@/lib/api-client';
import type { VoiceStatus } from '@/lib/api-client';
import { useAuthStore } from '@/stores';
import { Analytics } from '@waqup/shared/utils';
import { useTranslations } from 'next-intl';

const RECORDING_TIPS = [
  'Record in a quiet room with no background noise',
  'Speak clearly and at a natural pace',
  'Keep 30+ seconds of total audio for best results',
  'Use a good microphone or phone voice memo app',
  'Read a passage aloud — a book, article, or poem works well',
];

export default function OnboardingVoicePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const t = useTranslations('onboarding.voice');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const intentionParam = searchParams.get('intention') ?? '';
  const skipHref = intentionParam ? `/onboarding/profile?intention=${encodeURIComponent(intentionParam)}` : '/onboarding/profile';

  const [status, setStatus] = useState<VoiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('My Voice');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [removeNoise, setRemoveNoise] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVoiceStatus();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
      setStatus({ voice_id: null, name: null, language: null, status: 'not_setup' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...files.filter((f) => !names.has(f.name))];
    });
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Voice name is required');
      return;
    }
    if (!selectedFiles.length) {
      setError('Upload at least one audio sample');
      return;
    }
    try {
      setCreating(true);
      setError(null);
      const formData = new FormData();
      formData.append('name', name.trim());
      selectedFiles.forEach((f) => formData.append('files', f));
      formData.append('remove_background_noise', String(removeNoise));
      await createVoice(formData);
      Analytics.onboardingStepCompleted('voice', user?.id);
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create voice');
    } finally {
      setCreating(false);
    }
  };

  const handleContinue = () => {
    Analytics.onboardingStepCompleted('voice', user?.id);
    router.push(skipHref);
  };

  if (loading) {
    return (
      <PageShell intensity="strong" maxWidth={520}>
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader2 size={32} color={colors.accent.primary} className="animate-spin" />
        </div>
      </PageShell>
    );
  }

  const showCreateForm = status?.status === 'not_setup';
  const showSuccess = status?.status === 'ready' || status?.status === 'processing';

  return (
    <PageShell intensity="strong" maxWidth={520}>
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: spacing.xl,
          paddingBottom: spacing.xxxl,
          gap: spacing.xl,
        }}
      >
        {/* Progress indicator — 5 dots */}
        <div style={{ display: 'flex', gap: spacing.sm, paddingTop: spacing.md }}>
          {([1, 2, 3, 4, 5] as const).map((i) => (
            <div
              key={i}
              style={{
                height: '3px',
                width: '32px',
                borderRadius: borderRadius.full,
                background: i <= 3 ? colors.accent.primary : `${colors.accent.primary}30`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            padding: `${spacing.xxl} ${spacing.xl}`,
            width: '100%',
            background: colors.glass.light,
            backdropFilter: BLUR.lg,
            WebkitBackdropFilter: BLUR.lg,
            borderRadius: borderRadius.xl,
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <Typography
            variant="h1"
            style={{
              color: colors.text.primary,
              fontSize: 'clamp(22px, 5vw, 28px)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: spacing.sm,
            }}
          >
            {t('headline')}
          </Typography>
          <Typography
            variant="body"
            style={{ color: colors.text.secondary, fontSize: '15px', lineHeight: 1.6, marginBottom: spacing.lg }}
          >
            {t('subhead')}
          </Typography>
          <div
            style={{
              textAlign: 'left',
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: `${colors.accent.primary}0A`,
              border: `1px solid ${colors.accent.primary}20`,
              marginBottom: spacing.sm,
            }}
          >
            <Typography variant="small" style={{ color: colors.text.primary, fontWeight: 600, marginBottom: spacing.xs, display: 'block' }}>
              {t('optionFree')}
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block', fontSize: '13px' }}>
              {t('optionClone')}
            </Typography>
            <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary, fontSize: '12px' }}>
              {t('costNote')}
            </Typography>
          </div>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.sm,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: `${colors.error}18`,
              border: `1px solid ${colors.error}40`,
              width: '100%',
            }}
          >
            <AlertCircle size={16} color={colors.error} style={{ marginTop: 2, flexShrink: 0 }} />
            <Typography variant="small" style={{ color: colors.error }}>{error}</Typography>
          </div>
        )}

        {showCreateForm && (
          <div
            style={{
              width: '100%',
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <div style={{ marginBottom: spacing.md }}>
              <label style={{ display: 'block', marginBottom: spacing.xs }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>{t('voiceName')}</Typography>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Voice"
                style={{
                  width: '100%',
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.transparent,
                  color: colors.text.primary,
                  fontSize: 15,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: spacing.md }}>
              <label style={{ display: 'block', marginBottom: spacing.xs }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>
                  {t('audioSamples')} <span style={{ color: colors.error }}>*</span>
                </Typography>
              </label>
              <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary, marginBottom: spacing.sm, display: 'block', fontSize: 12 }}>
                {t('audioHint')}
              </Typography>
              <input ref={fileInputRef} type="file" accept="audio/*" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  width: '100%',
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: borderRadius.md,
                  border: `2px dashed ${selectedFiles.length ? colors.accent.primary : colors.glass.border}`,
                  background: selectedFiles.length ? `${colors.accent.primary}08` : colors.glass.transparent,
                  color: selectedFiles.length ? colors.accent.primary : colors.text.secondary,
                  cursor: 'pointer',
                  fontSize: 14,
                  justifyContent: 'center',
                }}
              >
                <Upload size={18} />
                {selectedFiles.length ? `${selectedFiles.length} file(s)` : t('uploadCta')}
              </button>
              {selectedFiles.length > 0 && (
                <div style={{ marginTop: spacing.sm, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                  {selectedFiles.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: `${spacing.xs} ${spacing.md}`,
                        borderRadius: borderRadius.sm,
                        background: colors.glass.transparent,
                        border: `1px solid ${colors.glass.border}`,
                      }}
                    >
                      <Typography variant="small" style={{ color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                        {file.name}
                      </Typography>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text.secondary, padding: '2px 4px', fontSize: 14 }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: 'pointer', marginBottom: spacing.md }}>
              <input type="checkbox" checked={removeNoise} onChange={(e) => setRemoveNoise(e.target.checked)} style={{ accentColor: colors.accent.primary }} />
              <Typography variant="small" style={{ color: colors.text.secondary }}>{t('removeNoise')}</Typography>
            </label>

            <div
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.md,
                background: `${colors.accent.primary}0A`,
                border: `1px solid ${colors.accent.primary}20`,
                marginBottom: spacing.lg,
              }}
            >
              <Typography variant="small" style={{ color: colors.accent.primary, fontWeight: 600, marginBottom: spacing.sm, display: 'block' }}>
                {t('tipsTitle')}
              </Typography>
              <ul style={{ margin: 0, paddingLeft: spacing.lg, listStyle: 'disc' }}>
                {RECORDING_TIPS.map((tip) => (
                  <li key={tip} style={{ marginBottom: spacing.xs }}>
                    <Typography variant="small" style={{ color: colors.text.secondary }}>{tip}</Typography>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="primary" size="lg" fullWidth loading={creating} onClick={handleCreate}>
              {creating ? <Loader2 size={18} className="animate-spin" /> : t('createCta')}
            </Button>
          </div>
        )}

        {showSuccess && (
          <div
            style={{
              width: '100%',
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg }}>
              {status?.status === 'ready' ? t('readyMessage') : t('processingMessage')}
            </Typography>
            <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
              {t('continueCta')}
            </Button>
          </div>
        )}

        {/* CTA + Skip */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'center' }}>
          {!showCreateForm && !showSuccess && (
            <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
              {t('continueCta')}
            </Button>
          )}
          <Link
            href={skipHref}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: `${spacing.sm} 0`,
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '13px', opacity: 0.6 }}>
              {t('skipLabel')}
            </Typography>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
