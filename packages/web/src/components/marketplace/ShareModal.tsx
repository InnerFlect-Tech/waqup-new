'use client';

import React, { useCallback, useState } from 'react';
import { X, Copy, Check, ExternalLink, QrCode, Download } from 'lucide-react';
import { Typography } from '@/components';
import { BaseModal } from '@/components/shared/BaseModal';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';

export type SharePlatform = 'instagram' | 'whatsapp' | 'x' | 'copy';
type Tab = 'share' | 'qr';

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

function getQrUrl(url: string, size = 240): string {
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=${size}x${size}&bgcolor=0a0a0f&color=ffffff&margin=10&format=png&qzone=2`;
}

async function recordShare(contentId: string, platform: SharePlatform) {
  try {
    await fetch('/api/marketplace/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentItemId: contentId, platform }),
    });
  } catch {
    // Non-critical
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
  const [activeTab, setActiveTab] = useState<Tab>('share');
  const [qrDownloading, setQrDownloading] = useState(false);

  const shareUrl = getPublicUrl(contentId);
  const qrUrl = getQrUrl(shareUrl);
  const shareText = creatorName
    ? `"${title}" by ${creatorName} on waQup`
    : `"${title}" on waQup`;

  const handlePlatform = useCallback(async (platform: SharePlatform) => {
    await recordShare(contentId, platform);
    onShare?.(platform);

    if (platform === 'copy' || platform === 'instagram') {
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

  const handleDownloadQr = async () => {
    setQrDownloading(true);
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waQup-${title.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(qrUrl, '_blank');
    } finally {
      setQrDownloading(false);
    }
  };

  const tabStyle = (tab: Tab) => ({
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: borderRadius.md,
    background: activeTab === tab ? `${accent}20` : 'transparent',
    border: `1px solid ${activeTab === tab ? accent + '50' : 'transparent'}`,
    color: activeTab === tab ? accent : colors.text.secondary,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: activeTab === tab ? 700 : 400,
    transition: 'all 0.15s ease',
  });

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      zIndex={1001}
      style={{
        padding: 0,
        boxShadow: `0 32px 80px ${colors.overlay}, 0 0 0 1px ${accent}20`,
        maxWidth: 400,
      }}
    >
      <div style={{ padding: spacing.xl }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
          <div>
            <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
              Share
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.4, fontSize: 12 }}>
              &ldquo;{title}&rdquo;
              {creatorName ? ` by ${creatorName}` : ''}
              <br />
              <span style={{ color: accent, fontSize: 11 }}>Creator earns a Q for each share.</span>
            </Typography>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.xs, color: colors.text.secondary, flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: spacing.xs, marginBottom: spacing.lg, padding: `${spacing.xs}`, borderRadius: borderRadius.md, background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}>
          <button style={tabStyle('share')} onClick={() => setActiveTab('share')}>
            Share link
          </button>
          <button style={tabStyle('qr')} onClick={() => setActiveTab('qr')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <QrCode size={13} />
              QR code
            </span>
          </button>
        </div>

        {activeTab === 'share' && (
          <>
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
                style={{ color: colors.text.secondary, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}
              >
                {shareUrl}
              </Typography>
            </div>

            {/* Platform buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
              {PLATFORMS.map((p) => {
                const isCopyDone = (p.id === 'copy' || p.id === 'instagram') && copied;
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
                    {isCopyDone ? (
                      <Check size={16} color="#22c55e" />
                    ) : (
                      <span style={{ fontSize: 16 }}>{p.icon}</span>
                    )}
                    <span style={{ color: isCopyDone ? '#22c55e' : colors.text.primary }}>
                      {isCopyDone ? 'Copied!' : p.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11, opacity: 0.7, textAlign: 'center' }}>
              For Instagram: the link is copied — paste it in your story or bio.
            </Typography>
          </>
        )}

        {activeTab === 'qr' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.lg }}>
            <div
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.lg,
                background: '#0a0a0f',
                border: `1px solid ${accent}30`,
                boxShadow: `0 0 32px ${accent}20`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt={`QR code for ${title}`}
                width={200}
                height={200}
                style={{ display: 'block', borderRadius: borderRadius.md }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 1.6 }}>
                Scan to open the public player.
                <br />
                Post in your studio, on cards, or in print materials.
              </Typography>
            </div>

            <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={handleDownloadQr}
                disabled={qrDownloading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: borderRadius.lg,
                  background: `${accent}18`,
                  border: `1px solid ${accent}40`,
                  color: accent,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Download size={14} />
                {qrDownloading ? 'Downloading...' : 'Download PNG'}
              </button>

              <button
                onClick={() => {
                  void navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  border: `1px solid ${colors.glass.border}`,
                  color: copied ? '#22c55e' : colors.text.secondary,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
