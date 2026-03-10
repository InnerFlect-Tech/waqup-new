'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Button, Badge, Loading } from '@/components';
import { PageShell, PageContent } from '@/components';
import { Link } from '@/i18n/navigation';
import { Play, Pause, Share2, BookOpen, Clock, Users, ArrowLeft } from 'lucide-react';
import { spacing, borderRadius, BLUR } from '@/theme';
import { useTheme } from '@/theme';
import { getContentTypeIcon } from '@/lib';
import { ElevatedBadge, ShareModal } from '@/components/marketplace';
import { SpeakingAnimation } from '@/components/audio';
import { useWebAudioPlayer } from '@/hooks';
import type { AudioLayers } from '@waqup/shared/types';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@waqup/shared/utils';
import { useAuthStore } from '@/stores';

interface DetailItem {
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
  creatorId: string;
  creatorName?: string;
  script?: string;
}

const TYPE_LABEL: Record<string, string> = {
  affirmation: 'Affirmation',
  meditation: 'Guided Meditation',
  ritual: 'Ritual',
};

async function fetchDetail(contentItemId: string): Promise<DetailItem | null> {
  const { data: mi } = await supabase
    .from('marketplace_items')
    .select(`
      id,
      is_elevated,
      play_count,
      share_count,
      creator_id,
      content_items (
        id, type, title, description, duration,
        voice_url, ambient_url, binaural_url, audio_url, script
      )
    `)
    .eq('content_item_id', contentItemId)
    .eq('is_listed', true)
    .single();

  if (!mi) return null;

  const ci = (mi as Record<string, unknown>).content_items as Record<string, unknown> | null;
  if (!ci) return null;

  const creatorId = mi.creator_id as string;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username')
    .eq('id', creatorId)
    .single();

  const creatorName = (profile as { full_name?: string; username?: string } | null)?.full_name
    ?? (profile as { full_name?: string; username?: string } | null)?.username
    ?? 'Creator';

  return {
    id: ci.id as string,
    type: ci.type as DetailItem['type'],
    title: ci.title as string,
    description: (ci.description as string) ?? '',
    duration: (ci.duration as string) ?? '',
    voiceUrl: (ci.voice_url as string | null) ?? null,
    ambientUrl: (ci.ambient_url as string | null) ?? null,
    binauralUrl: (ci.binaural_url as string | null) ?? null,
    audioUrl: (ci.audio_url as string | null) ?? null,
    script: (ci.script as string | undefined),
    isElevated: (mi as Record<string, unknown>).is_elevated as boolean ?? false,
    playCount: (mi as Record<string, unknown>).play_count as number ?? 0,
    shareCount: (mi as Record<string, unknown>).share_count as number ?? 0,
    creatorId,
    creatorName,
  };
}

async function recordPlay(contentItemId: string) {
  try {
    await supabase.rpc('increment_play_count', { p_content_item_id: contentItemId });
  } catch {
    // Non-critical — don't surface to user
  }
}

async function addToSanctuary(contentItemId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase.from('sanctuary_saves').upsert(
    { user_id: user.id, content_item_id: contentItemId },
    { onConflict: 'user_id,content_item_id' },
  );
  return !error;
}

