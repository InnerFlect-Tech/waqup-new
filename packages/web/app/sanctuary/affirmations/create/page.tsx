'use client';

import React from 'react';
import { PlaceholderPage } from '@/components';

const AFFIRMATION_STEPS = ['select', 'theme', 'voice', 'audio', 'mix', 'complete'];

export default function AffirmationsCreatePage() {
  return (
    <PlaceholderPage
      title="Create Affirmation"
      description={`Steps: ${AFFIRMATION_STEPS.join(', ')}`}
      backHref="/sanctuary/affirmations"
    />
  );
}
