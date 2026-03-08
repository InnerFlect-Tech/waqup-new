'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button } from '@/components';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Mic, MicOff, MessageSquare } from 'lucide-react';
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

type OrbVariant = 'singularity' | 'aurora' | 'nebula';

const ORB_LABELS: Record<OrbVariant, string> = {
  singularity: 'Singularity',
  aurora: 'Aurora',
  nebula: 'Nebula',
};

const STATUS_MESSAGES = {
  idle: { text: 'Tap to speak', sub: 'Tell us what you want to create or how you feel' },
  listening: { text: 'Listening...', sub: 'Speak freely, we are here' },
  speaking: { text: 'Processing...', sub: 'Creating something for you' },
};

export default function SpeakPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [orbVariant, setOrbVariant] = useState<OrbVariant>('singularity');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  /** Once user taps to start, we keep listening (always-on). Gate needed for mic permission. */
  const [hasStartedListening, setHasStartedListening] = useState(false);

  const OrbComponent =
    orbVariant === 'singularity' ? VoiceOrb : orbVariant === 'aurora' ? VoiceOrbP5 : VoiceOrbOGL;

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

  const status = isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle';
  const { text, sub } = STATUS_MESSAGES[status];
  const isActive = isListening || isSpeaking;

  const { frequencyDataRef, resume, isReady, error } = useAudioAnalyzer({
    isListening: hasStartedListening ? isListening : false,
    enabled: true,
    smoothingTimeConstant: 0.45,
  });

  const handleMicClickWithResume = () => {
    resume();
    handleMicClick();
  };

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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: spacing.xl, flexShrink: 0 }}
          >
            <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
              Speak
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Voice-first creation — just talk, we&apos;ll handle the rest
            </Typography>
          </motion.div>

          {/* Orb style switcher — 3 buttons to change orb variant */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.sm,
              marginBottom: spacing.lg,
              flexShrink: 0,
            }}
          >
            <Typography variant="small" style={{ color: colors.text.secondary, fontWeight: 600 }}>
              Visual style
            </Typography>
            <div
              style={{
                display: 'flex',
                gap: spacing.sm,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {(['singularity', 'aurora', 'nebula'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setOrbVariant(v)}
                  style={{
                    padding: `${spacing.md} ${spacing.xl}`,
                    borderRadius: borderRadius.full,
                    border: `2px solid ${orbVariant === v ? colors.accent.primary : colors.glass.border}`,
                    background: orbVariant === v ? `${colors.accent.primary}30` : colors.glass.medium,
                    color: orbVariant === v ? colors.accent.primary : colors.text.primary,
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  {ORB_LABELS[v]}
                </button>
              ))}
            </div>
          </div>

          {/* Orb area — flex: 1 centers orb in viewport */}
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
            <OrbComponent
              isActive={isActive}
              voiceSource={isListening ? 'user' : isSpeaking ? 'ai' : 'idle'}
              frequencyDataRef={frequencyDataRef}
              style={{ minHeight: 360, width: '100%' }}
            />
          </div>

          {/* Status text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ textAlign: 'center', marginBottom: spacing.lg, flexShrink: 0 }}
            >
              <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 400 }}>
                {text}
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14 }}>
                {sub}
              </Typography>
            </motion.div>
          </AnimatePresence>

          {/* Mic button with pulse rings */}
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
                boxShadow: isActive ? `0 8px 32px ${colors.accent.primary}60` : `0 4px 16px rgba(0,0,0,0.3)`,
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
                position: 'relative',
              }}
            >
              {isActive ? <MicOff size={36} strokeWidth={2} /> : <Mic size={36} strokeWidth={2} />}
            </motion.button>
          </div>

          {/* Type alternative */}
          <Link href="/create/conversation" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md" style={{ color: colors.text.secondary, gap: spacing.sm }}>
              <MessageSquare size={16} />
              Prefer to type?
            </Button>
          </Link>
        </div>
      </PageContent>
    </PageShell>
  );
}
