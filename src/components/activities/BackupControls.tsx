import type { ChangeEvent } from 'react';
import { Icon } from '../icons/Icon';
import { BUTTON_STYLES } from '../shared/buttonStyles';

type BackupControlsProps = {
  isReading: boolean;
  onExport(): void;
  onSelectFile(file: File): void;
};

export function BackupControls({ isReading, onExport, onSelectFile }: BackupControlsProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) {
      onSelectFile(file);
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={BUTTON_STYLES.secondary} onClick={onExport}>
        <Icon name="download" />
        Exportar backup
      </button>
      <label aria-busy={isReading} className={`${BUTTON_STYLES.secondary} cursor-pointer has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-700`}>
        <Icon name="upload" />
        {isReading ? 'Lendo arquivo…' : 'Importar backup'}
        <input type="file" accept=".json,application/json" aria-label="Importar backup" className="sr-only" onChange={handleFileChange} />
      </label>
    </div>
  );
}
