import type { AppData } from './AppData';
import type { SaveErrorCode } from './SaveErrorCode';

export type AppDataSnapshot = {
  data: AppData;
  saveError: SaveErrorCode | null;
};
