import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { HeatmapDay } from '../../types/HeatmapDay';
import { HeatmapCell } from './HeatmapCell';

function makeDay(overrides: Partial<HeatmapDay>): HeatmapDay {
  return { dateKey: '2026-10-20', count: 0, level: 0, isFuture: false, activityIds: [], ...overrides };
}

describe('HeatmapCell', () => {
  it('TU-26: exibe rótulo acessível com a data, a quantidade e a intensidade', () => {
    render(<HeatmapCell day={makeDay({ count: 3, level: 3 })} isActive isSelected={false} onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: '20 de outubro, 3 atividades, intensidade 3 de 4' })).toHaveAttribute('tabindex', '0');
  });

  it('TU-26: descreve o dia sem atividades sem citar intensidade', () => {
    render(<HeatmapCell day={makeDay({})} isActive={false} isSelected={false} onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: '20 de outubro, nenhuma atividade' })).toHaveAttribute('tabindex', '-1');
  });

  it('TU-26: célula futura fica marcada como indisponível e não é acionável', async () => {
    const onSelect = vi.fn();
    render(<HeatmapCell day={makeDay({ dateKey: '2026-10-28', isFuture: true })} isActive={false} isSelected={false} onSelect={onSelect} />);
    const cell = screen.getByRole('button', { name: '28 de outubro, dia futuro' });
    expect(cell).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(cell);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('seleciona o dia ao clicar e indica a seleção na célula da grade', async () => {
    const onSelect = vi.fn();
    const day = makeDay({ count: 1, level: 1 });
    render(<HeatmapCell day={day} isActive isSelected onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(day);
    expect(screen.getByRole('gridcell')).toHaveAttribute('aria-selected', 'true');
  });

  it('renderiza célula vazia, sem botão, para dias fora do ano', () => {
    render(<HeatmapCell day={makeDay({ dateKey: null })} isActive={false} isSelected={false} onSelect={vi.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
