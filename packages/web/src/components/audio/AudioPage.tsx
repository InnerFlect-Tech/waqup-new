'use client';

import React, { useState } from 'react';
import { Typography, Button } from '@/components';
import { SpeakingAnimation } from '@/components/audio';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Play, Pause } from 'lucide-react';
import type { ContentItemType } from '@/components/content/ContentItem';

export interface AudioPageProps {
  id: string;
  contentType: ContentItemType;
  title?: string;
  backHref: string;
  onSave?: () => void;
}

export function AudioPage({ id, contentType, title, backHref, onSave }: AudioPageProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [volumeVoice, setVolumeVoice] = useState(80);
  const [volumeAmbient, setVolumeAmbient] = useState(40);
  const [volumeMaster, setVolumeMaster] = useState(100);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const handleSave = () => {
    onSave?.();
    // No-op for now; could show toast
  };

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: colors.glass.light,
    appearance: 'none',
    outline: 'none',
  };

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <Link href={backHref} style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.lg }}>
          <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
            ← Back
          </Typography>
        </Link>

        <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
          {title ?? `Edit sound — ${contentType} ${id}`}
        </Typography>
        <Typography variant="body" style={{ marginBottom: spacing.xl, color: colors.text.secondary }}>
          Adjust volumes, preview, and customize your audio experience.
        </Typography>

        {/* Waveform visualization */}
        <div
          style={{
            marginBottom: spacing.xl,
            borderRadius: borderRadius.lg,
            overflow: 'hidden',
            background: colors.glass.light,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <SpeakingAnimation isSpeaking={isPreviewPlaying} style={{ minHeight: '200px' }} />
        </div>

        {/* Preview controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
          <Button
            variant="primary"
            size="md"
            style={{ background: colors.gradients.primary }}
            onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
          >
            {isPreviewPlaying ? (
              <>
                <Pause size={18} strokeWidth={2.5} style={{ marginRight: spacing.xs }} />
                Pause
              </>
            ) : (
              <>
                <Play size={18} strokeWidth={2.5} style={{ marginRight: spacing.xs }} />
                Preview
              </>
            )}
          </Button>
          <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
            Preview playback
          </Typography>
        </div>

        {/* Volume sliders */}
        <div style={{ marginBottom: spacing.xl }}>
          <Typography variant="h3" style={{ marginBottom: spacing.lg, color: colors.text.primary }}>
            Volume mix
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>
                  Voice
                </Typography>
                <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
                  {volumeVoice}%
                </Typography>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volumeVoice}
                onChange={(e) => setVolumeVoice(Number(e.target.value))}
                style={{
                  ...sliderStyle,
                  background: `linear-gradient(to right, ${colors.accent.primary}, ${colors.glass.light})`,
                }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>
                  Ambient / Music
                </Typography>
                <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
                  {volumeAmbient}%
                </Typography>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volumeAmbient}
                onChange={(e) => setVolumeAmbient(Number(e.target.value))}
                style={{
                  ...sliderStyle,
                  background: `linear-gradient(to right, ${colors.accent.secondary}, ${colors.glass.light})`,
                }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>
                  Master
                </Typography>
                <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
                  {volumeMaster}%
                </Typography>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volumeMaster}
                onChange={(e) => setVolumeMaster(Number(e.target.value))}
                style={{
                  ...sliderStyle,
                  background: `linear-gradient(to right, ${colors.accent.tertiary}, ${colors.glass.light})`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Link href={backHref} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button variant="primary" size="md" style={{ background: colors.gradients.primary }} onClick={handleSave}>
            Save
          </Button>
        </div>
      </PageContent>
    </PageShell>
  );
}
