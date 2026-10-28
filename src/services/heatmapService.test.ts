import { describe, expect, it } from 'vitest';
import type { HeatmapDay } from '../types/HeatmapDay';
import { shiftDateKey } from './dateKeys';
import { buildYearGrid, countActiveDays, listYearsWithRecords, toIntensityLevel } from './heatmapService';

const TODAY = new Date(2026, 9, 27, 10, 0);

function daysWithDate(grid: HeatmapDay[][]): HeatmapDay[] {
  return grid.flat().filter((day: HeatmapDay) => day.dateKey !== null);
}

function findDay(grid: HeatmapDay[][], dateKey: string): HeatmapDay | undefined {
  return grid.flat().find((day: HeatmapDay) => day.dateKey === dateKey);
}

describe('toIntensityLevel', () => {
  it.each([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 3],
    [5, 4],
    [7, 4],
  ])('TU-15: mapeia %i atividades para o nível %i', (count: number, level: number) => {
    expect(toIntensityLevel(count)).toBe(level);
  });
});

describe('buildYearGrid', () => {
  it('TU-16: gera 7 linhas com o mesmo número de semanas', () => {
    const grid = buildYearGrid({}, 2026, TODAY);
    expect(grid).toHaveLength(7);
    expect(new Set(grid.map((row: HeatmapDay[]) => row.length)).size).toBe(1);
  });

  it('TU-16: começa no domingo e preenche com células vazias antes de 1º de janeiro', () => {
    const grid = buildYearGrid({}, 2026, TODAY);
    expect(grid[0][0].dateKey).toBeNull();
    expect(grid[4][0].dateKey).toBe('2026-01-01');
  });

  it('TU-16: inclui todos os dias do ano, inclusive em ano bissexto', () => {
    expect(daysWithDate(buildYearGrid({}, 2026, TODAY))).toHaveLength(365);
    expect(daysWithDate(buildYearGrid({}, 2028, TODAY))).toHaveLength(366);
  });

  it('TU-16: marca os dias posteriores a hoje como futuros', () => {
    const grid = buildYearGrid({}, 2026, TODAY);
    expect(findDay(grid, '2026-10-27')?.isFuture).toBe(false);
    expect(findDay(grid, '2026-10-28')?.isFuture).toBe(true);
  });

  it('TU-16: preenche quantidade, nível e atividades do dia', () => {
    const grid = buildYearGrid({ '2026-10-20': ['a', 'b', 'c'] }, 2026, TODAY);
    expect(findDay(grid, '2026-10-20')).toMatchObject({ count: 3, level: 3, activityIds: ['a', 'b', 'c'] });
  });
});

describe('countActiveDays', () => {
  it('TU-17: retorna 42 para 42 dias distintos com registro no ano', () => {
    const log = Object.fromEntries(
      Array.from({ length: 42 }, (_, index: number) => [shiftDateKey('2026-01-01', index), ['a', 'b']]),
    );
    expect(countActiveDays(log, 2026)).toBe(42);
  });

  it('TU-17: ignora registros de outros anos', () => {
    expect(countActiveDays({ '2025-12-31': ['a'], '2026-01-01': ['a'] }, 2026)).toBe(1);
  });
});

describe('listYearsWithRecords', () => {
  it('TU-18: lista os anos com registros incluindo o atual em ordem crescente', () => {
    expect(listYearsWithRecords({ '2025-06-01': ['a'], '2026-01-02': ['a'] }, 2026)).toEqual([2025, 2026]);
  });

  it('TU-18: retorna apenas o ano atual quando não há registros', () => {
    expect(listYearsWithRecords({}, 2026)).toEqual([2026]);
  });
});
