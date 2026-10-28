import type { ChoiceOption } from '../../types/ChoiceOption';

type ChoiceGroupProps<Value extends string> = {
  legend: string;
  name: string;
  options: readonly ChoiceOption<Value>[];
  selected: Value;
  onChange(value: Value): void;
};

export function ChoiceGroup<Value extends string>({ legend, name, options, selected, onChange }: ChoiceGroupProps<Value>) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option: ChoiceOption<Value>) => (
          <label key={option.value} title={option.label} className="flex size-11 cursor-pointer items-center justify-center rounded-control bg-surface text-xl transition-colors duration-150 hover:bg-brand-50 has-checked:bg-brand-100 has-checked:ring-2 has-checked:ring-brand-500 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-700">
            <input type="radio" name={name} value={option.value} checked={selected === option.value} onChange={() => onChange(option.value)} aria-label={option.label} className="sr-only" />
            {option.content}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
