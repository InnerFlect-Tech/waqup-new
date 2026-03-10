'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { spacing, borderRadius, BLUR } from '@/theme';
import { useTheme } from '@/theme';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Modal width - defaults to min(420px, calc(100vw - 32px)) */
  width?: string;
  /** Max width for larger modals (e.g. 520) */
  maxWidth?: string | number;
  /** z-index for modal - defaults 1001 */
  zIndex?: number;
  /** Additional style for the modal pane */
  style?: React.CSSProperties;
}

/**
 * BaseModal - Shared modal/dialog shell with backdrop, animations, and consistent styling.
 * Use for ShareModal, AddVoiceModal, FoundingMemberModal, etc.
 */
export function BaseModal({
  isOpen,
  onClose,
  children,
  width = 'min(420px, calc(100vw - 32px))',
  maxWidth,
  zIndex = 1001,
  style,
}: BaseModalProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: colors.overlay,
              backdropFilter: BLUR.sm,
              WebkitBackdropFilter: BLUR.sm,
              zIndex: zIndex - 1,
            }}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex,
              width: maxWidth ? '100%' : width,
              maxWidth: maxWidth ?? width,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.background.secondary ?? colors.background.primary,
              border: `1px solid ${colors.glass.border}`,
              boxShadow: `0 24px 80px ${colors.overlay}, 0 0 0 1px ${colors.glass.border}20`,
              ...style,
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
