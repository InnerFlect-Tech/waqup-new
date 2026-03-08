'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Camera, Sphere, Program, Mesh, Transform, Texture } from 'ogl';
import { useTheme } from '@/theme';

export type VoiceSource = 'user' | 'ai' | 'idle';

export interface VoiceOrbOGLProps {
  isActive: boolean;
  voiceSource?: VoiceSource;
  frequencyDataRef: React.RefObject<Uint8Array | null>;
  style?: React.CSSProperties;
  className?: string;
}

const FREQ_TEXTURE_SIZE = 128;

function hexToVec3(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }
  const rgba = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(hex);
  if (rgba) {
    return [
      parseInt(rgba[1], 10) / 255,
      parseInt(rgba[2], 10) / 255,
      parseInt(rgba[3], 10) / 255,
    ];
  }
  return [0.58, 0.4, 0.9];
}

const VERTEX_SHADER = `
  attribute vec3 position;
  attribute vec3 normal;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform float uVoiceSource;
  uniform vec3 uColorUser1;
  uniform vec3 uColorUser2;
  uniform vec3 uColorAI1;
  uniform vec3 uColorAI2;
  uniform sampler2D uFrequencyTexture;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.8);

    if (fresnel < 0.48) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
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

export function VoiceOrbOGL({
  isActive,
  voiceSource = 'idle',
  frequencyDataRef,
  style,
  className,
}: VoiceOrbOGLProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
    if (!containerRef.current || !webglSupported) return;

    const container = containerRef.current;
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 360;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const renderer = new Renderer({
      canvas: document.createElement('canvas'),
      width: w,
      height: h,
      dpr,
      alpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';

    const camera = new Camera(gl, { fov: 50 });
    camera.position.set(0, 0, 3.6);
    camera.lookAt([0, 0, 0]);

    const scene = new Transform();

    const texData = new Uint8Array(FREQ_TEXTURE_SIZE * 4);
    const freqTexture = new Texture(gl, {
      image: texData,
      width: FREQ_TEXTURE_SIZE,
      height: 1,
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      generateMipmaps: false,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });

    const uVoiceSource = voiceSource === 'user' ? 1 : voiceSource === 'ai' ? 2 : 0;
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0 },
        uVoiceSource: { value: uVoiceSource },
        uColorUser1: { value: hexToVec3(colorUserPrimary) },
        uColorUser2: { value: hexToVec3(colorUserSecondary) },
        uColorAI1: { value: hexToVec3(colorAIPrimary) },
        uColorAI2: { value: hexToVec3(colorAISecondary) },
        uFrequencyTexture: { value: freqTexture },
      },
      transparent: true,
      depthWrite: false,
      cullFace: null,
    });

    const geometry = new Sphere(gl, { radius: 1.6, widthSegments: 64, heightSegments: 64 });
    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    let intensity = 0;
    let rafId: number;

    const resize = () => {
      const cw = container.clientWidth || 400;
      const ch = container.clientHeight || 360;
      renderer.setSize(cw, ch);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const startTime = performance.now() / 1000;
    const update = () => {
      rafId = requestAnimationFrame(update);
      const t = performance.now() / 1000 - startTime;

      program.uniforms.uTime.value = t;
      program.uniforms.uVoiceSource.value = voiceSource === 'user' ? 1 : voiceSource === 'ai' ? 2 : 0;

      const data = frequencyDataRef.current;
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
        let s = 0;
        for (let i = 0; i < data.length; i++) s += data[i];
        intensity += (Math.min(1, s / data.length / 128) - intensity) * 0.22;
      } else {
        const idleVal = Math.floor(20 + 15 * Math.sin(t * 0.8));
        for (let i = 0; i < FREQ_TEXTURE_SIZE; i++) {
          texData[i * 4] = idleVal;
          texData[i * 4 + 1] = idleVal;
          texData[i * 4 + 2] = idleVal;
          texData[i * 4 + 3] = 255;
        }
        intensity += (0.15 + 0.05 * Math.sin(t * 0.8) - intensity) * 0.22;
      }
      freqTexture.needsUpdate = true;
      freqTexture.image = texData;

      program.uniforms.uIntensity.value = intensity;
      mesh.rotation.y += 0.008;
      mesh.scale.set(1 + intensity * 0.2);

      renderer.render({ scene, camera });
    };
    update();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    webglSupported,
    colorUserPrimary,
    colorUserSecondary,
    colorAIPrimary,
    colorAISecondary,
    voiceSource,
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
      aria-label="Voice visualization (OGL)"
    />
  );
}
