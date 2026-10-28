import type { Activity } from './Activity';
import type { CompletionLog } from './CompletionLog';

export type AppData = {
  version: 1;
  activities: Activity[];
  completions: CompletionLog;
};
