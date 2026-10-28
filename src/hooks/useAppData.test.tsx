import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppDataWrapper } from '../test/hookWrapper';
import { CAMINHADA, makeAppData } from '../test/makeAppData';
import { readStorage, seedStorage } from '../test/storage';
import { useAppData } from './useAppData';

const TODAY = new Date(2026, 9, 27, 10, 0);

function renderAppData() {
  return renderHook(() => useAppData(), { wrapper: AppDataWrapper });
}

describe('useAppData', () => {
  it('TI-11: os registros persistem ao desmontar e montar o provider novamente', () => {
    const first = renderAppData();
    act(() => first.result.current.toggle({ dateKey: '2026-10-27', activityId: 'default-caminhada', today: TODAY }));
    first.unmount();
    const second = renderAppData();
    expect(second.result.current.data.completions).toEqual({ '2026-10-27': ['default-caminhada'] });
  });

  it('carrega os dados já salvos no navegador', () => {
    seedStorage(makeAppData());
    expect(renderAppData().result.current.data.activities).toEqual(makeAppData().activities);
  });

  it('grava cada alteração no navegador imediatamente', () => {
    seedStorage(makeAppData());
    const { result } = renderAppData();
    act(() => result.current.moveActivity('default-leitura', 'up'));
    expect(readStorage()).toEqual(result.current.data);
  });

  it('devolve o erro de validação e não cria atividade com nome duplicado', () => {
    seedStorage(makeAppData());
    const { result } = renderAppData();
    let error: ReturnType<typeof result.current.createActivity> = null;
    act(() => {
      error = result.current.createActivity({ name: 'caminhada' });
    });
    expect(error).toMatchObject({ code: 'NAME_DUPLICATE' });
    expect(result.current.data.activities).toHaveLength(2);
  });

  it('edita a atividade quando o nome é válido e recusa nome vazio', () => {
    seedStorage(makeAppData());
    const { result } = renderAppData();
    act(() => {
      expect(result.current.updateActivity(CAMINHADA.id, { name: 'Caminhada leve' })).toBeNull();
    });
    act(() => {
      expect(result.current.updateActivity(CAMINHADA.id, { name: ' ' })).toMatchObject({ code: 'NAME_REQUIRED' });
    });
    expect(result.current.data.activities[0].name).toBe('Caminhada leve');
  });

  it('expõe a falha de gravação e permite dispensar o aviso', () => {
    const { result } = renderAppData();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('cheio', 'QuotaExceededError');
    });
    act(() => result.current.removeActivity('default-caminhada'));
    expect(result.current.saveError).toBe('QUOTA_EXCEEDED');
    act(() => result.current.dismissSaveError());
    expect(result.current.saveError).toBeNull();
  });

  it('não grava nada quando a ação não muda os dados', () => {
    const { result } = renderAppData();
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    act(() => result.current.toggle({ dateKey: '2026-12-31', activityId: 'default-caminhada', today: TODAY }));
    expect(setItem).not.toHaveBeenCalled();
  });

  it('lança erro claro quando usado fora do provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useAppData())).toThrow('useAppData precisa ser usado dentro de AppDataProvider');
  });
});
