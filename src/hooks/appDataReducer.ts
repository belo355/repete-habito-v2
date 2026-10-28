import { createActivity, moveActivity, removeActivity, updateActivity } from '../services/activityRules';
import { toggleCompletion } from '../services/completionRules';
import { createInitialAppData } from '../services/storageService';
import type { AppData } from '../types/AppData';
import type { AppDataAction } from '../types/AppDataAction';

type ActionOf<Type extends AppDataAction['type']> = Extract<AppDataAction, { type: Type }>;

type ActionHandlers = {
  [Type in AppDataAction['type']]: (state: AppData, action: ActionOf<Type>) => AppData;
};

function withChanges(state: AppData, changes: Partial<AppData>): AppData {
  const keys = Object.keys(changes) as (keyof AppData)[];
  const hasChanged = keys.some((key: keyof AppData) => changes[key] !== state[key]);
  return hasChanged ? { ...state, ...changes } : state;
}

const ACTION_HANDLERS: ActionHandlers = {
  toggle: (state, action) => withChanges(state, { completions: toggleCompletion(state.completions, action.toggle) }),
  createActivity: (state, action) => withChanges(state, { activities: createActivity(action.input, state.activities) }),
  updateActivity: (state, action) =>
    withChanges(state, { activities: updateActivity(action.id, action.input, state.activities) }),
  removeActivity: (state, action) => removeActivity(action.id, state),
  moveActivity: (state, action) =>
    withChanges(state, { activities: moveActivity(action.id, action.direction, state.activities) }),
  replaceAll: (_state, action) => action.data,
  resetAll: () => createInitialAppData(),
};

export function appDataReducer(state: AppData, action: AppDataAction): AppData {
  const handler = ACTION_HANDLERS[action.type] as (state: AppData, action: AppDataAction) => AppData;
  return handler(state, action);
}
