import { getDayCompletions, summarizeDay } from '../services/completionRules';
import type { Activity } from '../types/Activity';
import type { DateKey } from '../types/DateKey';
import type { DaySummary } from '../types/DaySummary';
import { useAppData } from './useAppData';
import type { DayActivity } from '../types/DayActivity';

type UseDayCompletionsResult = {
  items: DayActivity[];
  summary: DaySummary;
  toggleActivity(activityId: string): void;
};

export function useDayCompletions(dateKey: DateKey): UseDayCompletionsResult {
  const { data, toggle } = useAppData();
  const doneIds = getDayCompletions(data.completions, dateKey);
  const items = data.activities.map((activity: Activity) => ({ activity, isDone: doneIds.includes(activity.id) }));
  return {
    items,
    summary: summarizeDay(data.completions, dateKey, data.activities),
    toggleActivity: (activityId: string) => toggle({ dateKey, activityId, today: new Date() }),
  };
}
