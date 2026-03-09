'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AudioPage } from '@/components/audio';
import { createContentService } from '@waqup/shared/services';
import { supabase } from '@/lib/supabase';
import type { ContentItem } from '@waqup/shared/types';
import type { AudioLayers } from '@waqup/shared/types';
import { Typography } from '@/components';
import { PageShell, PageContent } from '@/components';

export default function MeditationEditAudioPage() {
  const params = useParams();
  const id = params.id as string;
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <PageShell intensity="medium">
        <PageContent width="narrow">
          <Typography variant="body" style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', paddingTop: 80 }}>
            Loading…
          </Typography>
        </PageContent>
      </PageShell>
    );
  }

  if (error || !content) {
    return (
      <PageShell intensity="medium">
        <PageContent width="narrow">
          <Typography variant="body" style={{ color: '#ef4444', textAlign: 'center', paddingTop: 80 }}>
            {error ?? 'Content not found'}
          </Typography>
        </PageContent>
      </PageShell>
    );
  }

  const layers: AudioLayers = {
    voiceUrl: content.voiceUrl ?? content.audioUrl ?? null,
    ambientUrl: content.ambientUrl ?? null,
    binauralUrl: null,
  };

  const initialVolumes = content.audioSettings
    ? {
        voice: content.audioSettings.volumeVoice,
        ambient: content.audioSettings.volumeAmbient,
        binaural: content.audioSettings.volumeBinaural,
        master: content.audioSettings.volumeMaster,
      }
    : undefined;

  return (
    <AudioPage
      id={id}
      contentType="meditation"
      title={content.title}
      backHref={`/sanctuary/meditations`}
      layers={layers}
      audioSettings={content.audioSettings}
      initialVolumes={initialVolumes}
    />
  );
}
