'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { AudioPage } from '@/components/audio';
import { createContentService } from '@waqup/shared/services';
import { supabase } from '@/lib/supabase';
import { useSignedRecordingsUrl, useUpdateContent } from '@/hooks';
import type { ContentItem } from '@waqup/shared/types';
import type { AudioLayers } from '@waqup/shared/types';
import { resolveLayersFromContent } from '@waqup/shared/utils';
import { Typography, Button } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export default function RitualEditAudioPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { mutateAsync: updateContent } = useUpdateContent(id);
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rawVoiceUrl = content?.voiceUrl ?? content?.audioUrl ?? null;
  const { url: resolvedVoiceUrl, isLoading: voiceUrlLoading, error: voiceUrlError, retry: retryVoiceUrl } = useSignedRecordingsUrl(rawVoiceUrl);

  useEffect(() => {
    if (!id) return;
    createContentService(supabase)
      .getContentById(id)
      .then((result) => {
        if (result.success && result.data) {
          setContent(result.data);
        } else {
          setError(result.error ?? 'Content not found');
        }
      })
      .catch(() => setError('Failed to load content'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageShell intensity="medium" allowDocumentScroll>
        <PageContent width="narrow">
          <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center', paddingTop: 80 }}>
            Loading…
          </Typography>
        </PageContent>
      </PageShell>
    );
  }

  if (error || !content) {
    return (
      <PageShell intensity="medium" allowDocumentScroll>
        <PageContent width="narrow">
          <Typography variant="body" style={{ color: colors.error, textAlign: 'center', paddingTop: 80 }}>
            {error ?? 'Content not found'}
          </Typography>
        </PageContent>
      </PageShell>
    );
  }

  const isRecordingsUrl = rawVoiceUrl?.includes('/object/public/audio/recordings/');
  const voiceUrl = isRecordingsUrl ? resolvedVoiceUrl : rawVoiceUrl;

  // Show loading/error placeholder when resolving recordings URL (don't render player with null voiceUrl)
  if (isRecordingsUrl && !voiceUrl) {
    return (
      <PageShell intensity="medium" allowDocumentScroll>
        <PageContent width="narrow">
          <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.lg, fontWeight: 300 }}>
            {content.title}
          </Typography>
          <div
            style={{
              padding: spacing.xl,
              borderRadius: 12,
              background: colors.glass.light,
              border: `1px solid ${colors.glass.border}`,
              textAlign: 'center',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.md,
            }}
          >
            {voiceUrlLoading ? (
              <>
                <div style={{ width: 32, height: 32, border: `3px solid ${colors.glass.border}`, borderTopColor: colors.accent.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <Typography variant="body" style={{ color: colors.text.secondary }}>
                  Loading audio…
                </Typography>
              </>
            ) : voiceUrlError ? (
              <>
                <Typography variant="body" style={{ color: colors.error }}>
                  {voiceUrlError}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                  Make sure the migration <code>20260324000001_audio_system_buckets.sql</code> has been applied.
                </Typography>
                <Button variant="primary" size="md" onClick={retryVoiceUrl}>
                  Retry
                </Button>
              </>
            ) : null}
          </div>
        </PageContent>
      </PageShell>
    );
  }

  let layers: AudioLayers = resolveLayersFromContent(content, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
  if (isRecordingsUrl && voiceUrl) {
    layers = { ...layers, voiceUrl };
  }

  const initialVolumes = content.audioSettings
    ? {
        voice: content.audioSettings.volumeVoice,
        ambient: content.audioSettings.volumeAmbient,
        binaural: content.audioSettings.volumeBinaural,
        master: content.audioSettings.volumeMaster,
      }
    : undefined;

  const handleSave = async (data: { audioSettings: import('@waqup/shared/types').AudioSettings; ambientUrl: string | null }) => {
    await updateContent({
      audioSettings: data.audioSettings,
      ambientUrl: data.ambientUrl ?? undefined,
    });
    router.push('/sanctuary/rituals');
  };

  return (
    <AudioPage
      id={id}
      contentType="ritual"
      title={content.title}
      backHref="/sanctuary/rituals"
      layers={layers}
      audioSettings={content.audioSettings}
      initialVolumes={initialVolumes}
      onSave={handleSave}
    />
  );
}
