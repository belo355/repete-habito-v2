import { validateActivityName } from '../services/activityRules';
import type { ActivityInput } from '../types/ActivityInput';
import type { ActivityNameError } from '../types/ActivityNameError';
import type { AppDataActions } from '../types/AppDataActions';
import type { AppDataStore } from '../types/AppDataStore';

function buildActivityActions(store: AppDataStore): Pick<AppDataActions, 'createActivity' | 'updateActivity'> {
  const currentActivities = () => store.getSnapshot().data.activities;
  return {
    createActivity(input: ActivityInput): ActivityNameError | null {
      const error = validateActivityName(input.name, currentActivities());
      if (error) {
        return error;
      }
      store.dispatch({ type: 'createActivity', input });
      return null;
    },
    updateActivity(id: string, input: ActivityInput): ActivityNameError | null {
      const error = validateActivityName(input.name, currentActivities(), id);
      if (error) {
        return error;
      }
      store.dispatch({ type: 'updateActivity', id, input });
      return null;
    },
  };
}

export function buildAppDataActions(store: AppDataStore): AppDataActions {
  return {
    ...buildActivityActions(store),
    toggle: (toggle) => store.dispatch({ type: 'toggle', toggle }),
    removeActivity: (id) => store.dispatch({ type: 'removeActivity', id }),
    moveActivity: (id, direction) => store.dispatch({ type: 'moveActivity', id, direction }),
    replaceAll: (data) => store.dispatch({ type: 'replaceAll', data }),
    resetAll: () => store.dispatch({ type: 'resetAll' }),
    dismissSaveError: () => store.dismissSaveError(),
  };
}
