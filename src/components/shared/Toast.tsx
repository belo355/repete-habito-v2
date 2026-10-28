import { Icon } from '../icons/Icon';
import { BUTTON_STYLES } from './buttonStyles';

type ToastProps = {
  tone: 'success' | 'error';
  message: string;
  onDismiss?: () => void;
};

const TONE_STYLES = {
  success: 'bg-success-50 text-success-700',
  error: 'bg-danger-50 text-danger-700',
} as const;

export function Toast({ tone, message, onDismiss }: ToastProps) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-control p-3 text-sm font-medium shadow-soft ${TONE_STYLES[tone]}`}>
      <Icon name={tone === 'error' ? 'alert' : 'check'} className="mt-0.5 size-5 shrink-0" />
      <p className="flex-1 py-0.5">{message}</p>
      {onDismiss && (
        <button type="button" aria-label="Fechar aviso" className={`${BUTTON_STYLES.icon} -my-2 -mr-2 text-current`} onClick={onDismiss}>
          <Icon name="close" />
        </button>
      )}
    </div>
  );
}
