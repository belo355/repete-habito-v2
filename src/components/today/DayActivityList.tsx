import { useDayCompletions } from '../../hooks/useDayCompletions';
import { ROUTES } from '../../routes';
import type { DateKey } from '../../types/DateKey';
import { EmptyState } from '../shared/EmptyState';
import { ActivityToggle } from './ActivityToggle';
import { DaySummary } from './DaySummary';
import type { DayActivity } from '../../types/DayActivity';

type DayActivityListProps = {
  dateKey: DateKey;
};

export function DayActivityList({ dateKey }: DayActivityListProps) {
  const { items, summary, toggleActivity } = useDayCompletions(dateKey);
  if (items.length === 0) {
    return <EmptyState title="Nenhuma atividade cadastrada" description="Crie as atividades que você quer acompanhar para começar a registrar seus dias." actionLabel="Criar atividade" actionTo={ROUTES.activities} />;
  }
  return (
    <section aria-label="Atividades do dia" className="flex flex-col gap-3">
      <DaySummary summary={summary} />
      <ul className="flex flex-col gap-3">
        {items.map(({ activity, isDone }: DayActivity) => (
          <li key={activity.id}>
            <ActivityToggle activity={activity} isDone={isDone} dateKey={dateKey} onToggle={toggleActivity} />
          </li>
        ))}
      </ul>
    </section>
  );
}
