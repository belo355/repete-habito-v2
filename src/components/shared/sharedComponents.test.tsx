import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';
import { Toast } from './Toast';

describe('EmptyState', () => {
  it('exibe título, descrição e a ação para o destino informado', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Nada por aqui" description="Registre sua primeira atividade." actionLabel="Registrar" actionTo="/" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('region', { name: 'Nada por aqui' })).toHaveTextContent('Registre sua primeira atividade.');
    expect(screen.getByRole('link', { name: 'Registrar' })).toHaveAttribute('href', '/');
  });
});

describe('Toast', () => {
  it('anuncia sucesso como status e sem botão de fechar quando não há ação', () => {
    render(<Toast tone="success" message="Backup importado." />);
    expect(screen.getByRole('status')).toHaveTextContent('Backup importado.');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('anuncia erro como alerta', () => {
    render(<Toast tone="error" message="Arquivo inválido." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Arquivo inválido.');
  });
});
