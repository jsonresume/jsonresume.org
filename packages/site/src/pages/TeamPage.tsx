import {
  Avatar,
  Button,
  Container,
  Hero,
  Section,
  SectionIntro,
  Timeline,
} from '@jsonresume/ui';
import type { HistoryEvent, Team, TeamMember } from '@repo/domain';
import { team as copy } from '@repo/content/pages';
import { proxiedImage } from '@repo/images/url';
import { formatDate } from '../format';
import { InlineParagraphs } from '../InlineMarkdown';
import { paths } from '../links';
import { SiteLink } from '../SiteLink';
import * as s from './pages.css';
import { NextSteps } from './shared/NextSteps';
import * as l from './shared/layout.css';

function People({
  people,
  label,
}: {
  people: ReadonlyArray<TeamMember>;
  label: string;
}) {
  return (
    <ul className={s.people} aria-label={label}>
      {people.map((person) => (
        <li key={person.github} className={s.person}>
          <Avatar
            src={proxiedImage(person.avatar, 160)}
            name={person.name}
            size="lg"
            shape="circle"
          />
          <strong>{person.name}</strong>
          <span className={s.personLinks}>
            <a href={`https://github.com/${person.github}`}>GitHub</a>
            {person.twitter ? (
              <a href={`https://x.com/${person.twitter}`}>X</a>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

export interface TeamPageProps {
  team: Team;
  history: ReadonlyArray<HistoryEvent>;
}

/** The people behind JSON Resume, how to join them, and the project's story. */
export function TeamPage({ team, history }: TeamPageProps) {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Team"
        title="The people behind JSON Resume"
        lede="Volunteers have looked after the schema, the tools, the registry and this site since 2014."
      />
      <Section spacing="lg" aria-labelledby="core">
        <Container>
          <SectionIntro
            overline="Core team"
            title="Maintainers"
            headingId="core"
          >
            {copy.roles.coreTeam}
          </SectionIntro>
          <People people={team.coreTeam} label="Core team" />
          <SectionIntro
            overline="Standards committee"
            title="Schema reviewers"
            headingId="committee"
          >
            {copy.roles.standardsCommittee}
          </SectionIntro>
          <People
            people={team.standardsCommittee}
            label="Standards committee"
          />
        </Container>
      </Section>
      <Section tone="subtle" spacing="lg" aria-labelledby="contribute">
        <Container>
          <div className={l.twoCol}>
            <SectionIntro
              overline="Contributing"
              title="Join in"
              headingId="contribute"
            >
              {copy.contributing.intro}
            </SectionIntro>
            <div className={l.stack}>
              <ul className={s.ways}>
                {copy.contributing.ways.map((way) => (
                  <li key={way}>{way}</li>
                ))}
              </ul>
              <div className={l.actions}>
                <Button asChild variant="primary">
                  <a href={copy.contributing.href}>The repository</a>
                </Button>
                <Button asChild>
                  <a href={copy.contributing.guide}>Contributing guide</a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <Section spacing="lg" id="history" aria-labelledby="history-title">
        <Container>
          <SectionIntro
            overline="History"
            title="How it got here"
            headingId="history-title"
          />
          <div className={s.story}>
            {copy.story.map((chapter) => (
              <article key={chapter.title} className={s.chapter}>
                <h3 className={s.chapterTitle}>{chapter.title}</h3>
                <div className={s.chapterBody}>
                  <InlineParagraphs className={l.body}>
                    {chapter.body}
                  </InlineParagraphs>
                </div>
              </article>
            ))}
          </div>
          <h3 className={s.teamTitle}>Dated milestones</h3>
          <Timeline
            label="Project milestones"
            headingLevel={4}
            items={history.map((event) => ({
              date: formatDate(event.date),
              title: event.title,
              description: event.description,
              subtitle: <SiteLink href={event.href}>{event.source}</SiteLink>,
            }))}
          />
        </Container>
      </Section>
      <NextSteps
        title="Writing about the project?"
        items={[
          { label: 'Media kit', href: paths.media },
          { label: 'Read the blog', href: paths.blog },
        ]}
      />
    </>
  );
}
