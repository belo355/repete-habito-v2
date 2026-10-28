import { useRef, type KeyboardEvent } from 'react';
import { ARROW_DELTAS, findNextPosition } from '../services/heatmapNavigation';
import type { DateKey } from '../types/DateKey';
import type { HeatmapDay } from '../types/HeatmapDay';
import type { CellPosition } from '../types/CellPosition';

type CellRegistration = (element: HTMLButtonElement | null) => () => void;

type HeatmapKeyboard = {
  handleKeyDown(event: KeyboardEvent<HTMLButtonElement>): void;
  registerCell(dateKey: DateKey): CellRegistration;
};

type HeatmapKeyboardOptions = {
  grid: HeatmapDay[][];
  active: CellPosition;
  onSelect(day: HeatmapDay): void;
};

export function useHeatmapKeyboard({ grid, active, onSelect }: HeatmapKeyboardOptions): HeatmapKeyboard {
  const cellRefs = useRef(new Map<DateKey, HTMLButtonElement>());
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    const delta = ARROW_DELTAS[event.key];
    if (!delta) {
      return;
    }
    event.preventDefault();
    const next = findNextPosition(grid, active, delta);
    const nextDay = grid[next.row][next.column];
    onSelect(nextDay);
    const element = nextDay.dateKey ? cellRefs.current.get(nextDay.dateKey) : undefined;
    element?.focus();
    element?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }
  function registerCell(dateKey: DateKey): CellRegistration {
    return (element: HTMLButtonElement | null) => {
      if (element) {
        cellRefs.current.set(dateKey, element);
      }
      return () => {
        cellRefs.current.delete(dateKey);
      };
    };
  }
  return { handleKeyDown, registerCell };
}
