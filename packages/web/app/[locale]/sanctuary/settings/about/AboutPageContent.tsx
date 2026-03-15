'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Typography, PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { ACKNOWLEDGMENTS } from '@/config/acknowledgments';
import { APP_VERSION } from '@/config/version';
import { useTranslations } from 'next-intl';

interface AboutPageContentProps {
  changelogMarkdown: string;
  /** When 'public', page is accessible without auth; back link goes to home. When 'sanctuary', back link goes to settings. */
  variant?: 'public' | 'sanctuary';
}

export function AboutPageContent({ changelogMarkdown, variant = 'sanctuary' }: AboutPageContentProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const t = useTranslations('settings');

  const sectionStyle: React.CSSProperties = {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    background: colors.glass.light,
    backdropFilter: BLUR.lg,
    WebkitBackdropFilter: BLUR.lg,
    border: `1px solid ${colors.glass.border}`,
    marginBottom: spacing.lg,
  };

  const changelogContentStyles: React.CSSProperties = {
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 1.6,
  };

  return (
    <PageShell intensity="medium" allowDocumentScroll>
      <PageContent width="narrow">
        {variant === 'public' ? (
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xs,
              color: colors.text.secondary,
              textDecoration: 'none',
              fontSize: 14,
              marginBottom: spacing.lg,
            }}
          >
            <ArrowLeft size={16} />
            {t('aboutBackHome')}
          </Link>
        ) : (
          <Link
            href="/sanctuary/settings"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xs,
              color: colors.text.secondary,
              textDecoration: 'none',
              fontSize: 14,
              marginBottom: spacing.lg,
            }}
          >
            <ArrowLeft size={16} />
            {t('aboutBackToSettings')}
          </Link>
        )}

        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300, textAlign: 'center' }}>
          {t('aboutTitle')}
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, textAlign: 'center' }}>
          {t('aboutSubtitle')}
        </Typography>

        {/* Version & Beta badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={sectionStyle}>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            {t('version')}
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' }}>
            <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500 }}>
              waQup v{APP_VERSION}
            </Typography>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: borderRadius.full,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                background: `${colors.accent.tertiary}30`,
                color: colors.accent.tertiary,
              }}
            >
              {t('betaLabel')}
            </span>
          </div>
          <Typography variant="small" style={{ color: colors.text.tertiary, marginTop: spacing.sm }}>
            {t('betaNote')}
          </Typography>
        </motion.div>

        {/* Acknowledgments — people and beta testers only (no services/libraries) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={sectionStyle}>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            {t('acknowledgments')}
          </Typography>

          {ACKNOWLEDGMENTS.people.length > 0 && (
            <div style={{ marginBottom: spacing.lg }}>
              <Typography variant="small" style={{ color: colors.text.tertiary, marginBottom: spacing.sm, display: 'block' }}>
                {t('teamAndContributors')}
              </Typography>
              <ul style={{ margin: 0, paddingLeft: spacing.lg, color: colors.text.primary }}>
                {ACKNOWLEDGMENTS.people.map((p, i) => (
                  <li key={i} style={{ marginBottom: spacing.xs }}>
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: colors.accent.primary, textDecoration: 'none' }}
                      >
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                    {p.role && (
                      <Typography variant="small" as="span" style={{ color: colors.text.tertiary, marginLeft: spacing.xs }}>
                        — {p.role}
                      </Typography>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ACKNOWLEDGMENTS.betaTesters.length > 0 && (
            <div style={{ marginBottom: spacing.lg }}>
              <Typography variant="small" style={{ color: colors.text.tertiary, marginBottom: spacing.sm, display: 'block' }}>
                {t('betaTesters')}
              </Typography>
              <ul style={{ margin: 0, paddingLeft: spacing.lg, color: colors.text.primary }}>
                {ACKNOWLEDGMENTS.betaTesters.map((p, i) => (
                  <li key={i} style={{ marginBottom: spacing.xs }}>
                    {p.name}
                    {p.role && (
                      <Typography variant="small" as="span" style={{ color: colors.text.tertiary, marginLeft: spacing.xs }}>
                        — {p.role}
                      </Typography>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ACKNOWLEDGMENTS.people.length === 0 && ACKNOWLEDGMENTS.betaTesters.length === 0 && (
            <Typography variant="small" style={{ color: colors.text.tertiary }}>
              {t('teamAndContributors')}: —
            </Typography>
          )}
        </motion.div>

        {/* Changelog — rendered as HTML from markdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={sectionStyle}>
          <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
            {t('whatsNew')}
          </Typography>
          <div
            className="changelog-content"
            style={changelogContentStyles}
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 style={{ fontSize: 18, fontWeight: 600, marginTop: spacing.md, marginBottom: spacing.sm, color: colors.text.primary }}>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: spacing.lg, marginBottom: spacing.sm, color: colors.text.primary }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: spacing.md, marginBottom: spacing.xs, color: colors.text.primary }}>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p style={{ marginBottom: spacing.sm, color: colors.text.secondary }}>{children}</p>
                ),
                ul: ({ children }) => (
                  <ul style={{ margin: 0, paddingLeft: spacing.lg, marginBottom: spacing.md, color: colors.text.primary }}>
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: spacing.xs }}>{children}</li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: colors.accent.primary, textDecoration: 'none' }}
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong style={{ fontWeight: 600, color: colors.text.primary }}>{children}</strong>
                ),
                hr: () => <hr style={{ border: 'none', borderTop: `1px solid ${colors.glass.border}`, margin: `${spacing.lg} 0` }} />,
              }}
            >
              {changelogMarkdown}
            </ReactMarkdown>
          </div>
        </motion.div>
      </PageContent>
    </PageShell>
  );
}
