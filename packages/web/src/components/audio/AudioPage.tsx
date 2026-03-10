'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button } from '@/components';
import { SpeakingAnimation } from '@/components/audio';
import { spacing, borderRadius, BLUR } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { Link } from '@/i18n/navigation';
import { Play, Pause, SkipBack, SkipForward, Waves, Headphones } from 'lucide-react';
import { useWebAudioPlayer, useBinauralEngine } from '@/hooks';
import type { ContentItemType, AudioLayers, AudioVolumes, AudioSettings } from '@waqup/shared/types';
import { PLAYBACK_SPEEDS } from '@waqup/shared/types';
import { CONTENT_TYPE_COLORS, getBinauralPreset, getAtmospherePreset } from '@waqup/shared/constants';
import { supabase } from '@/lib/supabase';
import { formatTime, Analytics } from '@waqup/shared/utils';
import { resolveAtmosphereUrl } from '@/utils/atmosphere';
import { useAuthStore } from '@/stores';

export interface AudioPageProps {
  id: string;
  contentType: ContentItemType;
  title?: string;
  backHref: string;
  layers?: AudioLayers;
  /** Per-content audio settings — used to initialize binaural/atmosphere preset display */
  audioSettings?: AudioSettings | null;
  /** Override initial volumes (e.g. from content.audioSettings) */
  initialVolumes?: Partial<AudioVolumes>;
  onSave?: () => void;
}

const TYPE_ACCENT: Record<ContentItemType, string> = CONTENT_TYPE_COLORS;

interface LayerConfig {
  key: keyof AudioVolumes;
  label: string;
  sublabel: string;
  icon: string;
  colorKey?: 'accent';
  color?: string;
}

async function loadUserVolPrefs(): Promise<Partial<AudioVolumes> | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('profiles')
    .select('pref_vol_voice, pref_vol_ambient, pref_vol_binaural, pref_vol_master')
    .eq('id', user.id)
    .single();
  if (!data) return null;
  return {
    voice:    data.pref_vol_voice   ?? 80,
    ambient:  data.pref_vol_ambient  ?? 40,
    binaural: data.pref_vol_binaural ?? 30,
    master:   data.pref_vol_master   ?? 100,
  };
}

async function saveUserVolPrefs(prefs: AudioVolumes) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('profiles').upsert({
    id: user.id,
    pref_vol_voice:    prefs.voice,
    pref_vol_ambient:  prefs.ambient,
    pref_vol_binaural: prefs.binaural,
    pref_vol_master:   prefs.master,
  });
}

