'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { Typography } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';
import { VoiceLibrary } from '@/components/voices';

export default function VoiceLibraryPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium">
      <PageContent width="medium">
        <VoiceLibrary />
      </PageContent>
    </PageShell>
  );
}
