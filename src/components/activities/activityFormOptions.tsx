import { ACTIVITY_COLOR_LABELS, ACTIVITY_COLORS } from '../../services/activityPalette';
import type { ActivityColor } from '../../types/ActivityColor';
import { ACTIVITY_SWATCH_STYLES } from './activityColorStyles';
import type { ChoiceOption } from '../../types/ChoiceOption';

const ICON_CHOICES: ReadonlyArray<{ icon: string; label: string }> = [
  { icon: '✅', label: 'Concluído' },
  { icon: '🚶', label: 'Caminhada' },
  { icon: '🏃', label: 'Corrida' },
  { icon: '🏋️', label: 'Musculação' },
  { icon: '🚴', label: 'Bicicleta' },
  { icon: '🏊', label: 'Natação' },
  { icon: '🧘', label: 'Meditação' },
  { icon: '🤸', label: 'Alongamento' },
  { icon: '📚', label: 'Leitura' },
  { icon: '💧', label: 'Água' },
  { icon: '🥗', label: 'Alimentação' },
  { icon: '😴', label: 'Sono' },
];

export const ICON_OPTIONS: readonly ChoiceOption<string>[] = ICON_CHOICES.map(({ icon, label }) => ({
  value: icon,
  label: `Ícone ${label}`,
  content: <span aria-hidden="true">{icon}</span>,
}));

export const COLOR_OPTIONS: readonly ChoiceOption<ActivityColor>[] = ACTIVITY_COLORS.map((color: ActivityColor) => ({
  value: color,
  label: `Cor ${ACTIVITY_COLOR_LABELS[color]}`,
  content: <span aria-hidden="true" className={`size-6 rounded-full ${ACTIVITY_SWATCH_STYLES[color]}`} />,
}));

export function withCurrentIcon(icon: string): readonly ChoiceOption<string>[] {
  const isListed = ICON_OPTIONS.some((option: ChoiceOption<string>) => option.value === icon);
  return isListed ? ICON_OPTIONS : [{ value: icon, label: 'Ícone atual', content: <span aria-hidden="true">{icon}</span> }, ...ICON_OPTIONS];
}
