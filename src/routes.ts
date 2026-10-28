import type { DateKey } from './types/DateKey';

export const ROUTES = {
  today: '/',
  day: '/dia/:dateKey',
  dashboard: '/dashboard',
  activities: '/atividades',
} as const;

export function buildDayPath(dateKey: DateKey): string {
  return ROUTES.day.replace(':dateKey', dateKey);
}
