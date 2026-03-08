// @ts-nocheck - R3F Three.js elements (mesh, sphereGeometry, shaderMaterial) extend JSX; TS augmentation not picked up
'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTheme } from '@/theme';

const R3FCanvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uDisplacement;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  // Simplex-like noise for organic displacement
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    vec4 n = p * 0.142857142857;
    vec4 ns = n * 7.0 * n - 1.0;
    vec4 j = p - 49.0 * floor(n * ns);
    vec4 x_ = floor(j * 7.0);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * 0.142857142857 + 0.5;
    vec4 y = y_ * 0.142857142857 + 0.5;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 pos = position;
    float noise = snoise(pos * 2.0 + uTime * 0.5) * uDisplacement * uIntensity;
    pos += normal * noise;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uVoiceSource;
  uniform vec3 uColorUser1;
  uniform vec3 uColorUser2;
  uniform vec3 uColorAI1;
  uniform vec3 uColorAI2;
  uniform sampler2D uFrequencyTexture;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    vec4 n = p * 0.142857142857;
    vec4 ns = n * 7.0 * n - 1.0;
    vec4 j = p - 49.0 * floor(n * ns);
    vec4 x_ = floor(j * 7.0);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * 0.142857142857 + 0.5;
    vec4 y = y_ * 0.142857142857 + 0.5;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.8);

    if (fresnel < 0.48) {
      vec3 voidColor = vec3(0.0, 0.0, 0.0);
      gl_FragColor = vec4(voidColor, 1.0);
    } else {
      float theta = atan(vNormal.z, vNormal.x);
      float thetaNorm = (theta / 3.14159265 + 1.0) * 0.5;
      float freq = texture2D(uFrequencyTexture, vec2(thetaNorm, 0.5)).r;
      float segments = 64.0;
      float bar = floor(thetaNorm * segments) / segments;
      float barFreq = texture2D(uFrequencyTexture, vec2(bar + 0.5 / segments, 0.5)).r;
      float segMask = smoothstep(0.02, 0.04, abs(thetaNorm - bar - 0.5 / segments));
      freq = mix(freq, barFreq, segMask * 0.7);

      vec3 userColor = mix(uColorUser1, uColorUser2, fresnel);
      vec3 aiColor = mix(uColorAI1, uColorAI2, fresnel);
      float userMix = step(0.5, uVoiceSource) * (1.0 - step(1.5, uVoiceSource));
      vec3 themeColor = mix(aiColor, userColor, userMix);

      vec3 orange = vec3(1.0, 0.4, 0.2);
      vec3 pink = vec3(1.0, 0.4, 0.6);
      vec3 magenta = vec3(0.9, 0.2, 0.7);
      vec3 blue = vec3(0.3, 0.5, 1.0);
      vec3 violet = vec3(0.5, 0.2, 0.9);
      float t = thetaNorm;
      vec3 gradientColor;
      if (t < 0.25) gradientColor = mix(orange, pink, t * 4.0);
      else if (t < 0.5) gradientColor = mix(pink, magenta, (t - 0.25) * 4.0);
      else if (t < 0.75) gradientColor = mix(magenta, blue, (t - 0.5) * 4.0);
      else gradientColor = mix(blue, violet, (t - 0.75) * 4.0);
      vec3 baseColor = mix(themeColor, gradientColor, 0.6);

      float innerEdge = smoothstep(0.48, 0.52, fresnel);
      float outerGlow = smoothstep(0.45, 0.85, fresnel);
      float ringIntensity = 0.75 + freq * 0.75 + uIntensity * 0.5;
      float pulse = 0.93 + 0.07 * sin(uTime * 1.5) * (1.0 - uIntensity * 0.4);
      vec3 ringColor = baseColor * ringIntensity * pulse;
      ringColor = pow(ringColor, vec3(0.9));
      vec3 haloColor = baseColor * 0.25 * outerGlow * (1.0 - innerEdge * 0.5);
      vec3 color = ringColor * innerEdge + haloColor;

      float alpha = 0.9 * innerEdge + 0.35 * outerGlow * (1.0 - innerEdge) + freq * 0.25 + uIntensity * 0.2;
      gl_FragColor = vec4(color, min(alpha, 1.0));
    }
  }
