import { describe, expect, it } from 'vitest';
import {
  formatDateKey,
  formatLongDateKey,
  fromDateKey,
  getDateKeyYear,
  isFutureDateKey,
  isValidDateKey,
  shiftDateKey,
  toDateKey,
} from './dateKeys';

const TODAY = new Date(2026, 9, 27, 10, 0);

describe('dateKeys', () => {
  it('TU-01: converte a data local em chave sem deslocar o dia perto da meia-noite', () => {
    expect(toDateKey(new Date(2026, 9, 27, 23, 30))).toBe('2026-10-27');
  });

  it('TU-01: converte a chave de volta para a mesma data local', () => {
    const date = fromDateKey('2026-10-27');
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 9, 27]);
  });

  it('TU-02: identifica amanhã como data futura', () => {
    expect(isFutureDateKey('2026-10-28', TODAY)).toBe(true);
  });

  it('TU-02: não considera hoje nem ontem como datas futuras', () => {
    expect(isFutureDateKey('2026-10-27', TODAY)).toBe(false);
    expect(isFutureDateKey('2026-10-26', TODAY)).toBe(false);
  });

  it('TU-03: volta um dia atravessando a virada de ano', () => {
    expect(shiftDateKey('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('TU-03: avança um dia atravessando a virada de mês', () => {
    expect(shiftDateKey('2026-02-28', 1)).toBe('2026-03-01');
  });

  it('aceita somente chaves no formato AAAA-MM-DD com data existente', () => {
    expect(isValidDateKey('2026-10-27')).toBe(true);
    expect(isValidDateKey('2026-02-30')).toBe(false);
    expect(isValidDateKey('27/10/2026')).toBe(false);
  });

  it('extrai o ano da chave', () => {
    expect(getDateKeyYear('2025-12-31')).toBe(2025);
  });

  it('formata a data em português do Brasil', () => {
    expect(formatDateKey('2026-10-27')).toBe('27 de outubro');
    expect(formatLongDateKey('2026-10-27')).toBe('terça-feira, 27 de outubro de 2026');
  });
});
