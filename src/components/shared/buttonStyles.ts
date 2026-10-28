const BASE_BUTTON =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50';

export const BUTTON_STYLES = {
  primary: `${BASE_BUTTON} bg-brand-500 text-ink hover:bg-brand-600 active:bg-brand-600`,
  secondary: `${BASE_BUTTON} bg-card text-ink shadow-soft hover:bg-brand-50`,
  danger: `${BASE_BUTTON} bg-danger-600 text-white hover:bg-danger-700`,
  ghost: `${BASE_BUTTON} text-ink-muted hover:bg-ink/5 hover:text-ink`,
  icon: 'inline-flex size-11 items-center justify-center rounded-control text-ink-muted transition-colors duration-150 hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35',
} as const;
