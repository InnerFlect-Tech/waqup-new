import React from 'react';

// All sanctuary pages require auth/Supabase — opt out of static generation.
export const dynamic = 'force-dynamic';

export default function SanctuaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
