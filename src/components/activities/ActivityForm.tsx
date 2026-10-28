import { useActivityForm } from '../../hooks/useActivityForm';
import type { ActivityInput } from '../../types/ActivityInput';
import { BUTTON_STYLES } from '../shared/buttonStyles';
import { COLOR_OPTIONS, withCurrentIcon } from './activityFormOptions';
import { ChoiceGroup } from './ChoiceGroup';
import { NameField } from './NameField';
import type { ActivitySubmit } from '../../types/ActivitySubmit';

type ActivityFormProps = {
  formLabel: string;
  submitLabel: string;
  initial?: ActivityInput;
  onSubmit: ActivitySubmit;
  onCancel?: () => void;
};

export function ActivityForm({ formLabel, submitLabel, initial, onSubmit, onCancel }: ActivityFormProps) {
  const form = useActivityForm(onSubmit, initial);
  const fieldName = formLabel.replace(/\s+/g, '-').toLowerCase();
  return (
    <form aria-label={formLabel} onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-5">
      <NameField value={form.name} error={form.error} onChange={form.setName} />
      <ChoiceGroup legend="Ícone" name={`${fieldName}-icone`} options={withCurrentIcon(form.icon)} selected={form.icon} onChange={form.setIcon} />
      <ChoiceGroup legend="Cor" name={`${fieldName}-cor`} options={COLOR_OPTIONS} selected={form.color} onChange={form.setColor} />
      <div className="flex flex-wrap justify-end gap-2">
        {onCancel && (
          <button type="button" className={BUTTON_STYLES.ghost} onClick={onCancel}>Cancelar</button>
        )}
        <button type="submit" className={BUTTON_STYLES.primary}>{submitLabel}</button>
      </div>
    </form>
  );
}
