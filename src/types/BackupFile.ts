import type { AppData } from './AppData';

export type BackupFile = {
  app: 'repete-habito';
  version: 1;
  exportedAt: string;
  data: AppData;
};
