/**
 * Content type helpers - shared across platforms
 */

import type { ContentItemType } from '../types/content';

export type ContentTypeBadgeVariant = 'default' | 'success' | 'info';

/**
 * Parsed ritual script sections (Arrival, Regulation, Encoding, Repetition, Closure).
 * Used when ritual script uses the structured 5-part format.
 */
export interface RitualSections {
  arrival?: string;
  regulation?: string;
  encoding?: string;
  repetition?: string;
  closure?: string;
  /** Raw script when parsing yields no sections (backward compatibility) */
  raw?: string;
}

const RITUAL_SECTION_HEADERS = ['arrival', 'regulation', 'encoding', 'repetition', 'closure'] as const;

/**
 * Parse a ritual script into structured sections.
 * Forgiving: matches "Arrival", "arrival", "## Arrival", "# Arrival" etc.
 * Returns structured sections when headers are found; otherwise returns { raw: script }.
 */
export function parseRitualSections(script: string): RitualSections {
  const trimmed = script.trim();
  if (!trimmed) return { raw: '' };

  const result: RitualSections = {};
  const headerRegex = /^(?:#+\s*)?(arrival|regulation|encoding|repetition|closure)\s*$/im;

  const lines = trimmed.split('\n');
  let currentSection: keyof RitualSections | null = null;
  const currentContent: string[] = [];

  const flush = () => {
    if (currentSection && currentSection !== 'raw' && currentContent.length > 0) {
      const text = currentContent.join('\n').trim();
      if (text) (result as Record<string, string>)[currentSection!] = text;
    }
    currentContent.length = 0;
  };

  for (const line of lines) {
    const headerMatch = line.match(headerRegex);
    if (headerMatch) {
      flush();
      const key = headerMatch[1].toLowerCase() as (typeof RITUAL_SECTION_HEADERS)[number];
      currentSection = key;
      continue;
    }
    if (currentSection) {
      currentContent.push(line);
    } else {
      currentContent.push(line);
    }
  }
  flush();

  const hasAnySection = RITUAL_SECTION_HEADERS.some((h) => result[h]);
  if (!hasAnySection) return { raw: trimmed };

  return result;
}

/**
 * Check if a ritual script has parseable sections.
 */
export function hasRitualSections(script: string): boolean {
  const parsed = parseRitualSections(script);
  return RITUAL_SECTION_HEADERS.some((h) => (parsed as RitualSections)[h]);
}

/** Display-friendly section for UI (label + content) */
export interface RitualSectionDisplay {
  label: string;
  content: string;
}

/**
 * Convert parsed ritual sections to an ordered array for display.
 */
export function getRitualSectionsForDisplay(parsed: RitualSections): RitualSectionDisplay[] {
  const order: (keyof RitualSections)[] = ['arrival', 'regulation', 'encoding', 'repetition', 'closure'];
  const labels: Record<string, string> = {
    arrival: 'Arrival',
    regulation: 'Regulation',
    encoding: 'Encoding',
    repetition: 'Repetition',
    closure: 'Closure',
  };
  return order
    .filter((k) => parsed[k] && typeof parsed[k] === 'string')
    .map((k) => ({ label: labels[k as string], content: (parsed[k] as string).trim() }));
}

export function getContentTypeBadgeVariant(type: ContentItemType): ContentTypeBadgeVariant {
  switch (type) {
    case 'ritual':
      return 'default';
    case 'affirmation':
      return 'success';
    case 'meditation':
      return 'info';
    default:
      return 'default';
  }
}
