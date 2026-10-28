import type { IntensityLevel } from '../../types/IntensityLevel';

export const LEVEL_STYLES: Record<IntensityLevel, string> = {
  0: 'bg-surface ring-1 ring-inset ring-line',
  1: 'bg-heat-1',
  2: 'bg-heat-2',
  3: 'bg-heat-3',
  4: 'bg-heat-4',
};

export const LEVEL_LEGEND: ReadonlyArray<{ level: IntensityLevel; label: string }> = [
  { level: 0, label: 'Nenhuma atividade' },
  { level: 1, label: '1 atividade' },
  { level: 2, label: '2 atividades' },
  { level: 3, label: '3 a 4 atividades' },
  { level: 4, label: '5 ou mais atividades' },
];

export const GRID_COLUMN_STYLES: Record<number, string> = {
  53: 'grid-cols-[2rem_repeat(53,minmax(0,1fr))]',
  54: 'grid-cols-[2rem_repeat(54,minmax(0,1fr))]',
};
