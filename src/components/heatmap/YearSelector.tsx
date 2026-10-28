import { Icon } from '../icons/Icon';
import { BUTTON_STYLES } from '../shared/buttonStyles';

type YearSelectorProps = {
  year: number;
  years: number[];
  onChange(year: number): void;
};

export function YearSelector({ year, years, onChange }: YearSelectorProps) {
  const index = years.indexOf(year);
  const previousYear = years[index - 1];
  const nextYear = years[index + 1];
  return (
    <div className="flex items-center gap-1">
      <button type="button" aria-label="Ano anterior" disabled={previousYear === undefined} onClick={() => onChange(previousYear)} className={BUTTON_STYLES.icon}>
        <Icon name="chevron-left" />
      </button>
      <h2 aria-live="polite" className="min-w-14 text-center text-xl font-bold text-ink">{year}</h2>
      <button type="button" aria-label="Próximo ano" disabled={nextYear === undefined} onClick={() => onChange(nextYear)} className={BUTTON_STYLES.icon}>
        <Icon name="chevron-right" />
      </button>
    </div>
  );
}
