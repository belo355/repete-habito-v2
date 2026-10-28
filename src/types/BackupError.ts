import type { BackupErrorCode } from './BackupErrorCode';

export type BackupError = {
  code: BackupErrorCode;
  message: string;
};
