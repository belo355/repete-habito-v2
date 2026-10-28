import { createContext } from 'react';
import type { AppDataStore } from '../types/AppDataStore';

export const AppDataContext = createContext<AppDataStore | null>(null);
