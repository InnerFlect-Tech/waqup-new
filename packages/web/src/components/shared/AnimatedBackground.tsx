'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/theme';

interface AnimatedBackgroundProps {
  intensity?: 'light' | 'medium' | 'strong' | 'high';
  color?: 'primary' | 'secondary' | 'tertiary';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  intensity = 'medium',
  color = 'primary',
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const colors = theme.colors;
  
  const opacityMap = {
    light: 0.05,
    medium: 0.1,
    strong: 0.15,
    high: 0.2,
  };

  const opacity = opacityMap[intensity] || opacityMap.medium;
  const accentColor = color === 'primary' ? colors.accent.primary : color === 'secondary' ? colors.accent.secondary : colors.accent.tertiary;

  // Helper to convert hex to rgba with opacity
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Parse blur value (remove 'px' if present)
  const blurValue = colors.mystical.blur.replace('px', '');

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: -10,
        overflow: 'hidden',
      }}
    >
      {/* Base gradient background (MATCHES OLD APP: bg-gradient-to-br from-black via-purple-900/20 to-black) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom right, ${colors.background.primary}, rgba(88, 28, 135, 0.2), ${colors.background.primary})`,
        }}
      />

      {/* Animated orb 1 (MATCHES OLD APP: purple-500/30 blur-[100px]) */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexToRgba('#A855F7', 0.3)}, transparent)`, // purple-500/30
          filter: 'blur(100px)',
          animation: 'float 2s ease-in-out infinite',
        }}
      />

      {/* Animated orb 2 (MATCHES OLD APP: indigo-500/30 blur-[120px]) */}
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexToRgba('#6366F1', 0.3)}, transparent)`, // indigo-500/30
          filter: 'blur(120px)',
          animation: 'float 3s ease-in-out infinite reverse',
          animationDelay: '1s',
        }}
      />

      {/* Radial gradient overlay (MATCHES OLD APP) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%)`,
        }}
      />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(0.8);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) translateX(10px) scale(1);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
};
