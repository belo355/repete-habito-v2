import { STORAGE_KEY } from '../services/storageService';
import type { AppData } from '../types/AppData';

export function seedStorage(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function readStorage(): unknown {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? null : JSON.parse(stored);
}
