'use client';

import React from 'react';
import { PlaceholderPage } from '@/components';

const RITUAL_STEPS = [
  'init', 'values', 'strengths', 'goals', 'patterns',
  'tone', 'language', 'script', 'review', 'record', 'enhance', 'complete'
];

export default function RitualsCreatePage() {
  return (
    <PlaceholderPage
      title="Create Ritual"
      description={`Steps: ${RITUAL_STEPS.join(', ')}`}
      backHref="/sanctuary/rituals"
    />
  );
}
