import type { SaveErrorCode } from './SaveErrorCode';

export type SaveResult = { ok: true } | { ok: false; error: SaveErrorCode };