export function AudioPage({
  id,
  contentType,
  title,
  backHref,
  layers,
  audioSettings,
  initialVolumes,
  onSave,
}: AudioPageProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuthStore();
  const accent = TYPE_ACCENT[contentType];

  // Resolve atmosphere URL from Supabase Storage when layers.ambientUrl is not set.
  // resolveAtmosphereUrl() auto-builds the URL from NEXT_PUBLIC_SUPABASE_URL +
  // the audioSettings.atmospherePresetId — the layer activates once files are uploaded.
  const atmospherePresetIdForLayer = audioSettings?.atmospherePresetId ?? 'none';
  const resolvedAmbientUrl =
    layers?.ambientUrl ?? resolveAtmosphereUrl(atmospherePresetIdForLayer) ?? undefined;

  const resolvedLayers: AudioLayers = {
    ...(layers ?? {}),
    voiceUrl: layers?.voiceUrl ?? null,
    ambientUrl: resolvedAmbientUrl,
  };

  const {
    state,
    position,
    volumes,
    speed,
    analyserNode,
    audioContext,
    binauralGain,
    play,
    pause,
    seek,
    setVolumes,
    setSpeed,
    isReady,
  } = useWebAudioPlayer(resolvedLayers, initialVolumes);

  // ── Binaural engine (oscillators) ───────────────────────────────────────
  const binauralPresetId = audioSettings?.binauralPresetId ?? 'none';
  const selectedBinauralPreset = getBinauralPreset(binauralPresetId);

  useBinauralEngine({
    audioContext,
    binauralGain,
    preset: selectedBinauralPreset,
    isPlaying: state === 'playing',
  });

  // ── User preference persistence ─────────────────────────────────────────
  const [prefsSaved, setPrefsSaved] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load user's saved volume preferences on mount
  useEffect(() => {
    loadUserVolPrefs().then((prefs) => {
      if (prefs) setVolumes(prefs);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save user prefs when volumes change (debounced)
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      void saveUserVolPrefs(volumes).then(() => {
        setPrefsSaved(true);
        setTimeout(() => setPrefsSaved(false), 1500);
      });
    }, 1200);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [volumes]);

  const isPlaying = state === 'playing';
  const progress = position.durationMs > 0 ? position.positionMs / position.durationMs : 0;

  // ── Analytics: content played / completed ─────────────────────────────────
  const playedRef = useRef(false);
  useEffect(() => {
    if (state === 'playing' && !playedRef.current) {
      playedRef.current = true;
      Analytics.contentPlayed(id, contentType, user?.id);
    }
    if (state === 'ended') {
      const durationSeconds = Math.round(position.durationMs / 1000);
      Analytics.contentCompleted(id, contentType, durationSeconds, user?.id);
    }
    if (state === 'paused' || state === 'idle') playedRef.current = false;
  }, [state, id, contentType, user?.id, position.durationMs]);

  // ── Frequency data for waveform visualization ───────────────────────────
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

  // ── Layer config — with preset names in sublabels ───────────────────────
  const atmospherePresetId = audioSettings?.atmospherePresetId ?? 'none';
  const selectedAtmospherePreset = getAtmospherePreset(atmospherePresetId);

  const layerConfig: LayerConfig[] = [
    {
      key: 'voice',
      label: 'Voice',
      sublabel: 'Narration & guidance',
      icon: '🎙',
      colorKey: 'accent',
    },
    {
      key: 'binaural',
      label: selectedBinauralPreset.id !== 'none'
        ? `Binaural · ${selectedBinauralPreset.label}`
        : 'Binaural',
      sublabel: selectedBinauralPreset.id !== 'none'
        ? selectedBinauralPreset.description
        : 'No preset selected',
      icon: '〰',
      color: '#a78bfa',
    },
    {
      key: 'ambient',
      label: selectedAtmospherePreset.id !== 'none'
        ? `Atmosphere · ${selectedAtmospherePreset.label}`
        : 'Atmosphere',
      sublabel: selectedAtmospherePreset.id !== 'none'
        ? selectedAtmospherePreset.description
        : 'No soundscape selected',
      icon: '🌊',
      color: '#60a5fa',
    },
    {
      key: 'master',
      label: 'Master',
      sublabel: 'Overall volume',
      icon: '🔊',
      color: '#94a3b8',
    },
  ];

  const sliderBase: React.CSSProperties = {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    appearance: 'none' as React.CSSProperties['appearance'],
    outline: 'none',
    cursor: 'pointer',
  };

  const noBinaural = selectedBinauralPreset.id === 'none';
  const noAtmosphere = selectedAtmospherePreset.id === 'none' || !resolvedLayers.ambientUrl;

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
          {title ?? `Sound mix — ${contentType}`}
        </Typography>
        <Typography variant="body" style={{ marginBottom: spacing.xl, color: colors.text.secondary }}>
          Adjust your three-layer audio mix. Changes are saved to your preferences.
        </Typography>

        {/* Waveform visualization */}
        <div
          style={{
            marginBottom: spacing.xl,
            borderRadius: borderRadius.lg,
            overflow: 'hidden',
            background: colors.glass.light,
            backdropFilter: BLUR.md,
            WebkitBackdropFilter: BLUR.md,
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
            {isPlaying
              ? <><Pause size={18} strokeWidth={2.5} /> Pause</>
              : <><Play size={18} strokeWidth={2.5} /> Play</>
            }
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
                padding: `${spacing.xs} ${spacing.sm}`,
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

        {/* Volume mix — three independent layers + master */}
        <div
          style={{
            marginBottom: spacing.xl,
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.lg,
            WebkitBackdropFilter: BLUR.lg,
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
            <Waves size={18} color={accent} />
            <Typography variant="h3" style={{ color: colors.text.primary }}>
              Volume mix
            </Typography>
            {prefsSaved && (
              <Typography variant="small" style={{ color: colors.text.secondary, marginLeft: 'auto', fontSize: 11 }}>
                Saved
              </Typography>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
            {layerConfig.map(({ key, label, sublabel, icon, color, colorKey }) => {
              const trackColor = colorKey === 'accent' ? accent : (color ?? '#94a3b8');
              const value = volumes[key];
              const isDisabled = (key === 'binaural' && noBinaural) || (key === 'ambient' && noAtmosphere);
              return (
                <div key={key} style={{ opacity: isDisabled ? 0.4 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.sm }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <span style={{ fontSize: 14 }}>{icon}</span>
                        <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500, fontSize: 14 }}>
                          {label}
                        </Typography>
                      </div>
                      <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>
                        {sublabel}
                      </Typography>
                    </div>
                    <Typography
                      variant="small"
                      style={{ color: trackColor, fontWeight: 700, fontSize: 13, minWidth: 36, textAlign: 'right' }}
                    >
                      {value}%
                    </Typography>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        height: 6,
                        width: `${value}%`,
                        borderRadius: 3,
                        background: trackColor,
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        transition: 'width 0.05s ease',
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={value}
                      disabled={isDisabled}
                      onChange={(e) => setVolumes({ [key]: Number(e.target.value) })}
                      style={{
                        ...sliderBase,
                        background: `linear-gradient(to right, ${trackColor}40, ${colors.glass.border})`,
                        position: 'relative',
                        zIndex: 1,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {selectedBinauralPreset.id !== 'none' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginTop: spacing.lg, opacity: 0.6 }}>
              <Headphones size={12} color={colors.text.secondary} />
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>
                Use headphones to experience the binaural layer properly.
              </Typography>
            </div>
          )}

          <Typography variant="small" style={{ color: colors.text.secondary, marginTop: spacing.sm, fontSize: 11, opacity: 0.6 }}>
            Your mix is remembered across all your content.
          </Typography>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Link href={backHref} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="md">Back</Button>
          </Link>
          {onSave && (
            <Button variant="primary" size="md" onClick={onSave} style={{ backgroundColor: accent, borderColor: accent }}>
              Save
            </Button>
          )}
        </div>
      </PageContent>
    </PageShell>
  );
}
