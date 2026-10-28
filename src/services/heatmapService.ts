import { eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';
import type { CompletionLog } from '../types/CompletionLog';
import type { HeatmapDay } from '../types/HeatmapDay';
import type { IntensityLevel } from '../types/IntensityLevel';
import { getDayCompletions } from './completionRules';
import { getDateKeyYear, isFutureDateKey, toDateKey } from './dateKeys';

export const DAYS_PER_WEEK = 7;
const WEEK_OPTIONS = { weekStartsOn: 0 } as const;
const LAST_MONTH_INDEX = 11;
const LAST_DAY_OF_DECEMBER = 31;

const INTENSITY_THRESHOLDS: ReadonlyArray<{ minimum: number; level: IntensityLevel }> = [
  { minimum: 5, level: 4 },
  { minimum: 3, level: 3 },
  { minimum: 2, level: 2 },
  { minimum: 1, level: 1 },
];

const EMPTY_HEATMAP_DAY: HeatmapDay = { dateKey: null, count: 0, level: 0, isFuture: false, activityIds: [] };

export function toIntensityLevel(count: number): IntensityLevel {
  return INTENSITY_THRESHOLDS.find((threshold) => count >= threshold.minimum)?.level ?? 0;
}

function buildHeatmapDay(log: CompletionLog, date: Date, today: Date): HeatmapDay {
  const dateKey = toDateKey(date);
  const activityIds = getDayCompletions(log, dateKey);
  return {
    dateKey,
    count: activityIds.length,
    level: toIntensityLevel(activityIds.length),
    isFuture: isFutureDateKey(dateKey, today),
    activityIds,
  };
}

function listGridDays(year: number): Date[] {
  const start = startOfWeek(new Date(year, 0, 1), WEEK_OPTIONS);
  const end = endOfWeek(new Date(year, LAST_MONTH_INDEX, LAST_DAY_OF_DECEMBER), WEEK_OPTIONS);
  return eachDayOfInterval({ start, end });
}

export function buildYearGrid(log: CompletionLog, year: number, today: Date): HeatmapDay[][] {
  const cells = listGridDays(year).map((date: Date) =>
    date.getFullYear() === year ? buildHeatmapDay(log, date, today) : EMPTY_HEATMAP_DAY,
  );
  return Array.from({ length: DAYS_PER_WEEK }, (_, weekday: number) =>
    cells.filter((_, index: number) => index % DAYS_PER_WEEK === weekday),
  );
}

export function countActiveDays(log: CompletionLog, year: number): number {
  return Object.entries(log).filter(([dateKey, ids]) => getDateKeyYear(dateKey) === year && ids.length > 0)
    .length;
}

export function listYearsWithRecords(log: CompletionLog, currentYear: number): number[] {
  const years = new Set([currentYear, ...Object.keys(log).map(getDateKeyYear)]);
  return [...years].sort((first: number, second: number) => first - second);
}
