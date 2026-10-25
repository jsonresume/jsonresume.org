import { entries, text, texts, type Entry } from '@repo/resume-formats/read';

export type TimelineKind =
  | 'work'
  | 'volunteer'
  | 'education'
  | 'project'
  | 'award'
  | 'certificate'
  | 'publication';

/** One thing on a timeline: a job, a school, a project, an award. */
export interface TimelineItem {
  kind: TimelineKind;
  title: string;
  /** Where: the company, school, organisation, awarder or publisher. */
  at: string | null;
  /** YYYY, YYYY-MM or YYYY-MM-DD; awards and the like have only a start. */
  start: string | null;
  end: string | null;
  /** Still going: a start and no end. */
  current: boolean;
  summary: string | null;
  highlights: string[];
}

/** A resume as a timeline: who, and everything they did, newest first. */
export interface Timeline {
  name: string;
  label: string | null;
  items: TimelineItem[];
  /** Years since the first job began, or null without dated jobs. */
  yearsWorking: number | null;
}

const DATE = /^\d{4}(-\d{2}){0,2}$/;
const date = (v: unknown) => {
  const t = text(v);
  return t && DATE.test(t) ? t : null;
};

const item = (
  kind: TimelineKind,
  e: Entry,
  fields: { title: string; at: string; start: string; end?: string }
): TimelineItem | undefined => {
  const title = text(e[fields.title]) ?? text(e[fields.at]);
  if (!title) return undefined;
  const start = date(e[fields.start]);
  const end = fields.end ? date(e[fields.end]) : null;
  return {
    kind,
    title,
    at: title === text(e[fields.at]) ? null : text(e[fields.at]) ?? null,
    start,
    end,
    current: fields.end !== undefined && start !== null && end === null,
    summary: text(e['summary']) ?? text(e['description']) ?? null,
    highlights: [...texts(e['highlights']), ...texts(e['courses'])],
  };
};

/** When an item happened, for ordering: its end, else its start. */
const sortKey = (i: TimelineItem) =>
  i.current ? '9999' : i.end ?? i.start ?? '';

/**
 * Everything dated in a resume, newest first (current roles on top): jobs,
 * volunteering, schools, projects, awards, certificates and publications.
 */
export function toTimeline(
  resume: unknown,
  fallbackName: string,
  /** Today, YYYY-MM-DD, for how long they've worked. */
  today: string
): Timeline {
  const r = entries([resume])[0] ?? {};
  const basics = entries([r['basics']])[0] ?? {};
  const all = (key: string) => entries(r[key]);
  const items = [
    ...all('work').map((e) =>
      item('work', e, {
        title: 'position',
        at: 'name',
        start: 'startDate',
        end: 'endDate',
      })
    ),
    ...all('volunteer').map((e) =>
      item('volunteer', e, {
        title: 'position',
        at: 'organization',
        start: 'startDate',
        end: 'endDate',
      })
    ),
    ...all('education').map((e) =>
      item('education', e, {
        title: text(e['studyType']) ? 'studyType' : 'area',
        at: 'institution',
        start: 'startDate',
        end: 'endDate',
      })
    ),
    ...all('projects').map((e) =>
      item('project', e, {
        title: 'name',
        at: 'entity',
        start: 'startDate',
        end: 'endDate',
      })
    ),
    ...all('awards').map((e) =>
      item('award', e, { title: 'title', at: 'awarder', start: 'date' })
    ),
    ...all('certificates').map((e) =>
      item('certificate', e, { title: 'name', at: 'issuer', start: 'date' })
    ),
    ...all('publications').map((e) =>
      item('publication', e, {
        title: 'name',
        at: 'publisher',
        start: 'releaseDate',
      })
    ),
  ]
    .filter((i): i is TimelineItem => i !== undefined)
    .sort(
      (a, b) =>
        sortKey(b).localeCompare(sortKey(a)) ||
        (b.start ?? '').localeCompare(a.start ?? '')
    );
  const firstJob = items
    .filter((i) => i.kind === 'work' && i.start)
    .map((i) => i.start ?? '')
    .sort()[0];
  return {
    name: text(basics['name']) ?? fallbackName,
    label: text(basics['label']) ?? null,
    items,
    yearsWorking: firstJob
      ? Math.max(0, Number(today.slice(0, 4)) - Number(firstJob.slice(0, 4)))
      : null,
  };
}
