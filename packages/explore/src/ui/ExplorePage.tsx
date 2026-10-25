import {
  Badge,
  Button,
  Container,
  EmptyState,
  Grid,
  Hero,
  Pagination,
  ResumeCard,
  SearchField,
  Section,
  Text,
} from '@jsonresume/ui';
import type { ExploreResults } from '@repo/api';
import * as s from './explore.css';

export interface ExploreLinks {
  /** A person's resume. */
  person: (username: string) => string;
  /** Explore, searching for `query`, on `page`. */
  search: (query: string, page?: number) => string;
  /** Where a signed-in person opts out. */
  settings: string;
}

const month = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const updated = (iso: string | null) =>
  iso ? `Updated ${month.format(new Date(iso))}` : undefined;

/**
 * /explore: everyone's public resume, searchable. Search is a plain form
 * and paging plain links, so the page works without scripts and every
 * search has its own URL.
 */
export function ExplorePage({
  results,
  links,
}: {
  results: ExploreResults;
  links: ExploreLinks;
}) {
  const { query, people, total, page, pageCount, popularSkills } = results;
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Explore"
        title="Find people by their resumes"
        lede="Every public resume on JSON Resume, searchable by skill, role, place, name and employer."
      />
      <Section spacing="lg">
        <Container size="wide">
          <div className={s.results}>
            <form action={links.search('')} method="get" role="search">
              <div className={s.search}>
                <SearchField
                  name="q"
                  defaultValue={query}
                  aria-label="Search resumes"
                  placeholder="Try “rust berlin” or “product designer”"
                  size="lg"
                />
                <Button type="submit" variant="primary" size="lg">
                  Search
                </Button>
              </div>
            </form>
            {popularSkills.length > 0 ? (
              <ul className={s.skills} aria-label="Popular skills">
                {popularSkills.map((skill) => (
                  <li key={skill}>
                    <a href={links.search(skill)}>
                      <Badge tone="outline">{skill}</Badge>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <Text tone="muted" aria-live="polite">
              {query
                ? `${total.toLocaleString('en')} ${
                    total === 1 ? 'person matches' : 'people match'
                  } “${query}”`
                : `${total.toLocaleString('en')} people, fullest resumes first`}
            </Text>
            {people.length === 0 ? (
              <EmptyState
                title={`Nobody matches “${query}”`}
                action={
                  <Button asChild variant="secondary">
                    <a href={links.search('')}>See everyone</a>
                  </Button>
                }
              >
                Every word has to match: try fewer, or another spelling.
              </EmptyState>
            ) : (
              <Grid gap={4} minColumnWidth="18rem">
                {people.map((p) => (
                  <ResumeCard
                    key={p.username}
                    name={p.name}
                    label={p.label ?? undefined}
                    avatarUrl={p.image}
                    location={p.location ?? undefined}
                    skills={p.skills.slice(0, 5)}
                    updated={updated(p.updatedAt)}
                    href={links.person(p.username)}
                    headingLevel={2}
                  />
                ))}
              </Grid>
            )}
            <Pagination
              page={page}
              pageCount={pageCount}
              href={(n) => links.search(query, n)}
              label="Pages of results"
            />
            <Text tone="muted" size="sm">
              Your resume is listed once your page is public. To take it out,
              switch off Explore in <a href={links.settings}>Settings</a>.
            </Text>
          </div>
        </Container>
      </Section>
    </>
  );
}
