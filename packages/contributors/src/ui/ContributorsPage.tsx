import {
  Container,
  Hero,
  SearchField,
  Section,
  SegmentedControl,
  Stat,
  Stats,
} from '@jsonresume/ui';
import { useDeferredValue, useMemo, useState } from 'react';
import {
  filterContributors,
  KIND_GROUPS,
  totalsOf,
  type KindGroup,
} from '../contributors';
import type { Contributors } from '../model';
import * as s from './contributors.css';
import { Person } from './Person';

const GROUPS: ReadonlyArray<{ value: KindGroup | 'all'; label: string }> = [
  { value: 'all', label: 'Everyone' },
  { value: 'code', label: 'Code' },
  { value: 'themes', label: 'Themes' },
  { value: 'projects', label: 'Projects' },
  { value: 'discussion', label: 'Issues and discussion' },
  { value: 'team', label: 'Team' },
];

const isGroup = (v: string): v is KindGroup => v in KIND_GROUPS;
const n = (value: number) => value.toLocaleString('en');
const day = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export interface ContributorsPageProps {
  data: Contributors;
}

/**
 * /contributors: every person who has given JSON Resume anything (code,
 * themes, tools, bug reports, discussion), each credit linked to the work.
 * Everyone is in the server-rendered HTML; search and the filter only hide.
 */
export function ContributorsPage({ data }: ContributorsPageProps) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<KindGroup | 'all'>('all');
  const deferredQuery = useDeferredValue(query);
  const totals = useMemo(() => totalsOf(data.people), [data.people]);
  const shown = useMemo(
    () =>
      filterContributors(
        data.people,
        deferredQuery,
        group === 'all' ? undefined : group
      ),
    [data.people, deferredQuery, group]
  );
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Contributors"
        title="Everyone who has built JSON Resume"
        lede={`${n(
          totals.people
        )} people since 2014: code, themes, tools, bug reports and the discussions that shaped the schema. Every credit links to the work.`}
      />
      <Section spacing="lg" aria-labelledby="people-title">
        <Container size="wide">
          <Stats>
            <Stat value={n(totals.people)} label="People" />
            <Stat value={n(totals.commits)} label="Commits" />
            <Stat value={n(totals.pulls)} label="Pull requests" />
            <Stat value={n(totals.issues)} label="Issues" />
            <Stat value={n(totals.comments)} label="Comments" />
            <Stat value={n(totals.themes)} label="Themes on npm" />
          </Stats>
          <h2 id="people-title" className={s.count}>
            {shown.length === data.people.length
              ? `All ${n(shown.length)} contributors, most involved first`
              : `${n(shown.length)} of ${n(data.people.length)} contributors`}
          </h2>
          <div className={s.controls}>
            <SearchField
              value={query}
              onValueChange={setQuery}
              aria-label="Search contributors"
              placeholder="A name, a GitHub login, a repository or a theme"
            />
            <SegmentedControl
              label="What they did"
              options={GROUPS.map((g) => ({ value: g.value, label: g.label }))}
              value={group}
              onValueChange={(v) => setGroup(isGroup(v) ? v : 'all')}
            />
          </div>
          <ol className={s.people} aria-labelledby="people-title">
            {shown.map((person) => (
              <Person
                key={person.github ?? person.npm ?? person.name}
                person={person}
              />
            ))}
          </ol>
          <p className={s.note}>
            Collected {day.format(new Date(`${data.collected}T00:00:00Z`))} from
            the {data.repositories} public repositories of the jsonresume
            organisation on GitHub (commits, pull requests, issues and
            comments), every jsonresume-theme package on npm, and this site’s
            team and <a href="/projects">projects directory</a>. It is refreshed
            every week. Missing, or want your name shown differently? Set it on
            your GitHub profile, or{' '}
            <a href="https://github.com/jsonresume/jsonresume.org/issues/new">
              open an issue
            </a>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
