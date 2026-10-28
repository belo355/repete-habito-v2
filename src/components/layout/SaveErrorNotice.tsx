import { useAppData } from '../../hooks/useAppData';
import { Toast } from '../shared/Toast';

export const SAVE_ERROR_MESSAGE =
  'Não foi possível salvar no navegador. Seus registros continuam na tela, mas exporte um backup em Atividades para não perdê-los.';

export function SaveErrorNotice() {
  const { saveError, dismissSaveError } = useAppData();
  if (saveError === null) {
    return null;
  }
  return (
    <div className="fixed inset-x-4 bottom-24 z-30 mx-auto max-w-md md:top-20 md:bottom-auto">
      <Toast tone="error" message={SAVE_ERROR_MESSAGE} onDismiss={dismissSaveError} />
    </div>
  );
}
