'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ChevronRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { Typography, Button } from '@/components';
import { BaseModal } from '@/components/shared/BaseModal';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { QCoin } from '@/components/ui/QCoin';
import type { UserVoice, VoiceRelationship } from '@waqup/shared/types';
import { RELATIONSHIP_META } from '@waqup/shared/types';
import { API_ROUTE_COSTS } from '@waqup/shared/constants';

interface AddVoiceModalProps {
  onClose: () => void;
  onCreated: (voice: UserVoice) => void;
  creditBalance: number;
}

type Step = 'who' | 'upload' | 'confirm';

const RELATIONSHIPS: VoiceRelationship[] = ['family', 'friend', 'teacher', 'mentor', 'partner', 'other'];

const RECORDING_TIPS = [
  'Quiet room — no echo, no background noise',
  '30+ seconds of clear speech recommended',
  'Natural pace — read a poem, a letter, a passage',
  'MP3, WAV or M4A files accepted',
];

const RELATIONSHIP_COPY: Record<VoiceRelationship, { heading: string; placeholder: string; hint: string }> = {
  self:    { heading: 'My own voice',     placeholder: 'e.g. Me',          hint: 'Your own voice for maximum neural impact.' },
  family:  { heading: 'A family member',  placeholder: 'e.g. Mum, Dad…',   hint: 'A voice that shaped your earliest sense of self.' },
  friend:  { heading: 'A close friend',   placeholder: 'e.g. Sarah, Marco…', hint: 'Someone whose voice carries warmth and trust.' },
  teacher: { heading: 'A teacher',        placeholder: 'e.g. Dr. Patel…',  hint: 'A voice that expanded what you believed possible.' },
  mentor:  { heading: 'A mentor',         placeholder: 'e.g. Coach James…',hint: 'A voice that guided you at a turning point.' },
  partner: { heading: 'A partner',        placeholder: 'e.g. Alex…',       hint: 'A voice held close to the heart.' },
  other:   { heading: 'Someone important', placeholder: 'Their name…',     hint: 'A voice worth preserving.' },
};

