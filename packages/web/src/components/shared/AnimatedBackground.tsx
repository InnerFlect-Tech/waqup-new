'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/theme';

interface AnimatedBackgroundProps {
  intensity?: 'light' | 'medium' | 'strong' | 'high';
  color?: 'primary' | 'secondary' | 'tertiary';
}

function isDarkBg(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  intensity = 'medium',
  color = 'primary',
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- hydration-safe client-only render
  }, []);

  if (!mounted) {
    return null;
  }

  const colors = theme.colors;
  const darkMode = isDarkBg(colors.background.primary);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const accentColor = color === 'primary' ? colors.accent.primary : color === 'secondary' ? colors.accent.secondary : colors.accent.tertiary;

  if (!darkMode) {
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: colors.gradients.background,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${hexToRgba(accentColor, 0.08)}, transparent)`,
            filter: 'blur(80px)',
            animation: 'float 4s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${hexToRgba(colors.accent.secondary, 0.06)}, transparent)`,
            filter: 'blur(90px)',
            animation: 'float 5s ease-in-out infinite reverse',
            animationDelay: '1s',
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes float {
            0%   { transform: translateY(0) translateX(0) scale(0.98); opacity: 0.6; }
            50%  { transform: translateY(-15px) translateX(8px) scale(1); opacity: 0.8; }
            100% { transform: translateY(0) translateX(0) scale(0.98); opacity: 0.6; }
          }
        ` }} />
      </div>
    );
  }

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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom right, ${colors.background.primary}, rgba(88, 28, 135, 0.2), ${colors.background.primary})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexToRgba('#A855F7', 0.3)}, transparent)`,
          filter: 'blur(100px)',
          animation: 'float 2s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexToRgba('#6366F1', 0.3)}, transparent)`,
          filter: 'blur(120px)',
          animation: 'float 3s ease-in-out infinite reverse',
          animationDelay: '1s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%   { transform: translateY(0px) translateX(0px) scale(0.95); opacity: 0.1; }
          50%  { transform: translateY(-20px) translateX(10px) scale(1);  opacity: 0.15; }
          100% { transform: translateY(0px) translateX(0px) scale(0.95); opacity: 0.1; }
        }
      ` }} />
    </div>
  );
};
