'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface VoiceOrbProps {
  isActive: boolean;
  voiceSource?: 'user' | 'ai' | 'idle';
  frequencyDataRef?: React.RefObject<Uint8Array | null>;
  style?: React.CSSProperties;
  className?: string;
}

const RING_CONFIGS = [
  { radiusFactor: 0.52, width: 2.5, opacity: 0.85, speed: 0.4,  color: '#7C3AED' },
  { radiusFactor: 0.62, width: 1.8, opacity: 0.55, speed: -0.25, color: '#6D28D9' },
  { radiusFactor: 0.72, width: 1.2, opacity: 0.38, speed: 0.15, color: '#4C1D95' },
  { radiusFactor: 0.83, width: 0.8, opacity: 0.22, speed: -0.08, color: '#3B82F6' },
  { radiusFactor: 0.95, width: 0.5, opacity: 0.12, speed: 0.05,  color: '#1D4ED8' },
];

export function VoiceOrb({
  isActive,
  voiceSource = 'idle',
  frequencyDataRef,
  style,
  className,
}: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const getAccentColor = useCallback(() => {
    if (voiceSource === 'user') return { r: 124, g: 58, b: 237 };
    if (voiceSource === 'ai')   return { r: 59,  g: 130, b: 246 };
    return { r: 109, g: 40, b: 217 };
  }, [voiceSource]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const baseRadius = Math.min(w, h) * 0.38;

    timeRef.current += 0.016;
    const t = timeRef.current;

    // Read audio intensity (0–1)
    let intensity = 0;
    if (frequencyDataRef?.current) {
      const data = frequencyDataRef.current;
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      intensity = Math.min(1, (sum / data.length) / 128);
    }
    const pulse = isActive ? 1 + intensity * 0.18 : 1;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // ── Outer glow halo ─────────────────────────────────────────────────
    const haloR = baseRadius * 1.35 * pulse;
    const halo = ctx.createRadialGradient(cx, cy, baseRadius * 0.4, cx, cy, haloR);
    const accent = getAccentColor();
    halo.addColorStop(0,   `rgba(${accent.r},${accent.g},${accent.b},0)`);
    halo.addColorStop(0.6, `rgba(${accent.r},${accent.g},${accent.b},0.06)`);
    halo.addColorStop(1,   `rgba(${accent.r},${accent.g},${accent.b},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
    ctx.fill();

    // ── Concentric glowing rings ─────────────────────────────────────────
    RING_CONFIGS.forEach((ring, i) => {
      const angle = t * ring.speed + i * 0.8;
      const r = baseRadius * ring.radiusFactor * pulse;
      const opacityBoost = isActive ? ring.opacity + intensity * 0.25 : ring.opacity * 0.65;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Glow shadow
      ctx.shadowColor = ring.color;
      ctx.shadowBlur = 14 + intensity * 20;
      ctx.strokeStyle = ring.color;
      ctx.globalAlpha = Math.min(1, opacityBoost);
      ctx.lineWidth = ring.width * (1 + intensity * 0.5);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // ── Accretion disk (tilted ellipse) ──────────────────────────────────
    const diskAngle = t * 0.22;
    const diskRx = baseRadius * 1.08 * pulse;
    const diskRy = diskRx * 0.18;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(diskAngle);
    ctx.scale(1, diskRy / diskRx);

    const diskGrad = ctx.createLinearGradient(-diskRx, 0, diskRx, 0);
    const a = Math.max(0, isActive ? 0.45 + intensity * 0.45 : 0.18);
    diskGrad.addColorStop(0,    `rgba(251,146,60,0)`);
    diskGrad.addColorStop(0.15, `rgba(251,146,60,${a * 0.4})`);
    diskGrad.addColorStop(0.45, `rgba(167,139,250,${a})`);
    diskGrad.addColorStop(0.55, `rgba(96,165,250,${a})`);
    diskGrad.addColorStop(0.85, `rgba(251,146,60,${a * 0.4})`);
    diskGrad.addColorStop(1,    `rgba(251,146,60,0)`);

    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur  = 18 + intensity * 28;
    ctx.strokeStyle = diskGrad;
    ctx.lineWidth   = 3.5 + intensity * 4;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(0, 0, diskRx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // ── Event horizon (black center) ─────────────────────────────────────
    const voidR = baseRadius * 0.46;
    const voidGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, voidR);
    voidGrad.addColorStop(0,    'rgba(0,0,0,1)');
    voidGrad.addColorStop(0.82, 'rgba(0,0,0,1)');
    voidGrad.addColorStop(1,    'rgba(0,0,0,0.85)');
    ctx.fillStyle = voidGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, voidR, 0, Math.PI * 2);
    ctx.fill();

    // ── Inner rim glow ───────────────────────────────────────────────────
    ctx.shadowColor = `rgb(${accent.r},${accent.g},${accent.b})`;
    ctx.shadowBlur  = 20 + intensity * 30;
    ctx.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},${0.6 + intensity * 0.4})`;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, voidR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    rafRef.current = requestAnimationFrame(draw);
  }, [isActive, frequencyDataRef, getAccentColor]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width  = width  * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 320,
        position: 'relative',
        background: 'transparent',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
