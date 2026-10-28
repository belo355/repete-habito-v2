import { describe, expect, it } from 'vitest';
import { makeAppData } from '../test/makeAppData';
import { buildBackupFileName, parseBackup, serializeBackup, toBackupFile } from './backupService';

const EXPORTED_AT = new Date(2026, 9, 27, 19, 10);

function makeBackupContent(overrides: Record<string, unknown>): string {
  return JSON.stringify({ ...toBackupFile(makeAppData(), EXPORTED_AT), ...overrides });
}

describe('backupService', () => {
  it('TU-19: exportar e importar restaura exatamente os mesmos dados', () => {
    const data = makeAppData({ completions: { '2026-10-26': ['default-caminhada', 'default-leitura'] } });
    expect(parseBackup(serializeBackup(data, EXPORTED_AT))).toEqual({ ok: true, data });
  });

  it('TU-19: o arquivo exportado identifica a aplicação, a versão e a data', () => {
    expect(toBackupFile(makeAppData(), EXPORTED_AT)).toMatchObject({
      app: 'repete-habito',
      version: 1,
      exportedAt: EXPORTED_AT.toISOString(),
    });
  });

  it('TU-20: rejeita conteúdo que não é JSON', () => {
    const result = parseBackup('isto não é json');
    expect(result.ok === false && result.error.code).toBe('INVALID_JSON');
  });

  it('TU-20: rejeita JSON de outra aplicação', () => {
    const result = parseBackup(makeBackupContent({ app: 'outro-app' }));
    expect(result.ok === false && result.error.code).toBe('INVALID_FORMAT');
  });

  it('TU-20: rejeita backup com dados malformados', () => {
    const result = parseBackup(makeBackupContent({ data: { version: 1, activities: 'x', completions: {} } }));
    expect(result.ok === false && result.error.code).toBe('INVALID_FORMAT');
  });

  it('TU-20: rejeita versão de backup não suportada', () => {
    const result = parseBackup(makeBackupContent({ version: 99 }));
    expect(result.ok === false && result.error.code).toBe('UNSUPPORTED_VERSION');
  });

  it('TU-20: devolve mensagem em português para o erro', () => {
    const result = parseBackup('[]');
    expect(result.ok === false && result.error.message).toBe('O arquivo não é um backup válido do Repete Hábito.');
  });

  it('TU-21: inclui a data da exportação no nome do arquivo', () => {
    expect(buildBackupFileName(EXPORTED_AT)).toBe('repete-habito-backup-2026-10-27.json');
  });
});
