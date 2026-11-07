import { Predicate } from 'effect';
import type { Json, Path } from '../values';

/** One question in the guided form: where its answer goes, and an example. */
export interface Question {
  key: string;
  label: string;
  example: string;
  /** Long text; "lines" stores one array item per line. */
  kind?: 'long' | 'lines';
  wide?: boolean;
}

export interface Section {
  id: 'about' | 'work' | 'education' | 'skills';
  title: string;
  intro: string;
  /** Where its answers live; a list section repeats its questions per entry. */
  path: Path;
  list: boolean;
  questions: ReadonlyArray<Question>;
}

export const SECTIONS: ReadonlyArray<Section> = [
  {
    id: 'about',
    title: 'About you',
    intro: 'How people reach you, and the line under your name.',
    path: ['basics'],
    list: false,
    questions: [
      { key: 'name', label: 'Full name', example: 'Ada Lovelace' },
      { key: 'label', label: 'Headline', example: 'Senior Software Engineer' },
      { key: 'email', label: 'Email', example: 'ada@example.com' },
      { key: 'phone', label: 'Phone', example: '+44 20 7946 0000' },
      { key: 'url', label: 'Website', example: 'https://ada.dev' },
      {
        key: 'summary',
        label: 'Summary',
        example:
          'Engineer who turns messy problems into simple, well-tested systems.',
        kind: 'long',
        wide: true,
      },
    ],
  },
  {
    id: 'work',
    title: 'Experience',
    intro: 'Your jobs, newest first. A sentence per achievement works best.',
    path: ['work'],
    list: true,
    questions: [
      { key: 'name', label: 'Company', example: 'Analytical Engines Ltd' },
      { key: 'position', label: 'Role', example: 'Lead Programmer' },
      { key: 'startDate', label: 'Started', example: '2021-03' },
      { key: 'endDate', label: 'Ended (leave empty if current)', example: '' },
      {
        key: 'highlights',
        label: 'What you achieved, one per line',
        example: 'Cut build times from 20 minutes to 3',
        kind: 'lines',
        wide: true,
      },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    intro: 'Degrees, diplomas and courses that matter for the jobs you want.',
    path: ['education'],
    list: true,
    questions: [
      { key: 'institution', label: 'School', example: 'University of London' },
      { key: 'studyType', label: 'Qualification', example: 'BSc' },
      { key: 'area', label: 'Subject', example: 'Mathematics' },
      { key: 'endDate', label: 'Finished', example: '2015' },
    ],
  },
  {
    id: 'skills',
    title: 'Skills',
    intro:
      'One group per line: a name, a colon, then the skills. Or just a skill per line.',
    path: ['skills'],
    list: false,
    questions: [],
  },
];

/** Skills as the guided form writes them: "Frontend: React, CSS" per line. */
export const skillsText = (skills: Json) =>
  (Array.isArray(skills) ? skills : [])
    .filter(Predicate.isObject)
    .map((s) => {
      const name = Predicate.isString(s['name']) ? s['name'] : '';
      const words = Array.isArray(s['keywords'])
        ? s['keywords'].filter(Predicate.isString)
        : [];
      return words.length ? `${name}: ${words.join(', ')}` : name;
    })
    .join('\n');

export const parseSkills = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = '', rest] = line.split(/:(.*)/s);
      const keywords = (rest ?? '')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
      return keywords.length
        ? { name: name.trim(), keywords }
        : { name: name.trim() };
    });

/** "", {} or []: answers that weren't given. */
const blank = (v: unknown) =>
  v === '' ||
  (typeof v === 'object' && v !== null && Object.keys(v).length === 0);

/** Empty strings, lines and entries out, before previewing or saving. */
export const tidy = (value: Json): Json => {
  if (Array.isArray(value)) return value.map(tidy).filter((v) => !blank(v));
  if (Predicate.isObject(value))
    return Object.fromEntries(
      Object.entries(value)
        .map(([k, v]) => [k, tidy(v)] as const)
        .filter(([, v]) => !blank(v))
    );
  return Predicate.isString(value) ? value.trim() : value;
};
