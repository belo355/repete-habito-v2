import type { AppData } from '../types/AppData';
import type { BackupError } from '../types/BackupError';
import type { BackupFile } from '../types/BackupFile';
import type { BackupParseResult } from '../types/BackupParseResult';
import { isAppData } from './appDataValidation';
import { toDateKey } from './dateKeys';
import { isRecord, parseJsonSafely } from './json';
import type { BackupErrorCode } from '../types/BackupErrorCode';

export const BACKUP_APP_ID = 'repete-habito';
export const SUPPORTED_BACKUP_VERSION = 1;
export const MAX_BACKUP_SIZE_BYTES = 5 * 1024 * 1024;
const BACKUP_FILE_PREFIX = 'repete-habito-backup-';
const BACKUP_FILE_EXTENSION = '.json';
const JSON_INDENTATION = 2;

const BACKUP_ERROR_MESSAGES: Record<BackupErrorCode, string> = {
  INVALID_JSON: 'O arquivo não pôde ser lido. Escolha um arquivo .json exportado pelo Repete Hábito.',
  INVALID_FORMAT: 'O arquivo não é um backup válido do Repete Hábito.',
  UNSUPPORTED_VERSION: 'Este backup foi gerado por uma versão incompatível do Repete Hábito.',
};

export function buildBackupError(code: BackupErrorCode): BackupError {
  return { code, message: BACKUP_ERROR_MESSAGES[code] };
}

export function toBackupFile(data: AppData, exportedAt: Date): BackupFile {
  return { app: BACKUP_APP_ID, version: SUPPORTED_BACKUP_VERSION, exportedAt: exportedAt.toISOString(), data };
}

export function serializeBackup(data: AppData, exportedAt: Date): string {
  return JSON.stringify(toBackupFile(data, exportedAt), null, JSON_INDENTATION);
}

export function buildBackupFileName(exportedAt: Date): string {
  return `${BACKUP_FILE_PREFIX}${toDateKey(exportedAt)}${BACKUP_FILE_EXTENSION}`;
}

function failWith(code: BackupErrorCode): BackupParseResult {
  return { ok: false, error: buildBackupError(code) };
}

export function parseBackup(content: string): BackupParseResult {
  const parsed = parseJsonSafely(content);
  if (!parsed.ok) {
    return failWith('INVALID_JSON');
  }
  if (!isRecord(parsed.value) || parsed.value.app !== BACKUP_APP_ID) {
    return failWith('INVALID_FORMAT');
  }
  if (parsed.value.version !== SUPPORTED_BACKUP_VERSION) {
    return failWith('UNSUPPORTED_VERSION');
  }
  if (!isAppData(parsed.value.data)) {
    return failWith('INVALID_FORMAT');
  }
  return { ok: true, data: parsed.value.data };
}
