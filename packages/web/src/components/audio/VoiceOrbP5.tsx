// @ts-nocheck - R3F Three.js elements extend JSX; TS augmentation not fully picked up
'use client';

import React, { useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const R3FCanvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

interface VoiceOrbP5Props {
  isActive: boolean;
  voiceSource?: 'user' | 'ai' | 'idle';
  frequencyDataRef?: React.RefObject<Uint8Array | null>;
  style?: React.CSSProperties;
  className?: string;
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uVoiceSource; // 0=idle, 1=user, 2=ai
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  // Hash-based noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p  = p * 2.3 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  vec3 auroraColor(float t, float voiceSrc) {
    // user: teal → violet → emerald
    // ai:   electric blue → purple → cyan
    // idle: deep violet → teal
    if (voiceSrc > 1.5) {
      // ai
      return mix(
        mix(vec3(0.0, 0.6, 1.0), vec3(0.55, 0.15, 0.9), t),
        vec3(0.0, 0.9, 0.85),
        smoothstep(0.6, 1.0, t)
      );
    } else if (voiceSrc > 0.5) {
      // user
      return mix(
        mix(vec3(0.05, 0.6, 0.52), vec3(0.48, 0.2, 0.9), t),
        vec3(0.06, 0.72, 0.42),
        smoothstep(0.6, 1.0, t)
      );
    } else {
      // idle
      return mix(vec3(0.27, 0.08, 0.55), vec3(0.04, 0.5, 0.52), t);
    }
  }

  void main() {
    // Fresnel for edge glow
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.8);

    // Aurora bands — layered fbm waves along Y with time drift
    float y   = vUv.y;
    float slow = uTime * 0.12;
    float fast = uTime * 0.31;

    float band1 = fbm(vec2(vUv.x * 2.2 + slow,  y * 4.0 + slow * 0.7));
    float band2 = fbm(vec2(vUv.x * 3.8 - fast,  y * 6.5 + fast * 0.4));
    float band3 = fbm(vec2(vUv.x * 1.6 + slow * 0.5, y * 2.8 - slow * 0.3));

    // Vertical wave envelope: bands concentrated in a drifting horizontal strip
    float envelope1 = exp(-8.0 * pow(y - 0.35 - 0.15 * sin(slow), 2.0));
    float envelope2 = exp(-10.0 * pow(y - 0.65 + 0.12 * cos(fast * 0.7), 2.0));
    float envelope3 = exp(-6.0  * pow(y - 0.50 + 0.08 * sin(slow * 1.3), 2.0));

    float aurora = band1 * envelope1 * 1.4
                 + band2 * envelope2 * 1.1
                 + band3 * envelope3 * 0.9;

    aurora = clamp(aurora, 0.0, 1.0);
    aurora = aurora * (0.5 + uIntensity * 0.8); // audio reactive

    // Color
    vec3 col = auroraColor(aurora, uVoiceSource);

    // Add fresnel rim glow
    vec3 rimCol = uVoiceSource > 1.5
      ? vec3(0.15, 0.5, 1.0)
      : uVoiceSource > 0.5
        ? vec3(0.2, 0.85, 0.6)
        : vec3(0.45, 0.15, 0.8);

    col += rimCol * fresnel * (0.5 + uIntensity * 0.5);

    // Black void center (additive approach: dark interior, bright edges)
    float centerMask = 1.0 - smoothstep(0.05, 0.45, 1.0 - fresnel);
    col *= centerMask;
    col += rimCol * fresnel * fresnel * 0.4;

    float alpha = clamp(aurora * 0.9 + fresnel * 0.7, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

function AuroraOrb({
  isActive,
  voiceSource = 'idle',
  frequencyDataRef,
}: {
  isActive: boolean;
  voiceSource: 'user' | 'ai' | 'idle';
  frequencyDataRef?: React.RefObject<Uint8Array | null>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime:        { value: 0 },
      uIntensity:   { value: 0 },
      uVoiceSource: { value: 0 },
    }),
    []
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;

    const srcMap = { idle: 0, user: 1, ai: 2 };
    uniforms.uVoiceSource.value = srcMap[voiceSource] ?? 0;

    let intensity = 0;
    if (frequencyDataRef?.current) {
      const data = frequencyDataRef.current;
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      intensity = Math.min(1, (sum / data.length) / 128);
    }
    const target = isActive ? 0.25 + intensity * 0.75 : 0.1;
    uniforms.uIntensity.value += (target - uniforms.uIntensity.value) * 0.08;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.6, 96, 96]} />
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        side={THREE.FrontSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function VoiceOrbP5({
  isActive,
  voiceSource = 'idle',
  frequencyDataRef,
  style,
  className,
}: VoiceOrbP5Props) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 320,
        background: 'transparent',
        ...style,
      }}
    >
      <R3FCanvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <AuroraOrb
          isActive={isActive}
          voiceSource={voiceSource}
          frequencyDataRef={frequencyDataRef}
        />
      </R3FCanvas>
    </div>
  );
}
