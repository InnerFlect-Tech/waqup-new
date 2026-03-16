/**
 * Playback plan — timing and repetition engine for ritual audio.
 *
 * Calculates how many voice repetitions fit a target duration,
 * with configurable spacing between repeats.
 */

/** Output of buildPlaybackPlan — used by playback to schedule voice segments */
export interface PlaybackPlan {
  /** Number of times to play the voice track */
  repeatCount: number;
  /** Total duration in ms (voice segments + spacing; no trailing silence) */
  totalDurationMs: number;
  /** Duration of one voice playback in ms */
  voiceDurationMs: number;
  /** Spacing between repeats in ms */
  spacingMs: number;
  /** Segment structure: [voiceMs, pauseMs, voiceMs, pauseMs, ...] — length = 2*repeatCount - 1 (no trailing pause) */
  segmentDurations: number[];
}

const DEFAULT_SPACING_SECONDS = 3;

/**
 * Builds a playback plan for ritual audio with target duration and repetition.
 *
 * Algorithm:
 *   cycleMs = voiceDurationMs + spacingMs
 *   repeatCount = max(1, ceil(targetDurationMs / cycleMs))
 *   totalDurationMs = repeatCount * cycleMs - spacingMs  (no trailing silence)
 *
 * @param voiceDurationMs - Duration of the voice track in ms
 * @param targetDurationMinutes - Target total ritual duration (5, 10, 20, etc.)
 * @param spacingSeconds - Pause between repeats in seconds (default 3)
 */
export function buildPlaybackPlan(
  voiceDurationMs: number,
  targetDurationMinutes: number,
  spacingSeconds = DEFAULT_SPACING_SECONDS
): PlaybackPlan {
  const spacingMs = spacingSeconds * 1000;
  const targetDurationMs = targetDurationMinutes * 60 * 1000;

  const cycleMs = voiceDurationMs + spacingMs;
  const repeatCount = Math.max(1, Math.ceil(targetDurationMs / cycleMs));
  const totalDurationMs = repeatCount * cycleMs - spacingMs;

  const segmentDurations: number[] = [];
  for (let i = 0; i < repeatCount; i++) {
    segmentDurations.push(voiceDurationMs);
    if (i < repeatCount - 1) {
      segmentDurations.push(spacingMs);
    }
  }

  return {
    repeatCount,
    totalDurationMs,
    voiceDurationMs,
    spacingMs,
    segmentDurations,
  };
}

/**
 * Parses a duration string like "5 min", "10 min", "20 min" to minutes.
 * Returns null if unparseable.
 */
export function parseDurationStringToMinutes(durationStr: string | null | undefined): number | null {
  if (!durationStr || typeof durationStr !== 'string') return null;
  const trimmed = durationStr.trim().toLowerCase();
  const match = trimmed.match(/^(\d+)\s*(min|minute|minutes?)?$/);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Preset target durations in minutes for ritual audio */
export const TARGET_DURATION_PRESETS = [5, 10, 15, 20] as const;

export type TargetDurationPreset = (typeof TARGET_DURATION_PRESETS)[number];
