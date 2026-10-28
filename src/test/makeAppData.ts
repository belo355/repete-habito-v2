import type { Activity } from '../types/Activity';
import type { AppData } from '../types/AppData';

export const CAMINHADA: Activity = { id: 'default-caminhada', name: 'Caminhada', icon: '🚶', color: 'orange' };
export const LEITURA: Activity = { id: 'default-leitura', name: 'Leitura', icon: '📚', color: 'teal' };

export function makeAppData(overrides: Partial<AppData> = {}): AppData {
  return {
    version: 1,
    activities: [CAMINHADA, LEITURA],
    completions: {},
    ...overrides,
  };
}
