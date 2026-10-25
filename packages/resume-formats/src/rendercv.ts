import { stringify } from 'yaml';
import { entries, place, text, texts, type Entry } from './read';

/** Social networks RenderCV accepts; it rejects any other name. */
const NETWORKS = [
  'LinkedIn',
  'GitHub',
  'GitLab',
  'IMDB',
  'Instagram',
  'ORCID',
  'Mastodon',
  'StackOverflow',
  'ResearchGate',
  'YouTube',
  'Google Scholar',
  'Telegram',
  'WhatsApp',
  'Leetcode',
  'X',
  'Bluesky',
  'Reddit',
];
const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
const networkNames = new Map([
  ...NETWORKS.map((n): [string, string] => [key(n), n]),
  ['twitter', 'X'],
]);

/** RenderCV dates: YYYY, YYYY-MM or YYYY-MM-DD; anything else is left out. */
const date = (value: unknown) => {
  const t = text(value);
  return t && /^\d{4}(-\d{2}){0,2}$/.test(t) ? t : undefined;
};
const dates = (item: Entry) => {
  const start = date(item['startDate']);
  const end = date(item['endDate']);
  return start
    ? { start_date: start, end_date: end ?? 'present' }
    : { date: end ?? date(item['date']) ?? date(item['releaseDate']) };
};
const list = (values: ReadonlyArray<string>) =>
  values.length > 0 ? [...values] : undefined;

/** Where someone is, without the street: "San Francisco, California, US". */
const town = (location: unknown) => {
  const l = entries([location])[0];
  if (!l) return text(location);
  const parts = ['city', 'region', 'countryCode'].flatMap(
    (k) => text(l[k]) ?? []
  );
  return parts.length > 0 ? parts.join(', ') : undefined;
};

/** Drops absent fields, so the YAML holds only what the resume says. */
const clean = <A extends Record<string, unknown>>(o: A) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
const section = (items: ReadonlyArray<Record<string, unknown>>) =>
  items.length > 0 ? items.map(clean) : undefined;
/** "Label: details" lines; RenderCV needs both, so half-empty ones go. */
const oneLine = (
  pairs: ReadonlyArray<[string | undefined, string | undefined]>
) =>
  section(
    pairs.flatMap(([label, details]) =>
      label && details ? [{ label, details }] : []
    )
  );

/**
 * A resume as a RenderCV input file (rendercv.com): `rendercv render` turns
 * it into a typeset PDF. Every JSON Resume section that RenderCV has an
 * entry type for is kept; unsupported networks and odd dates are dropped.
 */
export function toRenderCv(resume: Entry): string {
  const basics = entries([resume['basics']])[0] ?? {};
  const all = (name: string) => entries(resume[name]);
  const phone = text(basics['phone']);
  const summary = text(basics['summary']);
  const sections = clean({
    summary: summary ? [summary] : undefined,
    experience: section(
      all('work').map((w) => ({
        company: text(w['name']) ?? '',
        position: text(w['position']),
        location: place(w['location']),
        ...dates(w),
        summary: text(w['summary']),
        highlights: list(texts(w['highlights'])),
      }))
    ),
    education: section(
      all('education').map((e) => ({
        institution: text(e['institution']) ?? '',
        area: text(e['area']) ?? '',
        degree: text(e['studyType']),
        ...dates(e),
        highlights: list(texts(e['courses'])),
      }))
    ),
    projects: section(
      all('projects').map((p) => ({
        name: text(p['name']) ?? '',
        ...dates(p),
        summary: text(p['description']),
        highlights: list(texts(p['highlights'])),
      }))
    ),
    volunteering: section(
      all('volunteer').map((v) => ({
        company: text(v['organization']) ?? '',
        position: text(v['position']),
        ...dates(v),
        summary: text(v['summary']),
        highlights: list(texts(v['highlights'])),
      }))
    ),
    publications: section(
      all('publications').map((p) => ({
        title: text(p['name']) ?? '',
        // JSON Resume has no authors: publications are the owner's work.
        authors: [text(basics['name']) ?? ''],
        journal: text(p['publisher']),
        url: text(p['url']),
        date: date(p['releaseDate']),
      }))
    ),
    awards: section(
      [...all('awards'), ...all('certificates')].map((a) => ({
        name: text(a['title']) ?? text(a['name']) ?? '',
        date: date(a['date']),
        summary: text(a['awarder']) ?? text(a['issuer']) ?? text(a['summary']),
      }))
    ),
    skills: oneLine(
      all('skills').map((s) => [
        text(s['name']),
        texts(s['keywords']).join(', ') || text(s['level']),
      ])
    ),
    languages: oneLine(
      all('languages').map((l) => [text(l['language']), text(l['fluency'])])
    ),
  });
  const cv = clean({
    name: text(basics['name']),
    location: town(basics['location']),
    email: text(basics['email']),
    // RenderCV wants international numbers; a local one can't be converted.
    phone: phone && /^\+\d/.test(phone) ? phone : undefined,
    website: text(basics['url']),
    social_networks: section(
      entries(basics['profiles']).flatMap((p) => {
        const network = networkNames.get(key(text(p['network']) ?? ''));
        const username = text(p['username']);
        return network && username ? [{ network, username }] : [];
      })
    ),
    sections: Object.keys(sections).length > 0 ? sections : undefined,
  });
  return stringify({ cv });
}
