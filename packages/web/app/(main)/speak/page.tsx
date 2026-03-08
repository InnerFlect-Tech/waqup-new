'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button } from '@/components';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Mic, MicOff, MessageSquare } from 'lucide-react';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { useAudioAnalyzer } from '@/hooks';

const VoiceOrb = dynamic(
  () => import('@/components/audio').then((mod) => ({ default: mod.VoiceOrb })),
  { ssr: false }
);

const STATUS_MESSAGES = {
  idle: { text: 'Tap to speak', sub: 'Tell us what you want to create or how you feel' },
  listening: { text: 'Listening...', sub: 'Speak freely, we are here' },
  speaking: { text: 'Processing...', sub: 'Creating something for you' },
};

export default function SpeakPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false);
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

  const { frequencyDataRef, resume } = useAudioAnalyzer({
    isListening,
    enabled: isActive,
  });

  const handleMicClickWithResume = () => {
    resume();
    handleMicClick();
  };

  return (
    <PageShell intensity="strong">
      <PageContent width="medium">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: spacing.xxl }}>
          <Link href="/sanctuary" style={{ textDecoration: 'none', alignSelf: 'flex-start', marginBottom: spacing.xl }}>
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              ← Sanctuary
            </Typography>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: spacing.xxl }}
          >
            <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
              Speak
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Voice-first creation — just talk, we&apos;ll handle the rest
            </Typography>
          </motion.div>

          {/* Animation area */}
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              marginBottom: spacing.xxl,
              borderRadius: borderRadius.xl,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <VoiceOrb
              isActive={isActive}
              voiceSource={isListening ? 'user' : isSpeaking ? 'ai' : 'idle'}
              frequencyDataRef={frequencyDataRef}
              style={{ minHeight: 280, borderRadius: borderRadius.xl }}
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
              style={{ textAlign: 'center', marginBottom: spacing.xl }}
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
          <div style={{ position: 'relative', marginBottom: spacing.xxl }}>
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
