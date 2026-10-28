import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('abre na tela de hoje com a marca da aplicação', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Repete Hábito' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hoje' })).toHaveAttribute('aria-current', 'page');
  });
});
