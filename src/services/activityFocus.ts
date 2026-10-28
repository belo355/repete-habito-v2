import type { Activity } from '../types/Activity';
import type { FocusRequest } from '../types/FocusRequest';
import type { MoveDirection } from '../types/MoveDirection';

const MOVE_OFFSET: Record<MoveDirection, number> = { up: -1, down: 1 };

export function resolveMoveFocus(activities: Activity[], id: string, direction: MoveDirection): FocusRequest | null {
  const index = activities.findIndex((activity: Activity) => activity.id === id);
  const targetIndex = index + MOVE_OFFSET[direction];
  if (index === -1 || targetIndex < 0 || targetIndex >= activities.length) {
    return null;
  }
  if (targetIndex === 0) {
    return { kind: 'item', activityId: id, target: 'move-down' };
  }
  return targetIndex === activities.length - 1 ? { kind: 'item', activityId: id, target: 'move-up' } : null;
}
