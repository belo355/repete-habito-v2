type LogContext = Record<string, unknown>;

function isLoggingEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.MODE !== 'test';
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export const logger = {
  warn(message: string, context: LogContext = {}): void {
    if (!isLoggingEnabled()) {
      return;
    }
    console.warn(message, context);
  },
  error(message: string, error?: unknown): void {
    if (!isLoggingEnabled()) {
      return;
    }
    console.error(message, { error: describeError(error) });
  },
};
