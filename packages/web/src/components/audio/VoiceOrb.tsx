'use client';

import React, { useEffect, useRef, useCallback } from 'react';

/**
 * OrbState — the single source of truth for what the orb communicates.
 * Each state maps to distinct color, motion, and ring behaviour.
 * Used by VoiceOrb AND by the speak page's UI state machine.
 */
export type OrbState =
  | 'idle'          // Calm breath, single faint ring — orb is present but waiting
  | 'listening'     // Violet rings expand, energy builds — orb leans in
  | 'hearing'       // Strong voice detected — corona fires, rings pulse outward
  | 'transcribing'  // Finalising speech — rings settle, soft glow
  | 'thinking'      // Processing — single slow disk rotation, muted glimmer
  | 'speaking'      // AI reply playing — real FFT reactivity, blue-violet shift
  | 'interrupted'   // User spoke mid-reply — flash snap, quick fade to listening
  | 'complete'      // Turn ended — soft exhale, fades to idle
  | 'low_credits'   // Amber pulse, slowing — communicates scarcity
  | 'error';        // Red fade, rings stop — communicates failure

interface VoiceOrbProps {
  orbState?:         OrbState;
  frequencyDataRef?: React.RefObject<Uint8Array<ArrayBufferLike> | null>;
  style?:            React.CSSProperties;
  className?:        string;
  /** Legacy compat — mapped to orbState internally */
  isActive?:         boolean;
  voiceSource?:      'user' | 'ai' | 'idle';
}

// ─── Color palette per state ───────────────────────────────────────────────

type RGB = [number, number, number];

const STATE_COLORS: Record<OrbState, { accent: RGB; rim: RGB; halo: RGB; disk: string }> = {
  idle:         { accent: [109, 40, 217],  rim: [124, 58, 237],   halo: [109, 40, 217],  disk: 'rgba(167,139,250,' },
  listening:    { accent: [168, 85, 247],  rim: [196, 131, 255],  halo: [168, 85, 247],  disk: 'rgba(167,139,250,' },
  hearing:      { accent: [192, 132, 252], rim: [216, 180, 254],  halo: [192, 132, 252], disk: 'rgba(216,180,254,' },
  transcribing: { accent: [139, 92, 246],  rim: [167, 139, 250],  halo: [139, 92, 246],  disk: 'rgba(167,139,250,' },
  thinking:     { accent: [91,  33, 182],  rim: [109, 40, 217],   halo: [91,  33, 182],  disk: 'rgba(124, 58,237,' },
  speaking:     { accent: [59, 130, 246],  rim: [96, 165, 250],   halo: [59, 130, 246],  disk: 'rgba(96, 165,250,' },
  interrupted:  { accent: [168, 85, 247],  rim: [196, 131, 255],  halo: [168, 85, 247],  disk: 'rgba(167,139,250,' },
  complete:     { accent: [109, 40, 217],  rim: [124, 58, 237],   halo: [109, 40, 217],  disk: 'rgba(167,139,250,' },
  low_credits:  { accent: [180, 83,  9],   rim: [217, 119, 6],    halo: [180, 83,  9],   disk: 'rgba(251,191, 36,' },
  error:        { accent: [153, 27, 27],   rim: [185, 28, 28],    halo: [153, 27, 27],   disk: 'rgba(239, 68, 68,' },
};

// Per-ring config — each ring tunes to a frequency band
const RING_CONFIGS = [
  { radiusFactor: 0.545, width: 2.6, opacityBase: 0.85, speed:  0.38, binStart:  0, binEnd:  8  },
  { radiusFactor: 0.640, width: 1.8, opacityBase: 0.58, speed: -0.25, binStart:  9, binEnd: 20  },
  { radiusFactor: 0.730, width: 1.2, opacityBase: 0.40, speed:  0.14, binStart: 21, binEnd: 45  },
  { radiusFactor: 0.840, width: 0.9, opacityBase: 0.24, speed: -0.08, binStart: 46, binEnd: 80  },
  { radiusFactor: 0.960, width: 0.5, opacityBase: 0.11, speed:  0.05, binStart: 81, binEnd: 127 },
];

