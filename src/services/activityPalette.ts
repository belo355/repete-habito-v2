import type { ActivityColor } from '../types/ActivityColor';

export const ACTIVITY_COLORS: readonly ActivityColor[] = ['orange', 'green', 'blue', 'purple', 'pink', 'teal'];

export const ACTIVITY_COLOR_LABELS: Record<ActivityColor, string> = {
  orange: 'Laranja',
  green: 'Verde',
  blue: 'Azul',
  purple: 'Roxo',
  pink: 'Rosa',
  teal: 'Turquesa',
};

export function isActivityColor(value: unknown): value is ActivityColor {
  return typeof value === 'string' && ACTIVITY_COLORS.some((color: ActivityColor) => color === value);
}
