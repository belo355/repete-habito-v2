import type { ReactNode } from 'react';
import { AppDataProvider } from '../hooks/AppDataProvider';

export function AppDataWrapper({ children }: { children: ReactNode }) {
  return <AppDataProvider>{children}</AppDataProvider>;
}
