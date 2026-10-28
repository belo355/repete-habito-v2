import { describe, expect, it } from 'vitest';
import { DEFAULT_ACTIVITIES } from '../services/defaultActivities';
import { CAMINHADA, LEITURA, makeAppData } from '../test/makeAppData';
import { appDataReducer } from './appDataReducer';

const TODAY = new Date(2026, 9, 27, 10, 0);

describe('appDataReducer', () => {
  it('TU-24: alterna o registro do dia sem mutar o estado anterior', () => {
    const state = makeAppData();
    const toggle = { dateKey: '2026-10-27', activityId: CAMINHADA.id, today: TODAY };
    const next = appDataReducer(state, { type: 'toggle', toggle });
    expect(next.completions).toEqual({ '2026-10-27': [CAMINHADA.id] });
    expect(state.completions).toEqual({});
  });

  it('TU-24: cria uma atividade no final da lista', () => {
    const next = appDataReducer(makeAppData(), { type: 'createActivity', input: { name: 'Yoga' } });
    expect(next.activities.map((activity) => activity.name)).toEqual(['Caminhada', 'Leitura', 'Yoga']);
  });

  it('TU-24: edita uma atividade mantendo o id', () => {
    const next = appDataReducer(makeAppData(), {
      type: 'updateActivity',
      id: LEITURA.id,
      input: { name: 'Leitura noturna', icon: '🌙', color: 'purple' },
    });
    expect(next.activities[1]).toEqual({ id: LEITURA.id, name: 'Leitura noturna', icon: '🌙', color: 'purple' });
  });

  it('TU-24: remove a atividade e seus registros', () => {
    const state = makeAppData({ completions: { '2026-10-27': [CAMINHADA.id, LEITURA.id] } });
    const next = appDataReducer(state, { type: 'removeActivity', id: CAMINHADA.id });
    expect(next.activities).toEqual([LEITURA]);
    expect(next.completions).toEqual({ '2026-10-27': [LEITURA.id] });
  });

  it('TU-24: reordena a atividade', () => {
    const next = appDataReducer(makeAppData(), { type: 'moveActivity', id: LEITURA.id, direction: 'up' });
    expect(next.activities).toEqual([LEITURA, CAMINHADA]);
  });

  it('TU-24: substitui todos os dados', () => {
    const data = makeAppData({ activities: [LEITURA] });
    expect(appDataReducer(makeAppData(), { type: 'replaceAll', data })).toBe(data);
  });

  it('TU-24: volta ao estado de primeiro acesso', () => {
    const next = appDataReducer(makeAppData({ completions: { '2026-10-27': [CAMINHADA.id] } }), { type: 'resetAll' });
    expect(next).toEqual({ version: 1, activities: [...DEFAULT_ACTIVITIES], completions: {} });
  });
});
