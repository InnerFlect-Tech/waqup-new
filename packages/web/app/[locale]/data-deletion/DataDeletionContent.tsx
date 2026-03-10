'use client';

import { Link } from '@/i18n/navigation';
import { PageShell, PageContent, Typography, Button } from '@/components';
import { spacing, useTheme } from '@/theme';
import { LEGAL_CONFIG } from '@/config/legal';

export function DataDeletionContent() {
  const { theme } = useTheme();
  const accentColor = theme.colors.accent.tertiary;
  const { entityName, contactEmail } = LEGAL_CONFIG;

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
          User Data Deletion
        </Typography>
        <Typography
          variant="body"
          style={{ marginBottom: spacing.xl, opacity: 0.75 }}
        >
          {entityName} respects your right to delete your data. Here is how you
          can request deletion.
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
            Delete your waQup account
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            You can delete your account and all associated data at any time from
            the app:
          </p>
          <ol style={{ paddingLeft: 20, marginTop: 8, fontSize: 14, lineHeight: 1.7 }}>
            <li>Open waQup (web or mobile)</li>
            <li>Go to Sanctuary → Settings</li>
            <li>Select &quot;Delete account&quot;</li>
            <li>Confirm the deletion</li>
          </ol>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 12 }}>
            After deletion, we remove or anonymize your data within 30 days,
            except where we must retain it for legal, tax, or fraud-prevention
            purposes.
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
            Revoke third‑party permissions
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            If you connected Facebook, Instagram, or Google to waQup, you can
            revoke access from your account settings on those platforms:
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 8, fontSize: 14, lineHeight: 1.7 }}>
            <li>
              <strong>Facebook/Instagram:</strong> Settings → Apps and Websites →
              waQup → Remove
            </li>
            <li>
              <strong>Google:</strong> Security → Third-party access → waQup →
              Revoke
            </li>
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
            Request deletion by email
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            To request manual deletion of your data, contact us at{' '}
            <a
              href={`mailto:${contactEmail}`}
              style={{ color: accentColor, textDecoration: 'underline' }}
            >
              {contactEmail}
            </a>
            . Include the email address associated with your waQup account. We
            will respond within 30 days and delete your data in accordance with
            our{' '}
            <Link href="/privacy" style={{ color: accentColor, textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
            .
          </p>
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
              Back to Home
            </Button>
          </Link>
          <Link href="/privacy" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md">
              Privacy Policy
            </Button>
          </Link>
          <Link href="/terms" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="md">
              Terms of Service
            </Button>
          </Link>
        </div>
      </PageContent>
    </PageShell>
  );
}
