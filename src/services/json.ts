type JsonParseResult = { ok: true; value: unknown } | { ok: false };

export function parseJsonSafely(content: string): JsonParseResult {
  try {
    return { ok: true, value: JSON.parse(content) };
  } catch {
    return { ok: false };
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
