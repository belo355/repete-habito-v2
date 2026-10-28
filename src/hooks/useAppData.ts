import { use, useMemo, useSyncExternalStore } from 'react';
import type { AppDataActions } from '../types/AppDataActions';
import type { AppDataSnapshot } from '../types/AppDataSnapshot';
import { buildAppDataActions } from './appDataActions';
import { AppDataContext } from './AppDataContext';

type UseAppDataResult = AppDataSnapshot & AppDataActions;

export function useAppData(): UseAppDataResult {
  const store = use(AppDataContext);
  if (!store) {
    throw new Error('useAppData precisa ser usado dentro de AppDataProvider');
  }
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const actions = useMemo(() => buildAppDataActions(store), [store]);
  return { ...snapshot, ...actions };
}
