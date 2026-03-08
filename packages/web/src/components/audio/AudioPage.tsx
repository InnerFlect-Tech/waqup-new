'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button } from '@/components';
import { SpeakingAnimation } from '@/components/audio';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import type { ContentItemType } from '@/components/content/ContentItem';
import { useWebAudioPlayer } from '@/hooks';
import type { AudioLayers } from '@waqup/shared/types';
import { PLAYBACK_SPEEDS } from '@waqup/shared/types';

export interface AudioPageProps {
  id: string;
  contentType: ContentItemType;
  title?: string;
  backHref: string;
  layers?: AudioLayers;
  onSave?: () => void;
}

const TYPE_ACCENT: Record<ContentItemType, string> = {
  affirmation: '#c084fc',
  meditation: '#60a5fa',
  ritual: '#34d399',
};

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function AudioPage({ id, contentType, title, backHref, layers, onSave }: AudioPageProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const accent = TYPE_ACCENT[contentType];

  const resolvedLayers: AudioLayers = layers ?? { voiceUrl: null };

  const {
    state,
    position,
    volumes,
    speed,
    analyserNode,
    play,
    pause,
    seek,
    setVolumes,
    setSpeed,
    isReady,
  } = useWebAudioPlayer(resolvedLayers);

  const isPlaying = state === 'playing';
  const progress = position.durationMs > 0 ? position.positionMs / position.durationMs : 0;

  // Pull frequency data from analyser for SpeakingAnimation
  const [freqData, setFreqData] = useState<number[]>([]);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!analyserNode || !isPlaying) {
      setFreqData([]);
      return;
    }
    const buf = new Uint8Array(analyserNode.frequencyBinCount);
    const tick = () => {
      analyserNode.getByteFrequencyData(buf);
      setFreqData(Array.from(buf.slice(0, 32)));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyserNode, isPlaying]);

  const sliderBase: React.CSSProperties = {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    appearance: 'none',
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <Link href={backHref} style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.lg }}>
          <Typography variant="small" style={{ color: colors.text.secondary }}>
            ← Back
          </Typography>
        </Link>

        <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
          {title ?? `Edit sound — ${contentType}`}
        </Typography>
        <Typography variant="body" style={{ marginBottom: spacing.xl, color: colors.text.secondary }}>
          Adjust volumes, preview, and customize your audio experience.
        </Typography>

        {/* VoiceOrb / waveform visualization — fed by real analyser */}
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
          <SpeakingAnimation isSpeaking={isPlaying} frequencyData={freqData} style={{ minHeight: '200px' }} />
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: spacing.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              {formatTime(position.positionMs)}
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              {formatTime(position.durationMs)}
            </Typography>
          </div>
          <div
            style={{
              position: 'relative',
              height: 6,
              borderRadius: 3,
              background: colors.glass.border,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const frac = (e.clientX - rect.left) / rect.width;
              seek(frac * position.durationMs);
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                borderRadius: 3,
                background: accent,
                width: `${Math.min(progress * 100, 100)}%`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>

        {/* Playback controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.lg, marginBottom: spacing.xl }}>
          <button
            onClick={() => seek(Math.max(0, position.positionMs - 15000))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text.secondary, padding: spacing.sm }}
          >
            <SkipBack size={22} strokeWidth={2} />
          </button>
          <Button
            variant="primary"
            size="md"
            onClick={isPlaying ? pause : play}
            disabled={!isReady && !!resolvedLayers.voiceUrl}
            style={{ backgroundColor: accent, borderColor: accent, minWidth: 100 }}
          >
            {isPlaying ? <><Pause size={18} strokeWidth={2.5} /> Pause</> : <><Play size={18} strokeWidth={2.5} /> Play</>}
          </Button>
          <button
            onClick={() => seek(Math.min(position.durationMs, position.positionMs + 15000))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text.secondary, padding: spacing.sm }}
          >
            <SkipForward size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Speed selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.xl }}>
          {PLAYBACK_SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                padding: `${spacing.xs}px ${spacing.sm}px`,
                borderRadius: borderRadius.sm,
                border: `1px solid ${speed === s ? accent : colors.glass.border}`,
                background: speed === s ? accent + '22' : 'transparent',
                color: speed === s ? accent : colors.text.secondary,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {s}×
            </button>
          ))}
        </div>

        {/* Volume sliders */}
        <div style={{ marginBottom: spacing.xl }}>
          <Typography variant="h3" style={{ marginBottom: spacing.lg, color: colors.text.primary }}>
            Volume mix
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            {[
              { label: 'Voice', key: 'voice' as const, color: accent, value: volumes.voice },
              { label: 'Ambient / Music', key: 'ambient' as const, color: '#60a5fa', value: volumes.ambient },
              { label: 'Master', key: 'master' as const, color: colors.text.secondary, value: volumes.master },
            ].map(({ label, key, color, value }) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                  <Typography variant="small" style={{ color: colors.text.secondary }}>{label}</Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary }}>{value}%</Typography>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) => setVolumes({ [key]: Number(e.target.value) })}
                  style={{ ...sliderBase, background: `linear-gradient(to right, ${color}, ${colors.glass.light})` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Link href={backHref} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="md">Cancel</Button>
          </Link>
          <Button variant="primary" size="md" onClick={onSave}>Save</Button>
        </div>
      </PageContent>
    </PageShell>
  );
}
