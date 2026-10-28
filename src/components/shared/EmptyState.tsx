import { useId } from 'react';
import { Link } from 'react-router';
import { BUTTON_STYLES } from './buttonStyles';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
};

export function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="rounded-card bg-card px-6 py-10 text-center shadow-soft">
      <h2 id={titleId} className="text-lg font-bold text-ink">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">{description}</p>
      <Link to={actionTo} className={`${BUTTON_STYLES.primary} mt-6`}>
        {actionLabel}
      </Link>
    </section>
  );
}
