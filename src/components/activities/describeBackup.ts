import type { AppData } from '../../types/AppData';

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function describeBackup(data: AppData): string {
  const activities = pluralize(data.activities.length, 'atividade', 'atividades');
  const days = pluralize(Object.keys(data.completions).length, 'dia registrado', 'dias registrados');
  return `O backup tem ${activities} e ${days}. Seus dados atuais serão substituídos.`;
}
