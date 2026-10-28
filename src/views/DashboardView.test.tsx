import { act, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { freezeToday } from '../test/clock';
import { CAMINHADA, LEITURA, makeAppData } from '../test/makeAppData';
import { renderApp } from '../test/renderApp';
import { seedStorage } from '../test/storage';

const FIVE_ACTIVITIES = ['a', 'b', 'c', 'd', 'e'].map((id: string) => ({ id, name: `Atividade ${id}`, icon: '✅', color: 'orange' as const }));

describe('DashboardView', () => {
  beforeEach(() => {
    freezeToday();
  });

  it('TI-08: mostra intensidades diferentes para 1 e 5 atividades e o total de dias ativos', () => {
    seedStorage(makeAppData({ activities: FIVE_ACTIVITIES, completions: { '2026-10-19': ['a'], '2026-10-20': ['a', 'b', 'c', 'd', 'e'] } }));
    renderApp('/dashboard');
    expect(screen.getByRole('button', { name: '19 de outubro, 1 atividade, intensidade 1 de 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '20 de outubro, 5 atividades, intensidade 4 de 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '21 de outubro, nenhuma atividade' })).toBeInTheDocument();
    expect(screen.getByText('dias ativos', { exact: false })).toHaveTextContent('2 dias ativos');
  });

  it('TI-09: clicar em uma célula mostra o detalhe do dia com link para registrar nele', async () => {
    seedStorage(makeAppData({ completions: { '2026-10-20': [CAMINHADA.id, LEITURA.id] } }));
    const { user } = renderApp('/dashboard');
    await user.click(screen.getByRole('button', { name: /^20 de outubro/ }));
    const details = screen.getByRole('region', { name: 'Detalhes do dia' });
    expect(details).toHaveTextContent('terça-feira, 20 de outubro de 2026');
    expect(details).toHaveTextContent('Caminhada, Leitura');
    await user.click(within(details).getByRole('link', { name: 'Registrar neste dia' }));
    expect(screen.getByRole('button', { name: 'Caminhada realizada em 20 de outubro' })).toBeInTheDocument();
  });

  it('TI-09: focar uma célula pelo teclado mostra o detalhe e as setas mudam o dia', async () => {
    seedStorage(makeAppData({ completions: { '2026-10-26': [CAMINHADA.id] } }));
    const { user } = renderApp('/dashboard');
    act(() => screen.getByRole('button', { name: /^27 de outubro/ }).focus());
    expect(screen.getByRole('region', { name: 'Detalhes do dia' })).toHaveTextContent('27 de outubro');
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: /^26 de outubro/ })).toHaveFocus();
    expect(screen.getByRole('region', { name: 'Detalhes do dia' })).toHaveTextContent('Caminhada');
  });

  it('TI-10: sem registros mostra estado vazio com ação para a tela de registro', async () => {
    const { user } = renderApp('/dashboard');
    expect(screen.getByRole('heading', { name: 'Nenhum registro ainda' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Registrar atividade' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Hoje' })).toBeInTheDocument();
  });

  it('TI-06: registrar ontem pela tela de registro reflete no mapa de calor', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/dia/2026-10-26');
    await user.click(screen.getByRole('button', { name: 'Leitura não realizada em 26 de outubro' }));
    await user.click(screen.getByRole('link', { name: 'Dashboard' }));
    expect(screen.getByRole('button', { name: '26 de outubro, 1 atividade, intensidade 1 de 4' })).toBeInTheDocument();
  });

  it('TI-04: renomear uma atividade com registros mantém o histórico no detalhe do dashboard', async () => {
    seedStorage(makeAppData({ completions: { '2026-10-20': [CAMINHADA.id] } }));
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Editar Caminhada' }));
    const nameInput = screen.getByRole('form', { name: 'Editar Caminhada' }).querySelector('input[type="text"]');
    await user.clear(nameInput as HTMLInputElement);
    await user.type(nameInput as HTMLInputElement, 'Corrida leve');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));
    await user.click(screen.getByRole('link', { name: 'Dashboard' }));
    await user.click(screen.getByRole('button', { name: /^20 de outubro/ }));
    expect(screen.getByRole('region', { name: 'Detalhes do dia' })).toHaveTextContent('Corrida leve');
  });

  it('mostra "Nenhuma atividade registrada" no detalhe de um dia vazio (regressão BUG-03)', async () => {
    seedStorage(makeAppData({ completions: { '2026-10-20': [CAMINHADA.id] } }));
    const { user } = renderApp('/dashboard');
    await user.click(screen.getByRole('button', { name: /^21 de outubro/ }));
    expect(screen.getByRole('region', { name: 'Detalhes do dia' })).toHaveTextContent('Nenhuma atividade registrada');
  });

  it('não mantém o detalhe de um dia de outro ano ao trocar o ano exibido', async () => {
    seedStorage(makeAppData({ completions: { '2025-03-10': [CAMINHADA.id], '2026-10-20': [CAMINHADA.id] } }));
    const { user } = renderApp('/dashboard');
    await user.click(screen.getByRole('button', { name: /^20 de outubro/ }));
    await user.click(screen.getByRole('button', { name: 'Ano anterior' }));
    expect(screen.queryByRole('region', { name: 'Detalhes do dia' })).not.toBeInTheDocument();
    expect(screen.getByText('Toque em um dia do mapa para ver o que foi feito.')).toBeInTheDocument();
  });

  it('navega entre os anos com registros', async () => {
    seedStorage(makeAppData({ completions: { '2025-03-10': [CAMINHADA.id] } }));
    const { user } = renderApp('/dashboard');
    expect(screen.getByRole('button', { name: 'Próximo ano' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Ano anterior' }));
    expect(screen.getByRole('grid', { name: 'Mapa de atividades de 2025' })).toBeInTheDocument();
    expect(screen.getByText('dia ativo', { exact: false })).toHaveTextContent('1 dia ativo');
  });
});
