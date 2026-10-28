import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { HeatmapDay } from '../types/HeatmapDay';
import { formatDateKey, fromDateKey } from './dateKeys';
import type { MonthLabel } from '../types/MonthLabel';

export const MAX_INTENSITY_LEVEL = 4;
const FIRST_DAY_OF_MONTH_SUFFIX = '-01';

export const WEEKDAY_LABELS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const;

export function describeActivityCount(count: number): string {
  if (count === 0) {
    return 'nenhuma atividade';
  }
  return count === 1 ? '1 atividade' : `${count} atividades`;
}

export function buildCellLabel(day: HeatmapDay): string {
  if (day.dateKey === null) {
    return '';
  }
  const date = formatDateKey(day.dateKey);
  if (day.isFuture) {
    return `${date}, dia futuro`;
  }
  const intensity = day.level > 0 ? `, intensidade ${day.level} de ${MAX_INTENSITY_LEVEL}` : '';
  return `${date}, ${describeActivityCount(day.count)}${intensity}`;
}

function findMonthStart(column: HeatmapDay[]): HeatmapDay | undefined {
  return column.find((day: HeatmapDay) => day.dateKey?.endsWith(FIRST_DAY_OF_MONTH_SUFFIX) ?? false);
}

export function buildMonthLabels(grid: HeatmapDay[][]): MonthLabel[] {
  const columnCount = grid[0]?.length ?? 0;
  return Array.from({ length: columnCount }, (_, column: number) => ({
    column,
    monthStart: findMonthStart(grid.map((row: HeatmapDay[]) => row[column])),
  }))
    .filter(({ monthStart }) => monthStart?.dateKey)
    .map(({ column, monthStart }) => ({
      column,
      label: format(fromDateKey(monthStart?.dateKey ?? ''), 'MMM', { locale: ptBR }),
    }));
}
