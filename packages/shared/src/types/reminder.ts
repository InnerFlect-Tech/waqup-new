/**
 * Reminder types - for scheduling practice sessions
 * daysOfWeek: 0 = Sunday, 1 = Monday, ... 6 = Saturday
 */

export interface UserReminder {
  id: string;
  label: string;
  time: string; // HH:mm format
  daysOfWeek: number[];
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReminderInput {
  label?: string;
  time: string; // HH:mm
  daysOfWeek: number[];
  enabled?: boolean;
}

export interface UpdateReminderInput {
  label?: string;
  time?: string;
  daysOfWeek?: number[];
  enabled?: boolean;
}
