import type { Activity } from './Activity';
import type { ActivityRemoval } from './ActivityRemoval';
import type { AppDataActions } from './AppDataActions';
import type { FocusRequest } from './FocusRequest';

export type ActivityManager = Pick<AppDataActions, 'createActivity' | 'updateActivity' | 'moveActivity'> &
  ActivityRemoval & {
    activities: Activity[];
    editingId: string | null;
    focusRequest: FocusRequest | null;
    startEditing(id: string): void;
    stopEditing(): void;
  };
