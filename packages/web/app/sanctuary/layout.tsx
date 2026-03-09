import React from 'react';
import { WellnessDisclaimer } from '@/components/legal/WellnessDisclaimer';
import { spacing, PAGE_PADDING } from '@/theme';

// All sanctuary pages require auth/Supabase — opt out of static generation.
export const dynamic = 'force-dynamic';

export default function SanctuaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div style={{ padding: `0 ${PAGE_PADDING} ${spacing.xl}`, display: 'flex', justifyContent: 'center' }}>
        <WellnessDisclaimer />
      </div>
    </>
  );
}
