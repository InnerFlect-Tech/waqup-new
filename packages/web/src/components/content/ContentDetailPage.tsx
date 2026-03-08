'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Typography, Button } from '@/components';
import { SpeakingAnimation } from '@/components/audio';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Play, Pause, Edit, Trash2, Share2, ChevronDown, ChevronUp, Mic } from 'lucide-react';
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
  onRecordPlay?: () => Promise<void>;
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [scriptExpanded, setScriptExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasAudio = Boolean(audioUrl);

  const handlePlayPause = async () => {
    if (hasAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        try {
          await audioRef.current.play();
          await onRecordPlay?.();
        } catch {
          setIsPlaying(false);
        }
      }
    }
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !hasAudio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
    };
  }, [hasAudio]);

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
      // Could add a toast here
    });
  };

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <Link href={backHref} style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.lg }}>
          <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
            ← Back to {contentType}s
          </Typography>
        </Link>

        <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
          {title}
        </Typography>
        <Typography variant="body" style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
          {description}
        </Typography>

        {/* Hidden audio element for playback */}
        {hasAudio && (
          <audio
            ref={audioRef}
            src={audioUrl}
            style={{ display: 'none' }}
            preload="metadata"
          />
        )}

        {/* Audio visualization */}
        <div style={{ marginBottom: spacing.xl, borderRadius: borderRadius.lg, overflow: 'hidden' }}>
          <SpeakingAnimation isSpeaking={isPlaying} style={{ minHeight: '320px' }} />
        </div>

        {/* Playback controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
          {hasAudio ? (
            <Button
              variant="primary"
              size="md"
              style={{ background: theme.colors.gradients.primary }}
              onClick={handlePlayPause}
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
              Last played: {new Date(lastPlayed).toLocaleDateString()}
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
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
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
            {scriptExpanded && (
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
            )}
          </div>
        )}
      </PageContent>
    </PageShell>
  );
}
