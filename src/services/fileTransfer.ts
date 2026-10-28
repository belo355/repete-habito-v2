import type { BackupParseResult } from '../types/BackupParseResult';
import { buildBackupError, MAX_BACKUP_SIZE_BYTES, parseBackup } from './backupService';

const JSON_MIME_TYPE = 'application/json';

type TextFileDownload = {
  fileName: string;
  content: string;
};

export function downloadTextFile(download: TextFileDownload): void {
  const url = URL.createObjectURL(new Blob([download.content], { type: JSON_MIME_TYPE }));
  const link = document.createElement('a');
  link.href = url;
  link.download = download.fileName;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url));
}

export async function readBackupFile(file: File): Promise<BackupParseResult> {
  if (file.size > MAX_BACKUP_SIZE_BYTES) {
    return { ok: false, error: buildBackupError('INVALID_FORMAT') };
  }
  return parseBackup(await file.text());
}
