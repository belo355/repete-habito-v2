import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CAMINHADA } from '../../test/makeAppData';
import { ActivityToggle } from './ActivityToggle';
import { DaySummary } from './DaySummary';

describe('ActivityToggle', () => {
  it('TU-25: expõe aria-pressed verdadeiro e rótulo com nome, estado e data quando realizada', () => {
    render(<ActivityToggle activity={CAMINHADA} isDone dateKey="2026-10-27" onToggle={vi.fn()} />);
    const toggle = screen.getByRole('button', { name: 'Caminhada realizada em 27 de outubro' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('realizada')).toBeVisible();
  });

  it('TU-25: expõe aria-pressed falso e o estado em texto quando não realizada', () => {
    render(<ActivityToggle activity={CAMINHADA} isDone={false} dateKey="2026-10-27" onToggle={vi.fn()} />);
    const toggle = screen.getByRole('button', { name: 'Caminhada não realizada em 27 de outubro' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('não realizada')).toBeVisible();
  });

  it('TU-25: avisa qual atividade foi tocada', async () => {
    const onToggle = vi.fn();
    render(<ActivityToggle activity={CAMINHADA} isDone={false} dateKey="2026-10-27" onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith('default-caminhada');
  });
});

describe('DaySummary', () => {
  it('usa o singular quando há apenas uma atividade', () => {
    render(<DaySummary summary={{ done: 0, total: 1 }} />);
    expect(screen.getByText('0 de 1 atividade realizada')).toBeInTheDocument();
  });

  it('comemora quando todas as atividades do dia foram feitas', () => {
    render(<DaySummary summary={{ done: 2, total: 2 }} />);
    expect(screen.getByText('Tudo feito!')).toBeInTheDocument();
  });
});
