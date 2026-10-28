import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { freezeToday } from '../test/clock';
import { AppDataWrapper } from '../test/hookWrapper';
import { CAMINHADA, LEITURA, makeAppData } from '../test/makeAppData';
import { seedStorage } from '../test/storage';
import { useDayCompletions } from './useDayCompletions';
import { useHeatmap } from './useHeatmap';

describe('useDayCompletions', () => {
  it('lista as atividades com o estado do dia e o resumo', () => {
    seedStorage(makeAppData({ completions: { '2026-10-27': [LEITURA.id] } }));
    const { result } = renderHook(() => useDayCompletions('2026-10-27'), { wrapper: AppDataWrapper });
    expect(result.current.items).toEqual([
      { activity: CAMINHADA, isDone: false },
      { activity: LEITURA, isDone: true },
    ]);
    expect(result.current.summary).toEqual({ done: 1, total: 2 });
  });

  it('alterna a atividade na data informada usando o dia atual como limite', () => {
    freezeToday();
    seedStorage(makeAppData());
    const { result } = renderHook(() => useDayCompletions('2026-10-26'), { wrapper: AppDataWrapper });
    act(() => result.current.toggleActivity(CAMINHADA.id));
    expect(result.current.summary.done).toBe(1);
  });
});

describe('useHeatmap', () => {
  it('monta a grade do ano com os dias ativos e os anos disponíveis', () => {
    freezeToday();
    seedStorage(makeAppData({ completions: { '2025-05-01': [CAMINHADA.id], '2026-10-20': [CAMINHADA.id] } }));
    const { result } = renderHook(() => useHeatmap(2026), { wrapper: AppDataWrapper });
    expect(result.current.grid).toHaveLength(7);
    expect(result.current.activeDays).toBe(1);
    expect(result.current.years).toEqual([2025, 2026]);
    expect(result.current.hasRecords).toBe(true);
  });

  it('indica quando ainda não há registros', () => {
    freezeToday();
    const { result } = renderHook(() => useHeatmap(2026), { wrapper: AppDataWrapper });
    expect(result.current.hasRecords).toBe(false);
  });
});
