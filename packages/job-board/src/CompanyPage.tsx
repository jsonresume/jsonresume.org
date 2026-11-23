import {
  Badge,
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  Container,
  Heading,
  Section,
  Text,
} from '@jsonresume/ui';
import type { CompanyProfile } from '@repo/api';
import { JobCard } from './JobCard';
import { JobList } from './JobList';
import * as s from './job.css';

const remoteLabels = {
  Full: 'Remote',
  Hybrid: 'Hybrid',
  None: 'On site',
} as const;

const placeText = (place: {
  city?: string;
  region?: string;
  countryCode?: string;
}) =>
  [place.city, place.region !== place.city ? place.region : undefined]
    .concat(place.countryCode)
    .filter(Boolean)
    .join(', ');

/** The company's facts, as its posts state them. */
function Facts({ company }: { company: CompanyProfile['company'] }) {
  const site = company.url;
  const places = (company.locations ?? []).map(placeText).join(' · ');
  return (
    <Card tone="raised" asChild>
      <dl className={s.facts}>
        {site && (
          <div>
            <dt className={s.factLabel}>Website</dt>
            <dd className={s.factValue}>
              <a href={site} rel="nofollow noopener">
                {site.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </dd>
          </div>
        )}
        {company.remote && (
          <div>
            <dt className={s.factLabel}>Works</dt>
            <dd className={s.factValue}>{remoteLabels[company.remote]}</dd>
          </div>
        )}
        {places && (
          <div>
            <dt className={s.factLabel}>Where</dt>
            <dd className={s.factValue}>{places}</dd>
          </div>
        )}
        <div>
          <dt className={s.factLabel}>For tools</dt>
          <dd className={s.factValue}>
            <a href={company.meta.canonical}>company.json</a>
          </dd>
        </div>
      </dl>
    </Card>
  );
}

/**
 * /jobs/companies/:slug: a company hiring on the board, from its posts,
 * with its open jobs.
 */
export function CompanyPage({
  profile,
  boardHref,
  jobHref,
}: {
  profile: CompanyProfile;
  boardHref: string;
  jobHref: (id: number) => string;
}) {
  const { company, jobs } = profile;
  const count = `${jobs.length} open ${jobs.length === 1 ? 'job' : 'jobs'}`;
  return (
    <Section spacing="lg">
      <Container size="wide">
        <Breadcrumbs className={s.crumbs}>
          <BreadcrumbItem href={boardHref}>Jobs</BreadcrumbItem>
          <BreadcrumbItem current>{company.name}</BreadcrumbItem>
        </Breadcrumbs>
        <div className={s.layout}>
          <article className={s.article}>
            <header className={s.header}>
              <Heading level={1} size="title">
                {company.name}
              </Heading>
              <p className={s.company}>
                {count} from Hacker News “Who is hiring?”
              </p>
              {company.technologies && (
                <div className={s.badges}>
                  {company.technologies.map((tech) => (
                    <Badge key={tech} tone="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </header>
            <JobList
              jobs={jobs}
              label={`Jobs at ${company.name}`}
              renderJob={(job) => <JobCard job={job} href={jobHref(job.id)} />}
            />
            <Text size="sm" tone="muted">
              Built from the company’s posts: only what they state.
            </Text>
          </article>
          <div className={s.aside}>
            <Facts company={company} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
