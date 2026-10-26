import type { ResumeListing } from '@repo/api';
import { entries, text, texts } from '@repo/resume-formats/read';

/** A resume ready to search: what Explore shows, and the words it matches. */
export interface Entry {
  listing: ResumeListing;
  /** Everything searchable, lower-cased: name, headline, place, skills, jobs. */
  words: string;
  /** Skills and keywords, lower-cased, for exact matches. */
  skillSet: ReadonlySet<string>;
  /** How complete it looks (headline, skills, photo, jobs): fuller first. */
  fullness: number;
}

/** The raw row: a username, its resume (basics, skills, work, meta) and when it was saved here. */
export interface Row {
  username: string;
  resume: unknown;
  updatedAt: Date | null;
}

// The sample resume's own date, kept by everyone who started from it.
const SAMPLE_DATE = '2017-12-24';

/** meta.lastModified, when it is a real date: not the sample's, not in the future. */
export const lastModifiedOf = (value: unknown, now = Date.now()) => {
  const raw = text(value);
  if (!raw || raw.startsWith(SAMPLE_DATE)) return null;
  const at = new Date(raw);
  const time = at.getTime();
  return Number.isNaN(time) || time > now || at.getUTCFullYear() < 2000
    ? null
    : at;
};

const town = (location: unknown): string | null => {
  const l = entries([location])[0];
  const parts = l
    ? ['city', 'region', 'countryCode'].flatMap((k) => text(l[k]) ?? [])
    : [];
  return parts.length > 0 ? parts.join(', ') : null;
};

const httpsImage = (basics: Readonly<Record<string, unknown>>) => {
  const url = text(basics['image']) ?? text(basics['picture']);
  return url && /^https:\/\/[^\s"'<>]+$/.test(url) ? url : null;
};

/**
 * The skills a resume lists: each group's keywords (the specific ones), or
 * its name when it has none ("Frontend" says little next to "React").
 */
const skillsOf = (resume: Readonly<Record<string, unknown>>) => {
  const all = entries(resume['skills']).flatMap((g) => {
    const keywords = texts(g['keywords']);
    return keywords.length > 0 ? keywords : text(g['name']) ?? [];
  });
  const seen = new Set<string>();
  return all.filter((s) => {
    const key = s.toLowerCase();
    if (seen.has(key) || s.length > 40) return false;
    seen.add(key);
    return true;
  });
};

/** A row as Explore lists it, or undefined when there is nothing to show. */
export const toEntry = (row: Row): Entry | undefined => {
  const resume = entries([row.resume])[0];
  if (!resume) return undefined;
  const basics = entries([resume['basics']])[0] ?? {};
  const name = text(basics['name']);
  const label = text(basics['label']) ?? null;
  const skills = skillsOf(resume);
  const work = entries(resume['work']);
  // A name and something about them, or it is an empty template.
  if (!name || (!label && skills.length === 0 && work.length === 0))
    return undefined;
  const location = town(basics['location']);
  const image = httpsImage(basics);
  const listing: ResumeListing = {
    username: row.username,
    name,
    label,
    location,
    image,
    skills: skills.slice(0, 8),
    updatedAt:
      (
        row.updatedAt ??
        lastModifiedOf(entries([resume['meta']])[0]?.['lastModified'])
      )?.toISOString() ?? null,
  };
  const words = [
    row.username,
    name,
    label,
    location,
    text(basics['summary']),
    ...skills,
    ...work.flatMap((w) => [text(w['position']), text(w['name'])]),
  ]
    .filter(Boolean)
    .join(' \n ')
    .toLowerCase();
  return {
    listing,
    words,
    skillSet: new Set(skills.map((s) => s.toLowerCase())),
    fullness:
      (label ? 2 : 0) +
      Math.min(skills.length, 6) / 3 +
      (image ? 1 : 0) +
      (work.length > 0 ? 1 : 0) +
      (location ? 0.5 : 0),
  };
};

const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Drops copies of a template: when three or more resumes share a name and
 * headline (the schema's sample, "John Doe", someone's resume copied as a
 * start), only one whose username is that name stays.
 */
export const dropTemplates = (all: ReadonlyArray<Entry>): Entry[] => {
  const key = (e: Entry) =>
    `${e.listing.name.toLowerCase()}|${(e.listing.label ?? '').toLowerCase()}`;
  const counts = new Map<string, number>();
  for (const e of all) counts.set(key(e), (counts.get(key(e)) ?? 0) + 1);
  return all.filter(
    (e) =>
      (counts.get(key(e)) ?? 0) < 3 ||
      squash(e.listing.username) === squash(e.listing.name)
  );
};
