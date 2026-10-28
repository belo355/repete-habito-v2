import { formatDateKey } from '../../services/dateKeys';
import type { Activity } from '../../types/Activity';
import type { DateKey } from '../../types/DateKey';
import { ACTIVITY_CHIP_STYLES } from '../activities/activityColorStyles';
import { CheckIndicator } from './CheckIndicator';

type ActivityToggleProps = {
  activity: Activity;
  isDone: boolean;
  dateKey: DateKey;
  onToggle(activityId: string): void;
};

export function ActivityToggle({ activity, isDone, dateKey, onToggle }: ActivityToggleProps) {
  const surface = isDone ? 'bg-success-50' : 'bg-card hover:bg-brand-50';
  return (
    <button type="button" aria-pressed={isDone} onClick={() => onToggle(activity.id)} className={`flex min-h-18 w-full items-center gap-4 rounded-card p-3 pr-4 text-left shadow-soft transition-[background-color,scale] duration-200 ease-out active:scale-[0.98] ${surface}`}>
      <span aria-hidden="true" className={`flex size-12 shrink-0 items-center justify-center rounded-control text-2xl ${ACTIVITY_CHIP_STYLES[activity.color]}`}>
        {activity.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold text-ink">{activity.name}</span>{' '}
        <span className={`block text-sm first-letter:uppercase ${isDone ? 'font-semibold text-success-700' : 'text-ink-muted'}`}>
          {isDone ? 'realizada' : 'não realizada'}
        </span>{' '}
        <span className="sr-only">{`em ${formatDateKey(dateKey)}`}</span>
      </span>
      <CheckIndicator isDone={isDone} />
    </button>
  );
}
