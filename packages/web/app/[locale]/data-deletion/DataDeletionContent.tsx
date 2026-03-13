'use client';

import { Link } from '@/i18n/navigation';
import { PageShell, PageContent, Typography, Button } from '@/components';
import { spacing, useTheme } from '@/theme';
import { LEGAL_CONFIG } from '@/config/legal';
import { useTranslations } from 'next-intl';

export function DataDeletionContent() {
  const { theme } = useTheme();
  const accentColor = theme.colors.accent.tertiary;
  const t = useTranslations('legal.dataDeletion');
  const { entityName, contactEmail } = LEGAL_CONFIG;

  const rich = (key: string) =>
    t.rich(key, {
      email: (chunks) => (
        <a
          href={`mailto:${contactEmail}`}
          style={{ color: accentColor, textDecoration: 'underline' }}
        >
          {chunks}
        </a>
      ),
      link: (chunks) => (
        <Link href="/privacy" style={{ color: accentColor, textDecoration: 'underline' }}>
          {chunks}
        </Link>
      ),
      entityName,
      contactEmail,
    });

  return (
    <PageShell intensity="medium">
      <PageContent style={{ maxWidth: 680 }}>
        <Typography
          variant="h1"
          style={{
            marginBottom: spacing.xs,
            fontSize: 28,
            fontWeight: 300,
          }}
        >
          {t('title')}
        </Typography>
        <Typography
          variant="body"
          style={{ marginBottom: spacing.xl, opacity: 0.75 }}
        >
          {t('intro', { entityName })}
        </Typography>

        <section style={{ marginBottom: spacing.xl }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: spacing.sm,
              marginTop: 0,
            }}
          >
            {t('s1.title')}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>{t('s1.p1')}</p>
          <ol style={{ paddingLeft: 20, marginTop: 8, fontSize: 14, lineHeight: 1.7 }}>
            <li>{t('s1.li1')}</li>
            <li>{t('s1.li2')}</li>
            <li>{t('s1.li3')}</li>
            <li>{t('s1.li4')}</li>
          </ol>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 12 }}>
            {t('s1.p2')}
          </p>
        </section>

        <section style={{ marginBottom: spacing.xl }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: spacing.sm,
              marginTop: 0,
            }}
          >
            {t('s2.title')}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>{t('s2.p1')}</p>
          <ul style={{ paddingLeft: 20, marginTop: 8, fontSize: 14, lineHeight: 1.7 }}>
            <li>{t('s2.li1')}</li>
            <li>{t('s2.li2')}</li>
          </ul>
        </section>

        <section style={{ marginBottom: spacing.xl }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: spacing.sm,
              marginTop: 0,
            }}
          >
            {t('s3.title')}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>{rich('s3.p1')}</p>
        </section>

        <div
          style={{
            marginTop: spacing.xl,
            display: 'flex',
            gap: spacing.md,
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md">
              {t('backToHome')}
            </Button>
          </Link>
          <Link href="/privacy" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md">
              {t('privacyPolicy')}
            </Button>
          </Link>
          <Link href="/terms" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md">
              {t('termsOfService')}
            </Button>
          </Link>
        </div>
      </PageContent>
    </PageShell>
  );
}
