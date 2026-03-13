'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button, AiCostNotice } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { Link } from '@/i18n/navigation';
import { Mic, Upload, Play, Check, Loader2, AlertCircle, Plus } from 'lucide-react';
import { getVoiceStatus, createVoice, uploadVoiceSamples, previewVoice } from '@/lib/api-client';
import type { VoiceStatus } from '@/lib/api-client';
import { VoiceGate } from '@/components/voice';

const PREVIEW_TEXT =
  'Hello, this is a preview of your cloned voice. Your personalized affirmations and meditations will sound like this.';

const RECORDING_TIPS = [
  'Record in a quiet room with no background noise',
  'Speak clearly and at a natural pace',
  'Keep 30+ seconds of total audio for best results',
  'Use a good microphone or phone voice memo app',
  'Read a passage aloud — a book, article, or poem works well',
];

export default function VoiceSetupPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const moreFilesRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<VoiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [removeNoise, setRemoveNoise] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVoiceStatus();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
      setStatus({ voice_id: null, name: null, language: null, status: 'not_setup' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...files.filter((f) => !names.has(f.name))];
    });
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const totalDurationLabel = selectedFiles.length
    ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
    : null;

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Voice name is required');
      return;
    }
    if (!selectedFiles.length) {
      setError('Upload at least one audio sample to create your voice');
      return;
    }
    try {
      setCreating(true);
      setError(null);
      const formData = new FormData();
      formData.append('name', name.trim());
      selectedFiles.forEach((f) => formData.append('files', f));
      formData.append('remove_background_noise', String(removeNoise));
      await createVoice(formData);
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create voice');
    } finally {
      setCreating(false);
    }
  };

  const handleUploadMore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('files', f));
      formData.append('remove_background_noise', String(removeNoise));
      await uploadVoiceSamples(formData);
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload samples');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handlePreview = async () => {
    try {
      setPreviewing(true);
      setError(null);
      setPreviewUrl(null);
      const blob = await previewVoice(PREVIEW_TEXT);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
    } finally {
      setPreviewing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <VoiceGate>
    <PageShell intensity="medium" allowDocumentScroll>
      <PageContent width="narrow">
        <AnimatePresence>
          {loading && (
            <motion.div
              key="voice-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
              }}
            >
              <Loader2 size={32} color={colors.accent.primary} className="animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
        {!loading && (<>
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300, textAlign: 'center' }}>
          My Voice
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textAlign: 'center' }}>
          Clone your voice for personalized affirmations and meditations. Upload a recording and your
          voice will be ready instantly.
        </Typography>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.sm,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: `${colors.error}18`,
              border: `1px solid ${colors.error}40`,
              marginBottom: spacing.xl,
            }}
          >
            <AlertCircle size={16} color={colors.error} style={{ marginTop: 2, flexShrink: 0 }} />
            <Typography variant="small" style={{ color: colors.error }}>
              {error}
            </Typography>
          </motion.div>
        )}

        {status?.status === 'not_setup' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.lg }}>
              Create your voice
            </Typography>

            {/* Voice name */}
            <div style={{ marginBottom: spacing.md }}>
              <label style={{ display: 'block', marginBottom: spacing.xs }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>
                  Voice name
                </Typography>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Voice"
                style={{
                  width: '100%',
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.transparent,
                  color: colors.text.primary,
                  fontSize: 15,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            {/* Audio samples upload */}
            <div style={{ marginBottom: spacing.md }}>
              <label style={{ display: 'block', marginBottom: spacing.xs }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>
                  Audio samples <span style={{ color: colors.error }}>*</span>
                </Typography>
              </label>
              <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary, marginBottom: spacing.sm, display: 'block', fontSize: 12 }}>
                Upload one or more audio recordings of your voice (MP3, WAV, M4A). 30+ seconds total recommended.
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  width: '100%',
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: borderRadius.md,
                  border: `2px dashed ${selectedFiles.length ? colors.accent.primary : colors.glass.border}`,
                  background: selectedFiles.length ? `${colors.accent.primary}08` : colors.glass.transparent,
                  color: selectedFiles.length ? colors.accent.primary : colors.text.secondary,
                  cursor: 'pointer',
                  fontSize: 14,
                  transition: 'all 0.2s',
                  justifyContent: 'center',
                }}
              >
                <Upload size={18} />
                {totalDurationLabel ?? 'Click to upload audio files'}
              </button>

              {selectedFiles.length > 0 && (
                <div style={{ marginTop: spacing.sm, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                  {selectedFiles.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: `${spacing.xs} ${spacing.md}`,
                        borderRadius: borderRadius.sm,
                        background: colors.glass.transparent,
                        border: `1px solid ${colors.glass.border}`,
                      }}
                    >
                      <Typography variant="small" style={{ color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                        {file.name}
                      </Typography>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text.secondary, padding: '2px 4px', fontSize: 14 }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Noise removal */}
            <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: 'pointer', marginBottom: spacing.md }}>
              <input
                type="checkbox"
                checked={removeNoise}
                onChange={(e) => setRemoveNoise(e.target.checked)}
                style={{ accentColor: colors.accent.primary }}
              />
              <Typography variant="small" style={{ color: colors.text.secondary }}>
                Remove background noise from samples
              </Typography>
            </label>

            {/* Tips */}
            <div
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.md,
                background: `${colors.accent.primary}0A`,
                border: `1px solid ${colors.accent.primary}20`,
                marginBottom: spacing.md,
              }}
            >
              <Typography variant="small" style={{ color: colors.accent.primary, fontWeight: 600, marginBottom: spacing.sm, display: 'block' }}>
                Tips for best results
              </Typography>
              <ul style={{ margin: 0, paddingLeft: spacing.lg, listStyle: 'disc' }}>
                {RECORDING_TIPS.map((tip) => (
                  <li key={tip} style={{ marginBottom: spacing.xs }}>
                    <Typography variant="small" style={{ color: colors.text.secondary }}>
                      {tip}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>

            <AiCostNotice
              cost={0}
              description="ElevenLabs Instant Voice Clone — uses your ElevenLabs account credits. No Q credits charged."
              style={{ marginBottom: spacing.lg }}
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={creating}
              onClick={handleCreate}
            >
              {creating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating your voice…
                </>
              ) : (
                <>
                  <Mic size={18} />
                  Create voice
                </>
              )}
            </Button>
          </motion.div>
        )}

        {(status?.status === 'ready' || status?.status === 'processing') && status?.voice_id && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
              marginBottom: spacing.lg,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                marginBottom: spacing.lg,
              }}
            >
              {status.status === 'ready' ? (
                <Check size={24} color={colors.success} />
              ) : (
                <Loader2 size={24} color={colors.accent.primary} className="animate-spin" />
              )}
              <Typography variant="h3" style={{ color: colors.text.primary }}>
                {status.name || 'My Voice'}
              </Typography>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: borderRadius.full,
                  background: status.status === 'ready' ? `${colors.success}20` : `${colors.accent.primary}20`,
                  color: status.status === 'ready' ? colors.success : colors.accent.primary,
                }}
              >
                {status.status === 'ready' ? 'Ready' : 'Processing'}
              </span>
            </div>

            {/* Preview */}
            <div style={{ marginBottom: spacing.lg }}>
              <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}>
                Preview your voice
              </Typography>
              <AiCostNotice
                cost={0}
                description="ElevenLabs TTS preview — uses your ElevenLabs account credits. No Q credits charged."
                style={{ marginBottom: spacing.sm }}
              />
              <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handlePreview}
                  disabled={previewing || status.status !== 'ready'}
                >
                  {previewing ? (
                    <Loader2 size={16} style={{ marginRight: spacing.sm }} className="animate-spin" />
                  ) : (
                    <Play size={16} style={{ marginRight: spacing.sm }} />
                  )}
                  {previewing ? 'Generating…' : 'Play preview'}
                </Button>
                {previewUrl && (
                  <audio controls src={previewUrl} style={{ maxWidth: 280, height: 36 }} />
                )}
              </div>
              {status.status === 'processing' && (
                <Typography variant="small" style={{ color: colors.text.secondary, marginTop: spacing.sm, display: 'block' }}>
                  Your voice is being processed. Preview will be available shortly.
                </Typography>
              )}
            </div>

            {/* Add more samples */}
            <div>
              <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm, display: 'block' }}>
                Improve quality — add more samples
              </Typography>
              <input
                ref={moreFilesRef}
                type="file"
                accept="audio/*"
                multiple
                disabled={uploading}
                onChange={handleUploadMore}
                style={{ display: 'none' }}
              />
              <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => moreFilesRef.current?.click()}
                  disabled={uploading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.md} ${spacing.lg}`,
                    borderRadius: borderRadius.md,
                    border: `1px solid ${colors.glass.border}`,
                    background: colors.glass.transparent,
                    color: colors.text.primary,
                    cursor: uploading ? 'wait' : 'pointer',
                    fontSize: 14,
                  }}
                >
                  {uploading ? (
                    <Loader2 size={16} color={colors.accent.primary} className="animate-spin" />
                  ) : (
                    <Plus size={16} color={colors.accent.primary} />
                  )}
                  {uploading ? 'Uploading…' : 'Add samples'}
                </button>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={removeNoise}
                    onChange={(e) => setRemoveNoise(e.target.checked)}
                    style={{ accentColor: colors.accent.primary }}
                  />
                  <Typography variant="small" style={{ color: colors.text.secondary }}>
                    Remove background noise
                  </Typography>
                </label>
              </div>
            </div>
          </motion.div>
        )}
        </>
        )}
      </PageContent>
    </PageShell>
    </VoiceGate>
  );
}
