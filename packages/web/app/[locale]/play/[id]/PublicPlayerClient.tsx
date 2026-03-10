'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Share2, LogIn, Check, ArrowRight, Users } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { useWebAudioPlayer } from '@/hooks';
import { SpeakingAnimation } from '@/components/audio';
import { ShareModal } from '@/components/marketplace';
import type { AudioLayers } from '@waqup/shared/types';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import { BLUR, useTheme, CONTENT_READABLE } from '@/theme';

interface PublicItem {
  id: string;
  type: 'affirmation' | 'meditation' | 'ritual';
  title: string;
  description: string;
  duration: string;
  voiceUrl: string | null;
  ambientUrl: string | null;
  binauralUrl: string | null;
  audioUrl: string | null;
  isElevated: boolean;
  playCount: number;
  shareCount: number;
  creatorName: string;
}

interface Props {
  item: PublicItem | null;
  contentId: string;
}

const TYPE_GRADIENT: Record<string, string> = {
  affirmation: `radial-gradient(ellipse at 30% 20%, #4a1a6e88, transparent 60%), radial-gradient(ellipse at 70% 80%, ${CONTENT_TYPE_COLORS.affirmation}22, transparent 60%)`,
  meditation: `radial-gradient(ellipse at 30% 20%, #1a2a4e88, transparent 60%), radial-gradient(ellipse at 70% 80%, ${CONTENT_TYPE_COLORS.meditation}22, transparent 60%)`,
  ritual: `radial-gradient(ellipse at 30% 20%, #0a2e1a88, transparent 60%), radial-gradient(ellipse at 70% 80%, ${CONTENT_TYPE_COLORS.ritual}22, transparent 60%)`,
};

const TYPE_ACCENT: Record<string, string> = CONTENT_TYPE_COLORS;

const TYPE_LABEL: Record<string, string> = {
  affirmation: 'Affirmation',
  meditation: 'Guided Meditation',
  ritual: 'Ritual',
};

const TYPE_CTA_VERB: Record<string, string> = {
  affirmation: 'affirmations',
  meditation: 'meditations',
  ritual: 'rituals',
};

function formatPlayCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function PublicPlayerClient({ item, contentId }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [shareOpen, setShareOpen] = useState(false);
  const [freqData, setFreqData] = useState<number[]>([]);
  const [relatedItems, setRelatedItems] = useState<PublicItem[]>([]);

  const layers: AudioLayers = item
    ? { voiceUrl: item.voiceUrl ?? item.audioUrl, ambientUrl: item.ambientUrl, binauralUrl: item.binauralUrl }
    : { voiceUrl: null };

  const { state, position, play, pause, isReady, analyserNode } = useWebAudioPlayer(layers);
  const isPlaying = state === 'playing';
  const progress = position.durationMs > 0 ? position.positionMs / position.durationMs : 0;

  useEffect(() => {
    if (!analyserNode || !isPlaying) { setFreqData([]); return; }
    const buf = new Uint8Array(analyserNode.frequencyBinCount);
    let raf = 0;
    const tick = () => {
      analyserNode.getByteFrequencyData(buf);
      setFreqData(Array.from(buf.slice(0, 32)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [analyserNode, isPlaying]);

  // Fetch related items
  useEffect(() => {
    if (!item) return;
    fetch(`/api/marketplace/items?type=${item.type}&sort=trending&limit=3`)
      .then((r) => r.json())
      .then((data) => {
        const all = data.items ?? data ?? [];
        setRelatedItems(
          all
            .filter((i: { content_item_id?: string }) => i.content_item_id !== contentId)
            .slice(0, 2)
            .map((i: Record<string, unknown>) => ({
              id: String(i.id),
              contentItemId: String(i.content_item_id ?? i.id),
              title: String(i.title ?? (i.content_items as Record<string, unknown>)?.title ?? 'Untitled'),
              type: item.type,
              creatorName: String(i.creator_name ?? 'Creator'),
              playCount: Number(i.play_count ?? 0),
            })),
        );
      })
      .catch(() => {});
  }, [item, contentId]);

  const type = item?.type ?? 'affirmation';
  const accent = TYPE_ACCENT[type] ?? '#c084fc';
  const gradient = TYPE_GRADIENT[type] ?? TYPE_GRADIENT.affirmation;
  const typeLabel = TYPE_LABEL[type] ?? type;
  const ctaVerb = TYPE_CTA_VERB[type] ?? 'practices';

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, background: gradient, pointerEvents: 'none' }} />

      {/* waQup header */}
      <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'white' }} />
          </div>
          <span style={{ color: 'white', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>waQup</span>
        </Link>
        <Link
          href="/signup"
          style={{
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: 100,
            border: `1px solid ${accent}55`,
            background: `${accent}15`,
            color: accent,
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <LogIn size={14} />
          Join waQup
        </Link>
      </div>

      {/* Main player card */}
      {item ? (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              width: 'min(480px, 100%)',
              borderRadius: 24,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${accent}30`,
              boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px ${accent}15`,
              overflow: 'hidden',
            }}
          >
            {/* Waveform */}
            <SpeakingAnimation isSpeaking={isPlaying} frequencyData={freqData} style={{ minHeight: 200 }} />

            {/* Content info */}
            <div style={{ padding: '24px 28px' }}>
              {/* Type badge + social proof */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 100,
                    background: `${accent}22`,
                    border: `1px solid ${accent}44`,
                    color: accent,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {typeLabel}
                </span>
                {item.playCount > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.6 }}>
                    <Users size={11} color="rgba(255,255,255,0.5)" />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                      {formatPlayCount(item.playCount)} practiced this
                    </span>
                  </div>
                )}
              </div>

              <h1 style={{ color: 'white', fontSize: 26, fontWeight: 300, lineHeight: 1.2, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                {item.title}
              </h1>
              <p style={{ color: colors.text.secondary, fontSize: 14, margin: '0 0 20px' }}>
                by {item.creatorName}
                {item.duration ? ` · ${item.duration}` : ''}
              </p>

              {item.description && (
                <p style={{ color: colors.text.secondary, fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
                  {item.description}
                </p>
              )}

              {/* Progress bar */}
              <div
                style={{
                  height: 4,
                  borderRadius: 2,
                  background: `${colors.text.primary}1a`,
                  marginBottom: 20,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: 2,
                    background: accent,
                    width: `${Math.min(progress * 100, 100)}%`,
                    transition: 'width 0.1s linear',
                  }}
                />
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                  onClick={isPlaying ? pause : play}
                  disabled={!isReady && !!layers.voiceUrl}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: 100,
                    background: accent,
                    border: 'none',
                    cursor: isReady || !layers.voiceUrl ? 'pointer' : 'not-allowed',
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    opacity: isReady || !layers.voiceUrl ? 1 : 0.6,
                  }}
                >
                  {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play</>}
                </button>

                <button
                  onClick={() => setShareOpen(true)}
                  style={{
                    padding: '14px 20px',
                    borderRadius: 100,
                    background: colors.glass.dark,
                    border: `1px solid ${colors.glass.border}`,
                    cursor: 'pointer',
                    color: colors.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </motion.div>

          {/* Primary acquisition CTA — create your own */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ marginTop: 28, width: 'min(480px, 100%)', textAlign: 'center' }}
          >
            {/* Share-to-earn callout */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 100,
                background: `${accent}12`,
                border: `1px solid ${accent}25`,
                marginBottom: 16,
              }}
            >
              <Check size={11} color={accent} />
              <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>
                Creator earns 1 Q every time this is shared
              </span>
            </div>

            {/* Primary CTA — signup to create */}
            <Link
              href={`/signup?type=${type}&ref=play`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '15px 24px',
                borderRadius: 100,
                background: accent,
                border: 'none',
                color: 'white',
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 10,
                boxShadow: `0 8px 30px ${accent}40`,
              }}
            >
              Create your own — it&apos;s free
              <ArrowRight size={16} />
            </Link>

            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginBottom: 0, lineHeight: 1.5 }}>
              Your voice. Your words. Free to practice forever.
            </p>
          </motion.div>

          {/* Related content */}
          {relatedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ marginTop: 32, width: 'min(480px, 100%)' }}
            >
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>
                More {typeLabel.toLowerCase()}s
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {relatedItems.map((related) => (
                  <Link
                    key={related.id}
                    href={`/play/${(related as unknown as { contentItemId?: string }).contentItemId ?? related.id}`}
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Play size={12} color={accent} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
                        {related.title}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>
                        {related.creatorName}
                        {(related as unknown as { playCount?: number }).playCount ? ` · ${formatPlayCount((related as unknown as { playCount: number }).playCount)} plays` : ''}
                      </p>
                    </div>
                    <ArrowRight size={14} color={`${accent}60`} style={{ flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', maxWidth: CONTENT_READABLE }}
        >
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 24 }}>
            This content is no longer available.
          </p>
          <Link
            href="/marketplace"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: 100,
              background: accent,
              color: 'white',
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Browse Marketplace
          </Link>
        </motion.div>
      )}

      {item && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          contentId={contentId}
          title={item.title}
          creatorName={item.creatorName}
          contentType={item.type}
        />
      )}
    </div>
  );
}
