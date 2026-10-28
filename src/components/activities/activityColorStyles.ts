import type { ActivityColor } from '../../types/ActivityColor';

export const ACTIVITY_CHIP_STYLES: Record<ActivityColor, string> = {
  orange: 'bg-brand-100',
  green: 'bg-emerald-200',
  blue: 'bg-sky-100',
  purple: 'bg-violet-100',
  pink: 'bg-pink-100',
  teal: 'bg-teal-100',
};

export const ACTIVITY_SWATCH_STYLES: Record<ActivityColor, string> = {
  orange: 'bg-brand-500',
  green: 'bg-success-500',
  blue: 'bg-sky-500',
  purple: 'bg-violet-500',
  pink: 'bg-pink-500',
  teal: 'bg-teal-500',
};
