import { describe, expect, it } from 'vitest';
import { CAMINHADA, LEITURA } from '../test/makeAppData';
import { resolveMoveFocus } from './activityFocus';

const CORRIDA = { id: 'corrida', name: 'Corrida', icon: '🏃', color: 'green' as const };
const ACTIVITIES = [CAMINHADA, LEITURA, CORRIDA];

describe('resolveMoveFocus', () => {
  it('pede foco no botão de subir quando a atividade vai para o fim', () => {
    expect(resolveMoveFocus(ACTIVITIES, LEITURA.id, 'down')).toEqual({ kind: 'item', activityId: LEITURA.id, target: 'move-up' });
  });

  it('pede foco no botão de descer quando a atividade vai para o topo', () => {
    expect(resolveMoveFocus(ACTIVITIES, LEITURA.id, 'up')).toEqual({ kind: 'item', activityId: LEITURA.id, target: 'move-down' });
  });

  it('não pede mudança de foco quando o movimento é impossível ou o id não existe', () => {
    expect(resolveMoveFocus(ACTIVITIES, CAMINHADA.id, 'up')).toBeNull();
    expect(resolveMoveFocus(ACTIVITIES, 'inexistente', 'down')).toBeNull();
  });
});
