'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/theme';

export interface SpeakingAnimationProps {
  /** Whether audio is currently playing/speaking */
  isSpeaking?: boolean;
  /** Duration for each page transition in milliseconds */
  pageDuration?: number;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Audio frequency data for reactive visualization (optional) */
  frequencyData?: number[];
}

/**
 * SpeakingAnimation - A refined, professional 4-page animated component
 * with ChatGPT-like simplicity and futuristic glass-morphism design.
 * 
 * Features:
 * - Clean, minimal animations with ample white space
 * - Professional glass-morphism effects
 * - Subtle futuristic vibes without overwhelming visuals
 * - Smooth, refined transitions
 * - 4 distinct pages with elegant simplicity
 */
export const SpeakingAnimation: React.FC<SpeakingAnimationProps> = ({
  isSpeaking = false,
  pageDuration = 5000, // 5 seconds per page for more contemplative feel
  className = '',
  style,
  frequencyData,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [currentPage, setCurrentPage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Cycle through 4 pages when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % 4);
    }, pageDuration);

    return () => clearInterval(interval);
  }, [isSpeaking, pageDuration]);

  // Reset to first page when speaking starts
  useEffect(() => {
    if (isSpeaking) {
      setCurrentPage(0);
    }
  }, [isSpeaking]);

  // Generate frequency bars (simulated if not provided)
  const frequencyBars = frequencyData || Array.from({ length: 12 }, () => Math.random() * 0.6 + 0.2);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        overflow: 'hidden',
        borderRadius: '16px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-in-out',
        background: colors.background.primary,
        ...style,
      }}
    >
      {/* Subtle Background Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${colors.accent.light}15 0%, transparent 70%)`,
        }}
      />

      {/* Page 1: Minimal Floating Orbs */}
      <Page
        isActive={currentPage === 0}
        pageIndex={0}
        colors={colors}
      >
        <div className="minimal-orb-container">
          <div className="minimal-orb minimal-orb-1" />
          <div className="minimal-orb minimal-orb-2" />
          <div className="minimal-orb minimal-orb-3" />
        </div>
      </Page>

      {/* Page 2: Clean Frequency Bars */}
      <Page
        isActive={currentPage === 1}
        pageIndex={1}
        colors={colors}
      >
        <div className="clean-frequency-container">
          {frequencyBars.map((height, index) => (
            <div
              key={index}
              className="clean-frequency-bar"
              style={{
                animationDelay: `${index * 0.08}s`,
                '--bar-height': `${height * 100}%`,
              } as React.CSSProperties & { '--bar-height': string }}
            />
          ))}
        </div>
      </Page>

      {/* Page 3: Subtle Wave Pattern */}
      <Page
        isActive={currentPage === 2}
        pageIndex={2}
        colors={colors}
      >
        <div className="subtle-wave-container">
          <div className="subtle-wave subtle-wave-1" />
          <div className="subtle-wave subtle-wave-2" />
          <div className="subtle-wave subtle-wave-3" />
        </div>
      </Page>

      {/* Page 4: Minimal Rotating Rings */}
      <Page
        isActive={currentPage === 3}
        pageIndex={3}
        colors={colors}
      >
        <div className="minimal-ring-container">
          <div className="minimal-ring minimal-ring-1" />
          <div className="minimal-ring minimal-ring-2" />
        </div>
      </Page>

      {/* Minimal Page Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            style={{
              width: currentPage === index ? '24px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: currentPage === index
                ? colors.accent.primary
                : `${colors.border.light}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            aria-label={`Page ${index + 1} of 4`}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        /* Page Container - Clean transitions */
        .page {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          pointer-events: none;
        }

        .page.active {
          opacity: 1;
          transform: translateY(0);
        }

        /* Page 1: Minimal Floating Orbs */
        .minimal-orb-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .minimal-orb {
          position: absolute;
          border-radius: 50%;
          background: ${colors.glass.light};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${colors.glass.border};
          box-shadow: 0 4px 16px ${colors.mystical.glow}15;
        }

        .minimal-orb-1 {
          width: 120px;
          height: 120px;
          top: 25%;
          left: 20%;
          animation: minimalFloat-1 8s ease-in-out infinite;
        }

        .minimal-orb-2 {
          width: 100px;
          height: 100px;
          top: 50%;
          right: 25%;
          animation: minimalFloat-2 10s ease-in-out infinite;
        }

        .minimal-orb-3 {
          width: 80px;
          height: 80px;
          bottom: 25%;
          left: 50%;
          animation: minimalFloat-3 12s ease-in-out infinite;
        }

        @keyframes minimalFloat-1 {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.6;
          }
          50% {
            transform: translate(20px, -20px);
            opacity: 0.8;
          }
        }

        @keyframes minimalFloat-2 {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.5;
          }
          50% {
            transform: translate(-25px, 25px);
            opacity: 0.7;
          }
        }

        @keyframes minimalFloat-3 {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.6;
          }
          50% {
            transform: translate(15px, -15px);
            opacity: 0.8;
          }
        }

        /* Page 2: Clean Frequency Bars */
        .clean-frequency-container {
          position: relative;
          width: 80%;
          max-width: 400px;
          height: 200px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 6px;
        }

        .clean-frequency-bar {
          flex: 1;
          max-width: 24px;
          height: var(--bar-height);
          min-height: 20px;
          background: ${colors.gradients.primary};
          border-radius: 4px 4px 0 0;
          opacity: 0.7;
          animation: cleanBarPulse 1.5s ease-in-out infinite;
          transform-origin: bottom;
        }

        @keyframes cleanBarPulse {
          0%, 100% {
            transform: scaleY(1);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(1.1);
            opacity: 0.9;
          }
        }

        /* Page 3: Subtle Wave Pattern */
        .subtle-wave-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subtle-wave {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 1px solid ${colors.glass.border};
          background: ${colors.glass.light}40;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .subtle-wave-1 {
          animation: subtleWave-1 6s ease-in-out infinite;
        }

        .subtle-wave-2 {
          animation: subtleWave-2 8s ease-in-out infinite 1s;
        }

        .subtle-wave-3 {
          animation: subtleWave-3 10s ease-in-out infinite 2s;
        }

        @keyframes subtleWave-1 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }

        @keyframes subtleWave-2 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.4;
          }
        }

        @keyframes subtleWave-3 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.25;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.45;
          }
        }

        /* Page 4: Minimal Rotating Rings */
        .minimal-ring-container {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .minimal-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1.5px solid ${colors.glass.border};
        }

        .minimal-ring-1 {
          width: 120px;
          height: 120px;
          border-top-color: ${colors.accent.primary};
          border-right-color: ${colors.accent.secondary};
          border-bottom-color: transparent;
          border-left-color: transparent;
          animation: minimalRotate-1 8s linear infinite;
        }

        .minimal-ring-2 {
          width: 160px;
          height: 160px;
          border-top-color: ${colors.accent.secondary};
          border-right-color: ${colors.accent.primary};
          border-bottom-color: transparent;
          border-left-color: transparent;
          animation: minimalRotate-2 12s linear infinite reverse;
        }

        @keyframes minimalRotate-1 {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes minimalRotate-2 {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Page Component - Clean page wrapper
 */
interface PageProps {
  isActive: boolean;
  pageIndex: number;
  colors: any;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ isActive, children }) => {
  return (
    <div className={`page ${isActive ? 'active' : ''}`}>
      {children}
    </div>
  );
};
