import { describe, expect, it, vi } from 'vitest';
import { makeAppData } from '../test/makeAppData';
import { MAX_BACKUP_SIZE_BYTES, serializeBackup } from './backupService';
import { downloadTextFile, readBackupFile } from './fileTransfer';

function stubObjectUrls() {
  const createObjectURL = vi.fn(() => 'blob:backup');
  const revokeObjectURL = vi.fn();
  vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
  return { revokeObjectURL };
}

describe('fileTransfer', () => {
  it('clica no link com o nome do arquivo enquanto ele está no documento e depois o remove', () => {
    stubObjectUrls();
    let wasAttachedOnClick = false;
    let downloadName = '';
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      wasAttachedOnClick = document.body.contains(this);
      downloadName = this.download;
    });
    downloadTextFile({ fileName: 'backup.json', content: '{}' });
    expect(wasAttachedOnClick).toBe(true);
    expect(downloadName).toBe('backup.json');
    expect(document.querySelector('a[download]')).toBeNull();
  });

  it('libera a URL temporária só depois que o navegador inicia o download', () => {
    vi.useFakeTimers();
    const { revokeObjectURL } = stubObjectUrls();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    downloadTextFile({ fileName: 'backup.json', content: '{}' });
    expect(revokeObjectURL).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:backup');
  });

  it('lê e valida um arquivo de backup', async () => {
    const file = new File([serializeBackup(makeAppData(), new Date())], 'backup.json');
    expect(await readBackupFile(file)).toEqual({ ok: true, data: makeAppData() });
  });

  it('rejeita arquivos maiores que o limite sem lê-los', async () => {
    const file = new File(['x'], 'grande.json');
    Object.defineProperty(file, 'size', { value: MAX_BACKUP_SIZE_BYTES + 1 });
    const result = await readBackupFile(file);
    expect(result.ok === false && result.error.code).toBe('INVALID_FORMAT');
  });
});
