'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Mic, MicOff } from 'lucide-react';
import { spacing, borderRadius, PAGE_VERTICAL_PADDING_PX } from '@/theme';
import { useTheme } from '@/theme';
import { useAudioAnalyzer } from '@/hooks';

const VoiceOrb = dynamic(
  () => import('@/components/audio').then((mod) => ({ default: mod.VoiceOrb })),
  { ssr: false }
);
const VoiceOrbP5 = dynamic(
  () => import('@/components/audio').then((mod) => ({ default: mod.VoiceOrbP5 })),
  { ssr: false }
);
const VoiceOrbOGL = dynamic(
  () => import('@/components/audio').then((mod) => ({ default: mod.VoiceOrbOGL })),
  { ssr: false }
);

type OrbVariant = 'three' | 'p5' | 'ogl';

const ORB_LABELS: Record<OrbVariant, string> = {
  three: 'Three.js',
  p5: 'p5.js',
  ogl: 'OGL',
};

export default function SpeakTestPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [orbVariant, setOrbVariant] = useState<OrbVariant>('three');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasStartedListening, setHasStartedListening] = useState(false);

  const handleMicClick = () => {
    if (!hasStartedListening) {
      setHasStartedListening(true);
      setIsListening(true);
      setIsSpeaking(false);
      setTimeout(() => setIsSpeaking(true), 1200);
      return;
    }
    if (isListening) {
      setIsSpeaking(false);
    } else {
      setIsListening(true);
      setIsSpeaking(false);
      setTimeout(() => setIsSpeaking(true), 1200);
    }
  };

  const isActive = isListening || isSpeaking;

  const { frequencyDataRef, resume } = useAudioAnalyzer({
    isListening: hasStartedListening ? isListening : false,
    enabled: true,
    smoothingTimeConstant: 0.45,
  });

  const handleMicClickWithResume = () => {
    resume();
    handleMicClick();
  };

  const OrbComponent =
    orbVariant === 'three'
      ? VoiceOrb
      : orbVariant === 'p5'
        ? VoiceOrbP5
        : VoiceOrbOGL;

  return (
    <PageShell intensity="strong">
      <PageContent width="medium">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: `calc(100dvh - ${PAGE_VERTICAL_PADDING_PX}px)`,
            paddingTop: spacing.xxl,
            paddingBottom: spacing.xxl,
            boxSizing: 'border-box',
          }}
        >
          <Link
            href="/speak"
            style={{ textDecoration: 'none', alignSelf: 'flex-start', marginBottom: spacing.xl }}
          >
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              ← Speak
            </Typography>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: spacing.lg, flexShrink: 0 }}
          >
            <Typography
              variant="h1"
              style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}
            >
              Orb test mode
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg }}>
              Switch between Three.js, p5.js, and OGL orb implementations
            </Typography>

            {/* 3 pill buttons */}
            <div
              style={{
                display: 'flex',
                gap: spacing.sm,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {(['three', 'p5', 'ogl'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setOrbVariant(v)}
                  style={{
                    padding: `${spacing.sm} ${spacing.lg}`,
                    borderRadius: borderRadius.full,
                    border: `1px solid ${orbVariant === v ? colors.accent.primary : colors.glass.border}`,
                    background: orbVariant === v ? `${colors.accent.primary}20` : 'transparent',
                    color: orbVariant === v ? colors.accent.primary : colors.text.secondary,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  {ORB_LABELS[v]}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Orb area */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: 480,
              minHeight: 320,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={orbVariant}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ width: '100%', minHeight: 360 }}
              >
                <OrbComponent
                  isActive={isActive}
                  voiceSource={isListening ? 'user' : isSpeaking ? 'ai' : 'idle'}
                  frequencyDataRef={frequencyDataRef}
                  style={{ minHeight: 360, width: '100%' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mic button */}
          <div style={{ position: 'relative', marginBottom: spacing.xl, flexShrink: 0 }}>
            {isActive && (
              <>
                {[1, 2].map((ring) => (
                  <motion.div
                    key={ring}
                    animate={{ scale: [1, 1.8 + ring * 0.3], opacity: [0.35, 0] }}
                    transition={{ duration: 1.6, delay: ring * 0.4, repeat: Infinity, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: borderRadius.full,
                      border: `2px solid ${colors.accent.primary}`,
                      pointerEvents: 'none',
                    }}
                  />
                ))}
              </>
            )}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleMicClickWithResume}
              style={{
                width: 88,
                height: 88,
                borderRadius: borderRadius.full,
                border: 'none',
                background: isActive ? colors.gradients.primary : colors.glass.light,
                backdropFilter: isActive ? undefined : 'blur(12px)',
                color: isActive ? colors.text.onDark : colors.text.primary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive
                  ? `0 8px 32px ${colors.accent.primary}60`
                  : '0 4px 16px rgba(0,0,0,0.3)',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
                position: 'relative',
              }}
            >
              {isActive ? (
                <MicOff size={36} strokeWidth={2} />
              ) : (
                <Mic size={36} strokeWidth={2} />
              )}
            </motion.button>
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
}
