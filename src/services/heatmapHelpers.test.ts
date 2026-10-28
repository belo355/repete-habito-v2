import { describe, expect, it } from 'vitest';
import { buildCellLabel, buildMonthLabels, describeActivityCount } from './heatmapLabels';
import { findNextPosition, findPosition, resolveActivePosition } from './heatmapNavigation';
import { buildYearGrid } from './heatmapService';

const TODAY = new Date(2026, 9, 27, 10, 0);
const GRID_2026 = buildYearGrid({}, 2026, TODAY);

describe('heatmapLabels', () => {
  it('descreve a quantidade de atividades no singular e no plural', () => {
    expect(describeActivityCount(0)).toBe('nenhuma atividade');
    expect(describeActivityCount(1)).toBe('1 atividade');
    expect(describeActivityCount(4)).toBe('4 atividades');
  });

  it('não gera rótulo para célula vazia', () => {
    expect(buildCellLabel({ dateKey: null, count: 0, level: 0, isFuture: false, activityIds: [] })).toBe('');
  });

  it('gera os 12 rótulos de meses na coluna em que cada mês começa', () => {
    const labels = buildMonthLabels(GRID_2026);
    expect(labels).toHaveLength(12);
    expect(labels[0]).toEqual({ column: 0, label: 'jan' });
    expect(labels[11].label).toBe('dez');
  });

  it('não gera rótulos para uma grade vazia', () => {
    expect(buildMonthLabels([])).toEqual([]);
  });
});

describe('heatmapNavigation', () => {
  it('encontra a posição de uma data na grade', () => {
    expect(findPosition(GRID_2026, '2026-01-01')).toEqual({ row: 4, column: 0 });
    expect(findPosition(GRID_2026, '2025-12-31')).toBeNull();
  });

  it('avança para a próxima semana com a seta para a direita', () => {
    expect(findNextPosition(GRID_2026, { row: 4, column: 0 }, { row: 0, column: 1 })).toEqual({ row: 4, column: 1 });
  });

  it('pula células vazias e para no limite da grade', () => {
    expect(findNextPosition(GRID_2026, { row: 4, column: 0 }, { row: -1, column: 0 })).toEqual({ row: 4, column: 0 });
    expect(findNextPosition(GRID_2026, { row: 4, column: 1 }, { row: 0, column: -1 })).toEqual({ row: 4, column: 0 });
  });

  it('usa a primeira preferência encontrada e cai no primeiro dia do ano', () => {
    expect(resolveActivePosition(GRID_2026, [null, '2026-01-02'])).toEqual({ row: 5, column: 0 });
    expect(resolveActivePosition(GRID_2026, ['2030-01-01'])).toEqual({ row: 4, column: 0 });
  });
});
