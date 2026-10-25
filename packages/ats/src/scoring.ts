/** Building blocks of a check: points earned, and the issue when they aren't. */
import type { AtsCheck, AtsIssue, Severity } from './report';

export type Entry = Readonly<Record<string, unknown>>;

export const issue = (
  severity: Severity,
  field: string,
  message: string,
  fix: string
): AtsIssue => ({ severity, field, message, fix });

export const check = (
  id: string,
  name: string,
  max: number,
  parts: ReadonlyArray<readonly [points: number, problem?: AtsIssue]>
): AtsCheck => ({
  id,
  name,
  max,
  score: Math.max(
    0,
    Math.min(max, Math.floor(parts.reduce((sum, [points]) => sum + points, 0)))
  ),
  issues: parts.flatMap(([, problem]) => (problem ? [problem] : [])),
});

/** Points when it's there; nothing, and the issue, when it isn't. */
export const need = (ok: boolean, points: number, problem: AtsIssue) =>
  ok ? ([points] as const) : ([0, problem] as const);
