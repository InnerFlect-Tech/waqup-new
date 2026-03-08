'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface VoiceOrbOGLProps {
  isActive: boolean;
  voiceSource?: 'user' | 'ai' | 'idle';
  frequencyDataRef?: React.RefObject<Uint8Array | null>;
  style?: React.CSSProperties;
  className?: string;
}

// ── Lightweight 2D Perlin noise (deterministic) ────────────────────────────
function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }

const PERM = new Uint8Array(512);
(function buildPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
})();

function grad2(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

function perlin2(x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u  = fade(xf);
  const v  = fade(yf);
  const aa = PERM[PERM[xi]     + yi];
  const ab = PERM[PERM[xi]     + yi + 1];
  const ba = PERM[PERM[xi + 1] + yi];
  const bb = PERM[PERM[xi + 1] + yi + 1];
  return lerp(
    lerp(grad2(aa, xf,     yf),     grad2(ba, xf - 1, yf),     u),
    lerp(grad2(ab, xf,     yf - 1), grad2(bb, xf - 1, yf - 1), u),
    v
  );
}

// ── Particle ────────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  speed: number;
}

function makeParticle(cx: number, cy: number, orbitR: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const r = orbitR * (0.55 + Math.random() * 0.45);
  return {
    x:       cx + Math.cos(angle) * r,
    y:       cy + Math.sin(angle) * r,
    vx:      0,
    vy:      0,
    life:    Math.random() * 180,
    maxLife: 100 + Math.random() * 180,
    hue:     240 + Math.random() * 80, // navy → purple → magenta
    speed:   0.6 + Math.random() * 1.2,
  };
}

const PARTICLE_COUNT = 600;

export function VoiceOrbOGL({
  isActive,
  voiceSource = 'idle',
  frequencyDataRef,
  style,
  className,
}: VoiceOrbOGLProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const timeRef      = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  // Init particles lazily after we know size
  const initParticles = useCallback((cx: number, cy: number, orbitR: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      makeParticle(cx, cy, orbitR)
    );
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w  = canvas.width;
    const h  = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const orbitR = Math.min(w, h) * 0.40;

    timeRef.current += 0.016;
    const t = timeRef.current;

    // Audio intensity
    let intensity = 0;
    if (frequencyDataRef?.current) {
      const data = frequencyDataRef.current;
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      intensity = Math.min(1, (sum / data.length) / 128);
    }
    const turbulence = isActive ? 0.8 + intensity * 2.5 : 0.4;

    // Hue bias per voice source
    const hueOffset = voiceSource === 'ai' ? 40 : voiceSource === 'user' ? 0 : 20;

    // Fade trails
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, 0, w, h);

    // Lazy init
    if (particlesRef.current.length === 0) initParticles(cx, cy, orbitR);

    // Update + draw particles
    particlesRef.current.forEach((p, i) => {
      // Flow field direction from Perlin noise
      const nx = p.x / w * 3.0 + t * 0.25;
      const ny = p.y / h * 3.0 + t * 0.18;
      const angle = perlin2(nx, ny) * Math.PI * 4 * turbulence;

      p.vx += Math.cos(angle) * 0.06 * p.speed;
      p.vy += Math.sin(angle) * 0.06 * p.speed;

      // Gentle pull toward orbit ring
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pull = (dist - orbitR * 0.78) * 0.003;
      p.vx -= (dx / dist) * pull;
      p.vy -= (dy / dist) * pull;

      // Damping
      p.vx *= 0.96;
      p.vy *= 0.96;

      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      // Respawn when dead or outside outer boundary
      if (p.life >= p.maxLife || dist > orbitR * 1.25) {
        particlesRef.current[i] = makeParticle(cx, cy, orbitR);
        return;
      }

      const lifeFrac  = p.life / p.maxLife;
      const alpha     = Math.sin(lifeFrac * Math.PI) * (isActive ? 0.65 + intensity * 0.35 : 0.35);
      const hue       = (p.hue + hueOffset) % 360;
      const lightness = 55 + lifeFrac * 25;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2 + lifeFrac * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue},90%,${lightness}%,${alpha})`;
      ctx.fill();
    });

    // ── Outer glow ring ──────────────────────────────────────────────────
    const glowR    = orbitR * (1.05 + intensity * 0.08);
    const ringGrad = ctx.createRadialGradient(cx, cy, orbitR * 0.9, cx, cy, glowR);
    const rimHue   = voiceSource === 'ai' ? 220 : voiceSource === 'user' ? 260 : 270;
    ringGrad.addColorStop(0,   `hsla(${rimHue},85%,60%,${0.12 + intensity * 0.2})`);
    ringGrad.addColorStop(1,   `hsla(${rimHue},85%,60%,0)`);
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fill();

    // ── Event horizon (black center) ────────────────────────────────────
    const voidR    = orbitR * 0.48;
    const voidGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, voidR * 1.12);
    voidGrad.addColorStop(0,    'rgba(0,0,0,1)');
    voidGrad.addColorStop(0.85, 'rgba(0,0,0,1)');
    voidGrad.addColorStop(1,    'rgba(0,0,0,0.7)');
    ctx.fillStyle = voidGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, voidR * 1.12, 0, Math.PI * 2);
    ctx.fill();

    // ── Inner rim glow ───────────────────────────────────────────────────
    ctx.shadowColor = `hsl(${rimHue},85%,65%)`;
    ctx.shadowBlur  = 16 + intensity * 28;
    ctx.strokeStyle = `hsla(${rimHue},85%,65%,${0.55 + intensity * 0.45})`;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, voidR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    rafRef.current = requestAnimationFrame(draw);
  }, [isActive, voiceSource, frequencyDataRef, initParticles]);

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
      // Reset particles on resize
      particlesRef.current = [];
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
