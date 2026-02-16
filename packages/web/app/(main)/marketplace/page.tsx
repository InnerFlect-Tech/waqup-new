'use client';

import React from 'react';
import { PlaceholderPage } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export default function MarketplacePage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PlaceholderPage
      title="Marketplace"
      description="Discover, search, and browse content. (Stub — Phase 14.1)"
      backHref="/home"
    >
      <div style={{ marginTop: spacing.lg }}>
        <Link href="/marketplace/creator" style={{ textDecoration: 'none' }}>
          <Button variant="outline" size="md">
            Creator dashboard
          </Button>
        </Link>
      </div>
    </PlaceholderPage>
  );
}
