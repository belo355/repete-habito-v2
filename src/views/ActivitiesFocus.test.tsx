import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CAMINHADA, LEITURA, makeAppData } from '../test/makeAppData';
import { renderApp } from '../test/renderApp';
import { seedStorage } from '../test/storage';

const CORRIDA = { id: 'default-corrida', name: 'Corrida', icon: '🏃', color: 'green' as const };

describe('ActivitiesView — foco após ações (regressão BUG-01)', () => {
  it('devolve o foco ao botão Editar depois de salvar a edição', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Editar Caminhada' }));
    await user.click(within(screen.getByRole('form', { name: 'Editar Caminhada' })).getByRole('button', { name: 'Salvar alterações' }));
    expect(screen.getByRole('button', { name: 'Editar Caminhada' })).toHaveFocus();
  });

  it('devolve o foco ao botão Editar depois de cancelar a edição', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Editar Leitura' }));
    await user.click(within(screen.getByRole('form', { name: 'Editar Leitura' })).getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('button', { name: 'Editar Leitura' })).toHaveFocus();
  });

  it('leva o foco para a lista depois de remover uma atividade sem histórico', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Remover Leitura' }));
    expect(screen.getByRole('list', { name: 'Lista de atividades' })).toHaveFocus();
  });

  it('leva o foco para a lista depois de confirmar a remoção no diálogo', async () => {
    seedStorage(makeAppData({ completions: { '2026-10-20': [CAMINHADA.id] } }));
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Remover Caminhada' }));
    await user.click(screen.getByRole('button', { name: 'Remover' }));
    expect(screen.getByRole('list', { name: 'Lista de atividades' })).toHaveFocus();
  });

  it('move o foco para o botão oposto quando a atividade chega ao fim da lista', async () => {
    seedStorage(makeAppData({ activities: [CAMINHADA, LEITURA, CORRIDA] }));
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Mover Leitura para baixo' }));
    expect(screen.getByRole('button', { name: 'Mover Leitura para cima' })).toHaveFocus();
  });

  it('move o foco para o botão oposto quando a atividade chega ao topo da lista', async () => {
    seedStorage(makeAppData({ activities: [CAMINHADA, LEITURA, CORRIDA] }));
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Mover Leitura para cima' }));
    expect(screen.getByRole('button', { name: 'Mover Leitura para baixo' })).toHaveFocus();
  });

  it('mantém o foco no mesmo botão quando a atividade não chega a um extremo', async () => {
    seedStorage(makeAppData({ activities: [CAMINHADA, LEITURA, CORRIDA, { ...CORRIDA, id: 'x', name: 'Natação' }] }));
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Mover Caminhada para baixo' }));
    expect(screen.getByRole('button', { name: 'Mover Caminhada para baixo' })).toHaveFocus();
  });
});
