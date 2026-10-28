import { describe, expect, it } from 'vitest';
import type { Activity } from '../types/Activity';
import {
  getDayCompletions,
  hasActivityHistory,
  removeActivityCompletions,
  summarizeDay,
  toggleCompletion,
} from './completionRules';

const TODAY = new Date(2026, 9, 27, 10, 0);

function makeActivity(id: string): Activity {
  return { id, name: id, icon: '✅', color: 'orange' };
}

describe('completionRules', () => {
  it('TU-04: adiciona a atividade não registrada no dia sem alterar os outros dias', () => {
    const log = { '2026-10-26': ['leitura'] };
    const result = toggleCompletion(log, { dateKey: '2026-10-27', activityId: 'caminhada', today: TODAY });
    expect(result).toEqual({ '2026-10-26': ['leitura'], '2026-10-27': ['caminhada'] });
  });

  it('TU-05: remove a atividade já registrada e apaga o dia que ficou vazio', () => {
    const log = { '2026-10-27': ['caminhada'] };
    const result = toggleCompletion(log, { dateKey: '2026-10-27', activityId: 'caminhada', today: TODAY });
    expect(result).toEqual({});
  });

  it('TU-05: mantém as outras atividades do dia ao remover uma', () => {
    const log = { '2026-10-27': ['caminhada', 'leitura'] };
    const result = toggleCompletion(log, { dateKey: '2026-10-27', activityId: 'caminhada', today: TODAY });
    expect(result).toEqual({ '2026-10-27': ['leitura'] });
  });

  it('TU-06: ignora a alternância em data futura', () => {
    const log = { '2026-10-27': ['caminhada'] };
    const result = toggleCompletion(log, { dateKey: '2026-10-28', activityId: 'leitura', today: TODAY });
    expect(result).toBe(log);
  });

  it('não altera o registro original ao alternar', () => {
    const log = { '2026-10-27': ['caminhada'] };
    toggleCompletion(log, { dateKey: '2026-10-27', activityId: 'leitura', today: TODAY });
    expect(log).toEqual({ '2026-10-27': ['caminhada'] });
  });

  it('TU-07: resume quantas atividades cadastradas foram feitas no dia', () => {
    const activities = ['a', 'b', 'c', 'd', 'e'].map(makeActivity);
    const log = { '2026-10-27': ['a', 'b', 'c'] };
    expect(summarizeDay(log, '2026-10-27', activities)).toEqual({ done: 3, total: 5 });
  });

  it('TU-07: ignora no resumo registros de atividades que não existem mais', () => {
    const log = { '2026-10-27': ['a', 'removida'] };
    expect(summarizeDay(log, '2026-10-27', [makeActivity('a')])).toEqual({ done: 1, total: 1 });
  });

  it('retorna lista vazia para dia sem registros', () => {
    expect(getDayCompletions({}, '2026-10-27')).toEqual([]);
  });

  it('TU-13: indica histórico quando a atividade tem registros', () => {
    expect(hasActivityHistory({ '2026-10-20': ['a'] }, 'a')).toBe(true);
  });

  it('TU-13: indica ausência de histórico quando a atividade não tem registros', () => {
    expect(hasActivityHistory({ '2026-10-20': ['b'] }, 'a')).toBe(false);
  });

  it('remove os registros de uma atividade em todos os dias e apaga dias vazios', () => {
    const log = { '2026-10-20': ['a'], '2026-10-21': ['a', 'b'] };
    expect(removeActivityCompletions(log, 'a')).toEqual({ '2026-10-21': ['b'] });
  });
});
