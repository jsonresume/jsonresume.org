import {
  Badge,
  Checklist,
  Code,
  Heading,
  ScoreMeter,
  Stack,
  Text,
} from '@jsonresume/ui';
import { issuesOf, statusOf, type AtsReport, type Severity } from '../report';
import * as s from './ats.css';

/** The rating's bands, as checkAts rates (report.ts). */
const bands = [
  { min: 0, label: 'Needs work', tone: 'danger' as const },
  { min: 55, label: 'Fair', tone: 'warning' as const },
  { min: 75, label: 'Good', tone: 'success' as const },
  { min: 90, label: 'Excellent', tone: 'success' as const },
];

const severity: Record<
  Severity,
  { label: string; tone: 'danger' | 'warning' | 'info' }
> = {
  critical: { label: 'Must fix', tone: 'danger' },
  warning: { label: 'Should fix', tone: 'warning' },
  tip: { label: 'Tip', tone: 'info' },
};

/** The score as a ring, rated. */
export function AtsScore({
  report,
  size = 112,
}: {
  report: AtsReport;
  size?: number;
}) {
  return (
    <ScoreMeter
      value={report.score}
      label="ATS score"
      bands={bands}
      size={size}
    />
  );
}

/**
 * A resume's ATS report: the score and what it means, each check, then
 * every issue, most important first, with the fix and the field.
 */
export function AtsReportView({
  report,
  headingLevel = 2,
  limit,
}: {
  report: AtsReport;
  headingLevel?: 2 | 3;
  /** Show only the first few issues. */
  limit?: number;
}) {
  const all = issuesOf(report);
  const shown = limit === undefined ? all : all.slice(0, limit);
  return (
    <Stack gap={6}>
      <Stack direction="row" gap={4} align="center" wrap>
        <AtsScore report={report} />
        <Stack gap={1}>
          <Text size="md" weight="semibold">
            {report.summary}
          </Text>
          <Text size="sm" tone="muted">
            Read from your resume as applicant tracking systems (Greenhouse,
            Lever, Workday) read it.
          </Text>
        </Stack>
      </Stack>
      <Checklist
        label="Checks"
        items={report.checks.map((c) => ({
          status: statusOf(c),
          title: `${c.name}: ${c.score} of ${c.max}`,
          description: c.issues[0]?.message,
        }))}
      />
      {shown.length > 0 ? (
        <Stack gap={3}>
          <Heading level={headingLevel} size="group">
            To fix, most important first
          </Heading>
          <ol className={s.issues}>
            {shown.map((issue, i) => (
              <li key={i} className={s.issue}>
                <Badge tone={severity[issue.severity].tone}>
                  {severity[issue.severity].label}
                </Badge>
                <Text weight="semibold">{issue.message}</Text>
                <Text size="sm" tone="muted" className={s.detail}>
                  {issue.fix} <Code>{issue.field}</Code>
                </Text>
              </li>
            ))}
          </ol>
          {shown.length < all.length ? (
            <Text size="sm" tone="muted">
              And {all.length - shown.length} more.
            </Text>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}
