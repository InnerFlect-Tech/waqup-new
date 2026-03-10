/**
 * Date formatting utilities shared across web and mobile.
 * Uses Intl for locale-aware formatting.
 */

export interface FormatDateOptions {
  /** Include year in output. Default: true */
  includeYear?: boolean;
  /** Locale for Intl. Default: 'en-GB' */
  locale?: string;
  /** Fallback when iso is null/undefined. Default: '—' */
  fallback?: string;
  /** Month only (e.g. "Jan"). Default: false */
  monthOnly?: boolean;
  /** Weekday + short date (e.g. "Mon, Jan 15"). Default: false */
  weekdayShort?: boolean;
  /** Month and year only (e.g. "March 2025"). Default: false */
  monthYearOnly?: boolean;
}

/**
 * Format an ISO date string for display.
 */
export function formatDate(
  iso?: string | null,
  opts: FormatDateOptions = {}
): string {
  if (iso == null || iso === '') return opts.fallback ?? '—';
  const { includeYear = true, locale = 'en-GB', monthOnly = false, weekdayShort = false, monthYearOnly = false } = opts;
  const d = new Date(iso);
  if (monthOnly) {
    return d.toLocaleDateString(locale, { month: 'short' });
  }
  if (monthYearOnly) {
    return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }
  if (weekdayShort) {
    return d.toLocaleDateString(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
  return d.toLocaleDateString(locale, {
    day: includeYear ? '2-digit' : 'numeric',
    month: 'short',
    year: includeYear ? 'numeric' : undefined,
  });
}

export interface FormatDateRelativeOptions {
  /** Include year in the date part when beyond threshold. Default: true */
  includeYearInDate?: boolean;
  /** Fallback when iso is null/undefined. Default: '—' */
  fallback?: string;
  /** Use compact style (Nd ago, Nw ago). Default: false */
  compact?: boolean;
}

/**
 * Format as relative (Today, Yesterday, N days ago) or absolute date.
 */
export function formatDateRelative(
  iso?: string | null,
  opts: FormatDateRelativeOptions = {}
): string {
  if (iso == null || iso === '') return opts.fallback ?? '—';
  const { includeYearInDate = true, compact = false } = opts;
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return compact ? `${diffDays}d ago` : `${diffDays} days ago`;
  if (diffDays < 30) return compact ? `${Math.floor(diffDays / 7)}w ago` : `${Math.floor(diffDays / 7)} weeks ago`;

  return formatDate(iso, { includeYear: includeYearInDate && diffDays > 365 });
}
