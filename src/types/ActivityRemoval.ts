import type { Activity } from './Activity';

export type ActivityRemoval = {
  pendingRemoval: Activity | null;
  requestRemoval(id: string): void;
  confirmRemoval(): void;
  cancelRemoval(): void;
};
