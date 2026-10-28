import { loadAppData, saveAppData } from '../services/storageService';
import type { AppDataAction } from '../types/AppDataAction';
import type { AppDataSnapshot } from '../types/AppDataSnapshot';
import { appDataReducer } from './appDataReducer';
import type { AppDataStore } from '../types/AppDataStore';

type Listener = () => void;

export function createAppDataStore(): AppDataStore {
  let snapshot: AppDataSnapshot = { data: loadAppData(), saveError: null };
  const listeners = new Set<Listener>();
  function publish(next: AppDataSnapshot): void {
    snapshot = next;
    listeners.forEach((listener: Listener) => listener());
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispatch(action: AppDataAction) {
      const data = appDataReducer(snapshot.data, action);
      if (data === snapshot.data) {
        return;
      }
      const result = saveAppData(data);
      publish({ data, saveError: result.ok ? null : result.error });
    },
    dismissSaveError() {
      publish({ ...snapshot, saveError: null });
    },
  };
}
