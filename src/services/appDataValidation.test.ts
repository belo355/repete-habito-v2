import { describe, expect, it } from 'vitest';
import { CAMINHADA, makeAppData } from '../test/makeAppData';
import { isAppData } from './appDataValidation';

describe('isAppData', () => {
  it('aceita dados completos e consistentes', () => {
    expect(isAppData(makeAppData({ completions: { '2026-10-27': ['default-caminhada'] } }))).toBe(true);
  });

  it('rejeita valores que não são objetos ou têm outra versão', () => {
    expect(isAppData(null)).toBe(false);
    expect(isAppData({ ...makeAppData(), version: 2 })).toBe(false);
  });

  it('rejeita atividades com cor desconhecida ou nome vazio', () => {
    expect(isAppData(makeAppData({ activities: [{ ...CAMINHADA, color: 'black' as 'orange' }] }))).toBe(false);
    expect(isAppData(makeAppData({ activities: [{ ...CAMINHADA, name: ' ' }] }))).toBe(false);
  });

  it('rejeita atividades com id duplicado', () => {
    expect(isAppData(makeAppData({ activities: [CAMINHADA, { ...CAMINHADA, name: 'Outra' }] }))).toBe(false);
  });

  it('rejeita chave de data inválida', () => {
    expect(isAppData(makeAppData({ completions: { '27/10/2026': ['default-caminhada'] } }))).toBe(false);
  });

  it('rejeita registros de atividades inexistentes, repetidos ou dias vazios', () => {
    expect(isAppData(makeAppData({ completions: { '2026-10-27': ['inexistente'] } }))).toBe(false);
    expect(isAppData(makeAppData({ completions: { '2026-10-27': ['default-caminhada', 'default-caminhada'] } }))).toBe(false);
    expect(isAppData(makeAppData({ completions: { '2026-10-27': [] } }))).toBe(false);
  });

  it('rejeita registros que não são um objeto', () => {
    expect(isAppData({ ...makeAppData(), completions: [] })).toBe(false);
  });
});
