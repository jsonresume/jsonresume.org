import {
  Badge,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Callout,
  Card,
  Container,
  Heading,
  Section,
  Text,
} from '@jsonresume/ui';
import type { Job } from '@repo/api';
import {
  employmentLabels,
  hnUrl,
  monthsText,
  postedText,
  remoteText,
  salaryText,
  seniorityLabels,
} from './format';
import * as s from './job.css';
import { applyHref, Linkified } from './Linkified';

function List({ title, items }: { title: string; items: readonly string[] }) {
  if (items.length === 0) return null;
  return (
    <section className={s.block}>
      <Heading level={2} size="subsection">
        {title}
      </Heading>
      <ul className={s.bullets}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function Facts({ job }: { job: Job }) {
  const facts: Array<[string, string | null]> = [
    ['Pay', salaryText(job)],
    ['Where', [remoteText(job), job.location].filter(Boolean).join(' · ')],
    ['Time zones', job.timezones],
    ['Level', seniorityLabels[job.seniority]],
    ['Type', employmentLabels[job.employmentType]],
    [
      'Visa sponsorship',
      job.visa === 'unspecified' ? null : job.visa === 'yes' ? 'Yes' : 'No',
    ],
    ['Equity', job.equity],
    ['Posted', `${postedText(job.postedAt)} by ${job.author}`],
  ];
  return (
    <Card tone="raised" asChild>
      <dl className={s.facts}>
        {facts.map(([label, value]) =>
          value ? (
            <div key={label}>
              <dt className={s.factLabel}>{label}</dt>
              <dd className={s.factValue}>{value}</dd>
            </div>
          ) : null
        )}
      </dl>
    </Card>
  );
}

/** /jobs/:id: the role as parsed, with the original post below. */
export function JobPage({ job, boardHref }: { job: Job; boardHref: string }) {
  const apply = applyHref(job.apply);
  const repost = monthsText(job.months);
  return (
    <Section spacing="lg">
      <Container size="wide">
        <Breadcrumbs className={s.crumbs}>
          <BreadcrumbItem href={boardHref}>Jobs</BreadcrumbItem>
          <BreadcrumbItem current>{job.company}</BreadcrumbItem>
        </Breadcrumbs>
        <div className={s.layout}>
          <article className={s.article}>
            <header className={s.header}>
              <Heading level={1} size="title">
                {job.title}
              </Heading>
              <p className={s.company}>{job.company}</p>
              <div className={s.badges}>
                {repost && <Badge tone="brand">{repost}</Badge>}
                {job.skills.map((skill) => (
                  <Badge key={skill} tone="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
              {job.closed && (
                <Callout tone="warning" title="No longer on the board">
                  This post is from an older thread, a newer post replaced it,
                  or its author removed it. The company may still be hiring.
                </Callout>
              )}
              <div className={s.actions}>
                {apply && (
                  <Button asChild variant="primary">
                    <a href={apply} rel="nofollow noopener">
                      Apply
                    </a>
                  </Button>
                )}
                <Button asChild variant="secondary">
                  <a href={hnUrl(job.id)}>View on Hacker News</a>
                </Button>
              </div>
            </header>
            {job.summary && <Text size="md">{job.summary}</Text>}
            <List title="What you’ll do" items={job.responsibilities} />
            <List title="What they’re looking for" items={job.qualifications} />
            <List
              title="Skills"
              items={job.skillDetails.map((skill) =>
                skill.keywords.length
                  ? `${skill.name}: ${skill.keywords.join(', ')}`
                  : skill.name
              )}
            />
            <section className={s.block}>
              <Heading level={2} size="subsection">
                The post
              </Heading>
              <blockquote className={s.post}>
                {job.post.map((paragraph, i) => (
                  <p key={i}>
                    <Linkified text={paragraph} />
                  </p>
                ))}
              </blockquote>
            </section>
          </article>
          <Facts job={job} />
        </div>
      </Container>
    </Section>
  );
}
