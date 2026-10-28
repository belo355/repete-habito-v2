import type { ActivityInput } from './ActivityInput';
import type { AppData } from './AppData';
import type { CompletionToggle } from './CompletionToggle';
import type { MoveDirection } from './MoveDirection';

export type AppDataAction =
  | { type: 'toggle'; toggle: CompletionToggle }
  | { type: 'createActivity'; input: ActivityInput }
  | { type: 'updateActivity'; id: string; input: ActivityInput }
  | { type: 'removeActivity'; id: string }
  | { type: 'moveActivity'; id: string; direction: MoveDirection }
  | { type: 'replaceAll'; data: AppData }
  | { type: 'resetAll' };
