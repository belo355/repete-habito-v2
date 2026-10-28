import { useMemo } from 'react';
import { fromDateKey, getDateKeyYear, getTodayKey } from '../services/dateKeys';
import { buildYearGrid, countActiveDays, listYearsWithRecords } from '../services/heatmapService';
import type { HeatmapDay } from '../types/HeatmapDay';
import { useAppData } from './useAppData';

type UseHeatmapResult = {
  grid: HeatmapDay[][];
  activeDays: number;
  years: number[];
  hasRecords: boolean;
};

export function useHeatmap(year: number): UseHeatmapResult {
  const { data } = useAppData();
  const todayKey = getTodayKey();
  const grid = useMemo(
    () => buildYearGrid(data.completions, year, fromDateKey(todayKey)),
    [data.completions, year, todayKey],
  );
  return {
    grid,
    activeDays: countActiveDays(data.completions, year),
    years: listYearsWithRecords(data.completions, getDateKeyYear(todayKey)),
    hasRecords: Object.keys(data.completions).length > 0,
  };
}
