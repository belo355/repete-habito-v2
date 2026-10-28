import { useEffect, useRef } from 'react';
import type { Activity } from '../../types/Activity';
import { ActivityForm } from './ActivityForm';
import { ActivityListItem } from './ActivityListItem';
import type { ActivityManager } from '../../types/ActivityManager';

type ActivityListProps = {
  manager: ActivityManager;
};

function EditingItem({ activity, manager }: { activity: Activity; manager: ActivityManager }) {
  function submit(input: Parameters<ActivityManager['updateActivity']>[1]) {
    const error = manager.updateActivity(activity.id, input);
    if (error === null) {
      manager.stopEditing();
    }
    return error;
  }
  return (
    <div className="rounded-card bg-card p-4 shadow-soft">
      <ActivityForm formLabel={`Editar ${activity.name}`} submitLabel="Salvar alterações" initial={activity} onSubmit={submit} onCancel={manager.stopEditing} />
    </div>
  );
}

export function ActivityList({ manager }: ActivityListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const { focusRequest } = manager;
  useEffect(() => {
    if (focusRequest?.kind === 'list') {
      listRef.current?.focus();
    }
  }, [focusRequest]);
  const handlers = { onMove: manager.moveActivity, onEdit: manager.startEditing, onRemove: manager.requestRemoval };
  const lastIndex = manager.activities.length - 1;
  return (
    <ul ref={listRef} tabIndex={-1} aria-label="Lista de atividades" className="flex flex-col gap-3 rounded-card">
      {manager.activities.map((activity: Activity, index: number) => (
        <li key={activity.id}>
          {manager.editingId === activity.id ? (
            <EditingItem activity={activity} manager={manager} />
          ) : (
            <ActivityListItem activity={activity} position={{ isFirst: index === 0, isLast: index === lastIndex }} handlers={handlers} focusRequest={focusRequest} />
          )}
        </li>
      ))}
    </ul>
  );
}
