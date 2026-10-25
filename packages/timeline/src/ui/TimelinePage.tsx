import {
  Badge,
  Button,
  Container,
  Hero,
  Section,
  Stat,
  Stats,
  Timeline as TimelineList,
} from '@jsonresume/ui';
import { when } from '../dates';
import type { Timeline, TimelineKind } from '../timeline';
import * as s from './timeline.css';

const kindLabels: Record<TimelineKind, string> = {
  work: 'Work',
  volunteer: 'Volunteering',
  education: 'Education',
  project: 'Project',
  award: 'Award',
  certificate: 'Certificate',
  publication: 'Publication',
};

export interface TimelineLinks {
  page: string;
  pdf: string;
}

/**
 * /@username/timeline: a career at a glance, newest first, with how long
 * each role lasted. `today` is YYYY-MM-DD (from the server, so the page
 * hydrates the same).
 */
export function TimelinePage({
  username,
  timeline,
  today,
  links,
}: {
  username: string;
  timeline: Timeline;
  today: string;
  links: TimelineLinks;
}) {
  const count = (kinds: TimelineKind[]) =>
    timeline.items.filter((i) => kinds.includes(i.kind)).length;
  const stats: Array<[string, number | null]> = [
    ['Years working', timeline.yearsWorking],
    ['Roles', count(['work', 'volunteer'])],
    ['Schools and courses', count(['education'])],
    ['Projects', count(['project'])],
    ['Awards and certificates', count(['award', 'certificate'])],
  ];
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow={`@${username} · Timeline`}
        title={timeline.name}
        lede={timeline.label ?? undefined}
        actions={
          <>
            <Button asChild variant="primary">
              <a href={links.page}>Open the resume</a>
            </Button>
            <Button asChild variant="secondary">
              <a href={links.pdf}>Download PDF</a>
            </Button>
          </>
        }
      />
      <Section spacing="lg">
        <Container size="prose">
          <div className={s.body}>
            <Stats>
              {stats.flatMap(([label, value]) =>
                value ? [<Stat key={label} label={label} value={value} />] : []
              )}
            </Stats>
            {timeline.items.length === 0 ? (
              <p>Nothing on this resume has dates yet.</p>
            ) : (
              <TimelineList
                label={`${timeline.name}’s timeline`}
                headingLevel={2}
                items={timeline.items.map((item) => ({
                  date: when(item, today.slice(0, 7)),
                  title: item.title,
                  subtitle: (
                    <>
                      <Badge tone="outline">{kindLabels[item.kind]}</Badge>{' '}
                      {item.at}
                    </>
                  ),
                  description: item.summary ?? undefined,
                  details:
                    item.highlights.length > 0 ? (
                      <ul className={s.highlights}>
                        {item.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    ) : undefined,
                  current: item.current,
                }))}
              />
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
