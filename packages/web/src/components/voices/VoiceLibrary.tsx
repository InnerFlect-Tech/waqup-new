'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR, CONTENT_READABLE } from '@/theme';
import { useCreditBalance } from '@/hooks';
import { QCoin } from '@/components/ui/QCoin';
import { VoiceCard } from './VoiceCard';
import { AddVoiceModal } from './AddVoiceModal';
import type { UserVoice } from '@waqup/shared/types';
import { API_ROUTE_COSTS } from '@waqup/shared/constants';

export function VoiceLibrary() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { balance } = useCreditBalance();

  const [voices, setVoices] = useState<UserVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchVoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/voices');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? 'Failed to load voices');
      setVoices((data.voices ?? []) as UserVoice[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load voices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);

  const handleVoiceCreated = (voice: UserVoice) => {
    setVoices((prev) => [...prev, voice]);
    setShowAddModal(false);
  };

  const handleVoiceDeleted = (id: string) => {
    setVoices((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSamplesAdded = (_id: string) => {
    // Voice quality improved — no state change needed
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="voice-library-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `${spacing.xxl} 0`,
              minHeight: 200,
            }}
          >
            <Loader2 size={28} color={colors.accent.primary} className="animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      {!loading && (
    <>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: spacing.xl,
          flexWrap: 'wrap',
          gap: spacing.md,
        }}
      >
        <div>
          <Typography variant="h2" style={{ color: colors.text.primary, margin: 0, fontWeight: 300 }}>
            Voice Library
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
            Preserve the voices of those who matter most. Use them in your meditations and affirmations.
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexShrink: 0 }}>
          <QCoin size="sm" showAmount={balance} />
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}
          >
            <Plus size={16} />
            Add voice
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: `2px 7px`,
                borderRadius: borderRadius.full,
                background: 'rgba(255,255,255,0.2)',
                marginLeft: 4,
              }}
            >
              {API_ROUTE_COSTS.voiceSlot} Q
            </span>
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: spacing.md,
            borderRadius: borderRadius.md,
            background: `${colors.error}10`,
            border: `1px solid ${colors.error}30`,
            marginBottom: spacing.xl,
          }}
        >
          <Typography variant="small" style={{ color: colors.error }}>
            {error}
          </Typography>
        </div>
      )}

      {/* Empty state */}
      {voices.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: `${spacing.xxl} ${spacing.xl}`,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.glass.border}`,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.xl,
          }}
        >
          {/* Floating orb cluster */}
          <div style={{ position: 'relative', width: 100, height: 80 }}>
            {['#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'].map((color, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2.5 + i * 0.4,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                style={{
                  position: 'absolute',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: `${color}40`,
                  border: `1.5px solid ${color}80`,
                  left: 10 + i * 17,
                  top: 20,
                  boxShadow: `0 0 10px ${color}40`,
                }}
              />
            ))}
          </div>

          <div>
            <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 400 }}>
              Your voice library is empty
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, maxWidth: CONTENT_READABLE, lineHeight: 1.6 }}>
              Add the voices of people who matter to you — a parent, a teacher, a friend, a mentor, a partner. Hear their guidance whenever you need it.
            </Typography>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}
          >
            <Plus size={18} />
            Add your first voice
          </Button>

          <Typography variant="small" style={{ color: colors.text.secondary, opacity: 0.5, fontSize: 12 }}>
            Each voice slot costs {API_ROUTE_COSTS.voiceSlot} Q credits
          </Typography>
        </motion.div>
      )}

      {/* Voice grid */}
      {voices.length > 0 && (
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: spacing.lg,
          }}
        >
          <AnimatePresence>
            {voices.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                onDelete={handleVoiceDeleted}
                onSamplesAdded={handleSamplesAdded}
              />
            ))}
          </AnimatePresence>

          {/* Add card */}
          <motion.button
            layout
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            style={{
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: 'transparent',
              border: `2px dashed ${colors.glass.border}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.md,
              minHeight: 160,
              transition: 'border-color 0.2s',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: `${colors.accent.primary}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={20} color={colors.accent.primary} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <Typography variant="body" style={{ color: colors.text.secondary, margin: 0 }}>
                Add a voice
              </Typography>
              <Typography variant="small" style={{ color: colors.text.secondary, opacity: 0.5, fontSize: 12 }}>
                {API_ROUTE_COSTS.voiceSlot} Q credits
              </Typography>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Add modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddVoiceModal
            onClose={() => setShowAddModal(false)}
            onCreated={handleVoiceCreated}
            creditBalance={balance}
          />
        )}
      </AnimatePresence>
    </>
      )}
    </>
  );
}
