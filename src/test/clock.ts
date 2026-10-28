import { vi } from 'vitest';

export const FIXED_TODAY = new Date(2026, 9, 27, 10, 0);
export const FIXED_TODAY_KEY = '2026-10-27';

export function freezeToday(): void {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXED_TODAY);
}
