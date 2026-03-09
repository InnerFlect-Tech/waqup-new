'use client';

import React from 'react';
import { Typography, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import Link from 'next/link';

export default function SystemPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <SuperAdminGate>
    <PageShell intensity="medium" bare>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>
        <div style={{ marginBottom: spacing.xl }}>
          <Typography
            variant="h1"
            style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}
          >
            waQup System Documentation
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Technical overview of database schema, architecture, and data flow. For developers and technical stakeholders.
          </Typography>
        </div>

        {/* Architecture Overview */}
        <Section title="Architecture Overview" colors={colors}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            waQup is a monorepo with shared business logic and platform-specific UI:
          </Typography>
          <pre
            style={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: colors.background.secondary,
              border: `1px solid ${colors.glass.border}`,
              overflow: 'auto',
              fontSize: '13px',
              color: colors.text.secondary,
            }}
          >
{`waqup-new/
├── packages/
│   ├── shared/     # Business logic, services, types, schemas
│   ├── mobile/     # React Native + Expo (Android, iOS)
│   └── web/        # Next.js (desktop browsers, PWA)
├── supabase/       # Migrations, seed, config (single source of truth)
│   ├── migrations/
│   └── seed.sql
└── docs/`}
          </pre>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md }}>
            Backend: Supabase (Postgres, Auth, Storage). Same API locally and in production; only env vars differ.
          </Typography>
        </Section>

        {/* ER Diagram */}
        <Section title="Database Schema (ER Diagram)" colors={colors}>
          <div
            style={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: colors.background.secondary,
              border: `1px solid ${colors.glass.border}`,
              overflow: 'auto',
            }}
          >
            <pre style={{ fontSize: '12px', color: colors.text.secondary, margin: 0 }}>
{`erDiagram
    auth_users {
        uuid id PK
        string email
        string encrypted_password
        timestamptz created_at
        timestamptz updated_at
    }

    content_items {
        uuid id PK
        uuid user_id FK
        text type "affirmation|meditation|ritual"
        text title
        text description
        text script
        text duration
        text frequency
        text status "draft|complete"
        timestamptz last_played_at
        text audio_url
        text voice_type
        jsonb audio_settings
        timestamptz created_at
        timestamptz updated_at
    }

    auth_users ||--o{ content_items : "owns"
`}
            </pre>
          </div>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm, fontSize: '13px' }}>
            Future tables (Phases 9–14): profiles, credit_transactions, conversations, marketplace_*.
          </Typography>
        </Section>

        {/* content_items Table Detail */}
        <Section title="content_items Table" colors={colors}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
            Unified table for affirmations, meditations, and rituals. RLS: users can only access their own rows.
          </Typography>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              color: colors.text.secondary,
            }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                <th style={{ textAlign: 'left', padding: spacing.sm, color: colors.text.primary }}>Column</th>
                <th style={{ textAlign: 'left', padding: spacing.sm, color: colors.text.primary }}>Type</th>
                <th style={{ textAlign: 'left', padding: spacing.sm, color: colors.text.primary }}>Constraints</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                <td style={{ padding: spacing.sm }}>id</td>
                <td style={{ padding: spacing.sm }}>uuid</td>
                <td style={{ padding: spacing.sm }}>PK, default gen_random_uuid()</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                <td style={{ padding: spacing.sm }}>user_id</td>
                <td style={{ padding: spacing.sm }}>uuid</td>
                <td style={{ padding: spacing.sm }}>FK → auth.users(id), NOT NULL</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                <td style={{ padding: spacing.sm }}>type</td>
                <td style={{ padding: spacing.sm }}>text</td>
                <td style={{ padding: spacing.sm }}>affirmation | meditation | ritual</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                <td style={{ padding: spacing.sm }}>title, description, script</td>
                <td style={{ padding: spacing.sm }}>text</td>
                <td style={{ padding: spacing.sm }}>description default &apos;&apos;</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                <td style={{ padding: spacing.sm }}>duration, frequency</td>
                <td style={{ padding: spacing.sm }}>text</td>
                <td style={{ padding: spacing.sm }}>duration default &apos;&apos;</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                <td style={{ padding: spacing.sm }}>status</td>
                <td style={{ padding: spacing.sm }}>text</td>
                <td style={{ padding: spacing.sm }}>draft | complete, default draft</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                <td style={{ padding: spacing.sm }}>audio_url, voice_type</td>
                <td style={{ padding: spacing.sm }}>text</td>
                <td style={{ padding: spacing.sm }}>nullable</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                <td style={{ padding: spacing.sm }}>audio_settings</td>
                <td style={{ padding: spacing.sm }}>jsonb</td>
                <td style={{ padding: spacing.sm }}>nullable (volumeVoice, volumeAmbient, volumeMaster)</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                <td style={{ padding: spacing.sm }}>last_played_at, created_at, updated_at</td>
                <td style={{ padding: spacing.sm }}>timestamptz</td>
                <td style={{ padding: spacing.sm }}>updated_at auto-updated via trigger</td>
              </tr>
            </tbody>
          </table>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm, fontSize: '13px' }}>
            Indexes: content_items_user_id_idx, content_items_user_type_idx. RLS policies: view, create, update, delete own content.
          </Typography>
        </Section>

        {/* Data Flow */}
        <Section title="Data Flow" colors={colors}>
          <pre
            style={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: colors.background.secondary,
              border: `1px solid ${colors.glass.border}`,
              fontSize: '13px',
              color: colors.text.secondary,
            }}
          >
{`User → Supabase Auth (login/signup)
     → createSupabaseClient (shared)
     → content service (getUserContent, createContent, updateContent, deleteContent)
     → content_items table (RLS enforces user_id = auth.uid())

OAuth: /auth/callback exchanges code for session, sets cookies.`}
          </pre>
        </Section>

        {/* Migrations */}
        <Section title="Migrations" colors={colors}>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
            Single source of truth: <code style={{ background: colors.background.secondary, padding: `${spacing.xs} ${spacing.sm}`, borderRadius: borderRadius.sm }}>supabase/migrations/</code>
          </Typography>
          <ul style={{ color: colors.text.secondary, fontSize: '14px', paddingLeft: spacing.lg, marginBottom: spacing.sm }}>
            <li>20260308000000_create_content_items.sql — table, indexes, triggers, RLS</li>
            <li>20260308000001_add_audio_columns.sql — audio_url, voice_type, audio_settings</li>
          </ul>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '13px' }}>
            Local: <code style={{ background: colors.background.secondary, padding: `${spacing.xs} ${spacing.sm}`, borderRadius: borderRadius.sm }}>supabase db reset</code>. Deploy: <code style={{ background: colors.background.secondary, padding: `${spacing.xs} ${spacing.sm}`, borderRadius: borderRadius.sm }}>supabase db push</code>. Verify: <code style={{ background: colors.background.secondary, padding: `${spacing.xs} ${spacing.sm}`, borderRadius: borderRadius.sm }}>npm run supabase:diff</code>.
          </Typography>
        </Section>

        <div style={{ marginTop: spacing.xl, paddingTop: spacing.lg, borderTop: `1px solid ${colors.glass.border}`, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
          <Link
            href="/health"
            style={{ color: colors.accent.tertiary, fontSize: '14px', textDecoration: 'none' }}
          >
            🩺 API Health
          </Link>
        </div>
      </div>
    </PageShell>
    </SuperAdminGate>
  );
}

function Section({
  title,
  colors,
  children,
}: {
  title: string;
  colors: { text: { primary: string; secondary: string }; glass: { border: string }; background: { secondary: string } };
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: spacing.xl }}>
      <Typography
        variant="h2"
        style={{
          marginBottom: spacing.sm,
          color: colors.text.primary,
          fontSize: '1.25rem',
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      {children}
    </div>
  );
}
