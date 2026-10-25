/** How much an issue matters to an applicant tracking system. */
export type Severity = 'critical' | 'warning' | 'tip';

/** Something to fix, and where in the resume (a JSON path such as work[0].startDate). */
export interface AtsIssue {
  severity: Severity;
  message: string;
  fix: string;
  field: string;
}

/** One area of the resume, scored. */
export interface AtsCheck {
  id: string;
  name: string;
  score: number;
  max: number;
  issues: AtsIssue[];
}

export type Rating = 'Excellent' | 'Good' | 'Fair' | 'Needs work';

/** A resume's ATS readiness: a 0 to 100 score, each check, what to fix first. */
export interface AtsReport {
  score: number;
  rating: Rating;
  summary: string;
  checks: AtsCheck[];
}

export const ratingOf = (score: number): Rating =>
  score >= 90
    ? 'Excellent'
    : score >= 75
    ? 'Good'
    : score >= 55
    ? 'Fair'
    : 'Needs work';

/** Pass, warn or fail, for a checklist: full marks, most of them, or fewer. */
export const statusOf = (check: AtsCheck): 'pass' | 'warn' | 'fail' =>
  check.score >= check.max
    ? 'pass'
    : check.score >= check.max * 0.6
    ? 'warn'
    : 'fail';

const rank: Record<Severity, number> = { critical: 0, warning: 1, tip: 2 };

/** Every issue, the ones that cost most first. */
export const issuesOf = (report: AtsReport): AtsIssue[] =>
  report.checks
    .flatMap((c) => c.issues)
    .sort((a, b) => rank[a.severity] - rank[b.severity]);

export const summaryOf = (score: number, checks: AtsCheck[]): string => {
  const weakest = [...checks]
    .filter((c) => c.score < c.max)
    .sort((a, b) => a.score / a.max - b.score / b.max)
    .slice(0, 2)
    .map((c) => c.name.toLowerCase());
  if (weakest.length === 0)
    return 'Applicant tracking systems will read everything on this resume.';
  const focus = weakest.join(' and ');
  if (score >= 75)
    return `Ready for tracking systems; ${focus} could be stronger.`;
  return `Tracking systems will miss things here: start with ${focus}.`;
};
