import { Badge, Card } from '@jsonresume/ui';
import type { JobSummary } from '@repo/api';
import type { ReactNode } from 'react';
import * as s from './board.css';
import {
  companyText,
  employmentLabels,
  monthsText,
  postedText,
  remoteText,
  salaryText,
  seniorityLabels,
} from './format';

export interface JobCardProps {
  job: JobSummary;
  /** Where the title links. */
  href: string;
  /** Beside the job: a fit score, mark buttons. Stays clickable over the card link. */
  aside?: ReactNode;
  /** Heading level of the title, for the page's outline. */
  headingLevel?: 'h2' | 'h3';
}

/** A job in a list: company and age, title, where and pay, skills. */
export function JobCard({
  job,
  href,
  aside,
  headingLevel: Heading = 'h2',
}: JobCardProps) {
  const salary = salaryText(job);
  const repost = monthsText(job.months);
  // "Remote (US)" already says US.
  const place =
    job.location && !job.remoteRegions.includes(job.location)
      ? job.location
      : null;
  const facts = [
    remoteText(job),
    place,
    seniorityLabels[job.seniority],
    employmentLabels[job.employmentType],
  ].filter((fact): fact is string => Boolean(fact));
  return (
    <Card tone="raised" className={`${s.card} ${s.positioned}`}>
      <div className={s.main}>
        <p className={s.overline}>
          <span className={s.company}>{companyText(job.company)}</span>
          <span>{postedText(job.postedAt)}</span>
          {repost && <span>{repost}</span>}
        </p>
        <Heading className={s.title}>
          <a className={s.titleLink} href={href}>
            {job.title}
          </a>
        </Heading>
        <div className={s.meta}>
          {salary && <Badge tone="success">{salary}</Badge>}
          {facts.map((fact) => (
            <Badge key={fact} tone="outline">
              {fact}
            </Badge>
          ))}
        </div>
        {job.skills.length > 0 && (
          <ul className={s.skills} aria-label="Skills">
            {job.skills.map((skill) => (
              <li key={skill} className={s.skill}>
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>
      {aside && <div className={s.aside}>{aside}</div>}
    </Card>
  );
}
