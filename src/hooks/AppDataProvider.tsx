import { useState, type ReactNode } from 'react';
import { AppDataContext } from './AppDataContext';
import { createAppDataStore } from './appDataStore';

type AppDataProviderProps = {
  children: ReactNode;
};

export function AppDataProvider({ children }: AppDataProviderProps) {
  const [store] = useState(createAppDataStore);
  return <AppDataContext value={store}>{children}</AppDataContext>;
}
