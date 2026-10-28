import { useState } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { useBackup } from '../../hooks/useBackup';
import { BUTTON_STYLES } from '../shared/buttonStyles';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { Toast } from '../shared/Toast';
import { BackupControls } from './BackupControls';
import { describeBackup } from './describeBackup';

type Dialog = 'reset' | null;

export function BackupPanel() {
  const backup = useBackup();
  const { resetAll } = useAppData();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const finish = (message: string, action: () => void) => () => {
    action();
    setDialog(null);
    setNotice(message);
  };
  return (
    <div className="flex flex-col gap-4">
      <BackupControls isReading={backup.isReading} onExport={backup.exportBackup} onSelectFile={(file: File) => { setNotice(null); void backup.selectFile(file); }} />
      {backup.error && <Toast tone="error" message={backup.error.message} />}
      {notice && <Toast tone="success" message={notice} onDismiss={() => setNotice(null)} />}
      <button type="button" className={`${BUTTON_STYLES.ghost} self-start text-danger-700 hover:bg-danger-50 hover:text-danger-700`} onClick={() => setDialog('reset')}>Apagar todos os dados</button>
      {backup.pendingData && <ConfirmDialog title="Substituir seus dados?" description={describeBackup(backup.pendingData)} confirmLabel="Substituir dados" onConfirm={finish('Backup importado com sucesso.', backup.confirmImport)} onCancel={backup.cancelImport} />}
      {dialog === 'reset' && <ConfirmDialog title="Apagar todos os dados?" description="Todas as atividades e registros serão apagados e o app voltará ao estado inicial. Esta ação não pode ser desfeita." confirmLabel="Apagar tudo" tone="danger" onConfirm={finish('Todos os dados foram apagados.', resetAll)} onCancel={() => setDialog(null)} />}
    </div>
  );
}
