'use client';

import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { PageShell, PageContent, Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';
import { LEGAL_CONFIG } from '@/config/legal';
import { useTranslations } from 'next-intl';

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: spacing.xl }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: spacing.sm,
          marginTop: 0,
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: 'inherit' }}>
        {children}
      </div>
    </section>
  );
}

function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <a
      href={href}
      style={{
        color: theme.colors.accent.tertiary,
        textDecoration: 'underline',
      }}
    >
      {children}
    </a>
  );
}

export function PrivacyContent() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const t = useTranslations('legal.privacy');
  const { entityName, contactEmail, lastUpdated, privacyEffectiveDate } =
    LEGAL_CONFIG;

  const rich = (key: string) =>
    t.rich(key, {
      email: (chunks) => (
        <LegalLink href={`mailto:${contactEmail}`}>{chunks}</LegalLink>
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
          style={{ marginBottom: spacing.xl, color: colors.text.tertiary ?? 'rgba(255,255,255,0.55)' }}
        >
          {t('lastUpdated', { lastUpdated, privacyEffectiveDate })}
        </Typography>

        <LegalSection title={t('s1.title')}>
          <p>{rich('s1.p1')}</p>
        </LegalSection>

        <LegalSection title={t('s2.title')}>
          <p>{t('s2.p1')}</p>
          <p>{t('s2.p2')}</p>
          <p>{t('s2.p3')}</p>
          <p>{t('s2.p4')}</p>
          <p>{t('s2.p5')}</p>
        </LegalSection>

        <LegalSection title={t('s3.title')}>
          <p>{t('s3.p1')}</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>{t('s3.li1')}</li>
            <li>{t('s3.li2')}</li>
            <li>{t('s3.li3')}</li>
            <li>{t('s3.li4')}</li>
            <li>{t('s3.li5')}</li>
            <li>{t('s3.li6')}</li>
            <li>{t('s3.li7')}</li>
          </ul>
        </LegalSection>

        <LegalSection title={t('s4.title')}>
          <p>{t('s4.p1')}</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>{t('s4.li1')}</li>
            <li>{t('s4.li2')}</li>
            <li>{t('s4.li3')}</li>
            <li>{t('s4.li4')}</li>
            <li>{t('s4.li5')}</li>
          </ul>
          <p>{t('s4.p2')}</p>
        </LegalSection>

        <LegalSection title={t('s5.title')}>
          <p>{t('s5.p1')}</p>
          <p>{t('s5.p2')}</p>
        </LegalSection>

        <LegalSection title={t('s6.title')}>
          <p>{t('s6.p1')}</p>
        </LegalSection>

        <LegalSection title={t('s7.title')}>
          <p>{t('s7.p1')}</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>{t('s7.li1')}</li>
            <li>{t('s7.li2')}</li>
            <li>{t('s7.li3')}</li>
            <li>{t('s7.li4')}</li>
            <li>{t('s7.li5')}</li>
            <li>{t('s7.li6')}</li>
          </ul>
          <p>{rich('s7.p2')}</p>
          <p>{t('s7.p3')}</p>
        </LegalSection>

        <LegalSection title={t('s8.title')}>
          <p>{t('s8.p1')}</p>
        </LegalSection>

        <LegalSection title={t('s9.title')}>
          <p>{t('s9.p1')}</p>
        </LegalSection>

        <LegalSection title={t('s10.title')}>
          <p>{rich('s10.p1')}</p>
        </LegalSection>

        <LegalSection title={t('s11.title')}>
          <p>{t('s11.p1')}</p>
        </LegalSection>

        <div style={{ marginTop: spacing.xl, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md">
              {t('backToHome')}
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
