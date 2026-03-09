'use client';

import React, { useState } from 'react';
import { Typography, Button, Input } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';

export interface ContentEditPageProps {
  title: string;
  description: string;
  script: string;
  backHref: string;
  contentType: string;
  onSave?: (data: { title: string; description: string; script: string }) => void;
}

export function ContentEditPage({
  title: initialTitle,
  description: initialDescription,
  script: initialScript,
  backHref,
  contentType,
  onSave,
}: ContentEditPageProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [script, setScript] = useState(initialScript);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    setSaveError(null);
    try {
      await onSave({ title, description, script });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell intensity="medium">
      <PageContent width="medium">
        <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
          Edit {contentType}
        </Typography>
        <Typography variant="body" style={{ marginBottom: spacing.xl, color: colors.text.secondary }}>
          Update the details of your {contentType}.
        </Typography>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg,
            marginBottom: spacing.xl,
          }}
        >
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
          <div style={{ marginBottom: spacing.md }}>
            <Typography variant="captionBold" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              Script
            </Typography>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Enter script..."
              rows={8}
              style={{
                width: '100%',
                padding: spacing.md,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.glass.border}`,
                background: colors.glass.light,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                fontSize: '14px',
                color: colors.text.primary,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        {saveError && (
          <Typography variant="small" style={{ color: colors.error, marginBottom: spacing.md }}>
            {saveError}
          </Typography>
        )}
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Link href={backHref} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="md" disabled={saving}>
              Cancel
            </Button>
          </Link>
          <Button
            variant="primary"
            size="md"
            loading={saving}
            onClick={handleSave}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </PageContent>
    </PageShell>
  );
}
