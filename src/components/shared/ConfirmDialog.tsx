import { useId } from 'react';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { BUTTON_STYLES } from './buttonStyles';
import type { ButtonTone } from '../../types/ButtonTone';

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  tone?: ButtonTone;
  onConfirm(): void;
  onCancel(): void;
};

export function ConfirmDialog({ title, description, confirmLabel, tone = 'primary', onConfirm, onCancel }: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const { dialogRef, handleKeyDown } = useDialogFocus(onCancel);
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/40 p-4 sm:items-center" onKeyDown={handleKeyDown}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="w-full max-w-sm rounded-card bg-card p-6 shadow-soft">
        <h2 id={titleId} className="text-lg font-bold text-ink">{title}</h2>
        <p id={descriptionId} className="mt-2 text-sm text-ink-muted">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className={BUTTON_STYLES.ghost} onClick={onCancel}>Cancelar</button>
          <button type="button" className={BUTTON_STYLES[tone]} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
