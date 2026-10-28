import type { Activity } from '../types/Activity';
import type { CompletionLog } from '../types/CompletionLog';
import type { CompletionToggle } from '../types/CompletionToggle';
import type { DateKey } from '../types/DateKey';
import type { DaySummary } from '../types/DaySummary';
import { isFutureDateKey } from './dateKeys';

function withoutEmptyDays(log: CompletionLog): CompletionLog {
  return Object.fromEntries(Object.entries(log).filter(([, ids]) => ids.length > 0));
}

export function getDayCompletions(log: CompletionLog, dateKey: DateKey): string[] {
  return log[dateKey] ?? [];
}

export function toggleCompletion(log: CompletionLog, toggle: CompletionToggle): CompletionLog {
  if (isFutureDateKey(toggle.dateKey, toggle.today)) {
    return log;
  }
  const current = getDayCompletions(log, toggle.dateKey);
  const isDone = current.includes(toggle.activityId);
  const next = isDone
    ? current.filter((id: string) => id !== toggle.activityId)
    : [...current, toggle.activityId];
  return withoutEmptyDays({ ...log, [toggle.dateKey]: next });
}

export function removeActivityCompletions(log: CompletionLog, activityId: string): CompletionLog {
  const cleaned = Object.fromEntries(
    Object.entries(log).map(([dateKey, ids]) => [dateKey, ids.filter((id: string) => id !== activityId)]),
  );
  return withoutEmptyDays(cleaned);
}

export function hasActivityHistory(log: CompletionLog, activityId: string): boolean {
  return Object.values(log).some((ids: string[]) => ids.includes(activityId));
}

export function summarizeDay(log: CompletionLog, dateKey: DateKey, activities: Activity[]): DaySummary {
  const doneIds = getDayCompletions(log, dateKey);
  const done = activities.filter((activity: Activity) => doneIds.includes(activity.id)).length;
  return { done, total: activities.length };
}
