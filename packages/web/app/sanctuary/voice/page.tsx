'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography, Button } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { Mic, Upload, Play, Check, Loader2 } from 'lucide-react';

interface VoiceStatus {
  voice_id: string | null;
  name: string | null;
  language: string | null;
  status: 'not_setup' | 'processing' | 'ready';
}

const PREVIEW_TEXT =
  'Hello, this is a preview of your cloned voice. Your personalized affirmations and meditations will sound like this.';

export default function VoiceSetupPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [status, setStatus] = useState<VoiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [removeNoise, setRemoveNoise] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/voice');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch');
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

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Voice name is required');
      return;
    }
    try {
      setCreating(true);
      setError(null);
      const res = await fetch('/api/voice/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), language: language.trim() || 'en' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to create');
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create voice');
    } finally {
      setCreating(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('files', f));
      formData.append('remove_background_noise', String(removeNoise));
      const res = await fetch('/api/voice/samples', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to upload');
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
      const res = await fetch('/api/voice/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: PREVIEW_TEXT }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to generate preview');
      }
      const blob = await res.blob();
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

  if (loading) {
    return (
      <PageShell intensity="medium">
        <PageContent width="narrow">
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: spacing.xxl }}>
            <Loader2 size={24} color={colors.accent.primary} className="animate-spin" />
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Loading voice setup…
            </Typography>
          </div>
        </PageContent>
      </PageShell>
    );
  }

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <Link href="/sanctuary" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.xl }}>
          <Typography variant="small" style={{ color: colors.text.secondary }}>
            ← Sanctuary
          </Typography>
        </Link>

        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          My Voice
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xxl }}>
          Set up your cloned voice for personalized affirmations and meditations. Record in a quiet room with clear
          speech — 30+ seconds total recommended.
        </Typography>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: `${colors.error}20`,
              border: `1px solid ${colors.error}40`,
              marginBottom: spacing.xl,
            }}
          >
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
              padding: spacing.xxl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.lg }}>
              Create your voice
            </Typography>
            <div style={{ marginBottom: spacing.lg }}>
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
                }}
              />
            </div>
            <div style={{ marginBottom: spacing.xl }}>
              <label style={{ display: 'block', marginBottom: spacing.xs }}>
                <Typography variant="small" style={{ color: colors.text.secondary }}>
                  Language
                </Typography>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.transparent,
                  color: colors.text.primary,
                  fontSize: 15,
                }}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
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
                  Creating…
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
              padding: spacing.xxl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.glass.border}`,
              marginBottom: spacing.xl,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                marginBottom: spacing.lg,
              }}
            >
              {status.status === 'ready' ? (
                <Check size={24} color="#34d399" />
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
                  background: status.status === 'ready' ? '#34d39920' : `${colors.accent.primary}20`,
                  color: status.status === 'ready' ? '#34d399' : colors.accent.primary,
                }}
              >
                {status.status === 'ready' ? 'Ready' : 'Processing'}
              </span>
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                Add more samples for better quality (quiet room, clear speech, 30+ seconds)
              </Typography>
              <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.md} ${spacing.lg}`,
                    borderRadius: borderRadius.md,
                    border: `1px solid ${colors.glass.border}`,
                    background: colors.glass.transparent,
                    cursor: uploading ? 'wait' : 'pointer',
                  }}
                >
                  <input
                    type="file"
                    accept="audio/*"
                    multiple
                    disabled={uploading}
                    onChange={handleUpload}
                    style={{ display: 'none' }}
                  />
                  {uploading ? (
                    <Loader2 size={18} color={colors.accent.primary} className="animate-spin" />
                  ) : (
                    <Upload size={18} color={colors.accent.primary} />
                  )}
                  <Typography variant="body" style={{ color: colors.text.primary }}>
                    {uploading ? 'Uploading…' : 'Upload samples'}
                  </Typography>
                </label>
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

            <div>
              <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                Preview your voice
              </Typography>
              <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handlePreview}
                  disabled={previewing || status.status !== 'ready'}
                  style={{
                    borderColor: colors.glass.border,
                    background: colors.glass.transparent,
                  }}
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
            </div>
          </motion.div>
        )}
      </PageContent>
    </PageShell>
  );
}
