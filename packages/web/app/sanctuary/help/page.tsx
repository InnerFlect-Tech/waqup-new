'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft, Send, CheckCircle, Mail } from 'lucide-react';
import { Typography, Button } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';

const FAQS = [
  {
    q: 'What are Qs and how do I use them?',
    a: 'Qs are waQup credits. You spend them when you create content — affirmations, meditations, and rituals. Practice (listening back to your content) is always free. You can earn Qs by referring friends, maintaining streaks, or by getting a plan.',
  },
  {
    q: 'Does my voice get cloned? How does that work?',
    a: 'Yes — we use ElevenLabs Professional Voice Cloning to generate audio in your own voice. You record a short sample, we clone it, and all your content is rendered in that voice. Your voice data is tied to your account and never shared.',
  },
  {
    q: 'Can I practice without spending Qs?',
    a: 'Absolutely. Listening to any content you have created is unlimited and free. Qs are only spent during the creation process — writing scripts, generating audio, and publishing to the marketplace.',
  },
  {
    q: 'How is my data handled?',
    a: 'Your content, voice, and personal data are stored securely via Supabase. We do not sell your data. You can request a full export or deletion of your account at any time by writing to us.',
  },
  {
    q: 'What happens if I run out of Qs?',
    a: 'You can still access and practice all your existing content. You won\'t be able to create new content until your balance is topped up. Head to Get Qs to choose a plan.',
  },
];

const FEEDBACK_CATEGORIES = [
  { id: 'bug', label: 'Bug report' },
  { id: 'feature', label: 'Feature request' },
  { id: 'content', label: 'Content quality' },
  { id: 'billing', label: 'Billing question' },
  { id: 'general', label: 'General feedback' },
];

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      style={{
        borderRadius: borderRadius.lg,
        background: colors.glass.light,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${open ? `${colors.accent.primary}40` : colors.glass.border}`,
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
        marginBottom: spacing.sm,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: spacing.lg,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
          textAlign: 'left',
        }}
      >
        <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontWeight: 400, lineHeight: 1.4 }}>
          {question}
        </Typography>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={18} color={colors.text.secondary} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: `0 ${spacing.lg} ${spacing.lg} ${spacing.lg}`,
                borderTop: `1px solid ${colors.glass.border}`,
                paddingTop: spacing.md,
              }}
            >
              <Typography variant="body" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.6, fontSize: 14 }}>
                {answer}
              </Typography>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HelpPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 5) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), category }),
      });

      if (res.ok) {
        setStatus('sent');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <Link href="/sanctuary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl }}>
          <ArrowLeft size={14} color={colors.text.secondary} />
          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
            Sanctuary
          </Typography>
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
            Help & Feedback
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg }}>
            Questions, ideas, or something not working — we want to hear it.
          </Typography>
        </motion.div>

        {/* Feedback form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: spacing.lg }}
        >
          <Typography
            variant="h4"
            style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}
          >
            Give feedback
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Category selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
              {FEEDBACK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  style={{
                    padding: `${spacing.xs} ${spacing.md}`,
                    borderRadius: borderRadius.full,
                    border: `1px solid ${category === cat.id ? `${colors.accent.primary}70` : colors.glass.border}`,
                    background: category === cat.id ? `${colors.accent.primary}20` : colors.glass.light,
                    color: category === cat.id ? colors.accent.tertiary : colors.text.secondary,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (status === 'error' || status === 'sent') setStatus('idle');
              }}
              placeholder="Tell us what's on your mind…"
              rows={3}
              style={{
                width: '100%',
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                background: colors.glass.light,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${colors.glass.border}`,
                color: colors.text.primary,
                fontSize: 14,
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: spacing.md,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = `${colors.accent.primary}50`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.glass.border;
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
              <AnimatePresence mode="wait">
                {status === 'sent' && (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}
                  >
                    <CheckCircle size={16} color="#34d399" />
                    <Typography variant="small" style={{ color: '#34d399', margin: 0 }}>
                      Thank you — we got it.
                    </Typography>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Typography variant="small" style={{ color: colors.error, margin: 0 }}>
                      Something went wrong. Try again or{' '}
                      <a href="mailto:hello@waqup.app" style={{ color: colors.accent.tertiary }}>
                        email us
                      </a>
                      .
                    </Typography>
                  </motion.div>
                )}
                {(status === 'idle' || status === 'sending') && <div />}
              </AnimatePresence>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={status === 'sending' || message.trim().length < 5}
                style={{ flexShrink: 0 }}
              >
                <Send size={14} />
                {status === 'sending' ? 'Sending…' : 'Send'}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: spacing.lg }}
        >
          <Typography
            variant="h4"
            style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}
          >
            Common questions
          </Typography>

          {FAQS.map((faq, index) => (
            <FaqItem key={faq.q} question={faq.q} answer={faq.a} index={index} />
          ))}
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${colors.glass.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: borderRadius.md,
              background: `${colors.accent.primary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Mail size={18} color={colors.accent.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <Typography variant="body" style={{ color: colors.text.primary, margin: 0, marginBottom: spacing.xs, fontWeight: 400 }}>
              Still need help?
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
              Write to{' '}
              <a href="mailto:hello@waqup.app" style={{ color: colors.accent.tertiary, textDecoration: 'none' }}>
                hello@waqup.app
              </a>
              {' '}— we read every message.
            </Typography>
          </div>
        </motion.div>
      </PageContent>
    </PageShell>
  );
}
