import { Link } from 'react-router';
import { buildDayPath, ROUTES } from '../../routes';
import { formatDateKey, shiftDateKey } from '../../services/dateKeys';
import type { DateKey } from '../../types/DateKey';
import { Icon } from '../icons/Icon';
import { BUTTON_STYLES } from '../shared/buttonStyles';

type DayNavigatorProps = {
  dateKey: DateKey;
  todayKey: DateKey;
};

function pathForDay(dateKey: DateKey, todayKey: DateKey): string {
  return dateKey === todayKey ? ROUTES.today : buildDayPath(dateKey);
}

export function DayNavigator({ dateKey, todayKey }: DayNavigatorProps) {
  const isToday = dateKey === todayKey;
  const previousKey = shiftDateKey(dateKey, -1);
  const nextKey = shiftDateKey(dateKey, 1);
  return (
    <nav aria-label="Navegação entre dias" className="flex items-center gap-1">
      {!isToday && <Link to={ROUTES.today} className={BUTTON_STYLES.ghost}>Ir para hoje</Link>}
      <Link to={pathForDay(previousKey, todayKey)} aria-label={`Dia anterior, ${formatDateKey(previousKey)}`} className={`${BUTTON_STYLES.icon} bg-card shadow-soft`}>
        <Icon name="chevron-left" />
      </Link>
      {isToday ? (
        <button type="button" disabled aria-label="Próximo dia indisponível" className={`${BUTTON_STYLES.icon} bg-card shadow-soft`}>
          <Icon name="chevron-right" />
        </button>
      ) : (
        <Link to={pathForDay(nextKey, todayKey)} aria-label={`Próximo dia, ${formatDateKey(nextKey)}`} className={`${BUTTON_STYLES.icon} bg-card shadow-soft`}>
          <Icon name="chevron-right" />
        </Link>
      )}
    </nav>
  );
}
