'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { ScienceInsight } from './ScienceInsight';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { Sparkles, RefreshCw, Edit3, Check } from 'lucide-react';

export interface ContentScriptStepProps {
  backHref: string;
  nextHref: string;
}

type ScriptState = 'idle' | 'generating' | 'ready' | 'editing' | 'error';

function ScriptSkeleton() {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {[0.8, 0.95, 0.7, 1, 0.85, 0.9].map((w, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.4, delay: i * 0.1, repeat: Infinity }}
          style={{
            height: 14,
            borderRadius: borderRadius.sm,
            background: colors.glass.medium,
            width: `${w * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

export function ContentScriptStep({ backHref, nextHref }: ContentScriptStepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { contentType, intent, context, personalization, script, setScript, setCurrentStep } = useContentCreation();

  const [state, setState] = useState<ScriptState>(script ? 'ready' : 'idle');
  const [editValue, setEditValue] = useState(script);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const generate = useCallback(async () => {
    setState('generating');
    setError('');
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: contentType, intent, context, personalization }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const { script: generated } = await res.json() as { script: string };
      setScript(generated);
      setEditValue(generated);
      setState('ready');
    } catch {
      setError('Something went wrong. Please try again.');
      setState('error');
    }
  }, [contentType, intent, context, personalization, setScript]);

  useEffect(() => {
    if (state === 'idle') generate();
  }, []);

  const handleSaveEdit = () => {
    setScript(editValue);
    setIsEditing(false);
    setState('ready');
  };

  const handleContinue = () => {
    setCurrentStep('script');
    router.push(nextHref);
  };

  const displayScript = isEditing ? editValue : script;

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: spacing.xl, textAlign: 'center' }}
      >
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          {state === 'generating' ? 'Crafting your script…' : 'Your script'}
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary }}>
          {state === 'generating'
            ? 'AI is weaving your intent into language'
            : 'Read through, edit freely, then record in your own voice'}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: spacing.xl }}
      >
        <div
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${state === 'ready' ? colors.accent.primary + '40' : colors.glass.border}`,
            minHeight: 200,
            position: 'relative',
          }}
        >
          {/* Generating indicator */}
          <AnimatePresence>
            {state === 'generating' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: spacing.xl }}
              >
                <div style={{ marginBottom: spacing.lg, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles size={18} color={colors.accent.primary} />
                  </motion.div>
                  <Typography variant="small" style={{ color: colors.accent.primary }}>
                    Generating…
                  </Typography>
                </div>
                <ScriptSkeleton />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Script content */}
          {state === 'ready' && !isEditing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <Typography
                variant="body"
                style={{
                  color: colors.text.primary,
                  lineHeight: 1.9,
                  whiteSpace: 'pre-wrap',
                  fontSize: 15,
                }}
              >
                {displayScript}
              </Typography>
            </motion.div>
          )}

          {/* Edit mode */}
          {isEditing && (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={12}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                fontSize: 15,
                lineHeight: 1.9,
                color: colors.text.primary,
                fontFamily: 'inherit',
              }}
            />
          )}

          {state === 'error' && (
            <div style={{ textAlign: 'center', padding: spacing.xl }}>
              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
                {error}
              </Typography>
              <Button variant="ghost" size="md" onClick={generate}>
                Try again
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        {state === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' }}
          >
            {isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveEdit}
                style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.accent.primary }}
              >
                <Check size={14} />
                Save edits
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setEditValue(script); setIsEditing(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary }}
              >
                <Edit3 size={14} />
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={generate}
              style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary }}
            >
              <RefreshCw size={14} />
              Regenerate
            </Button>
          </motion.div>
        )}

        <ScienceInsight
          topic="voice-identity"
          insight="The script is a starting point. Editing it in your own words deepens the neural encoding — the more it sounds like you, the more powerfully it lands."
        />
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href={backHref} style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="md" style={{ color: colors.text.secondary }}>
            ← Back
          </Button>
        </Link>
        <Button
          variant="primary"
          size="lg"
          disabled={state !== 'ready'}
          onClick={handleContinue}
        >
          Choose Voice →
        </Button>
      </div>
    </div>
  );
}
