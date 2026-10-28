import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { freezeToday } from '../test/clock';
import { CAMINHADA, LEITURA, makeAppData } from '../test/makeAppData';
import { renderApp } from '../test/renderApp';
import { readStorage, seedStorage } from '../test/storage';

function newActivityForm() {
  return within(screen.getByRole('form', { name: 'Nova atividade' }));
}

describe('ActivitiesView — gerenciamento', () => {
  beforeEach(() => {
    freezeToday();
  });

  it('TI-03: cria uma atividade que passa a aparecer na tela de registro', async () => {
    const { user } = renderApp('/atividades');
    await user.type(newActivityForm().getByLabelText('Nome da atividade'), 'Yoga');
    await user.click(newActivityForm().getByRole('radio', { name: 'Ícone Meditação' }));
    await user.click(newActivityForm().getByRole('button', { name: 'Adicionar atividade' }));
    expect(newActivityForm().getByLabelText('Nome da atividade')).toHaveValue('');
    await user.click(screen.getByRole('link', { name: 'Hoje' }));
    expect(screen.getByRole('button', { name: 'Yoga não realizada em 27 de outubro' })).toBeInTheDocument();
  });

  it('TI-03: recusa nome duplicado com erro associado ao campo', async () => {
    seedStorage(makeAppData({ activities: [{ ...CAMINHADA, id: 'yoga', name: 'Yoga' }] }));
    const { user } = renderApp('/atividades');
    const nameInput = newActivityForm().getByLabelText('Nome da atividade');
    await user.type(nameInput, 'yoga');
    await user.click(newActivityForm().getByRole('button', { name: 'Adicionar atividade' }));
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAccessibleDescription(/Já existe uma atividade com esse nome\./);
    await user.type(nameInput, 'x');
    expect(nameInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('TI-05: remover atividade com histórico pede confirmação e cancelar mantém tudo', async () => {
    seedStorage(makeAppData({ completions: { '2026-10-26': [CAMINHADA.id] } }));
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Remover Caminhada' }));
    expect(screen.getByRole('dialog', { name: 'Remover Caminhada?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(readStorage()).toEqual(makeAppData({ completions: { '2026-10-26': [CAMINHADA.id] } }));
  });

  it('TI-05: confirmar a remoção apaga a atividade e seus registros', async () => {
    seedStorage(makeAppData({ completions: { '2026-10-26': [CAMINHADA.id, LEITURA.id] } }));
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Remover Caminhada' }));
    await user.click(screen.getByRole('button', { name: 'Remover' }));
    expect(screen.queryByText('Caminhada')).not.toBeInTheDocument();
    expect(readStorage()).toEqual(makeAppData({ activities: [LEITURA], completions: { '2026-10-26': [LEITURA.id] } }));
  });

  it('remove direto, sem confirmação, uma atividade sem histórico', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Remover Leitura' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Leitura')).not.toBeInTheDocument();
  });

  it('edita nome e cor mantendo a atividade, e permite cancelar a edição', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Editar Caminhada' }));
    const editForm = within(screen.getByRole('form', { name: 'Editar Caminhada' }));
    await user.clear(editForm.getByLabelText('Nome da atividade'));
    await user.type(editForm.getByLabelText('Nome da atividade'), 'Caminhada leve');
    await user.click(editForm.getByRole('radio', { name: 'Cor Verde' }));
    await user.click(editForm.getByRole('button', { name: 'Salvar alterações' }));
    expect(readStorage()).toMatchObject({ activities: [{ id: CAMINHADA.id, name: 'Caminhada leve', color: 'green' }, LEITURA] });
    await user.click(screen.getByRole('button', { name: 'Editar Leitura' }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('form', { name: 'Editar Leitura' })).not.toBeInTheDocument();
  });

  it('mantém a edição aberta e mostra o erro quando o nome fica vazio', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Editar Caminhada' }));
    const editForm = within(screen.getByRole('form', { name: 'Editar Caminhada' }));
    await user.clear(editForm.getByLabelText('Nome da atividade'));
    await user.click(editForm.getByRole('button', { name: 'Salvar alterações' }));
    expect(editForm.getByText('Informe um nome para a atividade.')).toBeInTheDocument();
  });

  it('reordena atividades e desabilita os movimentos nos extremos', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    expect(screen.getByRole('button', { name: 'Mover Caminhada para cima' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Mover Caminhada para baixo' }));
    expect(readStorage()).toMatchObject({ activities: [LEITURA, CAMINHADA] });
    expect(screen.getByRole('button', { name: 'Mover Caminhada para baixo' })).toBeDisabled();
  });
});
