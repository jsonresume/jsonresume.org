import { Card, Heading, Text } from '@jsonresume/ui';
import type { Job } from '@repo/api';
import * as s from './job.css';

const API = '/api';

/**
 * Where else this job leads: the company's other jobs on the board, and
 * the job and its company as JSON Resume documents for other tools.
 */
export function JobLinks({ job, boardHref }: { job: Job; boardHref: string }) {
  const company = job.company.trim();
  return (
    <Card tone="raised" className={s.prepare}>
      <Heading level={2} size="group">
        More
      </Heading>
      {company && (
        <a
          href={
            job.companySlug
              ? `${boardHref}/companies/${job.companySlug}`
              : `${boardHref}?q=${encodeURIComponent(company)}`
          }
        >
          Other jobs at {company}
        </a>
      )}
      <Text size="sm" tone="muted">
        For other tools, as JSON Resume documents:
      </Text>
      <a href={`${API}/jobs/${job.id}/document`}>This job (job.json)</a>
      {job.companySlug && (
        <a href={`${API}/companies/${job.companySlug}/document`}>
          The company (company.json)
        </a>
      )}
    </Card>
  );
}
