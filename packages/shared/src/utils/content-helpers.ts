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

/** Common prompt prefixes to strip for cleaner display titles */
const PROMPT_PREFIXES = [
  /^i\s+(?:want|need|would\s+like)\s+(?:to\s+)?/i,
  /^i\s+(?:want|need)\s+/i,
  /^i\'?d?\s+like\s+(?:to\s+)?/i,
  /^help\s+me\s+(?:to\s+)?/i,
  /^can\s+(?:you\s+)?(?:help\s+)?(?:me\s+)?/i,
  /^(?:to\s+)?(?:be|feel|get|have|stop|start)\s+/i,
];

/**
 * Convert raw user prompt/title into a premium display title.
 * Examples: "I want to stop smoke" → "Stop Smoking"; "morning confidence" → "Morning Confidence"
 */
export function toDisplayTitle(title: string): string {
  if (!title?.trim()) return 'Untitled';
  let s = title.trim();
  for (const re of PROMPT_PREFIXES) {
    s = s.replace(re, '').trim();
    if (s) break;
  }
  if (!s) return 'Untitled';
  // Title case: capitalize first letter of each word
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Minimal item shape for display info (avoids importing ContentItem) */
export interface ContentDisplayInput {
  title?: string | null;
  description?: string | null;
  script?: string | null;
  status?: 'draft' | 'processing' | 'ready' | 'failed' | null;
  voiceUrl?: string | null;
  audioUrl?: string | null;
}

/** Result of getContentDisplayInfo for premium track cards */
export interface ContentDisplayInfo {
  displayTitle: string;
  subtitle: string | null;
  draftLabel: 'Untitled draft' | 'Draft in progress' | 'Needs review' | null;
}

/** Heuristic: title looks like raw prompt/script, not a polished library title */
function isNonsenseTitle(title: string): boolean {
  const s = (title ?? '').trim();
  if (!s || s.length < 2) return true;
  if (s.length > 80) return true; // Raw script/prompt spillover
  if (s.includes('\n')) return true; // Multi-line = not a title
  if (/^[\d\s\-_:;.,]+$/.test(s)) return true; // Mostly punctuation/numbers
  return false;
}

/**
 * Get display-ready title, subtitle, and draft label for premium track library cards.
 * Never shows raw prompts or nonsense strings as polished titles.
 */
export function getContentDisplayInfo(item: ContentDisplayInput): ContentDisplayInfo {
  const title = (item.title ?? '').trim();
  const desc = (item.description ?? '').trim();
  const status = item.status;
  const hasAudio = !!(item.voiceUrl ?? item.audioUrl);
  const hasScript = !!(item.script?.trim());

  let draftLabel: ContentDisplayInfo['draftLabel'] = null;
  if (status === 'failed') {
    draftLabel = 'Needs review';
  } else if (status === 'draft') {
    if (!title || isNonsenseTitle(title)) draftLabel = 'Untitled draft';
    else if (!hasAudio && !hasScript) draftLabel = 'Draft in progress';
    else draftLabel = 'Draft in progress';
  }

  let displayTitle: string;
  if (!title || isNonsenseTitle(title)) {
    displayTitle = draftLabel === 'Untitled draft' ? 'Untitled draft' : 'Untitled';
  } else {
    displayTitle = toDisplayTitle(title);
  }

  // Subtitle: description if present and not duplicating title
  const subtitle =
    desc && desc.toLowerCase() !== displayTitle.toLowerCase() ? desc : null;

  return { displayTitle, subtitle, draftLabel };
}
