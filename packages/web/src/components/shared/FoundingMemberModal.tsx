'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Shield, Zap, ArrowRight } from 'lucide-react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import Link from 'next/link';

interface FoundingMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FoundingMemberModal({ isOpen, onClose }: FoundingMemberModalProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: BLUR.sm,
              WebkitBackdropFilter: BLUR.sm,
              zIndex: 1000,
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1001,
              width: 'min(420px, calc(100vw - 32px))',
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
              boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${colors.accent.primary}20`,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: spacing.lg,
              }}
            >
              <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontWeight: 500 }}>
                Founding Members
              </Typography>
              <button
                onClick={onClose}
                type="button"
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: spacing.xs,
                  color: colors.text.secondary,
                  flexShrink: 0,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Value prop */}
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                marginBottom: spacing.lg,
                lineHeight: 1.6,
                fontSize: 15,
              }}
            >
              Lock in lifetime pricing, get 500 Qs on activation, and join the first 500 members building waQup
              alongside us.
            </Typography>

            {/* Perks preview */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.sm,
                marginBottom: spacing.xl,
              }}
            >
              {[
                { icon: Star, text: 'Permanent Founding Member badge', color: colors.accent.tertiary },
                { icon: Shield, text: 'Price locked forever', color: colors.accent.primary },
                { icon: Zap, text: '3 months free · 500 Qs on activation', color: colors.accent.secondary },
              ].map(({ icon: Icon, text, color }) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: borderRadius.md,
                    background: `${color}12`,
                    border: `1px solid ${color}25`,
                  }}
                >
                  <Icon size={16} color={color} />
                  <Typography variant="small" style={{ color: colors.text.primary, fontWeight: 500, fontSize: 13 }}>
                    {text}
                  </Typography>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link href="/join" style={{ textDecoration: 'none' }} onClick={onClose}>
              <Button variant="primary" size="lg" fullWidth style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
                View full details
                <ArrowRight size={18} color={colors.text.onDark} />
              </Button>
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
