import { useState, type FormEvent } from 'react';
import { DEFAULT_ACTIVITY_COLOR, DEFAULT_ACTIVITY_ICON } from '../services/activityRules';
import type { ActivityColor } from '../types/ActivityColor';
import type { ActivityInput } from '../types/ActivityInput';
import type { ActivityNameError } from '../types/ActivityNameError';
import type { ActivitySubmit } from '../types/ActivitySubmit';

type UseActivityFormResult = {
  name: string;
  icon: string;
  color: ActivityColor;
  error: ActivityNameError | null;
  setName(name: string): void;
  setIcon(icon: string): void;
  setColor(color: ActivityColor): void;
  handleSubmit(event: FormEvent<HTMLFormElement>): void;
};

export function useActivityForm(onSubmit: ActivitySubmit, initial?: ActivityInput): UseActivityFormResult {
  const [name, setName] = useState(initial?.name ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? DEFAULT_ACTIVITY_ICON);
  const [color, setColor] = useState<ActivityColor>(initial?.color ?? DEFAULT_ACTIVITY_COLOR);
  const [error, setError] = useState<ActivityNameError | null>(null);
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const submitError = onSubmit({ name, icon, color });
    setError(submitError);
    if (submitError === null && initial === undefined) {
      setName('');
      setIcon(DEFAULT_ACTIVITY_ICON);
      setColor(DEFAULT_ACTIVITY_COLOR);
    }
  }
  function changeName(nextName: string): void {
    setName(nextName);
    setError(null);
  }
  return { name, icon, color, error, setName: changeName, setIcon, setColor, handleSubmit };
}
