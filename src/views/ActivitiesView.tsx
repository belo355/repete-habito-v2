import { ActivityForm } from '../components/activities/ActivityForm';
import { ActivityList } from '../components/activities/ActivityList';
import { BackupPanel } from '../components/activities/BackupPanel';
import { PageSection } from '../components/shared/PageSection';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { useActivityManager } from '../hooks/useActivityManager';

export function ActivitiesView() {
  const manager = useActivityManager();
  return (
    <div className="flex flex-col gap-8 pt-4">
      <header>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-ink">Atividades</h1>
        <p className="mt-1 text-ink-muted">Escolha o que você quer acompanhar todos os dias.</p>
      </header>
      <PageSection title="Nova atividade">
        <div className="rounded-card bg-card p-4 shadow-soft">
          <ActivityForm formLabel="Nova atividade" submitLabel="Adicionar atividade" onSubmit={manager.createActivity} />
        </div>
      </PageSection>
      <PageSection title="Suas atividades">
        <ActivityList manager={manager} />
      </PageSection>
      <PageSection title="Backup e dados" description="Seus dados ficam só neste navegador. Exporte um backup para guardá-los ou levá-los para outro dispositivo.">
        <BackupPanel />
      </PageSection>
      {manager.pendingRemoval && <ConfirmDialog title={`Remover ${manager.pendingRemoval.name}?`} description="O histórico desta atividade será apagado de todos os dias. Esta ação não pode ser desfeita." confirmLabel="Remover" tone="danger" onConfirm={manager.confirmRemoval} onCancel={manager.cancelRemoval} />}
    </div>
  );
}
