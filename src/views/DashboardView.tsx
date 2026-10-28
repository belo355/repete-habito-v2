import { useState } from 'react';
import { DayDetails } from '../components/heatmap/DayDetails';
import { HeatmapGrid } from '../components/heatmap/HeatmapGrid';
import { HeatmapLegend } from '../components/heatmap/HeatmapLegend';
import { YearSelector } from '../components/heatmap/YearSelector';
import { EmptyState } from '../components/shared/EmptyState';
import { useAppData } from '../hooks/useAppData';
import { useHeatmap } from '../hooks/useHeatmap';
import { ROUTES } from '../routes';
import { getDateKeyYear, getTodayKey } from '../services/dateKeys';
import type { DateKey } from '../types/DateKey';
import type { HeatmapDay } from '../types/HeatmapDay';

function ActiveDaysCount({ count }: { count: number }) {
  return (
    <p className="text-sm text-ink-muted">
      <strong className="text-2xl font-bold text-ink">{count}</strong> {count === 1 ? 'dia ativo' : 'dias ativos'}
    </p>
  );
}

function YearOverview({ todayKey }: { todayKey: DateKey }) {
  const [year, setYear] = useState(getDateKeyYear(todayKey));
  const [selectedKey, setSelectedKey] = useState<DateKey | null>(null);
  const { grid, activeDays, years } = useHeatmap(year);
  const { data } = useAppData();
  const selectedDay = grid.flat().find((day: HeatmapDay) => day.dateKey !== null && day.dateKey === selectedKey) ?? null;
  return (
    <section aria-label="Constância anual" className="flex flex-col gap-4 rounded-card bg-card p-4 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <YearSelector year={year} years={years} onChange={setYear} />
        <ActiveDaysCount count={activeDays} />
      </div>
      <HeatmapGrid year={year} grid={grid} selectedKey={selectedKey} todayKey={todayKey} onSelect={(day: HeatmapDay) => setSelectedKey(day.dateKey)} />
      <HeatmapLegend />
      <DayDetails day={selectedDay} activities={data.activities} todayKey={todayKey} />
    </section>
  );
}

export function DashboardView() {
  const todayKey = getTodayKey();
  const { data } = useAppData();
  const hasRecords = Object.keys(data.completions).length > 0;
  return (
    <div className="flex flex-col gap-6 pt-4">
      <header>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-ink">Dashboard</h1>
        <p className="mt-1 text-ink-muted">Sua constância ao longo do ano.</p>
      </header>
      {hasRecords ? (
        <YearOverview todayKey={todayKey} />
      ) : (
        <EmptyState title="Nenhum registro ainda" description="Registre sua primeira atividade para começar a acompanhar sua constância aqui." actionLabel="Registrar atividade" actionTo={ROUTES.today} />
      )}
    </div>
  );
}
