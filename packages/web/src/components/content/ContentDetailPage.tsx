'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Typography, Button } from '@/components';
import { AudioWaveform } from '@/components/audio';
import { spacing, borderRadius, BLUR } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { Link } from '@/i18n/navigation';
import { Play, Pause, Edit, Trash2, Share2, ChevronDown, ChevronUp, Mic } from 'lucide-react';
import { formatDate, Analytics, parseRitualSections, getRitualSectionsForDisplay } from '@waqup/shared/utils';
import { useAuthStore } from '@/stores';
import { useSignedRecordingsUrl } from '@/hooks';
import type { ContentItemType } from './ContentItem';

export interface ContentDetailPageProps {
  id: string;
  contentType: ContentItemType;
  title: string;
  description: string;
  duration?: string;
  script?: string;
  lastPlayed?: string;
  audioUrl?: string;
  backHref: string;
  editHref: string;
  editAudioHref: string;
  onRecordPlay?: (durationSeconds?: number) => Promise<void>;
  onDelete?: (id: string) => void;
}

export function ContentDetailPage({
  id,
  contentType,
  title,
  description,
  duration = '—',
  script,
  lastPlayed,
  audioUrl,
  backHref,
  editHref,
  editAudioHref,
  onRecordPlay,
  onDelete,
}: ContentDetailPageProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuthStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [scriptExpanded, setScriptExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { url: resolvedAudioUrl } = useSignedRecordingsUrl(audioUrl ?? null);
  const hasAudio = Boolean(audioUrl);
  const canPlay = hasAudio && Boolean(resolvedAudioUrl);

  const handlePlayPause = async () => {
    if (canPlay && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        try {
          await audioRef.current.play();
        } catch {
          setIsPlaying(false);
        }
      }
    }
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !canPlay) return;
    const onPlay = () => {
      setIsPlaying(true);
      Analytics.contentPlayed(id, contentType, user?.id);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      const durationSeconds = el.duration ? Math.round(el.duration) : 0;
      Analytics.contentCompleted(id, contentType, durationSeconds, user?.id);
      void onRecordPlay?.(durationSeconds);
    };
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
    };
  }, [canPlay, id, contentType, user?.id, onRecordPlay]);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete?.(id);
      setShowDeleteConfirm(false);
      window.location.href = backHref;
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard?.writeText(url).then(() => {
      Analytics.contentShared(id, 'link', user?.id);
    });
  };

  return (
    <PageShell intensity="medium" allowDocumentScroll>
      <PageContent width="narrow">
        <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
          {title}
        </Typography>
        <Typography variant="body" style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
          {description}
        </Typography>

        {/* Hidden audio element for playback */}
        {canPlay && (
          <audio
            ref={audioRef}
            src={resolvedAudioUrl!}
            style={{ display: 'none' }}
            preload="metadata"
          />
        )}

        {/* Audio visualization */}
        <div style={{ marginBottom: spacing.xl, borderRadius: borderRadius.lg, overflow: 'hidden' }}>
          <AudioWaveform isPlaying={isPlaying} frequencyData={[]} style={{ minHeight: '320px' }} />
        </div>

        {/* Playback controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
          {hasAudio ? (
            <Button
              variant="primary"
              size="md"
              style={{ background: theme.colors.gradients.primary }}
              onClick={handlePlayPause}
              disabled={!canPlay}
            >
              {isPlaying ? (
                <>
                  <Pause size={18} strokeWidth={2.5} style={{ marginRight: spacing.xs }} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={18} strokeWidth={2.5} style={{ marginLeft: spacing.xs, marginRight: spacing.xs }} />
                  Play
                </>
              )}
            </Button>
          ) : (
            <Link href={editAudioHref} style={{ textDecoration: 'none' }}>
              <Button
                variant="primary"
                size="md"
                style={{ background: theme.colors.gradients.primary, display: 'flex', alignItems: 'center', gap: spacing.xs }}
              >
                <Mic size={18} strokeWidth={2.5} />
                Generate audio
              </Button>
            </Link>
          )}
          {duration && (
            <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
              {duration}
            </Typography>
          )}
          {lastPlayed && (
            <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
              Last played: {formatDate(lastPlayed)}
            </Typography>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.xl }}>
          <Link href={editHref} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="md">
              <Edit size={16} strokeWidth={2.5}  />
              Edit
            </Button>
          </Link>
          <Link href={editAudioHref} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="md">
              Edit sound / script
            </Button>
          </Link>
          <Button variant="ghost" size="md" onClick={handleShare} style={{ color: colors.text.secondary }}>
            <Share2 size={16} strokeWidth={2.5}  />
            Share
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={handleDelete}
            style={{ color: colors.error ?? colors.text.secondary }}
          >
            <Trash2 size={16} strokeWidth={2.5}  />
            {showDeleteConfirm ? 'Confirm delete?' : 'Delete'}
          </Button>
        </div>

        {/* Script preview (collapsible) */}
        {script && (
          <div
            style={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: colors.glass.light,
              backdropFilter: BLUR.md,
              WebkitBackdropFilter: BLUR.md,
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <button
              onClick={() => setScriptExpanded(!scriptExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: colors.text.secondary,
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {scriptExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              Script
            </button>
            {scriptExpanded &&
              (contentType === 'ritual' ? (() => {
                const parsed = parseRitualSections(script);
                const sectionsForDisplay = getRitualSectionsForDisplay(parsed);
                if (sectionsForDisplay.length > 0) {
                  return (
                    <div style={{ marginTop: spacing.sm, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                      {sectionsForDisplay.map((section, i) => (
                        <div
                          key={i}
                          style={{
                            padding: spacing.md,
                            borderRadius: borderRadius.md,
                            background: colors.glass.medium,
                            border: `1px solid ${colors.glass.border}`,
                          }}
                        >
                          <Typography
                            variant="small"
                            style={{
                              color: colors.text.secondary,
                              fontSize: 11,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              marginBottom: spacing.xs,
                              display: 'block',
                            }}
                          >
                            {section.label}
                          </Typography>
                          <Typography
                            variant="body"
                            style={{ color: colors.text.secondary, whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 14 }}
                          >
                            {section.content}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  );
                }
                return (
                  <Typography
                    variant="body"
                    style={{ marginTop: spacing.sm, color: colors.text.secondary, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                  >
                    {script}
                  </Typography>
                );
              })() : (
                <Typography
                  variant="body"
                  style={{
                    marginTop: spacing.sm,
                    color: colors.text.secondary,
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                  }}
                >
                  {script}
                </Typography>
              ))}
          </div>
        )}
      </PageContent>
    </PageShell>
  );
}
