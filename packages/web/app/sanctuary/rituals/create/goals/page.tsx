'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { Heart, Brain, Zap, Users, Shield, Sun, Leaf, Star, Check } from 'lucide-react';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';

interface Goal {
  id: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  description: string;
  color: string;
}

const GOALS: Goal[] = [
  { id: 'confidence', icon: Star, label: 'Confidence', description: 'Build unshakeable self-belief', color: '#f59e0b' },
  { id: 'health', icon: Heart, label: 'Health & Vitality', description: 'Honour and strengthen your body', color: '#fb7185' },
  { id: 'focus', icon: Brain, label: 'Focus & Clarity', description: 'Cut through noise and distraction', color: '#60a5fa' },
  { id: 'energy', icon: Zap, label: 'Energy & Motivation', description: 'Access your inner drive', color: '#f97316' },
  { id: 'relationships', icon: Users, label: 'Relationships', description: 'Deepen connection and love', color: '#c084fc' },
  { id: 'peace', icon: Leaf, label: 'Inner Peace', description: 'Cultivate calm and equanimity', color: '#34d399' },
  { id: 'resilience', icon: Shield, label: 'Resilience', description: 'Bounce back stronger', color: '#a78bfa' },
  { id: 'purpose', icon: Sun, label: 'Purpose & Meaning', description: 'Align with what matters most', color: '#fbbf24' },
];

export default function RitualCreateGoalsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { setCurrentStep, setIntent } = useContentCreation();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setCurrentStep('intent');
  }, [setCurrentStep]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    const goalLabels = GOALS.filter((g) => selected.includes(g.id)).map((g) => g.label);
    setIntent(`Goals: ${goalLabels.join(', ')}`);
    router.push('/create/conversation');
  };

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: spacing.xl, textAlign: 'center' }}
      >
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          Set Your Goals
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary }}>
          Choose up to 3 areas you want your ritual to address
        </Typography>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: spacing.md,
          marginBottom: spacing.xl,
        }}
      >
        {GOALS.map((goal, index) => {
          const isSelected = selected.includes(goal.id);
          const Icon = goal.icon;

          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggle(goal.id)}
              style={{
                padding: spacing.lg,
                borderRadius: borderRadius.xl,
                background: isSelected
                  ? `linear-gradient(145deg, ${goal.color}25, ${colors.glass.light})`
                  : colors.glass.light,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${isSelected ? goal.color + '60' : colors.glass.border}`,
                boxShadow: isSelected ? `0 8px 24px ${goal.color}25` : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative',
                transform: isSelected ? 'translateY(-2px)' : 'none',
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: spacing.sm,
                    right: spacing.sm,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: goal.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={12} color="#fff" strokeWidth={3} />
                </div>
              )}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: borderRadius.md,
                  background: `${goal.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.md,
                }}
              >
                <Icon size={20} color={goal.color} strokeWidth={2} />
              </div>
              <Typography variant="h4" style={{ color: colors.text.primary, margin: 0, marginBottom: spacing.xs }}>
                {goal.label}
              </Typography>
              <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 12 }}>
                {goal.description}
              </Typography>
            </motion.button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <Typography variant="small" style={{ color: colors.text.secondary, textAlign: 'center', display: 'block', marginBottom: spacing.md }}>
          {selected.length} goal{selected.length > 1 ? 's' : ''} selected
        </Typography>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/sanctuary/rituals/create/init" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="md" style={{ color: colors.text.secondary }}>
            ← Back
          </Button>
        </Link>
        <Button
          variant="primary"
          size="lg"
          disabled={selected.length === 0}
          onClick={handleContinue}
          style={{ background: selected.length > 0 ? colors.gradients.primary : colors.glass.medium }}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
