'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Typography, Button, AiCostNotice } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { ScienceInsight } from './ScienceInsight';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { Sparkles, RefreshCw, Edit3, Check, ChevronLeft } from 'lucide-react';
import { API_ROUTE_COSTS } from '@waqup/shared/constants';
import { generateScript } from '@/lib/api-client';

const SCRIPT_COST = API_ROUTE_COSTS.generateScript;

export interface ContentScriptStepProps {
  backHref: string;
  nextHref: string;
}

type ScriptState = 'idle' | 'confirming' | 'generating' | 'ready' | 'editing' | 'error';

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
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const generate = useCallback(async () => {
    if (!intent.trim()) {
      setError('No intent found. Please go back and fill in your intent first.');
      setState('error');
      return;
    }
    setState('generating');
    setError('');
    setShowRegenerateConfirm(false);
    try {
      const generated = await generateScript({ type: contentType, intent, context, personalization });
      setScript(generated);
      setEditValue(generated);
      setState('ready');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setState('error');
    }
  }, [contentType, intent, context, personalization, setScript]);

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
            : state === 'idle'
            ? 'Ready to generate your personalised script'
            : 'Read through, edit freely, then record in your own voice'}
        </Typography>
      </motion.div>

      {/* Idle state — explicit generate button with cost notice */}
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
              textAlign: 'center',
              marginBottom: spacing.xl,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: borderRadius.full,
                background: `${colors.accent.primary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: `0 auto ${spacing.lg}`,
              }}
            >
              <Sparkles size={24} color={colors.accent.primary} />
            </div>
            <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
              Create your draft
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, fontSize: 14 }}>
              We&apos;ll craft a draft from your intention — review and make it completely yours.
            </Typography>
            <AiCostNotice
              cost={SCRIPT_COST}
              costLabel="for this generation"
              description="GPT-4o-mini · personalised to your intent"
              style={{ marginBottom: spacing.lg, textAlign: 'left' }}
            />
            <Button variant="primary" size="lg" onClick={generate}>
              <Sparkles size={16} style={{ marginRight: spacing.xs }} />
              Create Draft — {SCRIPT_COST} Qs
            </Button>
          </motion.div>
        )}

        {/* Generating state */}
        {state === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
              minHeight: 200,
              marginBottom: spacing.xl,
            }}
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

        {/* Ready / editing state */}
        {(state === 'ready' || state === 'editing') && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: spacing.xl }}
          >
            <div
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: colors.glass.light,
                backdropFilter: BLUR.xl,
                WebkitBackdropFilter: BLUR.xl,
                border: `1px solid ${colors.accent.primary + '40'}`,
                minHeight: 200,
              }}
            >
              {!isEditing ? (
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
              ) : (
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
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginTop: spacing.md }}
            >
              <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
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
                  onClick={() => setShowRegenerateConfirm(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary }}
                >
                  <RefreshCw size={14} />
                  Regenerate — {SCRIPT_COST} Qs
                </Button>
              </div>

              {/* Regenerate confirmation */}
              <AnimatePresence>
                {showRegenerateConfirm && (
                  <AiCostNotice
                    cost={SCRIPT_COST}
                    costLabel="to regenerate"
                    description="A new script will replace the current one"
                    confirmLabel="Regenerate"
                    onConfirm={generate}
                    onCancel={() => setShowRegenerateConfirm(false)}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            <ScienceInsight
              topic="voice-identity"
              insight="The script is a starting point. Editing it in your own words deepens the neural encoding — the more it sounds like you, the more powerfully it lands."
            />
          </motion.div>
        )}

        {/* Error state */}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
              textAlign: 'center',
              marginBottom: spacing.xl,
            }}
          >
            <Typography variant="body" style={{ color: colors.error ?? '#ef4444', marginBottom: spacing.sm, fontWeight: 600 }}>
              Script generation failed
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.md, fontSize: 13 }}>
              {error}
            </Typography>
            <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" size="md" onClick={generate}>
                Try again — {SCRIPT_COST} Qs
              </Button>
              <Link href="/health" target="_blank" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" size="md" style={{ color: colors.text.secondary, fontSize: 13 }}>
                  Check API health ↗
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href={backHref} style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="md" style={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} /> Back
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
