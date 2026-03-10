'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/theme';

export interface MermaidDiagramProps {
  chart: string;
  id?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function MermaidDiagram({ chart, id: propId, style, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const colors = theme.colors;
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const id = propId ?? `mermaid-${Math.random().toString(36).slice(2, 9)}`;

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: colors.accent.primary,
            primaryTextColor: colors.text.primary,
            primaryBorderColor: colors.accent.tertiary,
            lineColor: colors.text.secondary,
            secondaryColor: colors.background.secondary,
            tertiaryColor: colors.glass.light,
          },
        });
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(rendered);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    }
    render();
    return () => { cancelled = true; };
  }, [chart, id, colors]);

  if (error) {
    return (
      <div style={{ padding: 16, background: `${colors.error}1a`, border: `1px solid ${colors.error}66`, borderRadius: 8, fontSize: 13, ...style }} className={className}>
        Diagram error: {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div ref={containerRef} style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }} className={className}>
        <span style={{ color: colors.text.secondary, fontSize: 13 }}>Loading diagram…</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ display: 'flex', justifyContent: 'center', ...style }}
      className={className}
    />
  );
}
