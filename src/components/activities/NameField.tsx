import { useId } from 'react';
import { MAX_ACTIVITY_NAME_LENGTH } from '../../services/activityRules';
import type { ActivityNameError } from '../../types/ActivityNameError';

type NameFieldProps = {
  value: string;
  error: ActivityNameError | null;
  onChange(value: string): void;
};

export function NameField({ value, error, onChange }: NameFieldProps) {
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  const describedBy = error ? `${errorId} ${hintId}` : hintId;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-ink">Nome da atividade</label>
      <input id={inputId} type="text" value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={error !== null} aria-describedby={describedBy} autoComplete="off" placeholder="Ex.: Yoga" className="min-h-11 rounded-control bg-surface px-3 text-base text-ink placeholder:text-ink-muted aria-invalid:ring-2 aria-invalid:ring-danger-600" />
      {error && (
        <p id={errorId} className="text-sm font-semibold text-danger-700">{error.message}</p>
      )}
      <p id={hintId} className="text-xs text-ink-muted">{`${value.trim().length}/${MAX_ACTIVITY_NAME_LENGTH} caracteres`}</p>
    </div>
  );
}
