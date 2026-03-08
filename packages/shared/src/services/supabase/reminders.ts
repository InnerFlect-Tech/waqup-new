import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserReminder, CreateReminderInput, UpdateReminderInput } from '../../types/reminder';

export interface RemindersServiceResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

function formatTimeFromDb(value: string): string {
  if (!value) return '09:00';
  const match = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    const h = match[1].padStart(2, '0');
    const m = match[2];
    return `${h}:${m}`;
  }
  return '09:00';
}

function mapRow(row: Record<string, unknown>): UserReminder {
  const daysRaw = row.days_of_week;
  const daysOfWeek = Array.isArray(daysRaw)
    ? (daysRaw as number[]).slice().sort((a, b) => a - b)
    : [1, 2, 3, 4, 5];
  return {
    id: row.id as string,
    label: (row.label as string) || 'Practice reminder',
    time: formatTimeFromDb(row.time as string),
    daysOfWeek,
    enabled: (row.enabled as boolean) ?? true,
    createdAt: (row.created_at as string) || undefined,
    updatedAt: (row.updated_at as string) || undefined,
  };
}

export function createRemindersService(client: SupabaseClient) {
  async function getUserReminders(): Promise<RemindersServiceResult<UserReminder[]>> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        return { data: [], error: null, success: true };
      }

      const { data, error } = await client
        .from('user_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('time', { ascending: true });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return {
        data: (data || []).map(mapRow),
        error: null,
        success: true,
      };
    } catch {
      return { data: null, error: 'Failed to fetch reminders', success: false };
    }
  }

  async function createReminder(
    input: CreateReminderInput
  ): Promise<RemindersServiceResult<UserReminder>> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        return { data: null, error: 'Not authenticated', success: false };
      }

      const days = (input.daysOfWeek?.length ? input.daysOfWeek : [1, 2, 3, 4, 5]).slice().sort((a, b) => a - b);

      const { data, error } = await client
        .from('user_reminders')
        .insert({
          user_id: user.id,
          label: input.label || 'Practice reminder',
          time: input.time,
          days_of_week: days,
          enabled: input.enabled ?? true,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: mapRow(data), error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to create reminder', success: false };
    }
  }

  async function updateReminder(
    id: string,
    input: UpdateReminderInput
  ): Promise<RemindersServiceResult<UserReminder>> {
    try {
      const updatePayload: Record<string, unknown> = {};
      if (input.label !== undefined) updatePayload.label = input.label;
      if (input.time !== undefined) updatePayload.time = input.time;
      if (input.daysOfWeek !== undefined) {
        updatePayload.days_of_week = input.daysOfWeek.slice().sort((a, b) => a - b);
      }
      if (input.enabled !== undefined) updatePayload.enabled = input.enabled;

      const { data, error } = await client
        .from('user_reminders')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: mapRow(data), error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to update reminder', success: false };
    }
  }

  async function deleteReminder(id: string): Promise<RemindersServiceResult<void>> {
    try {
      const { error } = await client.from('user_reminders').delete().eq('id', id);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: null, error: null, success: true };
    } catch {
      return { data: null, error: 'Failed to delete reminder', success: false };
    }
  }

  return {
    getUserReminders,
    createReminder,
    updateReminder,
    deleteReminder,
  };
}
