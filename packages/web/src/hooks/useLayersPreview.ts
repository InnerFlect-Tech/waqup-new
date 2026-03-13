'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BinauralPreset } from '@waqup/shared/constants';

const DEFAULT_PREVIEW_MS = 6000;
const BINAURAL_GAIN_SCALE = 0.15; // Keep preview quiet

interface UseLayersPreviewOptions {
  /** Binaural preset (id='none' or beatFrequencyHz=0 → skipped) */
  binauralPreset: BinauralPreset | null;
  /** Ambient/atmosphere audio URL (null → skipped) */
  ambientUrl: string | null;
  /** Volume 0–100 for binaural */
  volumeBinaural: number;
  /** Volume 0–100 for ambient */
  volumeAmbient: number;
}

interface UseLayersPreviewResult {
  /** Play binaural + ambient for durationMs (default 6s). Stop early with stop(). */
  play: (durationMs?: number) => void;
  /** Stop preview immediately */
  stop: () => void;
  /** True while preview is playing */
  isPlaying: boolean;
}

/**
 * Standalone preview for binaural + atmosphere layers (no voice).
 * Creates a temporary AudioContext and HTMLAudioElement — does not touch
 * the main player. Use for "Preview layers" in Mix & Layer and edit-audio.
 */
export function useLayersPreview({
  binauralPreset,
  ambientUrl,
  volumeBinaural,
  volumeAmbient,
}: UseLayersPreviewOptions): UseLayersPreviewResult {
  const ctxRef = useRef<AudioContext | null>(null);
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);
  const leftPanRef = useRef<StereoPannerNode | null>(null);
  const rightPanRef = useRef<StereoPannerNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    try { leftOscRef.current?.stop(); } catch { /* ok */ }
    try { rightOscRef.current?.stop(); } catch { /* ok */ }
    leftOscRef.current?.disconnect();
    rightOscRef.current?.disconnect();
    leftPanRef.current?.disconnect();
    rightPanRef.current?.disconnect();
    gainRef.current?.disconnect();
    leftOscRef.current = null;
    rightOscRef.current = null;
    leftPanRef.current = null;
    rightPanRef.current = null;
    gainRef.current = null;
    if (ambientRef.current) {
      ambientRef.current.pause();
      ambientRef.current = null;
    }
    if (ctxRef.current?.state !== 'closed') {
      void ctxRef.current?.close();
    }
    ctxRef.current = null;
    setIsPlaying(false);
  }, []);

  const play = useCallback(
    (durationMs = DEFAULT_PREVIEW_MS) => {
      stop();

      const hasBinaural =
        binauralPreset &&
        binauralPreset.id !== 'none' &&
        binauralPreset.beatFrequencyHz > 0;
      const hasAmbient = !!ambientUrl;

      if (!hasBinaural && !hasAmbient) return;

      setIsPlaying(true);

      // Binaural layer
      if (hasBinaural && binauralPreset) {
        try {
          const ctx = new AudioContext();
          ctxRef.current = ctx;

          const gain = ctx.createGain();
          gain.gain.value = (volumeBinaural / 100) * BINAURAL_GAIN_SCALE;
          gain.connect(ctx.destination);
          gainRef.current = gain;

          const leftFreq = binauralPreset.carrierFrequencyHz + binauralPreset.beatFrequencyHz / 2;
          const rightFreq = binauralPreset.carrierFrequencyHz - binauralPreset.beatFrequencyHz / 2;

          const leftOsc = ctx.createOscillator();
          const leftPan = ctx.createStereoPanner();
          leftOsc.type = 'sine';
          leftOsc.frequency.value = leftFreq;
          leftPan.pan.value = -1;
          leftOsc.connect(leftPan);
          leftPan.connect(gain);
          leftOsc.start();
          leftOscRef.current = leftOsc;
          leftPanRef.current = leftPan;

          const rightOsc = ctx.createOscillator();
          const rightPan = ctx.createStereoPanner();
          rightOsc.type = 'sine';
          rightOsc.frequency.value = rightFreq;
          rightPan.pan.value = 1;
          rightOsc.connect(rightPan);
          rightPan.connect(gain);
          rightOsc.start();
          rightOscRef.current = rightOsc;
          rightPanRef.current = rightPan;
        } catch {
          // Ignore — ambient may still play
        }
      }

      // Ambient layer
      if (hasAmbient && ambientUrl) {
        const audio = new Audio(ambientUrl);
        audio.loop = true;
        audio.volume = (volumeAmbient / 100) * 0.5;
        void audio.play().catch(() => { /* autoplay blocked */ });
        ambientRef.current = audio;
      }

      timeoutRef.current = setTimeout(stop, durationMs);
    },
    [
      stop,
      binauralPreset,
      ambientUrl,
      volumeBinaural,
      volumeAmbient,
    ],
  );

  useEffect(() => () => stop(), [stop]);

  return { play, stop, isPlaying };
}
