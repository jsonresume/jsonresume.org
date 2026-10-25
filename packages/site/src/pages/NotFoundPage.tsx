import {
  Button,
  Callout,
  Container,
  LinkCard,
  PageHeader,
  SearchField,
  Section,
  SectionIntro,
} from '@jsonresume/ui';
import { useRouterState } from '@tanstack/react-router';
import { paths, resumeUrl } from '../links';
import { SiteLink } from '../SiteLink';
import * as l from './shared/layout.css';
import * as s from './pages.css';

const places = [
  {
    title: 'Getting started',
    description: 'Write resume.json and publish it from a GitHub gist.',
    href: paths.gettingStarted,
  },
  {
    title: 'Themes',
    description: 'Every theme, previewed on a real resume.',
    href: paths.themes,
  },
  {
    title: 'Jobs',
    description: 'Hacker News roles, ranked against your resume.',
    href: paths.jobs,
  },
  {
    title: 'Registry',
    description: 'What moved from registry.jsonresume.org, and what is coming.',
    href: paths.registry,
  },
];

/** "/thomasdavis" looks like a person: resumes live at /@thomasdavis. */
const usernameIn = (pathname: string) =>
  /^\/([a-z0-9][a-z0-9-]{0,38})\/?$/i.exec(pathname)?.[1];

export function NotFoundPage() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const username = usernameIn(pathname);
  return (
    <>
      {/* React hoists this into <head>; missing pages stay out of search. */}
      <meta name="robots" content="noindex" />
      <PageHeader
        title="Page not found"
        description="This page doesn’t exist, or it hasn’t moved to the new site yet."
        actions={
          <Button asChild variant="primary">
            <SiteLink href={paths.home}>Go to the home page</SiteLink>
          </Button>
        }
      />
      <Section spacing="md">
        <Container>
          <div className={l.stack}>
            {username ? (
              <Callout tone="info" title={`Looking for @${username}?`}>
                Resumes live at{' '}
                <SiteLink href={resumeUrl(username)}>
                  jsonresume.org/@{username}
                </SiteLink>
                .
              </Callout>
            ) : null}
            <form action={paths.explore} method="get" role="search">
              <div className={s.lostSearch}>
                <SearchField
                  name="q"
                  defaultValue={username ?? ''}
                  aria-label="Search resumes"
                  placeholder="Find someone by name or skill"
                />
                <Button type="submit" variant="secondary">
                  Search resumes
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </Section>
      <Section spacing="md" aria-labelledby="lost-places">
        <Container>
          <SectionIntro
            overline="Or try"
            title="Popular pages"
            headingId="lost-places"
          />
          <ul className={l.cardGrid2}>
            {places.map((place) => (
              <li key={place.href}>
                <LinkCard
                  asChild
                  title={place.title}
                  description={place.description}
                >
                  <SiteLink href={place.href} />
                </LinkCard>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
