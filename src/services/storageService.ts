import type { Activity } from '../types/Activity';
import type { AppData } from '../types/AppData';
import type { SaveResult } from '../types/SaveResult';
import { isAppData } from './appDataValidation';
import { DEFAULT_ACTIVITIES } from './defaultActivities';
import { parseJsonSafely } from './json';
import { logger } from './logger';
import type { SaveErrorCode } from '../types/SaveErrorCode';

export const STORAGE_KEY = 'repete-habito:data';
const QUOTA_ERROR_NAMES = ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'];

export function createInitialAppData(): AppData {
  return {
    version: 1,
    activities: DEFAULT_ACTIVITIES.map((activity: Activity) => ({ ...activity })),
    completions: {},
  };
}

function readStoredValue(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error: unknown) {
    logger.error('Armazenamento local indisponível para leitura', error);
    return null;
  }
}

export function loadAppData(): AppData {
  const stored = readStoredValue();
  if (stored === null) {
    return createInitialAppData();
  }
  const parsed = parseJsonSafely(stored);
  if (!parsed.ok || !isAppData(parsed.value)) {
    logger.warn('Dados locais inválidos; o estado inicial foi restaurado');
    return createInitialAppData();
  }
  return parsed.value;
}

function toSaveErrorCode(error: unknown): SaveErrorCode {
  const isQuotaError = error instanceof DOMException && QUOTA_ERROR_NAMES.includes(error.name);
  return isQuotaError ? 'QUOTA_EXCEEDED' : 'UNAVAILABLE';
}

export function saveAppData(data: AppData): SaveResult {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { ok: true };
  } catch (error: unknown) {
    logger.error('Falha ao gravar os dados locais', error);
    return { ok: false, error: toSaveErrorCode(error) };
  }
}

export function clearAppData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error: unknown) {
    logger.error('Falha ao apagar os dados locais', error);
  }
}
