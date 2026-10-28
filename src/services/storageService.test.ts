import { describe, expect, it, vi } from 'vitest';
import { makeAppData } from '../test/makeAppData';
import { DEFAULT_ACTIVITIES } from './defaultActivities';
import { clearAppData, createInitialAppData, loadAppData, saveAppData, STORAGE_KEY } from './storageService';

describe('storageService', () => {
  it('TU-22: retorna o estado inicial com atividades sugeridas quando não há dados salvos', () => {
    expect(loadAppData()).toEqual({ version: 1, activities: [...DEFAULT_ACTIVITIES], completions: {} });
  });

  it('TU-22: retorna o estado inicial quando o conteúdo salvo está corrompido', () => {
    localStorage.setItem(STORAGE_KEY, '{corrompido');
    expect(loadAppData()).toEqual(createInitialAppData());
  });

  it('TU-22: retorna o estado inicial quando o conteúdo salvo tem formato inválido', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, activities: [] }));
    expect(loadAppData()).toEqual(createInitialAppData());
  });

  it('carrega os dados gravados anteriormente', () => {
    const data = makeAppData({ completions: { '2026-10-27': ['default-leitura'] } });
    saveAppData(data);
    expect(loadAppData()).toEqual(data);
  });

  it('TU-23: retorna erro de cota sem lançar quando o armazenamento está cheio', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('cheio', 'QuotaExceededError');
    });
    expect(saveAppData(makeAppData())).toEqual({ ok: false, error: 'QUOTA_EXCEEDED' });
  });

  it('retorna erro de indisponibilidade para outras falhas de gravação', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(saveAppData(makeAppData())).toEqual({ ok: false, error: 'UNAVAILABLE' });
  });

  it('usa o estado inicial quando a leitura do armazenamento falha', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(loadAppData()).toEqual(createInitialAppData());
  });

  it('apaga os dados salvos e não lança quando a remoção falha', () => {
    saveAppData(makeAppData());
    clearAppData();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(() => clearAppData()).not.toThrow();
  });

  it('cria cópias das atividades sugeridas no estado inicial', () => {
    expect(createInitialAppData().activities[0]).not.toBe(DEFAULT_ACTIVITIES[0]);
  });
});
