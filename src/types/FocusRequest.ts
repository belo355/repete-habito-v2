import type { ActivityFocusTarget } from './ActivityFocusTarget';

export type FocusRequest =
  | { kind: 'item'; activityId: string; target: ActivityFocusTarget }
  | { kind: 'list' };
