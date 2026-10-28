import { addDays, format, isAfter, isValid, parse, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DateKey } from '../types/DateKey';

const DATE_KEY_FORMAT = 'yyyy-MM-dd';
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const YEAR_LENGTH = 4;
const PARSE_REFERENCE_DATE = new Date(2000, 0, 1);

export function toDateKey(date: Date): DateKey {
  return format(date, DATE_KEY_FORMAT);
}

export function getTodayKey(): DateKey {
  return toDateKey(new Date());
}

export function fromDateKey(key: DateKey): Date {
  return parse(key, DATE_KEY_FORMAT, PARSE_REFERENCE_DATE);
}

export function isValidDateKey(key: string): boolean {
  if (!DATE_KEY_PATTERN.test(key)) {
    return false;
  }
  const date = fromDateKey(key);
  return isValid(date) && toDateKey(date) === key;
}

export function isFutureDateKey(key: DateKey, today: Date): boolean {
  return isAfter(fromDateKey(key), startOfDay(today));
}

export function shiftDateKey(key: DateKey, days: number): DateKey {
  return toDateKey(addDays(fromDateKey(key), days));
}

export function getDateKeyYear(key: DateKey): number {
  return Number(key.slice(0, YEAR_LENGTH));
}

export function formatDateKey(key: DateKey): string {
  return format(fromDateKey(key), "d 'de' MMMM", { locale: ptBR });
}

export function formatLongDateKey(key: DateKey): string {
  return format(fromDateKey(key), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
}
