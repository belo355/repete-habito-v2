import { Link } from 'react-router';
import { buildDayPath, ROUTES } from '../../routes';
import { formatLongDateKey } from '../../services/dateKeys';
import type { Activity } from '../../types/Activity';
import type { DateKey } from '../../types/DateKey';
import type { HeatmapDay } from '../../types/HeatmapDay';
import { BUTTON_STYLES } from '../shared/buttonStyles';

type DayDetailsProps = {
  day: HeatmapDay | null;
  activities: Activity[];
  todayKey: DateKey;
};

function listActivityNames(day: HeatmapDay, activities: Activity[]): string[] {
  return activities.filter((activity: Activity) => day.activityIds.includes(activity.id)).map((activity: Activity) => activity.name);
}

const FUTURE_DAY_TEXT = 'Dia futuro';
const EMPTY_DAY_TEXT = 'Nenhuma atividade registrada';

function describeDayContent(day: HeatmapDay, names: string[]): string {
  if (day.isFuture) {
    return FUTURE_DAY_TEXT;
  }
  return names.length > 0 ? names.join(', ') : EMPTY_DAY_TEXT;
}

export function DayDetails({ day, activities, todayKey }: DayDetailsProps) {
  if (!day?.dateKey) {
    return <p aria-live="polite" className="text-sm text-ink-muted">Toque em um dia do mapa para ver o que foi feito.</p>;
  }
  const names = listActivityNames(day, activities);
  const path = day.dateKey === todayKey ? ROUTES.today : buildDayPath(day.dateKey);
  return (
    <section aria-label="Detalhes do dia" aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 rounded-control bg-surface p-4">
      <div>
        <h3 className="font-bold text-ink first-letter:uppercase">{formatLongDateKey(day.dateKey)}</h3>
        <p className="mt-1 text-sm text-ink-muted">{describeDayContent(day, names)}</p>
      </div>
      {!day.isFuture && <Link to={path} className={BUTTON_STYLES.secondary}>Registrar neste dia</Link>}
    </section>
  );
}
