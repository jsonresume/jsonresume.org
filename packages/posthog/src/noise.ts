import type { CaptureResult } from 'posthog-js';

/**
 * Exceptions nobody can act on: requests cancelled by leaving a page, view
 * transitions the browser skipped, cross-origin scripts PostHog can't see
 * into, and browser extensions (wallets, page translators).
 */
const NOISE: ReadonlyArray<RegExp> = [
  /AbortError|signal is aborted/i,
  /^Error: Script error\.?$/,
  /Transition was aborted|Skipped ViewTransition/,
  /Object Not Found Matching Id/,
  /window\.ethereum/,
];

const describeOne = (exception: unknown) => {
  if (typeof exception !== 'object' || exception === null) return '';
  const type = 'type' in exception ? String(exception.type) : '';
  const value = 'value' in exception ? String(exception.value) : '';
  return `${type}: ${value}`;
};

/** True for an `$exception` event whose every exception is noise. */
export const isNoise = (event: CaptureResult): boolean => {
  if (event.event !== '$exception') return false;
  const list: unknown = event.properties?.['$exception_list'];
  if (!Array.isArray(list) || list.length === 0) return false;
  return list.every((exception) =>
    NOISE.some((pattern) => pattern.test(describeOne(exception)))
  );
};
