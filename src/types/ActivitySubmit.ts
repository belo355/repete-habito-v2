import type { ActivityInput } from './ActivityInput';
import type { ActivityNameError } from './ActivityNameError';

export type ActivitySubmit = (input: ActivityInput) => ActivityNameError | null;