export function AddVoiceModal({ onClose, onCreated, creditBalance }: AddVoiceModalProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const cost = API_ROUTE_COSTS.voiceSlot;
  const canAfford = creditBalance >= cost;

  const [step, setStep] = useState<Step>('who');
  const [relationship, setRelationship] = useState<VoiceRelationship>('family');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [removeNoise, setRemoveNoise] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const meta = RELATIONSHIP_META[relationship];
  const copy = RELATIONSHIP_COPY[relationship];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...selected.filter((f) => !names.has(f.name))];
    });
    e.target.value = '';
  };

  const handleCreate = async () => {
    if (!name.trim()) { setError('Please enter a name'); return; }
    if (!files.length) { setError('Upload at least one audio sample'); return; }

    try {
      setCreating(true);
      setError(null);

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('relationship', relationship);
      if (description.trim()) formData.append('description', description.trim());
      formData.append('avatar_color', meta.color);
      formData.append('remove_background_noise', String(removeNoise));
      files.forEach((f) => formData.append('files', f));

      const res = await fetch('/api/voices', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? data.error?.message ?? 'Failed to create voice');
      }

      onCreated(data.voice as UserVoice);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  const stepOrder: Step[] = ['who', 'upload', 'confirm'];
  const stepIdx = stepOrder.indexOf(step);

  const canAdvanceWho = relationship !== null && name.trim().length > 0;
  const canAdvanceUpload = files.length > 0;

  return (
    <BaseModal
      isOpen
      onClose={onClose}
      maxWidth={520}
      zIndex={50}
      style={{
        padding: 0,
        boxShadow: `0 24px 80px ${colors.overlay}, 0 0 60px ${meta.color}15`,
      }}
      >
      {/* Header */}
        <div
          style={{
            padding: `${spacing.xl} ${spacing.xl} ${spacing.lg}`,
            borderBottom: `1px solid ${colors.glass.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontWeight: 500 }}>
              Add a voice
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 2 }}>
              Preserve someone&apos;s voice, forever
            </Typography>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.text.secondary,
              padding: 4,
              borderRadius: borderRadius.sm,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ padding: `${spacing.md} ${spacing.xl}`, display: 'flex', gap: spacing.xs }}>
          {stepOrder.map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: i <= stepIdx ? meta.color : colors.glass.border,
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: `${spacing.lg} ${spacing.xl} ${spacing.xl}` }}>
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Who ── */}
            {step === 'who' && (
              <motion.div
                key="who"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500, marginBottom: spacing.lg }}>
                  Who is this voice?
                </Typography>

                {/* Relationship grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: spacing.sm,
                    marginBottom: spacing.xl,
                  }}
                >
                  {RELATIONSHIPS.map((r) => {
                    const m = RELATIONSHIP_META[r];
                    const selected = relationship === r;
                    return (
                      <button
                        key={r}
                        onClick={() => setRelationship(r)}
                        style={{
                          padding: `${spacing.md} ${spacing.sm}`,
                          borderRadius: borderRadius.lg,
                          border: `1px solid ${selected ? m.color : colors.glass.border}`,
                          background: selected ? `${m.color}15` : colors.glass.transparent,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: spacing.xs,
                          transition: 'all 0.2s',
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{m.emoji}</span>
                        <Typography
                          variant="small"
                          style={{
                            color: selected ? m.color : colors.text.secondary,
                            fontWeight: selected ? 600 : 400,
                            fontSize: 12,
                          }}
                        >
                          {m.label}
                        </Typography>
                      </button>
                    );
                  })}
                </div>

                {/* Name input */}
                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ display: 'block', marginBottom: spacing.xs }}>
                    <Typography variant="small" style={{ color: colors.text.secondary }}>
                      Their name
                    </Typography>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={copy.placeholder}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: `${spacing.md} ${spacing.lg}`,
                      borderRadius: borderRadius.md,
                      border: `1px solid ${name.trim() ? meta.color + '60' : colors.glass.border}`,
                      background: colors.glass.transparent,
                      color: colors.text.primary,
                      fontSize: 15,
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>

                {/* Description input */}
                <div style={{ marginBottom: spacing.xl }}>
                  <label style={{ display: 'block', marginBottom: spacing.xs }}>
                    <Typography variant="small" style={{ color: colors.text.secondary }}>
                      A note about them{' '}
                      <span style={{ opacity: 0.5 }}>(optional)</span>
                    </Typography>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={copy.hint}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: `${spacing.md} ${spacing.lg}`,
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.glass.border}`,
                      background: colors.glass.transparent,
                      color: colors.text.primary,
                      fontSize: 14,
                      boxSizing: 'border-box',
                      outline: 'none',
                      resize: 'none',
                      lineHeight: 1.5,
                    }}
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!canAdvanceWho}
                  onClick={() => setStep('upload')}
                  style={{ background: canAdvanceWho ? meta.color : undefined }}
                >
                  Continue
                  <ChevronRight size={18} style={{ marginLeft: 4 }} />
                </Button>
              </motion.div>
            )}

            {/* ── STEP 2: Upload ── */}
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500, marginBottom: spacing.sm }}>
                  Upload {name}&apos;s voice
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.xl, display: 'block' }}>
                  A few minutes of audio is all it takes. The more you upload, the more natural it sounds.
                </Typography>

                {/* Drop zone */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing.md,
                    width: '100%',
                    padding: `${spacing.xxl} ${spacing.xl}`,
                    borderRadius: borderRadius.xl,
                    border: `2px dashed ${files.length ? meta.color : colors.glass.border}`,
                    background: files.length ? `${meta.color}08` : colors.glass.transparent,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: spacing.lg,
                    boxSizing: 'border-box',
                  }}
                >
                  <Upload size={28} color={files.length ? meta.color : colors.text.secondary} />
                  <div style={{ textAlign: 'center' }}>
                    <Typography variant="body" style={{ color: files.length ? meta.color : colors.text.secondary, margin: 0 }}>
                      {files.length
                        ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                        : 'Click to upload audio files'}
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 4, display: 'block', fontSize: 12 }}>
                      MP3, WAV, M4A · 30+ seconds recommended
                    </Typography>
                  </div>
                </button>

                {/* File list */}
                {files.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, marginBottom: spacing.lg }}>
                    {files.map((file, i) => (
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
                        <Typography variant="small" style={{ color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '85%', fontSize: 12 }}>
                          {file.name}
                        </Typography>
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text.secondary, padding: '2px 4px', fontSize: 14 }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tips */}
                <div
                  style={{
                    padding: spacing.lg,
                    borderRadius: borderRadius.md,
                    background: `${meta.color}08`,
                    border: `1px solid ${meta.color}20`,
                    marginBottom: spacing.xl,
                  }}
                >
                  <Typography variant="small" style={{ color: meta.color, fontWeight: 600, marginBottom: spacing.sm, display: 'block' }}>
                    Tips for best results
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: spacing.lg, listStyle: 'disc' }}>
                    {RECORDING_TIPS.map((tip) => (
                      <li key={tip}>
                        <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12 }}>
                          {tip}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Noise removal */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    cursor: 'pointer',
                    marginBottom: spacing.xl,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={removeNoise}
                    onChange={(e) => setRemoveNoise(e.target.checked)}
                    style={{ accentColor: meta.color }}
                  />
                  <Typography variant="small" style={{ color: colors.text.secondary }}>
                    Remove background noise
                  </Typography>
                </label>

                <div style={{ display: 'flex', gap: spacing.md }}>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setStep('who')}
                    style={{ color: colors.text.secondary }}
                  >
                    <ChevronLeft size={16} style={{ marginRight: 4 }} />
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    style={{ flex: 1, background: canAdvanceUpload ? meta.color : undefined }}
                    disabled={!canAdvanceUpload}
                    onClick={() => setStep('confirm')}
                  >
                    Continue
                    <ChevronRight size={18} style={{ marginLeft: 4 }} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Confirm ── */}
            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Voice preview card */}
                <div
                  style={{
                    padding: spacing.xl,
                    borderRadius: borderRadius.xl,
                    background: `${meta.color}10`,
                    border: `1px solid ${meta.color}30`,
                    marginBottom: spacing.xl,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.lg,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: `${meta.color}20`,
                      border: `2px solid ${meta.color}50`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {meta.emoji}
                  </div>
                  <div>
                    <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontWeight: 500 }}>
                      {name}
                    </Typography>
                    <Typography variant="small" style={{ color: meta.color, marginTop: 2, display: 'block' }}>
                      {meta.label} · {files.length} audio file{files.length > 1 ? 's' : ''}
                    </Typography>
                    {description && (
                      <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 4, display: 'block', fontSize: 12, lineHeight: 1.4 }}>
                        {description}
                      </Typography>
                    )}
                  </div>
                </div>

                {/* Cost */}
                <div
                  style={{
                    padding: spacing.lg,
                    borderRadius: borderRadius.lg,
                    background: canAfford ? `${colors.accent.primary}0A` : `${colors.error}0A`,
                    border: `1px solid ${canAfford ? colors.accent.primary + '30' : colors.error + '40'}`,
                    marginBottom: spacing.lg,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                  }}
                >
                  <QCoin size="md" />
                  <div style={{ flex: 1 }}>
                    <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500, margin: 0 }}>
                      {cost} Q credits
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, display: 'block', fontSize: 12 }}>
                      {canAfford
                        ? `You have ${creditBalance} Q — ${creditBalance - cost} Q remaining after.`
                        : `You need ${cost} Q but only have ${creditBalance} Q.`}
                    </Typography>
                  </div>
                </div>

                {!canAfford && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: spacing.sm,
                      padding: spacing.md,
                      borderRadius: borderRadius.md,
                      background: `${colors.error}10`,
                      border: `1px solid ${colors.error}30`,
                      marginBottom: spacing.lg,
                    }}
                  >
                    <AlertCircle size={16} color={colors.error} style={{ marginTop: 1, flexShrink: 0 }} />
                    <Typography variant="small" style={{ color: colors.error }}>
                      Not enough Q credits. Visit your profile to get more.
                    </Typography>
                  </div>
                )}

                {error && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: spacing.sm,
                      padding: spacing.md,
                      borderRadius: borderRadius.md,
                      background: `${colors.error}10`,
                      border: `1px solid ${colors.error}30`,
                      marginBottom: spacing.lg,
                    }}
                  >
                    <AlertCircle size={16} color={colors.error} style={{ marginTop: 1, flexShrink: 0 }} />
                    <Typography variant="small" style={{ color: colors.error }}>{error}</Typography>
                  </div>
                )}

                <div style={{ display: 'flex', gap: spacing.md }}>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setStep('upload')}
                    style={{ color: colors.text.secondary }}
                    disabled={creating}
                  >
                    <ChevronLeft size={16} style={{ marginRight: 4 }} />
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    style={{ flex: 1, background: meta.color }}
                    disabled={!canAfford || creating}
                    loading={creating}
                    onClick={handleCreate}
                  >
                    {creating ? 'Cloning voice…' : `Save ${name}'s voice`}
                  </Button>
                </div>

                <Typography
                  variant="small"
                  style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.lg, display: 'block', fontSize: 11, opacity: 0.6, lineHeight: 1.4 }}
                >
                  Voice cloning powered by ElevenLabs. No credit refund on deletion.
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </BaseModal>
  );
}
