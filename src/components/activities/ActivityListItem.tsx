import { useItemFocus } from '../../hooks/useItemFocus';
import type { Activity } from '../../types/Activity';
import type { FocusRequest } from '../../types/FocusRequest';
import type { MoveDirection } from '../../types/MoveDirection';
import { Icon } from '../icons/Icon';
import { BUTTON_STYLES } from '../shared/buttonStyles';
import { ACTIVITY_CHIP_STYLES } from './activityColorStyles';
import type { ActivityFocusTarget } from '../../types/ActivityFocusTarget';
import type { IconName } from '../../types/IconName';

type ActivityItemHandlers = {
  onMove(id: string, direction: MoveDirection): void;
  onEdit(id: string): void;
  onRemove(id: string): void;
};

type ActivityListItemProps = {
  activity: Activity;
  position: { isFirst: boolean; isLast: boolean };
  handlers: ActivityItemHandlers;
  focusRequest?: FocusRequest | null;
};

type ItemAction = { icon: IconName; label: string; disabled: boolean; focusTarget?: ActivityFocusTarget; run(): void };

function buildActions({ activity, position, handlers }: ActivityListItemProps): ItemAction[] {
  return [
    { icon: 'arrow-up', label: `Mover ${activity.name} para cima`, disabled: position.isFirst, focusTarget: 'move-up', run: () => handlers.onMove(activity.id, 'up') },
    { icon: 'arrow-down', label: `Mover ${activity.name} para baixo`, disabled: position.isLast, focusTarget: 'move-down', run: () => handlers.onMove(activity.id, 'down') },
    { icon: 'pencil', label: `Editar ${activity.name}`, disabled: false, focusTarget: 'edit', run: () => handlers.onEdit(activity.id) },
    { icon: 'trash', label: `Remover ${activity.name}`, disabled: false, run: () => handlers.onRemove(activity.id) },
  ];
}

export function ActivityListItem(props: ActivityListItemProps) {
  const { activity } = props;
  const registerFocus = useItemFocus(props.focusRequest ?? null, activity.id);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-card bg-card p-3 shadow-soft">
      <span aria-hidden="true" className={`flex size-11 shrink-0 items-center justify-center rounded-control text-xl ${ACTIVITY_CHIP_STYLES[activity.color]}`}>{activity.icon}</span>
      <span className="min-w-24 flex-1 truncate font-semibold text-ink">{activity.name}</span>
      <div className="ml-auto flex shrink-0 justify-end">
        {buildActions(props).map((action: ItemAction) => (
          <button key={action.icon} ref={action.focusTarget ? registerFocus(action.focusTarget) : undefined} type="button" aria-label={action.label} disabled={action.disabled} onClick={action.run} className={`${BUTTON_STYLES.icon} ${action.icon === 'trash' ? 'hover:bg-danger-50 hover:text-danger-700' : ''}`}>
            <Icon name={action.icon} />
          </button>
        ))}
      </div>
    </div>
  );
}
