import type { ActivityInput } from './ActivityInput';
import type { ActivityNameError } from './ActivityNameError';
import type { AppData } from './AppData';
import type { CompletionToggle } from './CompletionToggle';
import type { MoveDirection } from './MoveDirection';

export type AppDataActions = {
  toggle(toggle: CompletionToggle): void;
  createActivity(input: ActivityInput): ActivityNameError | null;
  updateActivity(id: string, input: ActivityInput): ActivityNameError | null;
  removeActivity(id: string): void;
  moveActivity(id: string, direction: MoveDirection): void;
  replaceAll(data: AppData): void;
  resetAll(): void;
  dismissSaveError(): void;
};
