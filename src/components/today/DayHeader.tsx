import { formatDateKey, formatLongDateKey } from '../../services/dateKeys';
import type { DateKey } from '../../types/DateKey';
import { DayNavigator } from './DayNavigator';

type DayHeaderProps = {
  dateKey: DateKey;
  todayKey: DateKey;
};

function buildDayTitle(dateKey: DateKey, todayKey: DateKey): string {
  if (dateKey === todayKey) {
    return 'Hoje';
  }
  const weekday = formatLongDateKey(dateKey).split(',')[0];
  return weekday.charAt(0).toLocaleUpperCase('pt-BR') + weekday.slice(1);
}

export function DayHeader({ dateKey, todayKey }: DayHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3 pt-4">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-ink">{buildDayTitle(dateKey, todayKey)}</h1>
        <p className="mt-1 text-ink-muted">{formatDateKey(dateKey)}</p>
      </div>
      <DayNavigator dateKey={dateKey} todayKey={todayKey} />
    </header>
  );
}