export default function MarketplaceDetailPage({ params }: { params: { id: string } }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuthStore();
  const [item, setItem] = useState<DetailItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [freqData, setFreqData] = useState<number[]>([]);

  useEffect(() => {
    fetchDetail(params.id).then((d) => {
      setItem(d);
      setIsLoading(false);
    });
  }, [params.id]);

  useEffect(() => {
    if (item) Analytics.marketplaceItemViewed(item.id, user?.id);
  }, [item, user?.id]);

  const layers: AudioLayers = item
    ? {
        voiceUrl: item.voiceUrl ?? item.audioUrl,
        ambientUrl: item.ambientUrl ?? null,
        binauralUrl: item.binauralUrl ?? null,
      }
    : { voiceUrl: null };

  const { state, position, play, pause, isReady, analyserNode } = useWebAudioPlayer(layers);
  const isPlaying = state === 'playing';
  const progress = position.durationMs > 0 ? position.positionMs / position.durationMs : 0;

  useEffect(() => {
    if (isPlaying && item) void recordPlay(item.id);
  }, [isPlaying, item]);

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

  if (isLoading) {
    return (
      <PageShell intensity="medium">
        <PageContent width="narrow">
          <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loading variant="spinner" size="lg" />
          </div>
        </PageContent>
      </PageShell>
    );
  }

  if (!item) {
    return (
      <PageShell intensity="medium">
        <PageContent width="narrow">
          <Link href="/marketplace" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg }}>
            <ArrowLeft size={16} color={colors.text.secondary} />
            <Typography variant="small" style={{ color: colors.text.secondary }}>Marketplace</Typography>
          </Link>
          <Typography variant="h2" style={{ color: colors.text.primary }}>Content not found</Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm }}>
            This item may have been removed or is no longer listed.
          </Typography>
        </PageContent>
      </PageShell>
    );
  }

  const accent = CONTENT_TYPE_COLORS[item.type] ?? colors.accent.primary;
  const typeLabel = TYPE_LABEL[item.type] ?? item.type;

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <Link href="/marketplace" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xl }}>
          <ArrowLeft size={16} color={colors.text.secondary} />
          <Typography variant="small" style={{ color: colors.text.secondary }}>Marketplace</Typography>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
            {React.createElement(getContentTypeIcon(item.type), { size: 20, color: accent, strokeWidth: 2.5 })}
            <Badge size="sm" variant="default" style={{ color: accent, background: `${accent}20`, border: 'none' }}>
              {typeLabel}
            </Badge>
            {item.isElevated && <ElevatedBadge size="sm" />}
          </div>

          <Typography variant="h1" style={{ color: colors.text.primary, fontWeight: 300, marginBottom: spacing.sm }}>
            {item.title}
          </Typography>

          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.xl, flexWrap: 'wrap' }}>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              by {item.creatorName}
            </Typography>
            {item.duration && (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <Clock size={14} color={colors.text.secondary} />
                <Typography variant="small" style={{ color: colors.text.secondary }}>{item.duration}</Typography>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <Users size={14} color={colors.text.secondary} />
              <Typography variant="small" style={{ color: colors.text.secondary }}>
                {item.playCount.toLocaleString()} plays
              </Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <Share2 size={14} color={colors.text.secondary} />
              <Typography variant="small" style={{ color: colors.text.secondary }}>
                {item.shareCount.toLocaleString()} shares
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* Player card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            marginBottom: spacing.xl,
            borderRadius: borderRadius.xl,
            background: `linear-gradient(145deg, ${accent}15, ${colors.glass.light})`,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${accent}30`,
            overflow: 'hidden',
          }}
        >
          {/* Waveform */}
          <SpeakingAnimation isSpeaking={isPlaying} frequencyData={freqData} style={{ minHeight: 160 }} />

          {/* Progress */}
          <div style={{ padding: `0 ${spacing.xl}` }}>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: colors.glass.border,
                cursor: 'pointer',
                marginBottom: spacing.lg,
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const frac = (e.clientX - rect.left) / rect.width;
                // seek not exposed here — minimal player
                void frac;
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
          </div>

          {/* Controls */}
          <div style={{ padding: `0 ${spacing.xl} ${spacing.xl}`, display: 'flex', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={isPlaying ? pause : play}
              disabled={!isReady && !!layers.voiceUrl}
              style={{ backgroundColor: accent, borderColor: accent, minWidth: 120, flex: 1 }}
            >
              {isPlaying ? <><Pause size={18} strokeWidth={2.5} /> Pause</> : <><Play size={18} strokeWidth={2.5} /> Play preview</>}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setShareOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}
            >
              <Share2 size={16} /> Share
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={async () => {
                const ok = await addToSanctuary(item.id);
                if (ok) setSaved(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: saved ? '#22c55e' : undefined }}
            >
              <BookOpen size={16} />
              {saved ? 'Saved!' : 'Add to Sanctuary'}
            </Button>
          </div>
        </motion.div>

        {/* Description */}
        {item.description && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.md }}>About</Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.7, marginBottom: spacing.xl }}>
              {item.description}
            </Typography>
          </motion.div>
        )}

        {/* Script preview */}
        {item.script && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.lg,
                background: colors.glass.light,
                border: `1px solid ${colors.glass.border}`,
                marginBottom: spacing.xl,
              }}
            >
              <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.md }}>Script excerpt</Typography>
              <Typography
                variant="body"
                style={{
                  color: colors.text.secondary,
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                &ldquo;{item.script.slice(0, 300)}{item.script.length > 300 ? '…' : ''}&rdquo;
              </Typography>
            </div>
          </motion.div>
        )}

        {/* Share notice */}
        <div
          style={{
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            background: `${accent}08`,
            border: `1px solid ${accent}20`,
            textAlign: 'center',
          }}
        >
          <Typography variant="small" style={{ color: colors.text.secondary }}>
            Share this content and the creator earns a credit.{' '}
            <button
              onClick={() => setShareOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: accent, fontWeight: 600, fontSize: 'inherit', padding: 0 }}
            >
              Share now →
            </button>
          </Typography>
        </div>
      </PageContent>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        contentId={item.id}
        title={item.title}
        creatorName={item.creatorName}
        contentType={item.type}
        onShare={() => setItem((prev) => prev ? { ...prev, shareCount: prev.shareCount + 1 } : prev)}
      />
    </PageShell>
  );
}
