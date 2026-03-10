'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Plus, Trash2, Loader2, Upload } from 'lucide-react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import type { UserVoice } from '@waqup/shared/types';
import { RELATIONSHIP_META } from '@waqup/shared/types';

interface VoiceCardProps {
  voice: UserVoice;
  onDelete: (id: string) => void;
  onSamplesAdded: (id: string) => void;
}

export function VoiceCard({ voice, onDelete, onSamplesAdded }: VoiceCardProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const meta = RELATIONSHIP_META[voice.relationship];
  const ringColor = voice.avatar_color ?? meta.color;

  const [previewing, setPreviewing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const samplesInputRef = useRef<HTMLInputElement>(null);

  const handlePreview = async () => {
    if (previewUrl) {
      if (playing) {
        audioRef.current?.pause();
        setPlaying(false);
      } else {
        await audioRef.current?.play();
        setPlaying(true);
      }
      return;
    }

    try {
      setPreviewing(true);
      setError(null);
      const res = await fetch(`/api/voices/${voice.id}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message ?? 'Preview failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      const audio = new Audio(url);
      audio.onended = () => setPlaying(false);
      audioRef.current = audio;
      await audio.play();
      setPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview failed');
    } finally {
      setPreviewing(false);
    }
  };

  const handleAddSamples = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('files', f));
      const res = await fetch(`/api/voices/${voice.id}/samples`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? 'Upload failed');
      onSamplesAdded(voice.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/voices/${voice.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message ?? 'Delete failed');
      }
      onDelete(voice.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      style={{
        position: 'relative',
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
        background: colors.glass.light,
        backdropFilter: BLUR.xl,
        WebkitBackdropFilter: BLUR.xl,
        border: `1px solid ${colors.glass.border}`,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s',
      }}
      onHoverStart={() => {
        /* glow handled by box-shadow in style */
      }}
    >
      {/* Colored accent top strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${ringColor}99, ${ringColor}22)`,
          borderRadius: `${borderRadius.xl} ${borderRadius.xl} 0 0`,
        }}
      />

      {/* Avatar + name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
        {/* Avatar orb */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: `${ringColor}18`,
            border: `2px solid ${ringColor}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 0 16px ${ringColor}30`,
            fontSize: 22,
          }}
        >
          {meta.emoji}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h3"
            style={{
              color: colors.text.primary,
              margin: 0,
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {voice.name}
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginTop: 2 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: `2px ${spacing.sm}`,
                borderRadius: borderRadius.full,
                background: `${ringColor}20`,
                color: ringColor,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {voice.description && (
        <Typography
          variant="small"
          style={{
            color: colors.text.secondary,
            marginBottom: spacing.lg,
            lineHeight: 1.5,
            fontSize: 13,
          }}
        >
          {voice.description}
        </Typography>
      )}

      {/* Error */}
      {error && (
        <Typography
          variant="small"
          style={{ color: colors.error, marginBottom: spacing.sm, display: 'block', fontSize: 12 }}
        >
          {error}
        </Typography>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Preview */}
        <button
          onClick={handlePreview}
          disabled={previewing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: borderRadius.md,
            border: `1px solid ${ringColor}40`,
            background: `${ringColor}10`,
            color: ringColor,
            cursor: previewing ? 'wait' : 'pointer',
            fontSize: 13,
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
        >
          {previewing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : playing ? (
            <Pause size={14} />
          ) : (
            <Play size={14} />
          )}
          {previewing ? 'Generating…' : playing ? 'Pause' : 'Preview'}
        </button>

        {/* Add samples */}
        <input
          ref={samplesInputRef}
          type="file"
          accept="audio/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleAddSamples}
        />
        <button
          onClick={() => samplesInputRef.current?.click()}
          disabled={uploading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: borderRadius.md,
            border: `1px solid ${colors.glass.border}`,
            background: 'transparent',
            color: colors.text.secondary,
            cursor: uploading ? 'wait' : 'pointer',
            fontSize: 13,
            transition: 'all 0.2s',
          }}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Uploading…' : 'Add samples'}
        </button>

        {/* Delete */}
        <button
          onClick={() => setShowConfirmDelete(true)}
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: `${spacing.sm} ${spacing.sm}`,
            borderRadius: borderRadius.md,
            border: 'none',
            background: 'transparent',
            color: colors.text.secondary,
            cursor: 'pointer',
            fontSize: 13,
            opacity: 0.5,
            transition: 'opacity 0.2s',
          }}
          title="Remove voice"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: borderRadius.xl,
              background: `rgba(0,0,0,0.85)`,
              backdropFilter: BLUR.sm,
              WebkitBackdropFilter: BLUR.sm,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.lg,
              padding: spacing.xl,
            }}
          >
            <Typography
              variant="body"
              style={{ color: colors.text.primary, textAlign: 'center', fontWeight: 500 }}
            >
              Remove {voice.name} from your library?
            </Typography>
            <Typography
              variant="small"
              style={{ color: colors.text.secondary, textAlign: 'center', fontSize: 12 }}
            >
              This cannot be undone. The voice slot credit is not refunded.
            </Typography>
            <div style={{ display: 'flex', gap: spacing.md }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmDelete(false)}
                style={{ color: colors.text.secondary }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={deleting}
                onClick={handleDelete}
                style={{ background: colors.error, borderColor: colors.error }}
              >
                Remove
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
