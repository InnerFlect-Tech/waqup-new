'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { Typography, Button } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';

export type SharePlatform = 'instagram' | 'whatsapp' | 'x' | 'copy';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  title: string;
  creatorName?: string;
  contentType: 'affirmation' | 'meditation' | 'ritual';
  onShare?: (platform: SharePlatform) => void;
}

const TYPE_COLOR: Record<string, string> = {
  affirmation: '#c084fc',
  meditation: '#60a5fa',
  ritual: '#34d399',
};

const PLATFORMS: Array<{
  id: SharePlatform;
  label: string;
  color: string;
  icon: string;
  getUrl?: (shareUrl: string, text: string) => string;
}> = [
  {
    id: 'instagram',
    label: 'Instagram',
    color: '#e1306c',
    icon: '📸',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25d366',
    icon: '💬',
    getUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  },
  {
    id: 'x',
    label: 'X',
    color: '#000000',
    icon: '✕',
    getUrl: (url, text) => `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: 'copy',
    label: 'Copy link',
    color: '#6b7280',
    icon: '🔗',
  },
];

function getPublicUrl(contentId: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://waqup.app';
  return `${base}/play/${contentId}`;
}

async function recordShare(contentId: string, platform: SharePlatform) {
  try {
    await fetch('/api/marketplace/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentItemId: contentId, platform }),
    });
  } catch {
    // Non-critical — don't surface errors to user
  }
}

export function ShareModal({
  isOpen,
  onClose,
  contentId,
  title,
  creatorName,
  contentType,
  onShare,
}: ShareModalProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const accent = TYPE_COLOR[contentType] ?? colors.accent.primary;
  const [copied, setCopied] = useState(false);

  const shareUrl = getPublicUrl(contentId);
  const shareText = creatorName
    ? `"${title}" by ${creatorName} on waQup`
    : `"${title}" on waQup`;

  const handlePlatform = useCallback(async (platform: SharePlatform) => {
    await recordShare(contentId, platform);
    onShare?.(platform);

    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    if (platform === 'instagram') {
      // Instagram doesn't support direct URL-share links from desktop — copy link instead
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    const p = PLATFORMS.find((pl) => pl.id === platform);
    if (p?.getUrl) {
      window.open(p.getUrl(shareUrl, shareText), '_blank', 'noopener,noreferrer');
    }
  }, [contentId, shareUrl, shareText, onShare]);

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
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
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
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1001,
              width: 'min(420px, calc(100vw - 32px))',
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.background?.primary ?? '#0a0a0a',
              border: `1px solid ${colors.glass.border}`,
              boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${accent}20`,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xl }}>
              <div>
                <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                  Share
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.4 }}>
                  Share &ldquo;{title}&rdquo; and help others discover it.
                  <br />
                  <span style={{ color: accent, fontSize: 11 }}>The creator earns a credit for each share.</span>
                </Typography>
              </div>
              <button
                onClick={onClose}
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

            {/* Share URL preview */}
            <div
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: borderRadius.md,
                background: colors.glass.light,
                border: `1px solid ${colors.glass.border}`,
                marginBottom: spacing.lg,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                overflow: 'hidden',
              }}
            >
              <ExternalLink size={14} color={colors.text.secondary} style={{ flexShrink: 0 }} />
              <Typography
                variant="small"
                style={{
                  color: colors.text.secondary,
                  fontSize: 12,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {shareUrl}
              </Typography>
            </div>

            {/* Platform buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
              {PLATFORMS.map((p) => {
                const isCopyDone = p.id === 'copy' && copied;
                const isInstaCopied = p.id === 'instagram' && copied;

                return (
                  <button
                    key={p.id}
                    onClick={() => void handlePlatform(p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      padding: `${spacing.md} ${spacing.lg}`,
                      borderRadius: borderRadius.lg,
                      border: `1px solid ${colors.glass.border}`,
                      background: colors.glass.light,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      color: colors.text.primary,
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {isCopyDone || isInstaCopied ? (
                      <Check size={16} color="#22c55e" />
                    ) : (
                      <span style={{ fontSize: 16 }}>{p.icon}</span>
                    )}
                    <span style={{ color: isCopyDone || isInstaCopied ? '#22c55e' : colors.text.primary }}>
                      {isCopyDone ? 'Copied!' : isInstaCopied ? 'Link copied!' : p.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Instagram note */}
            <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11, opacity: 0.7, textAlign: 'center' }}>
              For Instagram: the link is copied — paste it in your story or bio.
            </Typography>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
