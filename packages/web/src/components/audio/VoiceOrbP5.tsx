'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/theme';

/** p5 instance - typed loosely to avoid static p5 module resolution in monorepo builds */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type P5Sketch = (p: any) => void;

export type VoiceSource = 'user' | 'ai' | 'idle';

export interface VoiceOrbP5Props {
  isActive: boolean;
  voiceSource?: VoiceSource;
  frequencyDataRef: React.RefObject<Uint8Array | null>;
  style?: React.CSSProperties;
  className?: string;
}

const PARTICLE_COUNT = 350;
const BASE_RADIUS = 1.2;

function parseColorToRgb(color: string): [number, number, number] {
  const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (hex) {
    return [parseInt(hex[1], 16) / 255, parseInt(hex[2], 16) / 255, parseInt(hex[3], 16) / 255];
  }
  const rgba = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(color);
  if (rgba) {
    return [parseInt(rgba[1], 10) / 255, parseInt(rgba[2], 10) / 255, parseInt(rgba[3], 10) / 255];
  }
  return [0.6, 0.4, 0.9];
}

export function VoiceOrbP5({
  isActive,
  voiceSource = 'idle',
  frequencyDataRef,
  style,
  className,
}: VoiceOrbP5Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<{ remove: () => void } | null>(null);
  const { theme } = useTheme();

  const colorUserPrimary = theme.colors.accent.primary;
  const colorUserSecondary = theme.colors.accent.secondary;
  const colorAIPrimary = theme.colors.mystical.orb;
  const colorAISecondary = theme.colors.mystical.glow;

  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !webglSupported) return;

    const loadP5 = async () => {
      const p5Module = await import('p5');
      const P5 = p5Module.default;

      const particles: Array<{
        angle: number;
        tilt: number;
        phase: number;
        binIndex: number;
      }> = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          angle: (i / PARTICLE_COUNT) * Math.PI * 2,
          tilt: Math.random() * Math.PI * 0.4 - Math.PI * 0.2,
          phase: Math.random() * Math.PI * 2,
          binIndex: Math.floor((i / PARTICLE_COUNT) * 64) % 64,
        });
      }

      const sketch: P5Sketch = (p) => {
        p.setup = () => {
          const w = containerRef.current?.clientWidth ?? 400;
          const h = containerRef.current?.clientHeight ?? 360;
          p.createCanvas(w, h, p.WEBGL);
          p.noStroke();
        };

        p.draw = () => {
          const w = containerRef.current?.clientWidth ?? 400;
          const h = containerRef.current?.clientHeight ?? 360;
          if (p.width !== w || p.height !== h) {
            p.resizeCanvas(w, h);
          }

          p.background(0, 0);
          p.push();

          const data = frequencyDataRef.current;
          let avgFreq = 0.2;
          const freqBins: number[] = [];
          if (data && data.length > 0) {
            const binCount = 64;
            for (let b = 0; b < binCount; b++) {
              const start = Math.floor((b / binCount) * data.length);
              const end = Math.floor(((b + 1) / binCount) * data.length);
              let sum = 0;
              for (let j = start; j < end && j < data.length; j++) {
                const boost = j >= 4 && j <= 140 ? 1.4 : 1;
                sum += data[j] * boost;
              }
              const val = (end - start) > 0 ? sum / (end - start) / 255 : 0.2;
              freqBins.push(Math.min(1, val));
            }
            let s = 0;
            for (let i = 0; i < data.length; i++) s += data[i];
            avgFreq = Math.min(1, s / data.length / 128);
          } else {
            const idle = 0.15 + 0.08 * Math.sin(p.frameCount * 0.03);
            for (let b = 0; b < 64; b++) freqBins.push(idle);
            avgFreq = idle;
          }

          const time = p.frameCount * 0.016;
          const intensity = avgFreq;

          const [r1, g1, b1] =
            voiceSource === 'user' ? parseColorToRgb(colorUserPrimary) : parseColorToRgb(colorAIPrimary);
          const [r2, g2, b2] =
            voiceSource === 'user' ? parseColorToRgb(colorUserSecondary) : parseColorToRgb(colorAISecondary);

          p.rotateY(time * 0.3);
          p.rotateX(0.2);

          // Dark sphere at center (black-hole void)
          p.fill(0, 0, 0, 255);
          p.sphere(60);

          for (let i = 0; i < particles.length; i++) {
            const pt = particles[i];
            const binVal = freqBins[pt.binIndex] ?? 0.2;
            const radius = BASE_RADIUS + binVal * 0.5 + intensity * 0.3;
            const x = Math.cos(pt.angle + time * 0.5) * radius * 80;
            const z = Math.sin(pt.angle + time * 0.5) * radius * 80;
            const y = Math.sin(pt.tilt + time * 0.2) * radius * 40;

            const mixT = (pt.angle / (Math.PI * 2) + 0.5) % 1;
            const r = r1 + (r2 - r1) * mixT;
            const g = g1 + (g2 - g1) * mixT;
            const b = b1 + (b2 - b1) * mixT;

            const size = 2 + binVal * 4 + intensity * 2;
            const alpha = 0.4 + binVal * 0.5 + (isActive ? 0.2 : 0);

            p.push();
            p.translate(x, y, z);
            p.fill(r * 255, g * 255, b * 255, alpha * 255);
            p.sphere(size);
            p.pop();
          }

          p.pop();
        };

        p.windowResized = () => {
          const w = containerRef.current?.clientWidth ?? 400;
          const h = containerRef.current?.clientHeight ?? 360;
          p.resizeCanvas(w, h);
        };
      };

      sketchRef.current = new P5(sketch, container);
    };

    loadP5();
    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
        sketchRef.current = null;
      }
    };
  }, [
    webglSupported,
    colorUserPrimary,
    colorUserSecondary,
    colorAIPrimary,
    colorAISecondary,
    voiceSource,
    isActive,
  ]);

  if (!webglSupported) {
    return (
      <div
        className={className}
        style={{
          minHeight: 360,
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          ...style,
        }}
        aria-label="Voice visualization (WebGL not supported)"
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${colorAIPrimary}, ${colorAISecondary})`,
            opacity: isActive ? 0.8 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 360,
        background: 'transparent',
        overflow: 'hidden',
        ...style,
      }}
      aria-label="Voice visualization (p5.js)"
    />
  );
}
