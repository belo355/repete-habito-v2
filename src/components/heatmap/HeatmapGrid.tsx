import { useHeatmapKeyboard } from '../../hooks/useHeatmapKeyboard';
import { WEEKDAY_LABELS } from '../../services/heatmapLabels';
import { resolveActivePosition } from '../../services/heatmapNavigation';
import type { DateKey } from '../../types/DateKey';
import type { HeatmapDay } from '../../types/HeatmapDay';
import { HeatmapCell } from './HeatmapCell';
import { HeatmapMonthLabels } from './HeatmapMonthLabels';
import { GRID_COLUMN_STYLES } from './heatmapStyles';
import type { CellPosition } from '../../types/CellPosition';

type HeatmapGridProps = {
  year: number;
  grid: HeatmapDay[][];
  selectedKey: DateKey | null;
  todayKey: DateKey;
  onSelect(day: HeatmapDay): void;
};

type HeatmapRowProps = {
  row: HeatmapDay[];
  rowIndex: number;
  active: CellPosition;
  selectedKey: DateKey | null;
  keyboard: ReturnType<typeof useHeatmapKeyboard>;
  onSelect(day: HeatmapDay): void;
};

function HeatmapRow({ row, rowIndex, active, selectedKey, keyboard, onSelect }: HeatmapRowProps) {
  return (
    <div role="row" className="contents">
      <span role="rowheader" className="sticky left-0 z-[1] self-center bg-card pr-1 text-xs font-semibold text-ink-muted">{WEEKDAY_LABELS[rowIndex]}</span>
      {row.map((day: HeatmapDay, columnIndex: number) => (
        <HeatmapCell key={day.dateKey ?? `vazio-${rowIndex}-${columnIndex}`} day={day} isActive={active.row === rowIndex && active.column === columnIndex} isSelected={day.dateKey !== null && day.dateKey === selectedKey} cellRef={day.dateKey ? keyboard.registerCell(day.dateKey) : undefined} onSelect={onSelect} onKeyDown={keyboard.handleKeyDown} />
      ))}
    </div>
  );
}

export function HeatmapGrid({ year, grid, selectedKey, todayKey, onSelect }: HeatmapGridProps) {
  const active = resolveActivePosition(grid, [selectedKey, todayKey]);
  const keyboard = useHeatmapKeyboard({ grid, active, onSelect });
  const columnStyle = GRID_COLUMN_STYLES[grid[0].length];
  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[44rem]">
        <HeatmapMonthLabels grid={grid} columnStyle={columnStyle} />
        <div role="grid" aria-label={`Mapa de atividades de ${year}`} className={`grid gap-[3px] ${columnStyle}`}>
          {grid.map((row: HeatmapDay[], rowIndex: number) => (
            <HeatmapRow key={WEEKDAY_LABELS[rowIndex]} row={row} rowIndex={rowIndex} active={active} selectedKey={selectedKey} keyboard={keyboard} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}
