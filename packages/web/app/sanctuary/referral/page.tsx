'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Button, QCoin } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { Copy, Check, Twitter, Mail, MessageCircle, Gift, Users } from 'lucide-react';
import { useAuthStore } from '@/stores';

function generateReferralCode(email: string): string {
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 6);
  const suffix = Math.abs(email.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 1000)
    .toString()
    .padStart(3, '0');
  return `${base}${suffix}`.toUpperCase();
}

const REWARD_STEPS: Array<{
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  iconNode?: React.ReactNode;
  label: string;
  sub: string;
  color: string;
}> = [
  { icon: Users, label: 'Friend signs up', sub: 'Using your link', color: '#c084fc' },
  { icon: Gift, label: 'They get onboarded', sub: 'Complete their profile', color: '#60a5fa' },
  { icon: Gift, iconNode: <QCoin size="md" />, label: 'You both earn', sub: '10 Qs each', color: '#34d399' },
];

export default function ReferralPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const email = user?.email || 'user@waqup.app';
  const referralCode = generateReferralCode(email);
  const referralUrl = `https://waqup.app/join?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback — ignore
    }
  };

  const shareText = encodeURIComponent('Transform your mind with waQup — personalized affirmations, meditations & rituals created with your own voice. Join me here:');

  const SHARE_LINKS = [
    {
      icon: Twitter,
      label: 'Share on X',
      color: '#1d9bf0',
      href: `https://twitter.com/intent/tweet?text=${shareText}%20${encodeURIComponent(referralUrl)}`,
    },
    {
      icon: MessageCircle,
      label: 'Share on WhatsApp',
      color: '#25d366',
      href: `https://wa.me/?text=${shareText}%20${encodeURIComponent(referralUrl)}`,
    },
    {
      icon: Mail,
      label: 'Share by Email',
      color: '#f59e0b',
      href: `mailto:?subject=${encodeURIComponent('Join me on waQup')}&body=${shareText}%20${encodeURIComponent(referralUrl)}`,
    },
  ];

  return (
    <PageShell intensity="medium">
      <PageContent width="narrow">

        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300, textAlign: 'center' }}>
          Share & Earn
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textAlign: 'center' }}>
          Invite friends to waQup. When they join and complete onboarding, you both get 10 Qs.
        </Typography>

        {/* How it works */}
        <div style={{ marginBottom: spacing.lg }}>
          <Typography
            variant="h4"
            style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}
          >
            How it works
          </Typography>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.md, flexWrap: 'wrap' }}>
            {REWARD_STEPS.map((step, index) => (
              <React.Fragment key={step.label}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    flex: 1,
                    minWidth: 140,
                    padding: spacing.lg,
                    borderRadius: borderRadius.xl,
                    background: colors.glass.light,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${colors.glass.border}`,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: borderRadius.md,
                      background: `${step.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      marginBottom: spacing.sm,
                    }}
                  >
                    {step.iconNode ?? <step.icon size={18} color={step.color} strokeWidth={2} />}
                  </div>
                  <Typography variant="h4" style={{ color: colors.text.primary, margin: 0, marginBottom: spacing.xs }}>
                    {step.label}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                    {step.sub}
                  </Typography>
                </motion.div>
                {index < REWARD_STEPS.length - 1 && (
                  <div style={{ alignSelf: 'center', color: colors.text.secondary, fontSize: 20, opacity: 0.3, flexShrink: 0 }}>
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Referral link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: `linear-gradient(145deg, ${colors.accent.primary}15, ${colors.glass.light})`,
            border: `1px solid ${colors.accent.primary}35`,
            marginBottom: spacing.xl,
          }}
        >
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            Your referral link
          </Typography>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.md} ${spacing.lg}`,
              borderRadius: borderRadius.lg,
              background: colors.glass.medium,
              border: `1px solid ${colors.glass.border}`,
              marginBottom: spacing.lg,
            }}
          >
            <Typography
              variant="small"
              style={{
                color: colors.text.secondary,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {referralUrl}
            </Typography>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: colors.accent.primary,
                background: `${colors.accent.primary}20`,
                padding: `${spacing.xs} ${spacing.sm}`,
                borderRadius: borderRadius.full,
                flexShrink: 0,
              }}
            >
              {referralCode}
            </span>
          </div>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleCopy}
            style={{ background: copied ? '#34d399' : colors.gradients.primary, transition: 'background 0.3s' }}
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy link
              </>
            )}
          </Button>
        </motion.div>

        {/* Share buttons */}
        <div style={{ marginBottom: spacing.lg }}>
          <Typography
            variant="h4"
            style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}
          >
            Share directly
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {SHARE_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  style={{
                    padding: spacing.md,
                    borderRadius: borderRadius.lg,
                    background: colors.glass.light,
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${colors.glass.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: borderRadius.md,
                      background: `${link.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <link.icon size={18} color={link.color} strokeWidth={2} />
                  </div>
                  <Typography variant="body" style={{ color: colors.text.primary }}>
                    {link.label}
                  </Typography>
                </motion.div>
              </a>
            ))}
          </div>
        </div>

        {/* Friends joined (empty state) */}
        <div
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${colors.glass.border}`,
            textAlign: 'center',
          }}
        >
          <Users size={32} color={colors.text.secondary} strokeWidth={1.5} style={{ marginBottom: spacing.md, opacity: 0.4 }} />
          <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
            No friends yet
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14 }}>
            Friends who joined using your link will appear here.
          </Typography>
        </div>
      </PageContent>
    </PageShell>
  );
}
