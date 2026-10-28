import type { AppData } from './AppData';
import type { BackupError } from './BackupError';

export type BackupParseResult = { ok: true; data: AppData } | { ok: false; error: BackupError };
