'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { ScienceInsight } from './ScienceInsight';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { CONTENT_TYPE_META } from '@/lib/creation-steps';
import {
  getActiveBinauralPresets,
  getActiveAtmospherePresets,
  type BinauralPreset,
  type AtmospherePreset,
} from '@waqup/shared/constants';
import type { AudioSettings } from '@waqup/shared/types';
import { DEFAULT_AUDIO_SETTINGS } from '@waqup/shared/types';
import { Music, Volume2, Waves, Zap, Wind, Check, ChevronLeft, Play, Square } from 'lucide-react';

export interface ContentAudioStepProps {
  backHref: string;
  nextHref: string;
}

// ─── Volume Slider ────────────────────────────────────────────────────────────

function VolumeSlider({
  label,
  sublabel,
  value,
  onChange,
  color,
  disabled,
}: {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
  disabled?: boolean;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, opacity: disabled ? 0.35 : 1 }}>
      <div style={{ width: 88, flexShrink: 0 }}>
        <Typography variant="small" style={{ color: colors.text.primary, fontSize: 13, fontWeight: 500 }}>
          {label}
        </Typography>
        {sublabel && (
          <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11, marginTop: 1 }}>
            {sublabel}
          </Typography>
        )}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: 4,
            appearance: 'none',
            WebkitAppearance: 'none',
            background: `linear-gradient(to right, ${color} ${value}%, ${colors.glass.border} ${value}%)`,
            borderRadius: 2,
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        />
      </div>
      <Typography variant="small" style={{ color: colors.text.secondary, width: 36, textAlign: 'right', fontSize: 12, flexShrink: 0 }}>
        {value}%
      </Typography>
    </div>
  );
}

// ─── Preset Card ──────────────────────────────────────────────────────────────

function PresetCard({
  label,
  sublabel,
  isSelected,
  isNone,
  onClick,
  accentColor,
}: {
  label: string;
  sublabel?: string;
  isSelected: boolean;
  isNone?: boolean;
  onClick: () => void;
  accentColor: string;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <button
      onClick={onClick}
      style={{
        padding: `${spacing.sm} ${spacing.md}`,
        borderRadius: borderRadius.lg,
        background: isSelected && !isNone ? `${accentColor}15` : 'transparent',
        border: `1px solid ${isSelected ? accentColor + '60' : colors.glass.border}`,
        color: isSelected ? accentColor : colors.text.secondary,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 80,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: isSelected ? 600 : 400 }}>{label}</span>
      {sublabel && (
        <span style={{ fontSize: 11, opacity: 0.7 }}>{sublabel}</span>
      )}
    </button>
  );
}

// ─── Binaural Preview Engine ──────────────────────────────────────────────────

