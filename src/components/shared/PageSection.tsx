import { useId, type ReactNode } from 'react';

type PageSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function PageSection({ title, description, children }: PageSectionProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <div>
        <h2 id={titleId} className="text-lg font-bold text-ink">{title}</h2>
        {description && <p className="mt-1 max-w-prose text-sm text-ink-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}
