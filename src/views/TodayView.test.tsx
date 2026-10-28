import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_ACTIVITIES } from '../services/defaultActivities';
import { freezeToday } from '../test/clock';
import { makeAppData } from '../test/makeAppData';
import { renderApp } from '../test/renderApp';
import { seedStorage } from '../test/storage';

describe('TodayView', () => {
  beforeEach(() => {
    freezeToday();
  });

  it('TI-01: marca e desmarca a atividade com um toque e atualiza o resumo', async () => {
    const { user } = renderApp('/');
    expect(screen.getByText('0 de 7 atividades realizadas')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Caminhada não realizada em 27 de outubro' }));
    expect(screen.getByRole('button', { name: 'Caminhada realizada em 27 de outubro' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('1 de 7 atividades realizadas')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Caminhada realizada em 27 de outubro' }));
    expect(screen.getByText('0 de 7 atividades realizadas')).toBeInTheDocument();
  });

  it('TI-02: o primeiro acesso mostra as atividades sugeridas sem pedir cadastro', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Hoje' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(DEFAULT_ACTIVITIES.length);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('TI-07: desabilita o próximo dia quando a data exibida é hoje', () => {
    renderApp('/');
    expect(screen.getByRole('button', { name: 'Próximo dia indisponível' })).toBeDisabled();
  });

  it('TI-07: redireciona uma data futura para hoje', () => {
    renderApp('/dia/2026-10-28');
    expect(screen.getByRole('heading', { level: 1, name: 'Hoje' })).toBeInTheDocument();
  });

  it('redireciona uma data inválida para hoje', () => {
    renderApp('/dia/2026-13-45');
    expect(screen.getByRole('heading', { level: 1, name: 'Hoje' })).toBeInTheDocument();
  });

  it('navega para o dia anterior e volta para hoje', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('link', { name: 'Dia anterior, 26 de outubro' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Segunda-feira' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Próximo dia, 27 de outubro' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Hoje' })).toBeInTheDocument();
  });

  it('registra a atividade na data navegada', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/dia/2026-10-20');
    await user.click(screen.getByRole('button', { name: 'Leitura não realizada em 20 de outubro' }));
    await user.click(screen.getByRole('link', { name: 'Ir para hoje' }));
    expect(screen.getByRole('button', { name: 'Leitura não realizada em 27 de outubro' })).toBeInTheDocument();
  });

  it('mostra estado vazio com link para criar atividades quando não há nenhuma', () => {
    seedStorage(makeAppData({ activities: [] }));
    renderApp('/');
    expect(screen.getByRole('link', { name: 'Criar atividade' })).toHaveAttribute('href', '/atividades');
  });
});
