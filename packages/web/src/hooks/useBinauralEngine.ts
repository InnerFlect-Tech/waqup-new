'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BinauralPreset } from '@waqup/shared/constants';

interface UseBinauralEngineOptions {
  /** AudioContext from useWebAudioPlayer — null until the player has loaded */
  audioContext: AudioContext | null;
  /**
   * The binaural GainNode that is already wired into the master bus.
   * Oscillators connect to this node; its gain is controlled by the player's
   * binaural volume slider via the existing setVolumes mechanism.
   */
  binauralGain: GainNode | null;
  /** Selected binaural preset, or null / preset with id='none' to disable */
  preset: BinauralPreset | null;
  /** Whether the main audio player is currently playing */
  isPlaying: boolean;
}

interface UseBinauralEngineResult {
  /** True when oscillators are currently running */
  isActive: boolean;
}

/**
 * Generates binaural beats via Web Audio API oscillators.
 *
 * Two sine wave oscillators are panned hard left/right with a configurable
 * frequency difference (beat frequency). The perceived binaural beat equals
 * this difference. Both oscillators connect to the provided `binauralGain`
 * node — volume is controlled externally by the player's volume mix.
 *
 * Oscillators start when isPlaying=true and a valid preset is selected.
 * They stop when isPlaying=false, or when the hook unmounts.
 * Preset changes recreate the oscillators (no audible gap at low volumes).
 */
export function useBinauralEngine({
  audioContext,
  binauralGain,
  preset,
  isPlaying,
}: UseBinauralEngineOptions): UseBinauralEngineResult {
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);
  const leftPanRef = useRef<StereoPannerNode | null>(null);
  const rightPanRef = useRef<StereoPannerNode | null>(null);
  const [isActive, setIsActive] = useState(false);

  const stopOscillators = useCallback(() => {
    // OscillatorNode.stop() throws if already stopped — guard against it
    try { leftOscRef.current?.stop(); } catch { /* already stopped */ }
    try { rightOscRef.current?.stop(); } catch { /* already stopped */ }
    leftOscRef.current?.disconnect();
    rightOscRef.current?.disconnect();
    leftPanRef.current?.disconnect();
    rightPanRef.current?.disconnect();
    leftOscRef.current = null;
    rightOscRef.current = null;
    leftPanRef.current = null;
    rightPanRef.current = null;
    setIsActive(false);
  }, []);

  const startOscillators = useCallback(() => {
    if (!audioContext || !binauralGain || !preset || preset.id === 'none') return;
    if (preset.beatFrequencyHz <= 0) return;
    if (audioContext.state === 'closed') return;

    try {
      const leftFreq = preset.carrierFrequencyHz + preset.beatFrequencyHz / 2;
      const rightFreq = preset.carrierFrequencyHz - preset.beatFrequencyHz / 2;

      // Left oscillator → hard left pan → binaural gain
      const leftOsc = audioContext.createOscillator();
      const leftPan = audioContext.createStereoPanner();
      leftOsc.type = 'sine';
      leftOsc.frequency.value = leftFreq;
      leftPan.pan.value = -1;
      leftOsc.connect(leftPan);
      leftPan.connect(binauralGain);
      leftOsc.start();

      // Right oscillator → hard right pan → binaural gain
      const rightOsc = audioContext.createOscillator();
      const rightPan = audioContext.createStereoPanner();
      rightOsc.type = 'sine';
      rightOsc.frequency.value = rightFreq;
      rightPan.pan.value = 1;
      rightOsc.connect(rightPan);
      rightPan.connect(binauralGain);
      rightOsc.start();

      leftOscRef.current = leftOsc;
      rightOscRef.current = rightOsc;
      leftPanRef.current = leftPan;
      rightPanRef.current = rightPan;
      setIsActive(true);
    } catch (e) {
      console.error('[useBinauralEngine] failed to start oscillators:', e);
      setIsActive(false);
    }
  }, [audioContext, binauralGain, preset]);

  // Start/stop oscillators when playing state or preset changes
  useEffect(() => {
    // Always stop existing oscillators first to avoid duplicates
    stopOscillators();

    if (isPlaying && audioContext && binauralGain && preset && preset.id !== 'none' && preset.beatFrequencyHz > 0) {
      startOscillators();
    }

    // Cleanup: stop on unmount or when any dependency changes
    return stopOscillators;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, preset?.id, audioContext, binauralGain]);

  return { isActive };
}
