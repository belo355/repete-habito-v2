import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AppDataProvider } from '../../hooks/AppDataProvider';
import { useAppData } from '../../hooks/useAppData';
import { renderApp } from '../../test/renderApp';
import { AppLayout } from './AppLayout';
import { SAVE_ERROR_MESSAGE } from './SaveErrorNotice';

const TODAY = new Date(2026, 9, 27, 10, 0);

function TogglePanel() {
  const { data, toggle } = useAppData();
  const doneCount = data.completions['2026-10-27']?.length ?? 0;
  return (
    <button type="button" onClick={() => toggle({ dateKey: '2026-10-27', activityId: 'default-caminhada', today: TODAY })}>
      Marcar caminhada ({doneCount} feitas)
    </button>
  );
}

function renderLayoutWithPanel() {
  render(
    <MemoryRouter>
      <AppDataProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<TogglePanel />} />
          </Route>
        </Routes>
      </AppDataProvider>
    </MemoryRouter>,
  );
}

describe('AppLayout', () => {
  it('mostra a navegação principal com os três destinos', () => {
    renderApp('/');
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Hoje|Dashboard|Atividades/ })).toHaveLength(3);
  });

  it('marca o destino atual com aria-current e navega ao clicar', async () => {
    const { user } = renderApp('/');
    expect(screen.getByRole('link', { name: 'Hoje' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('link', { name: 'Dashboard' }));
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
  });

  it('redireciona uma rota desconhecida para a tela de hoje', () => {
    renderApp('/rota-inexistente');
    expect(screen.getByRole('link', { name: 'Hoje' })).toHaveAttribute('aria-current', 'page');
  });

  it('TI-14: falha de gravação exibe aviso sem perder o registro feito na tela', async () => {
    const user = userEvent.setup();
    renderLayoutWithPanel();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('cheio', 'QuotaExceededError');
    });
    await user.click(screen.getByRole('button', { name: /Marcar caminhada/ }));
    expect(screen.getByRole('alert')).toHaveTextContent(SAVE_ERROR_MESSAGE);
    expect(screen.getByRole('button', { name: 'Marcar caminhada (1 feitas)' })).toBeInTheDocument();
  });

  it('TI-14: permite fechar o aviso de falha de gravação', async () => {
    const user = userEvent.setup();
    renderLayoutWithPanel();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    await user.click(screen.getByRole('button', { name: /Marcar caminhada/ }));
    await user.click(screen.getByRole('button', { name: 'Fechar aviso' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
