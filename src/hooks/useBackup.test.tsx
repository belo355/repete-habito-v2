import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { serializeBackup } from '../services/backupService';
import * as fileTransfer from '../services/fileTransfer';
import { AppDataWrapper } from '../test/hookWrapper';
import { LEITURA, makeAppData } from '../test/makeAppData';
import { seedStorage } from '../test/storage';
import { useAppData } from './useAppData';
import { useBackup } from './useBackup';

function renderBackup() {
  return renderHook(() => ({ backup: useBackup(), appData: useAppData() }), { wrapper: AppDataWrapper });
}

function makeFile(content: string): File {
  return new File([content], 'backup.json', { type: 'application/json' });
}

describe('useBackup', () => {
  it('exporta os dados atuais em um arquivo com a data no nome', () => {
    seedStorage(makeAppData());
    const download = vi.spyOn(fileTransfer, 'downloadTextFile').mockImplementation(() => undefined);
    const { result } = renderBackup();
    act(() => result.current.backup.exportBackup());
    expect(download.mock.calls[0][0].fileName).toMatch(/^repete-habito-backup-\d{4}-\d{2}-\d{2}\.json$/);
    expect(JSON.parse(download.mock.calls[0][0].content).data).toEqual(makeAppData());
  });

  it('guarda o backup válido aguardando confirmação e só substitui ao confirmar', async () => {
    const imported = makeAppData({ activities: [LEITURA] });
    const { result } = renderBackup();
    await act(() => result.current.backup.selectFile(makeFile(serializeBackup(imported, new Date()))));
    expect(result.current.backup.pendingData).toEqual(imported);
    expect(result.current.appData.data.activities).toHaveLength(7);
    act(() => result.current.backup.confirmImport());
    expect(result.current.appData.data).toEqual(imported);
    expect(result.current.backup.pendingData).toBeNull();
  });

  it('cancela a importação mantendo os dados atuais', async () => {
    const { result } = renderBackup();
    await act(() => result.current.backup.selectFile(makeFile(serializeBackup(makeAppData(), new Date()))));
    act(() => result.current.backup.cancelImport());
    expect(result.current.backup.pendingData).toBeNull();
    expect(result.current.appData.data.activities).toHaveLength(7);
  });

  it('expõe o erro de um arquivo inválido sem alterar os dados', async () => {
    const { result } = renderBackup();
    await act(() => result.current.backup.selectFile(makeFile('{quebrado')));
    expect(result.current.backup.error?.code).toBe('INVALID_JSON');
    expect(result.current.backup.isReading).toBe(false);
    expect(result.current.appData.data.activities).toHaveLength(7);
  });

  it('trata como erro de leitura uma falha inesperada ao abrir o arquivo', async () => {
    vi.spyOn(fileTransfer, 'readBackupFile').mockRejectedValue(new Error('falha de leitura'));
    const { result } = renderBackup();
    await act(() => result.current.backup.selectFile(makeFile('{}')));
    expect(result.current.backup.error?.code).toBe('INVALID_JSON');
  });

  it('considera só o arquivo escolhido por último quando a leitura anterior termina depois', async () => {
    let finishFirstRead: (result: Awaited<ReturnType<typeof fileTransfer.readBackupFile>>) => void = () => undefined;
    vi.spyOn(fileTransfer, 'readBackupFile')
      .mockImplementationOnce(() => new Promise((resolve) => { finishFirstRead = resolve; }))
      .mockResolvedValueOnce({ ok: false, error: { code: 'INVALID_JSON', message: 'Arquivo inválido.' } });
    const { result } = renderBackup();
    let firstSelection: Promise<void> = Promise.resolve();
    act(() => {
      firstSelection = result.current.backup.selectFile(makeFile('primeiro'));
    });
    await act(() => result.current.backup.selectFile(makeFile('segundo')));
    await act(async () => {
      finishFirstRead({ ok: true, data: makeAppData() });
      await firstSelection;
    });
    expect(result.current.backup.pendingData).toBeNull();
    expect(result.current.backup.error?.code).toBe('INVALID_JSON');
    expect(result.current.backup.isReading).toBe(false);
  });

  it('não altera os dados ao confirmar sem backup pendente', () => {
    const { result } = renderBackup();
    act(() => result.current.backup.confirmImport());
    expect(result.current.appData.data.activities).toHaveLength(7);
  });
});
