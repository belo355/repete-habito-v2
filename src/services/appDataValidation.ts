import type { Activity } from '../types/Activity';
import type { AppData } from '../types/AppData';
import type { CompletionLog } from '../types/CompletionLog';
import { MAX_ACTIVITY_NAME_LENGTH } from './activityRules';
import { isActivityColor } from './activityPalette';
import { isValidDateKey } from './dateKeys';
import { isRecord } from './json';

export const APP_DATA_VERSION = 1;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isActivityName(value: unknown): boolean {
  return isNonEmptyString(value) && value.trim().length <= MAX_ACTIVITY_NAME_LENGTH;
}

function isActivity(value: unknown): value is Activity {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isActivityName(value.name) &&
    isNonEmptyString(value.icon) &&
    isActivityColor(value.color)
  );
}

function hasUniqueValues(values: string[]): boolean {
  return new Set(values).size === values.length;
}

function isActivityList(value: unknown): value is Activity[] {
  return (
    Array.isArray(value) &&
    value.every(isActivity) &&
    hasUniqueValues(value.map((activity: Activity) => activity.id))
  );
}

function isDayEntry(ids: unknown, knownIds: Set<string>): boolean {
  return (
    Array.isArray(ids) &&
    ids.length > 0 &&
    ids.every((id: unknown) => typeof id === 'string' && knownIds.has(id)) &&
    hasUniqueValues(ids)
  );
}

function isCompletionLog(value: unknown, activities: Activity[]): value is CompletionLog {
  if (!isRecord(value)) {
    return false;
  }
  const knownIds = new Set(activities.map((activity: Activity) => activity.id));
  return Object.entries(value).every(
    ([dateKey, ids]) => isValidDateKey(dateKey) && isDayEntry(ids, knownIds),
  );
}

export function isAppData(value: unknown): value is AppData {
  return (
    isRecord(value) &&
    value.version === APP_DATA_VERSION &&
    isActivityList(value.activities) &&
    isCompletionLog(value.completions, value.activities)
  );
}
