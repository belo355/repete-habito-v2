import { useState } from 'react';
import { resolveMoveFocus } from '../services/activityFocus';
import { hasActivityHistory } from '../services/completionRules';
import type { Activity } from '../types/Activity';
import type { FocusRequest } from '../types/FocusRequest';
import type { MoveDirection } from '../types/MoveDirection';
import { useAppData } from './useAppData';
import type { ActivityManager } from '../types/ActivityManager';
import type { ActivityRemoval } from '../types/ActivityRemoval';

function useActivityRemoval(onRemoved: () => void): ActivityRemoval {
  const { data, removeActivity } = useAppData();
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
  function remove(id: string): void {
    removeActivity(id);
    onRemoved();
  }
  function requestRemoval(id: string): void {
    if (hasActivityHistory(data.completions, id)) {
      setPendingRemovalId(id);
      return;
    }
    remove(id);
  }
  function confirmRemoval(): void {
    if (pendingRemovalId !== null) {
      remove(pendingRemovalId);
    }
    setPendingRemovalId(null);
  }
  return {
    pendingRemoval: data.activities.find((activity: Activity) => activity.id === pendingRemovalId) ?? null,
    requestRemoval,
    confirmRemoval,
    cancelRemoval: () => setPendingRemovalId(null),
  };
}

export function useActivityManager(): ActivityManager {
  const { data, createActivity, updateActivity, moveActivity } = useAppData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  function move(id: string, direction: MoveDirection): void {
    setFocusRequest(resolveMoveFocus(data.activities, id, direction));
    moveActivity(id, direction);
  }
  function stopEditing(): void {
    setFocusRequest(editingId === null ? null : { kind: 'item', activityId: editingId, target: 'edit' });
    setEditingId(null);
  }
  return {
    ...useActivityRemoval(() => setFocusRequest({ kind: 'list' })),
    activities: data.activities,
    editingId,
    focusRequest,
    createActivity,
    updateActivity,
    moveActivity: move,
    startEditing: setEditingId,
    stopEditing,
  };
}
