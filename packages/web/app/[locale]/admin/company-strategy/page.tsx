'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { Compass, Layers, DollarSign, RefreshCw, Map, PiggyBank, Shield, AlertTriangle, Target } from 'lucide-react';
import { PageShell, SuperAdminGate, GlassCard, Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import {
  strategyLayers,
  revenueLayers,
  flywheelSteps,
  roadmapPhases,
  capitalAllocationBuckets,
  accessArchitectureItems,
  checkpointItems,
  riskItems,
  currentPosition,
} from '@/lib/admin/company-strategy-data';
import {
  StrategyLayerCard,
  FlywheelDiagram,
  RoadmapPhaseCard,
  CapitalAllocationGrid,
  ImpactArchitectureSection,
  StrategicCheckpointList,
  RiskMitigationList,
  NextMovesSection,
} from '@/components/admin/strategy';
import { Badge } from '@/components';

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <div style={{ marginBottom: spacing.lg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
        <Icon size={22} color={colors.accent.primary} />
        <Typography variant="h3" style={{ color: colors.text.primary }}>
          {title}
        </Typography>
      </div>
      {subtitle && (
        <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.5 }}>
          {subtitle}
        </Typography>
      )}
    </div>
  );
}

function RevenueLayerCard({
  layer,
}: {
  layer: (typeof revenueLayers)[0];
}) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const timingVariant = layer.timing === 'now' ? 'accent' : layer.timing === 'next' ? 'info' : 'default';
  const marginLabel = layer.marginSignal === 'high' ? 'High' : layer.marginSignal === 'medium' ? 'Med' : 'Low';

  return (
    <div
      style={{
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        background: colors.glass.light,
        border: `1px solid ${colors.glass.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm }}>
        <Typography variant="h4" style={{ color: colors.text.primary }}>
          {layer.label}
        </Typography>
        <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
          <Badge variant={timingVariant} size="sm">
            {layer.timing}
          </Badge>
          <Badge variant="outline" size="sm">
            Margin: {marginLabel}
          </Badge>
        </div>
      </div>
      <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.5 }}>
        {layer.description}
      </Typography>
      <Typography variant="small" style={{ color: colors.text.tertiary, lineHeight: 1.4 }}>
        <strong>Why pay:</strong> {layer.whyPay}
      </Typography>
      <Typography variant="small" style={{ color: colors.text.tertiary, lineHeight: 1.4 }}>
        <strong>Business value:</strong> {layer.businessValue}
      </Typography>
    </div>
  );
}

export default function CompanyStrategyPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <SuperAdminGate>
      <PageShell intensity="medium" bare allowDocumentScroll>
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: spacing.xxl, paddingBottom: spacing.xxl }}>
          <div style={{ marginBottom: spacing.xxl }}>
            <Link
              href="/admin"
              style={{
                color: colors.accent.tertiary,
                fontSize: 14,
                textDecoration: 'none',
                marginBottom: spacing.sm,
                display: 'inline-block',
              }}
            >
              ← Admin
            </Link>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}>
              Company Strategy / Master Plan
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Internal strategic command map — company thesis, scale logic, economic engine, and phase roadmap.
            </Typography>
          </div>

          {/* 1. North Star / Executive Thesis */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xxl }}>
            <SectionHeader
              icon={Compass}
              title="North Star / Executive Thesis"
              subtitle="What waQup is as a company and what it is building toward."
            />
            <div
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.md,
                background: `${colors.accent.primary}10`,
                border: `1px solid ${colors.accent.primary}25`,
              }}
            >
              <Typography variant="bodyBold" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
                waQup is not just an app. waQup is a company building an identity transformation and inner-development platform.
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6, marginBottom: spacing.md }}>
                Core progression: Personal transformation product → Premium monetization engine → Creator / practitioner distribution →
                Partner / institutional distribution → Wider access infrastructure → Platform-level global scale.
              </Typography>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                <Badge variant="accent" size="sm">
                  Current stage: Phase 1 — Prove Core Transformation
                </Badge>
                <Badge variant="info" size="sm">
                  Next horizon: Retention + monetization stabilization
                </Badge>
              </div>
            </div>
          </GlassCard>

          {/* 2. Strategic Stack */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xxl }}>
            <SectionHeader
              icon={Layers}
              title="Strategic Stack"
              subtitle="waQup is building more than a single app. Six layers from product to platform advantage."
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {strategyLayers.map((layer) => (
                <StrategyLayerCard key={layer.number} layer={layer} />
              ))}
            </div>
          </GlassCard>

          {/* 3. Economic Engine */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xxl }}>
            <SectionHeader
              icon={DollarSign}
              title="Economic Engine"
              subtitle="How the company makes money and compounds it over time."
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: spacing.md,
              }}
            >
              {revenueLayers.map((layer) => (
                <RevenueLayerCard key={layer.label} layer={layer} />
              ))}
            </div>
          </GlassCard>

          {/* 4. Scale Flywheel */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xxl }}>
            <SectionHeader
              icon={RefreshCw}
              title="Scale Flywheel"
              subtitle="Company compounding logic — transformative UX feeds retention, monetization, distribution, and ecosystem strength."
            />
            <div style={{ maxWidth: 400 }}>
              <FlywheelDiagram steps={flywheelSteps} />
            </div>
          </GlassCard>

          {/* 5. Phase Roadmap */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xxl }}>
            <SectionHeader
              icon={Map}
              title="Phase Roadmap"
              subtitle="Company phases, not just app features. Each phase has a gate condition and major risk."
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              {roadmapPhases.map((phase) => (
                <RoadmapPhaseCard key={phase.phase} phase={phase} />
              ))}
            </div>
          </GlassCard>

          {/* 6. Capital Allocation Logic */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xxl }}>
            <SectionHeader
              icon={PiggyBank}
              title="Capital Allocation Logic"
              subtitle="Strategic resource allocation model — where to reinvest for long-term growth."
            />
            <CapitalAllocationGrid buckets={capitalAllocationBuckets} />
          </GlassCard>

          {/* 7. Access / Impact Architecture */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xxl }}>
            <SectionHeader
              icon={Shield}
              title="Access / Impact Architecture"
              subtitle="How the company expands access beyond premium users — premium funds innovation; creator/partner layers increase distribution; access expansion becomes possible later."
            />
            <ImpactArchitectureSection items={accessArchitectureItems} />
          </GlassCard>

          {/* 8. Strategic Checkpoints */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xxl }}>
            <SectionHeader
              icon={Target}
              title="Strategic Checkpoints"
              subtitle="What must be true before advancing. Gate conditions and proof points."
            />
            <StrategicCheckpointList items={checkpointItems} />
          </GlassCard>

          {/* 9. Risk / Failure Modes */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xxl }}>
            <SectionHeader
              icon={AlertTriangle}
              title="Risk / Failure Modes"
              subtitle="Major company-level risks and mitigation directions."
            />
            <RiskMitigationList items={riskItems} />
          </GlassCard>

          {/* 10. Current Position / Next Moves */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xl }}>
            <SectionHeader
              icon={Target}
              title="Current Position / Next Moves"
              subtitle="Where waQup is now, what phase it is in, and what the next strategic moves are."
            />
            <NextMovesSection data={currentPosition} />
          </GlassCard>
        </div>
      </PageShell>
    </SuperAdminGate>
  );
}
