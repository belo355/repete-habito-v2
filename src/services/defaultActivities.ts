import type { Activity } from '../types/Activity';

export const DEFAULT_ACTIVITIES: readonly Activity[] = [
  { id: 'default-caminhada', name: 'Caminhada', icon: '🚶', color: 'orange' },
  { id: 'default-musculacao', name: 'Musculação', icon: '🏋️', color: 'blue' },
  { id: 'default-corrida', name: 'Corrida', icon: '🏃', color: 'green' },
  { id: 'default-alongamento', name: 'Alongamento', icon: '🤸', color: 'purple' },
  { id: 'default-leitura', name: 'Leitura', icon: '📚', color: 'teal' },
  { id: 'default-meditacao', name: 'Meditação', icon: '🧘', color: 'pink' },
  { id: 'default-agua', name: 'Beber água', icon: '💧', color: 'blue' },
];
