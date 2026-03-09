'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { ScienceInsight } from './ScienceInsight';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { getContentDetailHref } from './getContentDetailHref';
import { Sparkles, Headphones, ArrowRight, Share2 } from 'lucide-react';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import { Analytics } from '@waqup/shared/utils';
import { ShareModal } from '@/components/marketplace/ShareModal';
import { useAuthStore } from '@/stores';

const TYPE_LABELS = {
  affirmation: { emoji: '✦', color: CONTENT_TYPE_COLORS.affirmation, sanctuary: '/sanctuary/affirmations' },
  meditation: { emoji: '◎', color: CONTENT_TYPE_COLORS.meditation, sanctuary: '/sanctuary/meditations' },
  ritual: { emoji: '⬡', color: CONTENT_TYPE_COLORS.ritual, sanctuary: '/sanctuary/rituals' },
};

export interface ContentCompleteStepProps {
  savedId?: string;
}

export function ContentCompleteStep({ savedId }: ContentCompleteStepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { contentType, intent, script } = useContentCreation();
  const { user } = useAuthStore();
  const [show, setShow] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const meta = TYPE_LABELS[contentType];
  const editAudioHref = savedId ? `${getContentDetailHref(contentType, savedId)}/edit-audio` : null;
  const viewHref = savedId ? getContentDetailHref(contentType, savedId) : meta.sanctuary;

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    Analytics.contentCreated(contentType, 'form', user?.id);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
      {/* Celebration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ marginBottom: spacing.xxl }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `${meta.color}18`,
            border: `2px solid ${meta.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            marginBottom: spacing.xl,
            fontSize: 44,
          }}
        >
          {meta.emoji}
        </div>

        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          {contentType === 'affirmation' && 'Your affirmation is ready'}
          {contentType === 'meditation' && 'Your meditation is ready'}
          {contentType === 'ritual' && 'Your ritual is ready'}
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, maxWidth: 400, margin: '0 auto' }}>
          The practice is complete. Now the real work begins — daily repetition.
        </Typography>
      </motion.div>

      {/* Summary card */}
      {intent && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${colors.glass.border}`,
            marginBottom: spacing.xl,
            textAlign: 'left',
          }}
        >
          <Typography variant="small" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, marginBottom: spacing.sm, display: 'block' }}>
            Your intent
          </Typography>
          <Typography variant="body" style={{ color: colors.text.primary, lineHeight: 1.7, fontStyle: 'italic' }}>
            "{intent}"
          </Typography>
          {script && (
            <>
              <div style={{ height: 1, background: colors.glass.border, margin: `${spacing.lg} 0` }} />
              <Typography variant="small" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, marginBottom: spacing.sm, display: 'block' }}>
                Script preview
              </Typography>
              <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.7 }}>
                {script.slice(0, 200)}{script.length > 200 ? '…' : ''}
              </Typography>
            </>
          )}
        </motion.div>
      )}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.xl }}
      >
        {editAudioHref && (
          <Link href={editAudioHref} style={{ textDecoration: 'none' }}>
            <Button
              variant="primary"
              size="lg"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}
            >
              <Headphones size={18} />
              Open Audio Studio
              <ArrowRight size={16} />
            </Button>
          </Link>
        )}

        <Link href={viewHref} style={{ textDecoration: 'none' }}>
          <Button
            variant="ghost"
            size="lg"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, color: colors.text.secondary }}
          >
            <Sparkles size={16} />
            View in Sanctuary
          </Button>
        </Link>

        {savedId && (
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShareOpen(true)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, color: colors.text.secondary }}
          >
            <Share2 size={16} />
            Share
          </Button>
        )}
      </motion.div>

      {savedId && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          contentId={savedId}
          title={intent ?? 'My practice'}
          creatorName={user?.user_metadata?.full_name ?? user?.email?.split('@')[0]}
          contentType={contentType}
        />
      )}

      <ScienceInsight
        topic="neuroplasticity"
        insight="The first listen sets the pathway. Consistency over 21–66 days transforms the pattern from effortful to automatic."
        additionalTopics={['habit-formation']}
      />
    </div>
  );
}
