'use client';

import { useState, useEffect, useCallback } from 'react';
import { createRemindersService } from '@waqup/shared/services';
import { supabase } from '@/lib/supabase';
import type { UserReminder } from '@waqup/shared/types';
import type { CreateReminderInput, UpdateReminderInput } from '@waqup/shared/types';

const remindersService = createRemindersService(supabase);

interface UseRemindersResult {
  reminders: UserReminder[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createReminder: (input: CreateReminderInput) => Promise<boolean>;
  updateReminder: (id: string, input: UpdateReminderInput) => Promise<boolean>;
  deleteReminder: (id: string) => Promise<boolean>;
}

export function useReminders(): UseRemindersResult {
  const [reminders, setReminders] = useState<UserReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await remindersService.getUserReminders();
    if (result.success && result.data) {
      setReminders(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetch());
  }, [fetch]);

  const createReminder = useCallback(async (input: CreateReminderInput): Promise<boolean> => {
    const result = await remindersService.createReminder(input);
    if (result.success && result.data) {
      setReminders((prev) => [...prev, result.data!].sort((a, b) => a.time.localeCompare(b.time)));
      return true;
    }
    setError(result.error);
    return false;
  }, []);

  const updateReminder = useCallback(async (id: string, input: UpdateReminderInput): Promise<boolean> => {
    const result = await remindersService.updateReminder(id, input);
    if (result.success && result.data) {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? result.data! : r)).sort((a, b) => a.time.localeCompare(b.time))
      );
      return true;
    }
    setError(result.error);
    return false;
  }, []);

  const deleteReminder = useCallback(async (id: string): Promise<boolean> => {
    const result = await remindersService.deleteReminder(id);
    if (result.success) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
      return true;
    }
    setError(result.error);
    return false;
  }, []);

  return {
    reminders,
    isLoading,
    error,
    refetch: fetch,
    createReminder,
    updateReminder,
    deleteReminder,
  };
}
