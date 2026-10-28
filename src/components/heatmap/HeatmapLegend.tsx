import { LEVEL_LEGEND, LEVEL_STYLES } from './heatmapStyles';

export function HeatmapLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-ink-muted">
      <span aria-hidden="true">Menos</span>
      <ul aria-label="Legenda de intensidade" className="flex gap-1">
        {LEVEL_LEGEND.map(({ level, label }) => (
          <li key={level} title={label} className={`size-3.5 rounded-[3px] ${LEVEL_STYLES[level]}`}>
            <span className="sr-only">{label}</span>
          </li>
        ))}
      </ul>
      <span aria-hidden="true">Mais</span>
    </div>
  );
}
