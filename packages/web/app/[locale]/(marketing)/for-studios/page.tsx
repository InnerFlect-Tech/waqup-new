'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import {
  QrCode,
  Music,
  Moon,
  Wind,
  Sunrise,
  Share2,
  ArrowRight,
  Users,
  Sparkles,
} from 'lucide-react';
import { useTheme, spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH, PAGE_TOP_PADDING } from '@/theme';
import { Typography, Button, PageShell } from '@/components';

const MOMENTS = [
  {
    icon: Sunrise,
    label: 'Pre-class grounding',
    sub: 'Students arrive anxious. A 3-minute QR-accessible breathwork sets the tone before class starts.',
  },
  {
    icon: Moon,
    label: 'Savasana & yoga nidra',
    sub: "Your voice guides the final integration. Students scan the QR on their way out and take it home.",
  },
  {
    icon: Wind,
    label: 'Breathwork protocols',
    sub: "Box breathing, 4-7-8, coherence breathing — create a library of your signature protocols students can access anywhere.",
  },
  {
    icon: Music,
    label: 'Retreat take-home rituals',
    sub: "Every retreat should end with a practice students can maintain. waQup makes the continuation frictionless.",
  },
];

const LOOP = [
  { step: '01', label: 'You create the practice', sub: 'A savasana script, grounding ritual, or breathwork guide — in your voice, with ambient layers.' },
  { step: '02', label: 'Generate a QR code', sub: 'waQup creates a QR code for any published session. Print it, post it, put it on cards.' },
  { step: '03', label: 'Student scans in class', sub: 'QR → immersive audio player. No app required. Plays directly in the browser.' },
  { step: '04', label: 'They join waQup, you earn', sub: "Every student who signs up from your QR loop earns you referral credits. Their first session is free to listen, always." },
];

