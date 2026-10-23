import {
  Avatar,
  Container,
  PageHeader,
  Section,
  Timeline,
} from '@jsonresume/ui';
import type { HistoryEvent, Team, TeamMember } from '@repo/domain';
import { formatDate } from '../format';
import { SiteLink } from '../SiteLink';
import * as s from './pages.css';

/** GitHub avatars come at 50px in the data; ask for enough for a large avatar. */
const largeAvatar = (url: string) => url.replace(/([?&])s=\d+/, '$1s=160');

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
            src={largeAvatar(person.avatar)}
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

/** The people behind JSON Resume, and its documented history. */
export function TeamPage({ team, history }: TeamPageProps) {
  return (
    <>
      <PageHeader
        title="Team"
        description="JSON Resume is maintained by volunteers. These are the people who look after it."
      />
      <Section spacing="lg">
        <Container>
          <h2 className={s.teamTitle}>Core team</h2>
          <People people={team.coreTeam} label="Core team" />
          <h2 className={s.teamTitle}>Standards committee</h2>
          <People
            people={team.standardsCommittee}
            label="Standards committee"
          />
          <h2 id="history" className={s.teamTitle}>
            History
          </h2>
          <Timeline
            label="Project history"
            headingLevel={3}
            items={history.map((event) => ({
              date: formatDate(event.date),
              title: event.title,
              description: event.description,
              subtitle: <SiteLink href={event.href}>{event.source}</SiteLink>,
            }))}
          />
        </Container>
      </Section>
    </>
  );
}
