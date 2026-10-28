import type { Activity } from '../types/Activity';
import type { ActivityColor } from '../types/ActivityColor';
import type { ActivityInput } from '../types/ActivityInput';
import type { ActivityNameError } from '../types/ActivityNameError';
import type { AppData } from '../types/AppData';
import type { MoveDirection } from '../types/MoveDirection';
import { removeActivityCompletions } from './completionRules';
import type { ActivityNameErrorCode } from '../types/ActivityNameErrorCode';

export const MAX_ACTIVITY_NAME_LENGTH = 40;
export const DEFAULT_ACTIVITY_ICON = '✅';
export const DEFAULT_ACTIVITY_COLOR: ActivityColor = 'orange';
const NAME_LOCALE = 'pt-BR';
const MOVE_OFFSET: Record<MoveDirection, number> = { up: -1, down: 1 };

const NAME_ERROR_MESSAGES: Record<ActivityNameErrorCode, string> = {
  NAME_REQUIRED: 'Informe um nome para a atividade.',
  NAME_TOO_LONG: `Use no máximo ${MAX_ACTIVITY_NAME_LENGTH} caracteres.`,
  NAME_DUPLICATE: 'Já existe uma atividade com esse nome.',
};

function toComparableName(name: string): string {
  return name.trim().toLocaleLowerCase(NAME_LOCALE);
}

function buildNameError(code: ActivityNameErrorCode): ActivityNameError {
  return { code, message: NAME_ERROR_MESSAGES[code] };
}

function isNameTaken(name: string, activities: Activity[], editingId?: string): boolean {
  const comparable = toComparableName(name);
  return activities.some(
    (activity: Activity) => activity.id !== editingId && toComparableName(activity.name) === comparable,
  );
}

export function validateActivityName(
  name: string,
  activities: Activity[],
  editingId?: string,
): ActivityNameError | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return buildNameError('NAME_REQUIRED');
  }
  if (trimmed.length > MAX_ACTIVITY_NAME_LENGTH) {
    return buildNameError('NAME_TOO_LONG');
  }
  return isNameTaken(trimmed, activities, editingId) ? buildNameError('NAME_DUPLICATE') : null;
}

function buildActivity(id: string, input: ActivityInput): Activity {
  const icon = input.icon?.trim() || DEFAULT_ACTIVITY_ICON;
  return { id, name: input.name.trim(), icon, color: input.color ?? DEFAULT_ACTIVITY_COLOR };
}

export function createActivity(input: ActivityInput, activities: Activity[]): Activity[] {
  return [...activities, buildActivity(crypto.randomUUID(), input)];
}

export function updateActivity(id: string, input: ActivityInput, activities: Activity[]): Activity[] {
  return activities.map((activity: Activity) => (activity.id === id ? buildActivity(id, input) : activity));
}

export function removeActivity(id: string, data: AppData): AppData {
  return {
    ...data,
    activities: data.activities.filter((activity: Activity) => activity.id !== id),
    completions: removeActivityCompletions(data.completions, id),
  };
}

export function moveActivity(id: string, direction: MoveDirection, activities: Activity[]): Activity[] {
  const index = activities.findIndex((activity: Activity) => activity.id === id);
  const targetIndex = index + MOVE_OFFSET[direction];
  if (index === -1 || targetIndex < 0 || targetIndex >= activities.length) {
    return activities;
  }
  const reordered = [...activities];
  [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
  return reordered;
}