`;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const FREQ_TEXTURE_SIZE = 128;

interface OrbSceneProps {
  frequencyDataRef: React.RefObject<Uint8Array | null>;
  isActive: boolean;
  voiceSource: 'user' | 'ai' | 'idle';
  colorUserPrimary: string;
  colorUserSecondary: string;
  colorAIPrimary: string;
  colorAISecondary: string;
  reducedMotion: boolean;
}

function OrbScene({
  frequencyDataRef,
  isActive,
  voiceSource,
  colorUserPrimary,
  colorUserSecondary,
  colorAIPrimary,
  colorAISecondary,
  reducedMotion,
}: OrbSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const intensityRef = useRef(0);
  const freqTextureRef = useRef<THREE.DataTexture | null>(null);
  const texDataRef = useRef(new Uint8Array(FREQ_TEXTURE_SIZE * 4));

  const uniforms = useMemo(() => {
    const freqTexture = new THREE.DataTexture(
      texDataRef.current,
      FREQ_TEXTURE_SIZE,
      1,
      THREE.RGBAFormat,
      THREE.UnsignedByteType
    );
    freqTexture.needsUpdate = true;
    freqTextureRef.current = freqTexture;

    const uVoiceSource = voiceSource === 'user' ? 1 : voiceSource === 'ai' ? 2 : 0;
    return {
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uVoiceSource: { value: uVoiceSource },
      uDisplacement: { value: reducedMotion ? 0 : 0.08 },
      uColorUser1: { value: hexToVec3(colorUserPrimary) },
      uColorUser2: { value: hexToVec3(colorUserSecondary) },
      uColorAI1: { value: hexToVec3(colorAIPrimary) },
      uColorAI2: { value: hexToVec3(colorAISecondary) },
      uFrequencyTexture: { value: freqTexture },
    };
  }, [
    colorUserPrimary,
    colorUserSecondary,
    colorAIPrimary,
    colorAISecondary,
    voiceSource,
    reducedMotion,
  ]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    uniforms.uVoiceSource.value = voiceSource === 'user' ? 1 : voiceSource === 'ai' ? 2 : 0;

    const data = frequencyDataRef.current;
    const freqTex = freqTextureRef.current;
    const texData = texDataRef.current;
    if (freqTex && texData) {
      if (data && data.length > 0) {
        const binCount = data.length;
        for (let i = 0; i < FREQ_TEXTURE_SIZE; i++) {
          const srcStart = Math.floor((i / FREQ_TEXTURE_SIZE) * binCount);
          const srcEnd = Math.floor(((i + 1) / FREQ_TEXTURE_SIZE) * binCount);
          let sum = 0;
          for (let j = srcStart; j < srcEnd && j < binCount; j++) {
            const voiceBoost = j >= 4 && j <= 140 ? 1.4 : 1;
            sum += data[j] * voiceBoost;
          }
          const count = srcEnd - srcStart;
          const avg = count > 0 ? sum / count : 0;
          const val = Math.min(255, Math.floor(avg));
          texData[i * 4] = val;
          texData[i * 4 + 1] = val;
          texData[i * 4 + 2] = val;
          texData[i * 4 + 3] = 255;
        }
      } else {
        const idleVal = Math.floor(20 + 15 * Math.sin(t * 0.8));
        for (let i = 0; i < FREQ_TEXTURE_SIZE; i++) {
          texData[i * 4] = idleVal;
          texData[i * 4 + 1] = idleVal;
          texData[i * 4 + 2] = idleVal;
          texData[i * 4 + 3] = 255;
        }
      }
      freqTex.needsUpdate = true;
    }

    let targetIntensity = 0;
    if (data && data.length > 0) {
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i];
      }
      targetIntensity = Math.min(1, sum / data.length / 128);
    } else {
      targetIntensity = 0.15 + 0.05 * Math.sin(t * 0.8);
    }

    const lerpFactor = 0.22;
    intensityRef.current += (targetIntensity - intensityRef.current) * lerpFactor;
    uniforms.uIntensity.value = intensityRef.current;

    if (meshRef.current) {
      const scale = 1 + intensityRef.current * 0.2;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export type VoiceSource = 'user' | 'ai' | 'idle';

export interface VoiceOrbProps {
  /** Whether audio is active (listening or speaking) */
  isActive: boolean;
  /** Voice source: user (mic), ai (TTS), or idle */
  voiceSource?: VoiceSource;
  /** Ref to frequency data from useAudioAnalyzer */
  frequencyDataRef: React.RefObject<Uint8Array | null>;
  /** Custom style */
  style?: React.CSSProperties;
  /** Custom className */
  className?: string;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    setVisible(!document.hidden);
    const handler = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  return visible;
}

export function VoiceOrb({
  isActive,
  voiceSource = 'idle',
  frequencyDataRef,
  style,
  className,
}: VoiceOrbProps) {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const webglSupported = useWebGLSupport();
  const pageVisible = usePageVisible();

  const colorUserPrimary = theme.colors.accent.primary;
  const colorUserSecondary = theme.colors.accent.secondary;
  const colorAIPrimary = theme.colors.mystical.orb;
  const colorAISecondary = theme.colors.mystical.glow;

  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;

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
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 360,
        background: 'transparent',
        overflow: 'hidden',
        ...style,
      }}
      aria-label="Voice visualization"
    >
      <R3FCanvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.6], fov: 50 }}
        dpr={[1, dpr]}
        frameloop={pageVisible ? 'always' : 'demand'}
        style={{ width: '100%', height: '100%', minHeight: 360 }}
      >
        <OrbScene
          frequencyDataRef={frequencyDataRef}
          isActive={isActive}
          voiceSource={voiceSource}
          colorUserPrimary={colorUserPrimary}
          colorUserSecondary={colorUserSecondary}
          colorAIPrimary={colorAIPrimary}
          colorAISecondary={colorAISecondary}
          reducedMotion={reducedMotion}
        />
      </R3FCanvas>
    </div>
  );
}
