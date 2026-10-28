import { buildMonthLabels } from '../../services/heatmapLabels';
import type { HeatmapDay } from '../../types/HeatmapDay';
import type { MonthLabel } from '../../types/MonthLabel';

type HeatmapMonthLabelsProps = {
  grid: HeatmapDay[][];
  columnStyle: string;
};

const FIRST_DATA_COLUMN = 2;

export function HeatmapMonthLabels({ grid, columnStyle }: HeatmapMonthLabelsProps) {
  return (
    <div aria-hidden="true" className={`mb-1 grid gap-[3px] ${columnStyle}`}>
      {buildMonthLabels(grid).map(({ label, column }: MonthLabel) => (
        <span key={label} style={{ gridColumnStart: column + FIRST_DATA_COLUMN }} className="text-xs font-semibold whitespace-nowrap text-ink-muted">
          {label}
        </span>
      ))}
    </div>
  );
}
