import { track } from '@repo/posthog/browser';

/**
 * What /start tracks, to see where people leave it: each step reached,
 * each import's outcome (never its text), and the click to save. Plain
 * values only, as every browser event.
 */
export const startEvent = (
  event: 'start_step' | 'start_import_result' | 'start_save_clicked',
  properties: Readonly<Record<string, string | number | boolean | null>>
) => track(event, properties);
