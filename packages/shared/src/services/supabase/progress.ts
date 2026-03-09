import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContentItemType } from '../../types/content';
import type {
  ProgressStats,
  ProgressHeatmap,
  HeatmapDay,
  RecentSession,
  ReflectionEntry,
  ReflectionMessage,
  PracticeSession,
} from '../../types/progress';
import { xpToLevel, xpToNextLevel } from '../../types/progress';

export interface ProgressServiceResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

function mapReflectionRow(row: Record<string, unknown>): ReflectionEntry {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    energyLevel: (row.energy_level as number) ?? null,
    notes: (row.notes as string) ?? null,
    messages: (row.messages as ReflectionMessage[]) ?? [],
    aiSummary: (row.ai_summary as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapSessionRow(row: Record<string, unknown>): PracticeSession {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    contentItemId: (row.content_item_id as string) ?? null,
    contentType: row.content_type as ContentItemType,
    durationSeconds: (row.duration_seconds as number) ?? 0,
    playedAt: row.played_at as string,
  };
}

export function createProgressService(client: SupabaseClient) {
  async function getProgressStats(): Promise<ProgressServiceResult<ProgressStats>> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated', success: false };

      // Parameterless — uses auth.uid() internally (see migration 000011)
      const { data, error } = await client.rpc('get_progress_stats');

      if (error) return { data: null, error: error.message, success: false };

      const raw = data as {
        streak: number;
        totalSessions: number;
        minutesPracticed: number;
        contentCreated: number;
        totalXp: number;
        affirmationXp: number;
        meditationXp: number;
        ritualXp: number;
      };

      const level = xpToLevel(raw.totalXp);
      const xpToNext = xpToNextLevel(raw.totalXp);

      return {
        data: { ...raw, level, xpToNext },
        error: null,
        success: true,
      };
    } catch {
      return { data: null, error: 'Failed to fetch progress stats', success: false };
    }
  }

  async function getPracticeHeatmap(weeks = 16): Promise<ProgressServiceResult<ProgressHeatmap>> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated', success: false };

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - weeks * 7);

      const { data, error } = await client
        .from('practice_sessions')
        .select('played_at, content_type')
        .eq('user_id', user.id)
        .gte('played_at', startDate.toISOString())
        .lte('played_at', endDate.toISOString());

      if (error) return { data: null, error: error.message, success: false };

      // Count sessions and track type frequency per date
      const countByDate: Record<string, number> = {};
      const typeCountByDate: Record<string, Record<ContentItemType, number>> = {};

      for (const row of data ?? []) {
        const day = (row.played_at as string).slice(0, 10);
        countByDate[day] = (countByDate[day] ?? 0) + 1;

        const ct = row.content_type as ContentItemType;
        if (!typeCountByDate[day]) typeCountByDate[day] = { affirmation: 0, meditation: 0, ritual: 0 };
        typeCountByDate[day][ct] = (typeCountByDate[day][ct] ?? 0) + 1;
      }

      function dominantTypeForDay(day: string): ContentItemType | null {
        const counts = typeCountByDate[day];
        if (!counts) return null;
        let best: ContentItemType | null = null;
        let bestCount = 0;
        for (const [type, count] of Object.entries(counts) as [ContentItemType, number][]) {
          if (count > bestCount) { bestCount = count; best = type; }
        }
        return best;
      }

      // Build week grid
      const weekGrid: HeatmapDay[][] = [];
      const cursor = new Date(startDate);

      // Align start to Monday
      const dayOfWeek = cursor.getDay();
      const offsetToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
      cursor.setDate(cursor.getDate() + offsetToMonday);

      for (let w = 0; w < weeks; w++) {
        const week: HeatmapDay[] = [];
        for (let d = 0; d < 7; d++) {
          const dateStr = cursor.toISOString().slice(0, 10);
          const count = countByDate[dateStr] ?? 0;
          const intensity = (
            count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4
          ) as 0 | 1 | 2 | 3 | 4;
          week.push({ date: dateStr, count, intensity, dominantType: dominantTypeForDay(dateStr) });
          cursor.setDate(cursor.getDate() + 1);
        }
        weekGrid.push(week);
      }

      return {
        data: {
          weeks: weekGrid,
          startDate: startDate.toISOString().slice(0, 10),
          endDate: endDate.toISOString().slice(0, 10),
        },
        error: null,
        success: true,
      };
    } catch {
      return { data: null, error: 'Failed to fetch heatmap', success: false };
    }
  }

  async function getRecentSessions(limit = 7): Promise<ProgressServiceResult<RecentSession[]>> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated', success: false };

      const { data, error } = await client
        .from('practice_sessions')
        .select('content_type, duration_seconds, played_at, content_items(title)')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(limit);

      if (error) return { data: null, error: error.message, success: false };

      const sessions: RecentSession[] = (data ?? []).map((row) => {
        const joined = row as Record<string, unknown>;
        const titleSource = joined['content_items'] as { title: string } | null;
        return {
          contentType: joined['content_type'] as ContentItemType,
          title: titleSource?.title ?? null,
          durationSeconds: (joined['duration_seconds'] as number) ?? 0,
          playedAt: joined['played_at'] as string,
        };
      });

      return { data: sessions, error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to fetch recent sessions', success: false };
    }
  }

  async function getReflectionEntries(limit = 10): Promise<ProgressServiceResult<ReflectionEntry[]>> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated', success: false };

      const { data, error } = await client
        .from('reflection_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return { data: null, error: error.message, success: false };

      return {
        data: (data ?? []).map(mapReflectionRow),
        error: null,
        success: true,
      };
    } catch {
      return { data: null, error: 'Failed to fetch reflections', success: false };
    }
  }

  async function saveReflectionEntry(input: {
    energyLevel?: number;
    notes?: string;
    messages?: ReflectionMessage[];
    aiSummary?: string;
  }): Promise<ProgressServiceResult<ReflectionEntry>> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated', success: false };

      const { data, error } = await client
        .from('reflection_entries')
        .insert({
          user_id: user.id,
          energy_level: input.energyLevel ?? null,
          notes: input.notes ?? null,
          messages: input.messages ?? [],
          ai_summary: input.aiSummary ?? null,
        })
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };

      return { data: mapReflectionRow(data), error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to save reflection', success: false };
    }
  }

  async function insertPracticeSession(input: {
    contentItemId: string | null;
    contentType: ContentItemType;
    durationSeconds?: number;
  }): Promise<ProgressServiceResult<PracticeSession>> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated', success: false };

      const { data, error } = await client
        .from('practice_sessions')
        .insert({
          user_id: user.id,
          content_item_id: input.contentItemId,
          content_type: input.contentType,
          duration_seconds: input.durationSeconds ?? 0,
        })
        .select()
        .single();

      if (error) return { data: null, error: error.message, success: false };

      return { data: mapSessionRow(data), error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to insert practice session', success: false };
    }
  }

  return {
    getProgressStats,
    getPracticeHeatmap,
    getRecentSessions,
    getReflectionEntries,
    saveReflectionEntry,
    insertPracticeSession,
  };
}