function bandAvg(data: Uint8Array, start: number, end: number): number {
  let sum = 0;
  for (let i = start; i <= end; i++) sum += data[i];
  return sum / (end - start + 1) / 255;
}

// Map legacy props to OrbState
function resolveOrbState(
  orbState?: OrbState,
  isActive?: boolean,
  voiceSource?: 'user' | 'ai' | 'idle',
): OrbState {
  if (orbState) return orbState;
  if (!isActive) return 'idle';
  if (voiceSource === 'user') return 'listening';
  if (voiceSource === 'ai')   return 'speaking';
  return 'idle';
}

export function VoiceOrb({
  orbState,
  frequencyDataRef,
  style,
  className,
  isActive,
  voiceSource,
}: VoiceOrbProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const drawRef      = useRef<() => void>(() => undefined);
  const timeRef      = useRef(0);

  // All smoothed values as refs — never captured in closures, never cause RAF restarts.
  const bandRef      = useRef([0, 0, 0, 0, 0]);
  const intensityRef = useRef(0);
  const bassRef      = useRef(0);

  // Current state as a ref so the draw loop picks it up without restarting.
  const stateRef     = useRef<OrbState>('idle');
  // Transition flash timer (for interrupted state)
  const flashRef     = useRef(0);

  // Update stateRef synchronously whenever props change.
  const resolved = resolveOrbState(orbState, isActive, voiceSource);
  stateRef.current = resolved;
  if (resolved === 'interrupted') flashRef.current = 1;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w  = canvas.width;
    const h  = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const BR = Math.min(w, h) * 0.38;

    timeRef.current += 0.016;
    const t     = timeRef.current;
    const state = stateRef.current;

    const colors  = STATE_COLORS[state];
    const [ar, ag, ab] = colors.accent;
    const [rr, rg, rb] = colors.rim;

    // Decay flash
    if (flashRef.current > 0) flashRef.current = Math.max(0, flashRef.current - 0.06);

    // ── Determine data source + smoothing ─────────────────────────────────
    const data   = frequencyDataRef?.current;
    const isLive = state === 'listening' || state === 'hearing' || state === 'speaking';
    const smooth = isLive ? 0.14 : 0.05;

    if (data) {
      RING_CONFIGS.forEach((rc, i) => {
        bandRef.current[i] += (bandAvg(data, rc.binStart, rc.binEnd) - bandRef.current[i]) * smooth;
      });
      let rawI = 0;
      for (let i = 0; i < data.length; i++) rawI += data[i];
      rawI = Math.min(1, rawI / data.length / 128);
      intensityRef.current += (rawI - intensityRef.current) * smooth;
      bassRef.current += (bandAvg(data, 0, 20) - bassRef.current) * smooth;
    } else {
      // State-based synthetic motion when no audio data
      const decay = state === 'idle' ? 0.94 : 0.90;
      bandRef.current = bandRef.current.map(v => v * decay);
      intensityRef.current *= decay;
      bassRef.current *= decay;
    }

    const intensity = intensityRef.current;
    const bass      = bassRef.current;
    const bands     = bandRef.current;

    // ── State-dependent synthetic intensity overlay ─────────────────────
    // For states where we want life without audio data (idle breath, thinking pulse)
    let synthBass = 0;
    let synthIntensity = 0;
    switch (state) {
      case 'idle':
        synthBass      = 0.04 + 0.03 * Math.sin(t * 0.8);
        synthIntensity = synthBass;
        break;
      case 'transcribing':
        synthBass      = 0.06 + 0.04 * Math.sin(t * 1.2);
        synthIntensity = synthBass;
        break;
      case 'thinking':
        synthBass      = 0.05 + 0.04 * Math.sin(t * 0.5);
        synthIntensity = synthBass;
        break;
      case 'complete':
        synthBass      = 0.12 * Math.max(0, 1 - (t % 3) / 3);
        synthIntensity = synthBass;
        break;
      case 'interrupted':
        synthBass      = 0.2 * flashRef.current;
        synthIntensity = synthBass;
        break;
      case 'low_credits':
        synthBass      = 0.04 + 0.03 * Math.sin(t * 0.4);
        synthIntensity = synthBass;
        break;
      case 'error':
        synthBass      = 0.02 + 0.015 * Math.sin(t * 0.3);
        synthIntensity = synthBass;
        break;
    }

    const effectiveBass      = Math.max(bass, synthBass);
    const effectiveIntensity = Math.max(intensity, synthIntensity);
    const pulse = 1 + effectiveBass * 0.14;

    // ── Ring activity scale by state ──────────────────────────────────────
    const ringScale: Record<OrbState, number> = {
      idle:         0.45,
      listening:    0.80,
      hearing:      1.00,
      transcribing: 0.65,
      thinking:     0.30,
      speaking:     1.00,
      interrupted:  0.75,
      complete:     0.40,
      low_credits:  0.55,
      error:        0.20,
    };
    const rScale = ringScale[state];

    ctx.clearRect(0, 0, w, h);

    // Clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(cx, cy), 0, Math.PI * 2);
    ctx.clip();

    // ════════════════════════════════════════════════════════════════════
    // 1. OUTER HALO
    // ════════════════════════════════════════════════════════════════════
    const [hr, hg, hb] = colors.halo;
    const haloR = BR * 1.55 * pulse;
    const haloA = 0.04 + effectiveIntensity * 0.14 * rScale;
    const haloGrad = ctx.createRadialGradient(cx, cy, BR * 0.5, cx, cy, haloR);
    haloGrad.addColorStop(0,   `rgba(${hr},${hg},${hb},0)`);
    haloGrad.addColorStop(0.5, `rgba(${hr},${hg},${hb},${haloA})`);
    haloGrad.addColorStop(1,   `rgba(${hr},${hg},${hb},0)`);
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
    ctx.fill();

    // ════════════════════════════════════════════════════════════════════
    // 2. FREQUENCY-DRIVEN RINGS
    //    All 5 rings in a single save/restore with shadow set once.
    //    The shadow is cleared between rings by resetting shadowBlur.
    // ════════════════════════════════════════════════════════════════════
    ctx.save();
    ctx.translate(cx, cy);

    RING_CONFIGS.forEach((ring, i) => {
      const angle   = t * ring.speed + i * 0.9;
      const bandVal = (bands[i] + synthBass * 0.5) * rScale;
      const r       = BR * ring.radiusFactor * (1 + bandVal * 0.14) * pulse;
      const alpha   = Math.min(1, (ring.opacityBase + bandVal * 0.5) * rScale + 0.05);
      const hexColor = `rgb(${ar},${ag},${ab})`;

      ctx.save();
      ctx.rotate(angle);
      ctx.shadowColor = hexColor;
      ctx.shadowBlur  = 8 + bandVal * 30;
      ctx.strokeStyle = hexColor;
      ctx.globalAlpha = alpha;
      ctx.lineWidth   = ring.width * (1 + bandVal * 0.7);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // Hearing state: extra pulsing outer ring
    if (state === 'hearing') {
      const flashR = BR * 1.05 * pulse;
      const flashA = 0.3 + effectiveIntensity * 0.5;
      ctx.save();
      ctx.shadowColor = `rgb(${ar},${ag},${ab})`;
      ctx.shadowBlur  = 25 + effectiveIntensity * 40;
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${flashA})`;
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, flashR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();

    // ════════════════════════════════════════════════════════════════════
    // 3. ACCRETION DISK
    // ════════════════════════════════════════════════════════════════════
    const diskSpeed = state === 'thinking' ? 0.12 : 0.22;
    const diskAngle = t * diskSpeed;
    const diskRx    = BR * 1.10 * pulse;
    const diskRy    = diskRx * 0.18;
    const diskAlpha = (0.2 + effectiveIntensity * 0.35) * (state === 'thinking' ? 0.5 : 1);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(diskAngle);
    ctx.scale(1, diskRy / diskRx);

    const dc = colors.disk;
    const diskGrad = ctx.createLinearGradient(-diskRx, 0, diskRx, 0);
    diskGrad.addColorStop(0,    'rgba(251,146,60,0)');
    diskGrad.addColorStop(0.1,  `rgba(251,146,60,${diskAlpha * 0.35})`);
    diskGrad.addColorStop(0.42, `${dc}${diskAlpha})`);
    diskGrad.addColorStop(0.58, `${dc}${diskAlpha})`);
    diskGrad.addColorStop(0.9,  `rgba(251,146,60,${diskAlpha * 0.35})`);
    diskGrad.addColorStop(1,    'rgba(251,146,60,0)');

    ctx.shadowColor = `rgb(${ar},${ag},${ab})`;
    ctx.shadowBlur  = 16 + effectiveIntensity * 30;
    ctx.strokeStyle = diskGrad;
    ctx.lineWidth   = 3 + effectiveBass * 6;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(0, 0, diskRx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // ════════════════════════════════════════════════════════════════════
    // 4. FREQUENCY WAVEFORM CORONA (hearing + speaking states)
    // ════════════════════════════════════════════════════════════════════
    const voidR = BR * 0.46;
    if (data && (state === 'hearing' || state === 'speaking') && effectiveIntensity > 0.015) {
      const SEGMENTS  = 128;
      const waveBaseR = voidR * 1.02;
      const waveMaxH  = BR * 0.22;

      ctx.save();
      ctx.shadowColor = `rgba(${ar},${ag},${ab},0.8)`;
      ctx.shadowBlur  = 10 + effectiveIntensity * 18;
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.65)`;
      ctx.lineWidth   = 1.5;
      ctx.globalAlpha = Math.min(1, 0.3 + effectiveIntensity * 0.7);

      ctx.beginPath();
      for (let i = 0; i <= SEGMENTS; i++) {
        const angle   = (i / SEGMENTS) * Math.PI * 2 - Math.PI / 2;
        const bin     = Math.floor((i / SEGMENTS) * data.length) % data.length;
        const freqVal = data[bin] / 255;
        const r       = waveBaseR + freqVal * waveMaxH;
        const x       = cx + Math.cos(angle) * r;
        const y       = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    // ════════════════════════════════════════════════════════════════════
    // 5. EVENT HORIZON SPHERE
    // ════════════════════════════════════════════════════════════════════

    // 5a. Sphere fill
    const hlx = cx - voidR * 0.22;
    const hly = cy - voidR * 0.28;
    const sphereGrad = ctx.createRadialGradient(hlx, hly, 0, cx, cy, voidR);
    sphereGrad.addColorStop(0,    'rgba(32, 8, 72, 0.85)');
    sphereGrad.addColorStop(0.18, 'rgba(18, 4, 52, 0.95)');
    sphereGrad.addColorStop(0.45, 'rgba(6,  2, 22, 1)');
    sphereGrad.addColorStop(0.78, 'rgba(2,  0, 10, 1)');
    sphereGrad.addColorStop(1,    'rgba(0,  0,  0, 1)');
    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, voidR, 0, Math.PI * 2);
    ctx.fill();

    // 5b. Gravitational lensing rings
    const LENS = 7;
    for (let i = 0; i < LENS; i++) {
      const frac  = i / LENS;
      const lr    = voidR * (0.88 - frac * 0.68);
      const lA    = (0.018 + frac * 0.016 + effectiveIntensity * 0.02) * rScale;
      const lHue  = 260 + frac * 40;
      ctx.strokeStyle = `hsla(${lHue}, 80%, 65%, ${lA})`;
      ctx.lineWidth   = 0.6;
      ctx.beginPath();
      ctx.arc(cx, cy, lr, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 5c. Vortex spiral
    const spiralSpeed = state === 'thinking' ? 0.14 : 0.07;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * spiralSpeed);
    for (let arm = 0; arm < 2; arm++) {
      const offset = (arm / 2) * Math.PI * 2;
      ctx.beginPath();
      for (let s = 0; s < 120; s++) {
        const frac  = s / 120;
        const angle = frac * Math.PI * 2 * 1.6 + offset;
        const r     = voidR * 0.85 * frac;
        const x     = Math.cos(angle) * r;
        const y     = Math.sin(angle) * r;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      const sA = (0.05 + effectiveIntensity * 0.07) * rScale;
      ctx.strokeStyle = `rgba(120, 60, 200, ${sA})`;
      ctx.lineWidth   = 0.7;
      ctx.stroke();
    }
    ctx.restore();

    // 5d. Polar jets (only when active)
    if (state !== 'thinking' && state !== 'error' && state !== 'idle') {
      const jetH = voidR * (1.3 + bands[3] * 0.8);
      const jetW = voidR * 0.18;
      const jetA = (0.12 + bands[3] * 0.28) * rScale;
      for (const dir of [-1, 1]) {
        const jGrad = ctx.createLinearGradient(cx, cy, cx, cy + dir * jetH);
        jGrad.addColorStop(0,   `rgba(${rr},${rg},${rb},${jetA})`);
        jGrad.addColorStop(0.5, `rgba(${ar},${ag},${ab},${jetA * 0.3})`);
        jGrad.addColorStop(1,   'rgba(30, 20, 80, 0)');
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx - jetW, cy);
        ctx.lineTo(cx + jetW, cy);
        ctx.lineTo(cx + jetW * 0.1, cy + dir * jetH);
        ctx.lineTo(cx - jetW * 0.1, cy + dir * jetH);
        ctx.closePath();
        ctx.fillStyle = jGrad;
        ctx.fill();
        ctx.restore();
      }
    }

    // 5e. Specular highlight
    const specX = cx - voidR * 0.3;
    const specY = cy - voidR * 0.35;
    const specR = voidR * 0.12;
    const specGrad = ctx.createRadialGradient(specX, specY, 0, specX, specY, specR);
    specGrad.addColorStop(0,   'rgba(200, 160, 255, 0.18)');
    specGrad.addColorStop(0.5, 'rgba(160, 100, 255, 0.06)');
    specGrad.addColorStop(1,   'rgba(100,  60, 200, 0)');
    ctx.fillStyle = specGrad;
    ctx.beginPath();
    ctx.arc(specX, specY, specR, 0, Math.PI * 2);
    ctx.fill();

    // ════════════════════════════════════════════════════════════════════
    // 6. PHOTON SPHERE RIM
    // ════════════════════════════════════════════════════════════════════
    const rimGlow  = 18 + effectiveIntensity * 40;
    const rimAlpha = (0.5 + effectiveIntensity * 0.4) * (state === 'error' ? 0.4 : 1);
    ctx.shadowColor = `rgba(${rr},${rg},${rb},1)`;
    ctx.shadowBlur  = rimGlow;
    ctx.strokeStyle = `rgba(${rr},${rg},${rb},${rimAlpha})`;
    ctx.lineWidth   = 1.4 + effectiveBass * 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, voidR, 0, Math.PI * 2);
    ctx.stroke();

    // Soft glow ring behind rim
    ctx.shadowBlur  = rimGlow * 2.2;
    ctx.strokeStyle = `rgba(${rr},${rg},${rb},${rimAlpha * 0.3})`;
    ctx.lineWidth   = 4 + effectiveBass * 4;
    ctx.beginPath();
    ctx.arc(cx, cy, voidR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.restore(); // end circular clip

    rafRef.current = requestAnimationFrame(drawRef.current);
  }, [frequencyDataRef]); // Only dep is frequencyDataRef (stable ref object) — never restarts

  // Keep drawRef current so the RAF loop always calls the latest draw without restarting.
  drawRef.current = draw;

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = devicePixelRatio;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Animation loop — starts once, never restarts
  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative', background: 'transparent', ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}
