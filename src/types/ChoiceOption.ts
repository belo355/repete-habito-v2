import type { ReactNode } from 'react';

export type ChoiceOption<Value extends string> = {
  value: Value;
  label: string;
  content: ReactNode;
};