function useBinauralPreview() {
  const ctxRef = useRef<AudioContext | null>(null);
  const leftRef = useRef<OscillatorNode | null>(null);
  const rightRef = useRef<OscillatorNode | null>(null);
  const leftPanRef = useRef<StereoPannerNode | null>(null);
  const rightPanRef = useRef<StereoPannerNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    try { leftRef.current?.stop(); } catch { /* ok */ }
    try { rightRef.current?.stop(); } catch { /* ok */ }
    leftRef.current?.disconnect();
    rightRef.current?.disconnect();
    leftPanRef.current?.disconnect();
    rightPanRef.current?.disconnect();
    gainRef.current?.disconnect();
    leftRef.current = null;
    rightRef.current = null;
    leftPanRef.current = null;
    rightPanRef.current = null;
    gainRef.current = null;
    setIsPlaying(false);
  }, []);

  const play = useCallback((preset: BinauralPreset, volume: number, durationMs: number) => {
    stop();
    if (preset.id === 'none' || preset.beatFrequencyHz <= 0) return;

    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = (volume / 100) * 0.15; // Keep preview quiet
      gain.connect(ctx.destination);
      gainRef.current = gain;

      const leftFreq = preset.carrierFrequencyHz + preset.beatFrequencyHz / 2;
      const rightFreq = preset.carrierFrequencyHz - preset.beatFrequencyHz / 2;

      const leftOsc = ctx.createOscillator();
      const leftPan = ctx.createStereoPanner();
      leftOsc.type = 'sine';
      leftOsc.frequency.value = leftFreq;
      leftPan.pan.value = -1;
      leftOsc.connect(leftPan);
      leftPan.connect(gain);
      leftOsc.start();
      leftRef.current = leftOsc;
      leftPanRef.current = leftPan;

      const rightOsc = ctx.createOscillator();
      const rightPan = ctx.createStereoPanner();
      rightOsc.type = 'sine';
      rightOsc.frequency.value = rightFreq;
      rightPan.pan.value = 1;
      rightOsc.connect(rightPan);
      rightPan.connect(gain);
      rightOsc.start();
      rightRef.current = rightOsc;
      rightPanRef.current = rightPan;

      setIsPlaying(true);
      setTimeout(() => {
        stop();
        void ctx.close();
      }, durationMs);
    } catch {
      stop();
    }
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return { play, stop, isPlaying };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContentAudioStep({ backHref, nextHref }: ContentAudioStepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { contentType, audioSettings, setAudioSettings, setCurrentStep } = useContentCreation();
  const meta = CONTENT_TYPE_META[contentType];

  const [settings, setSettings] = useState<AudioSettings>(audioSettings ?? DEFAULT_AUDIO_SETTINGS);
  const binauralPreview = useBinauralPreview();
  const atmosphereAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const binauralPresets = getActiveBinauralPresets();
  const atmospherePresets = getActiveAtmospherePresets();

  const selectedBinaural = binauralPresets.find((p) => p.id === settings.binauralPresetId) ?? binauralPresets[0];
  const selectedAtmosphere = atmospherePresets.find((p) => p.id === settings.atmospherePresetId) ?? atmospherePresets[0];

  const update = useCallback(<K extends keyof AudioSettings>(key: K, value: AudioSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePreview = useCallback(() => {
    if (isPreviewing) {
      // Stop preview
      binauralPreview.stop();
      if (atmosphereAudioRef.current) {
        atmosphereAudioRef.current.pause();
        atmosphereAudioRef.current = null;
      }
      setIsPreviewing(false);
      return;
    }

    setIsPreviewing(true);
    const PREVIEW_MS = 6000;

    // Start binaural preview (oscillators)
    if (selectedBinaural.id !== 'none') {
      binauralPreview.play(selectedBinaural, settings.volumeBinaural, PREVIEW_MS);
    }

    // Start atmosphere preview (HTMLAudioElement) if file exists
    if (selectedAtmosphere.fileUrl) {
      const audio = new Audio(selectedAtmosphere.fileUrl);
      audio.loop = true;
      audio.volume = (settings.volumeAmbient / 100) * 0.5;
      void audio.play().catch(() => { /* autoplay blocked — ignore */ });
      atmosphereAudioRef.current = audio;
    }

    setTimeout(() => {
      binauralPreview.stop();
      if (atmosphereAudioRef.current) {
        atmosphereAudioRef.current.pause();
        atmosphereAudioRef.current = null;
      }
      setIsPreviewing(false);
    }, PREVIEW_MS);
  }, [isPreviewing, selectedBinaural, selectedAtmosphere, settings.volumeBinaural, settings.volumeAmbient, binauralPreview]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      binauralPreview.stop();
      if (atmosphereAudioRef.current) {
        atmosphereAudioRef.current.pause();
        atmosphereAudioRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = useCallback(() => {
    setAudioSettings(settings);
    setCurrentStep('audio');
    router.push(nextHref);
  }, [settings, setAudioSettings, setCurrentStep, router, nextHref]);

  const atmosphereHasFile = selectedAtmosphere.id !== 'none' && !!selectedAtmosphere.fileUrl;
  const binauralActive = selectedBinaural.id !== 'none';

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      {/* Header */}
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
          <Music size={24} color={meta.color} />
        </div>
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          Mix & Layer
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary }}>
          Configure three independent audio layers for this {contentType}
        </Typography>
      </motion.div>

      {/* ── Volume Mix ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          padding: spacing.xl,
          borderRadius: borderRadius.xl,
          background: colors.glass.light,
          backdropFilter: BLUR.xl,
          WebkitBackdropFilter: BLUR.xl,
          border: `1px solid ${colors.glass.border}`,
          marginBottom: spacing.md,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.lg,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <Volume2 size={15} color={colors.text.secondary} />
          <Typography variant="small" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Volume
          </Typography>
        </div>

        <VolumeSlider
          label="Voice"
          sublabel="Narration"
          value={settings.volumeVoice}
          onChange={(v) => update('volumeVoice', v)}
          color={meta.color}
        />
        <VolumeSlider
          label="Binaural"
          sublabel={binauralActive ? selectedBinaural.mood : 'Select below'}
          value={settings.volumeBinaural}
          onChange={(v) => update('volumeBinaural', v)}
          color="#a78bfa"
          disabled={!binauralActive}
        />
        <VolumeSlider
          label="Atmosphere"
          sublabel={selectedAtmosphere.id !== 'none' ? selectedAtmosphere.label : 'Select below'}
          value={settings.volumeAmbient}
          onChange={(v) => update('volumeAmbient', v)}
          color="#60a5fa"
          disabled={selectedAtmosphere.id === 'none'}
        />
      </motion.div>

      {/* ── Binaural Preset Selector ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          padding: spacing.xl,
          borderRadius: borderRadius.xl,
          background: colors.glass.light,
          backdropFilter: BLUR.xl,
          WebkitBackdropFilter: BLUR.xl,
          border: `1px solid ${colors.glass.border}`,
          marginBottom: spacing.md,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
          <Zap size={15} color={colors.text.secondary} />
          <Typography variant="small" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Binaural Layer
          </Typography>
        </div>
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.md }}>
          {binauralPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              label={preset.label}
              sublabel={preset.mood || undefined}
              isSelected={settings.binauralPresetId === preset.id}
              isNone={preset.id === 'none'}
              onClick={() => update('binauralPresetId', preset.id)}
              accentColor="#a78bfa"
            />
          ))}
        </div>
        <AnimatePresence>
          {selectedBinaural.id !== 'none' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 1.6 }}>
                {selectedBinaural.description}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Atmosphere Preset Selector ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          padding: spacing.xl,
          borderRadius: borderRadius.xl,
          background: colors.glass.light,
          backdropFilter: BLUR.xl,
          WebkitBackdropFilter: BLUR.xl,
          border: `1px solid ${colors.glass.border}`,
          marginBottom: spacing.md,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
          <Waves size={15} color={colors.text.secondary} />
          <Typography variant="small" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Atmosphere Layer
          </Typography>
        </div>
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.md }}>
          {atmospherePresets.map((preset) => (
            <PresetCard
              key={preset.id}
              label={preset.label}
              sublabel={preset.id !== 'none' ? preset.description : undefined}
              isSelected={settings.atmospherePresetId === preset.id}
              isNone={preset.id === 'none'}
              onClick={() => update('atmospherePresetId', preset.id)}
              accentColor="#60a5fa"
            />
          ))}
        </div>
        <AnimatePresence>
          {selectedAtmosphere.id !== 'none' && !atmosphereHasFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11, opacity: 0.6 }}>
                Atmosphere file not yet uploaded — this layer will be silent until added.
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Fade Effects ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: `${spacing.md} ${spacing.xl}`,
          borderRadius: borderRadius.xl,
          background: colors.glass.light,
          backdropFilter: BLUR.xl,
          WebkitBackdropFilter: BLUR.xl,
          border: `1px solid ${colors.glass.border}`,
          marginBottom: spacing.xl,
          display: 'flex',
          gap: spacing.xl,
          alignItems: 'center',
        }}
      >
        <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
          Effects
        </Typography>
        {(['fadeIn', 'fadeOut'] as const).map((key) => {
          const isOn = settings[key];
          return (
            <button
              key={key}
              onClick={() => update(key, !isOn)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: `${spacing.sm} 0`,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: borderRadius.sm,
                  background: isOn ? `${meta.color}20` : 'transparent',
                  border: `1px solid ${isOn ? meta.color : colors.glass.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                {isOn && <Check size={11} color={meta.color} />}
              </div>
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 13 }}>
                {key === 'fadeIn' ? 'Fade in' : 'Fade out'}
              </Typography>
            </button>
          );
        })}
      </motion.div>

      <ScienceInsight
        topic="audio-layers"
        insight="Layering sound can support focus and deepen a sense of presence. Binaural tones are experienced through the difference between two frequencies — use headphones for best effect."
      />

      {/* ── Actions ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl }}>
        <Link href={backHref} style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="md" style={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} /> Back
          </Button>
        </Link>
        <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
          {(binauralActive || selectedAtmosphere.id !== 'none') && (
            <Button
              variant="ghost"
              size="md"
              onClick={handlePreview}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                color: isPreviewing ? meta.color : colors.text.secondary,
              }}
            >
              {isPreviewing
                ? <><Square size={12} color={meta.color} /> Stop</>
                : <><Play size={13} /> Preview</>
              }
            </Button>
          )}
          <Button variant="primary" size="lg" onClick={handleContinue}>
            Review →
          </Button>
        </div>
      </div>
    </div>
  );
}