export default function ForStudiosPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'studio', source: 'for-studios' }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const green = '#34d399';

  return (
    <PageShell intensity="medium" bare allowDocumentScroll>
      <div
        style={{
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
          padding: `0 ${spacing.xl}`,
          marginTop: `calc(-1 * ${PAGE_TOP_PADDING})`,
        }}
      >
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            minHeight: '90dvh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: '120px',
            paddingBottom: spacing.xxl,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xs,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              background: `${green}18`,
              border: `1px solid ${green}40`,
              marginBottom: spacing.lg,
            }}
          >
            <QrCode size={14} color={green} />
            <Typography variant="smallBold" style={{ color: green, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
              For Yoga Studios & Retreat Facilitators
            </Typography>
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: 200,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: colors.text.primary,
              margin: `0 0 ${spacing.lg}`,
              maxWidth: 800,
            }}
          >
            Give every student a{' '}
            <span
              style={{
                background: `linear-gradient(to right, ${green}, ${colors.accent.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              take-home ritual
            </span>
          </h1>

          <Typography
            variant="body"
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: colors.text.secondary,
              maxWidth: 560,
              lineHeight: 1.6,
              marginBottom: spacing.xxl,
            }}
          >
            QR codes in your studio link to beautiful audio experiences — savasana, nidra, breathwork — created in your voice. Students scan, listen, and discover their own practice.
          </Typography>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: `${spacing.lg} ${spacing.xxl}`, borderRadius: borderRadius.lg, background: `${green}18`, border: `1px solid ${green}40` }}
            >
              <Typography variant="body" style={{ color: green, fontWeight: 600 }}>
                You&apos;re on the list. We&apos;ll reach out with your Studio QR Bundle.
              </Typography>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 480 }}>
              <input
                type="email"
                placeholder="studio@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ flex: 1, minWidth: 200, padding: `${spacing.md} ${spacing.lg}`, borderRadius: borderRadius.lg, background: colors.glass.light, border: `1px solid ${colors.glass.border}`, color: colors.text.primary, fontSize: 15, outline: 'none' }}
              />
              <Button type="submit" variant="primary" size="md" loading={loading} style={{ whiteSpace: 'nowrap', background: `linear-gradient(to right, ${green}, ${colors.accent.primary})`, border: 'none' }}>
                Get Studio Access
              </Button>
            </form>
          )}

          <Typography variant="small" style={{ color: colors.text.secondary, marginTop: spacing.md, fontSize: 13, opacity: 0.7 }}>
            Free to start · QR bundle included · Zero paid ads needed
          </Typography>
        </motion.section>

        {/* Class moments */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ paddingBottom: `calc(${spacing.xxl} + ${spacing.xxl})` }}
        >
          <Typography variant="h2" style={{ color: colors.text.primary, textAlign: 'center', marginBottom: spacing.xxl, fontWeight: 200, letterSpacing: '-0.02em' }}>
            Every moment in class becomes a lasting practice
          </Typography>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: spacing.xl }}>
            {MOMENTS.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  style={{ padding: spacing.xl, borderRadius: borderRadius.lg, background: colors.glass.light, backdropFilter: BLUR.lg, WebkitBackdropFilter: BLUR.lg, border: `1px solid ${colors.glass.border}` }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: borderRadius.md, background: `${green}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md }}>
                    <Icon size={20} color={green} strokeWidth={1.5} />
                  </div>
                  <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 700, marginBottom: spacing.xs }}>
                    {m.label}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                    {m.sub}
                  </Typography>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* The QR loop */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ paddingBottom: `calc(${spacing.xxl} + ${spacing.xxl})` }}
        >
          <Typography variant="h2" style={{ color: colors.text.primary, textAlign: 'center', marginBottom: spacing.xxl, fontWeight: 200, letterSpacing: '-0.02em' }}>
            The QR acquisition loop
          </Typography>

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 560,
              aspectRatio: '1',
              borderRadius: borderRadius.lg,
              overflow: 'hidden',
              margin: '0 auto',
              marginBottom: spacing.xxl,
            }}
          >
            <Image
              src="/images/for-studios-qr.png"
              alt="QR code in studio — student scanning, yoga mat, wellness space"
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.lg }}>
            {LOOP.map((l) => (
              <div
                key={l.step}
                style={{ padding: spacing.xl, borderRadius: borderRadius.lg, background: colors.glass.light, backdropFilter: BLUR.lg, WebkitBackdropFilter: BLUR.lg, border: `1px solid ${colors.glass.border}` }}
              >
                <div style={{ fontSize: 32, fontWeight: 200, color: green, opacity: 0.4, lineHeight: 1, marginBottom: spacing.sm, letterSpacing: '-0.03em' }}>
                  {l.step}
                </div>
                <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600, marginBottom: spacing.xs }}>
                  {l.label}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.55 }}>
                  {l.sub}
                </Typography>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: spacing.xl,
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              background: `${green}0a`,
              border: `1px solid ${green}25`,
              textAlign: 'center',
            }}
          >
            <Typography variant="small" style={{ color: green, fontSize: 13, lineHeight: 1.6 }}>
              The QR generator is built into every published session — print it, display it on screen, add it to your studio cards, or embed it on your website.
            </Typography>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', paddingBottom: `calc(${spacing.xxl} + ${spacing.xxl})` }}
        >
          <div style={{ padding: spacing.xxl, borderRadius: borderRadius.xl, background: `linear-gradient(135deg, ${green}0a, ${colors.accent.primary}08)`, border: `1px solid ${green}25` }}>
            <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: 200, marginBottom: spacing.md, letterSpacing: '-0.02em' }}>
              Your studio. Their practice. Every day.
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, maxWidth: 480, margin: `0 auto ${spacing.xl}`, lineHeight: 1.6 }}>
              Join as a studio and get the Studio QR Bundle — credits to create your first savasana, nidra, and breathwork sessions, plus QR cards ready to print.
            </Typography>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm, background: `linear-gradient(to right, ${green}, ${colors.accent.primary})`, border: 'none' }}>
                Start Your Studio Account
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </PageShell>
  );
}
