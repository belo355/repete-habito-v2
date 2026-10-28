import type { KeyboardEvent, Ref } from 'react';
import { buildCellLabel } from '../../services/heatmapLabels';
import type { HeatmapDay } from '../../types/HeatmapDay';
import { LEVEL_STYLES } from './heatmapStyles';

type HeatmapCellProps = {
  day: HeatmapDay;
  isActive: boolean;
  isSelected: boolean;
  cellRef?: Ref<HTMLButtonElement>;
  onSelect(day: HeatmapDay): void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
};

export function HeatmapCell({ day, isActive, isSelected, cellRef, onSelect, onKeyDown }: HeatmapCellProps) {
  if (day.dateKey === null) {
    return <div role="gridcell" className="aspect-square" />;
  }
  const selection = isSelected ? 'ring-2 ring-ink ring-offset-1 ring-offset-card' : '';
  const future = day.isFuture ? 'opacity-40' : 'cursor-pointer';
  const select = day.isFuture ? undefined : () => onSelect(day);
  return (
    <div role="gridcell" aria-selected={isSelected} className="aspect-square">
      <button ref={cellRef} type="button" tabIndex={isActive ? 0 : -1} aria-label={buildCellLabel(day)} aria-disabled={day.isFuture || undefined} onClick={select} onFocus={select} onMouseEnter={select} onKeyDown={onKeyDown} className={`block size-full rounded-[3px] transition-shadow duration-150 ${LEVEL_STYLES[day.level]} ${selection} ${future}`} />
    </div>
  );
}
