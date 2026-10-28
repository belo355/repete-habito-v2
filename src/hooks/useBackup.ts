import { useRef, useState } from 'react';
import { buildBackupError, buildBackupFileName, serializeBackup } from '../services/backupService';
import { downloadTextFile, readBackupFile } from '../services/fileTransfer';
import { logger } from '../services/logger';
import type { AppData } from '../types/AppData';
import type { BackupError } from '../types/BackupError';
import type { BackupParseResult } from '../types/BackupParseResult';
import { useAppData } from './useAppData';

type BackupReader = {
  error: BackupError | null;
  pendingData: AppData | null;
  isReading: boolean;
  selectFile(file: File): Promise<void>;
  clearPending(): void;
};

type UseBackupResult = Omit<BackupReader, 'clearPending'> & {
  exportBackup(): void;
  confirmImport(): void;
  cancelImport(): void;
};

async function readSafely(file: File): Promise<BackupParseResult> {
  try {
    return await readBackupFile(file);
  } catch (error: unknown) {
    logger.error('Falha ao ler o arquivo de backup', error);
    return { ok: false, error: buildBackupError('INVALID_JSON') };
  }
}

function useBackupReader(): BackupReader {
  const [error, setError] = useState<BackupError | null>(null);
  const [pendingData, setPendingData] = useState<AppData | null>(null);
  const [isReading, setIsReading] = useState(false);
  const latestRequest = useRef(0);
  async function selectFile(file: File): Promise<void> {
    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;
    setError(null);
    setIsReading(true);
    const result = await readSafely(file);
    if (requestId !== latestRequest.current) {
      return;
    }
    setIsReading(false);
    setPendingData(result.ok ? result.data : null);
    setError(result.ok ? null : result.error);
  }
  return { error, pendingData, isReading, selectFile, clearPending: () => setPendingData(null) };
}

export function useBackup(): UseBackupResult {
  const { data, replaceAll } = useAppData();
  const { clearPending, ...reader } = useBackupReader();
  function exportBackup(): void {
    const now = new Date();
    downloadTextFile({ fileName: buildBackupFileName(now), content: serializeBackup(data, now) });
  }
  function confirmImport(): void {
    if (reader.pendingData) {
      replaceAll(reader.pendingData);
    }
    clearPending();
  }
  return { ...reader, exportBackup, confirmImport, cancelImport: clearPending };
}
