import type { AppDataAction } from './AppDataAction';
import type { AppDataSnapshot } from './AppDataSnapshot';

export type AppDataStore = {
  getSnapshot(): AppDataSnapshot;
  subscribe(listener: () => void): () => void;
  dispatch(action: AppDataAction): void;
  dismissSaveError(): void;
};
