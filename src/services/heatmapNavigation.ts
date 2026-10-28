import type { DateKey } from '../types/DateKey';
import type { HeatmapDay } from '../types/HeatmapDay';
import type { CellPosition } from '../types/CellPosition';

export const ARROW_DELTAS: Readonly<Record<string, CellPosition>> = {
  ArrowRight: { row: 0, column: 1 },
  ArrowLeft: { row: 0, column: -1 },
  ArrowDown: { row: 1, column: 0 },
  ArrowUp: { row: -1, column: 0 },
};

function isInside(grid: HeatmapDay[][], position: CellPosition): boolean {
  return position.row >= 0 && position.row < grid.length && position.column >= 0 && position.column < grid[0].length;
}

export function findNextPosition(grid: HeatmapDay[][], from: CellPosition, delta: CellPosition): CellPosition {
  let candidate = { row: from.row + delta.row, column: from.column + delta.column };
  while (isInside(grid, candidate)) {
    if (grid[candidate.row][candidate.column].dateKey !== null) {
      return candidate;
    }
    candidate = { row: candidate.row + delta.row, column: candidate.column + delta.column };
  }
  return from;
}

export function findPosition(grid: HeatmapDay[][], dateKey: DateKey | null): CellPosition | null {
  for (let row = 0; row < grid.length; row += 1) {
    const column = grid[row].findIndex((day: HeatmapDay) => day.dateKey !== null && day.dateKey === dateKey);
    if (column !== -1) {
      return { row, column };
    }
  }
  return null;
}

function findFirstDay(grid: HeatmapDay[][]): CellPosition {
  const dateKeys = grid.flat().flatMap((day: HeatmapDay) => (day.dateKey === null ? [] : [day.dateKey]));
  const firstKey = dateKeys.sort()[0] ?? null;
  return findPosition(grid, firstKey) ?? { row: 0, column: 0 };
}

export function resolveActivePosition(grid: HeatmapDay[][], preferredKeys: (DateKey | null)[]): CellPosition {
  const match = preferredKeys.map((key: DateKey | null) => findPosition(grid, key)).find((position) => position !== null);
  return match ?? findFirstDay(grid);
}
