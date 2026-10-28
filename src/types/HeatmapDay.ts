import type { DateKey } from './DateKey';
import type { IntensityLevel } from './IntensityLevel';

export type HeatmapDay = {
  dateKey: DateKey | null;
  count: number;
  level: IntensityLevel;
  isFuture: boolean;
  activityIds: string[];
};
