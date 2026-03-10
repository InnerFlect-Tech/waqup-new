'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Typography } from '@/components';
import { PageShell, PageContent } from '@/components';
import { Mic, MicOff } from 'lucide-react';
import { spacing, borderRadius, PAGE_VERTICAL_PADDING_PX, BLUR } from '@/theme';
import { useTheme } from '@/theme';
import { useAudioAnalyzer } from '@/hooks';

const VoiceOrb = dynamic(
  () => import('@/components/orb').then((mod) => ({ default: mod.VoiceOrb })),
  { ssr: false }
);

export default function SpeakTestPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
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

  return (
    <PageShell intensity="strong">
      <PageContent width="medium">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: `calc(100dvh - ${PAGE_VERTICAL_PADDING_PX}px)`,
            paddingTop: spacing.lg,
            paddingBottom: spacing.xxl,
            boxSizing: 'border-box',
          }}
        >
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
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Voice orb demo — click the mic to toggle listening / speaking states
            </Typography>
          </motion.div>

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
            <VoiceOrb
              isActive={isActive}
              voiceSource={isListening ? 'user' : isSpeaking ? 'ai' : 'idle'}
              frequencyDataRef={frequencyDataRef}
              style={{ minHeight: 360, width: '100%' }}
            />
          </div>

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
                backdropFilter: isActive ? undefined : BLUR.lg,
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
