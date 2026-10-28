import { describe, expect, it } from 'vitest';
import type { Activity } from '../types/Activity';
import {
  createActivity,
  moveActivity,
  removeActivity,
  updateActivity,
  validateActivityName,
} from './activityRules';

const YOGA: Activity = { id: 'yoga', name: 'Yoga', icon: '🧘', color: 'green' };
const CORRIDA: Activity = { id: 'corrida', name: 'Corrida', icon: '🏃', color: 'blue' };
const LEITURA: Activity = { id: 'leitura', name: 'Leitura', icon: '📚', color: 'teal' };

describe('validateActivityName', () => {
  it('TU-08: rejeita nome vazio ou só com espaços', () => {
    expect(validateActivityName('   ', [])?.code).toBe('NAME_REQUIRED');
  });

  it('TU-08: rejeita nome com mais de 40 caracteres', () => {
    expect(validateActivityName('a'.repeat(41), [])?.code).toBe('NAME_TOO_LONG');
  });

  it('TU-08: aceita nome com exatamente 40 caracteres', () => {
    expect(validateActivityName('a'.repeat(40), [])).toBeNull();
  });

  it('TU-09: rejeita duplicado sem diferenciar maiúsculas e minúsculas', () => {
    const error = validateActivityName(' yoga ', [YOGA]);
    expect(error).toEqual({ code: 'NAME_DUPLICATE', message: 'Já existe uma atividade com esse nome.' });
  });

  it('TU-09: aceita o próprio nome ao editar a mesma atividade', () => {
    expect(validateActivityName('YOGA', [YOGA], 'yoga')).toBeNull();
  });
});

describe('createActivity', () => {
  it('TU-10: adiciona ao final, remove espaços das pontas e aplica ícone e cor padrão', () => {
    const result = createActivity({ name: '  Natação  ' }, [YOGA]);
    expect(result).toHaveLength(2);
    expect(result[1]).toMatchObject({ name: 'Natação', icon: '✅', color: 'orange' });
    expect(result[1].id).not.toBe('');
  });

  it('TU-10: não altera a lista original', () => {
    const activities = [YOGA];
    createActivity({ name: 'Natação' }, activities);
    expect(activities).toEqual([YOGA]);
  });
});

describe('updateActivity', () => {
  it('TU-11: mantém o id e altera nome, ícone e cor', () => {
    const result = updateActivity('corrida', { name: 'Corrida leve', icon: '👟', color: 'pink' }, [CORRIDA]);
    expect(result).toEqual([{ id: 'corrida', name: 'Corrida leve', icon: '👟', color: 'pink' }]);
  });
});

describe('removeActivity', () => {
  it('TU-12: remove a atividade e seus registros em todos os dias', () => {
    const data = {
      version: 1 as const,
      activities: [YOGA, CORRIDA],
      completions: { '2026-10-25': ['yoga'], '2026-10-26': ['yoga', 'corrida'] },
    };
    const result = removeActivity('yoga', data);
    expect(result.activities).toEqual([CORRIDA]);
    expect(result.completions).toEqual({ '2026-10-26': ['corrida'] });
  });
});

describe('moveActivity', () => {
  it('TU-14: troca a posição com a vizinha de baixo', () => {
    const result = moveActivity('yoga', 'down', [YOGA, CORRIDA, LEITURA]);
    expect(result.map((activity) => activity.id)).toEqual(['corrida', 'yoga', 'leitura']);
  });

  it('TU-14: mantém a ordem ao mover a primeira para cima', () => {
    const activities = [YOGA, CORRIDA];
    expect(moveActivity('yoga', 'up', activities)).toBe(activities);
  });

  it('TU-14: mantém a ordem ao mover a última para baixo ou um id inexistente', () => {
    const activities = [YOGA, CORRIDA];
    expect(moveActivity('corrida', 'down', activities)).toBe(activities);
    expect(moveActivity('inexistente', 'up', activities)).toBe(activities);
  });
});
