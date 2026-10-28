import type { DaySummary as DaySummaryData } from '../../types/DaySummary';

type DaySummaryProps = {
  summary: DaySummaryData;
};

function buildSummaryText({ done, total }: DaySummaryData): string {
  const noun = total === 1 ? 'atividade realizada' : 'atividades realizadas';
  return `${done} de ${total} ${noun}`;
}

export function DaySummary({ summary }: DaySummaryProps) {
  const isComplete = summary.total > 0 && summary.done === summary.total;
  return (
    <p aria-live="polite" className="text-sm font-semibold text-ink-muted">
      <span>{buildSummaryText(summary)}</span>
      {isComplete && <span className="ml-2 text-success-700">Tudo feito!</span>}
    </p>
  );
}
