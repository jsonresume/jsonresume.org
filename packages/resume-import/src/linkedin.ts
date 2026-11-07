import type { FieldConfidence } from '@repo/api';
import { csvRecords } from './csv';
import { isoDate } from './dates';

type Row = Record<string, string>;

/** A resume read without a model, and the fields that are a best guess. */
export interface RuleRead {
  resume: Record<string, unknown>;
  unsure: Array<{ path: string; confidence: Exclude<FieldConfidence, 'high'> }>;
}

const date = (raw: string | undefined) => (raw ? isoDate(raw) : undefined);

const BULLET = /^\s*[•▪◦*-]\s+/;

/** A description: bullet lines become highlights, the rest the summary. */
const described = (text: string | undefined) => {
  const lines = (text ?? '').split('\n').map((l) => l.trim());
  const highlights = lines
    .filter((l) => BULLET.test(l))
    .map((l) => l.replace(BULLET, ''));
  const summary = lines.filter((l) => l && !BULLET.test(l)).join('\n');
  return { summary, highlights };
};

const urls = (text: string | undefined) =>
  (text ?? '').match(/https?:\/\/[^\s,\]]+/g) ?? [];

const handles = (text: string | undefined) =>
  (text ?? '')
    .replace(/[[\]]/g, '')
    .split(',')
    .map((h) => h.trim().replace(/^@/, ''))
    .filter((h) => /^\w{1,30}$/.test(h));

const basicsFrom = (profile: Row | undefined, emails: Row[], phones: Row[]) => {
  const email =
    emails.find((e) => e['Primary'] === 'Yes')?.['Email Address'] ??
    emails[0]?.['Email Address'];
  const place = (profile?.['Geo Location'] ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const sites = urls(profile?.['Websites']);
  return {
    name: [profile?.['First Name'], profile?.['Last Name']]
      .filter(Boolean)
      .join(' '),
    label: profile?.['Headline'],
    email,
    phone: phones[0]?.['Number'],
    url: sites[0],
    summary: profile?.['Summary'],
    location: {
      city: place[0],
      region: place.length >= 3 ? place[1] : undefined,
      postalCode: profile?.['Zip Code'],
    },
    profiles: handles(profile?.['Twitter Handles']).map((username) => ({
      network: 'X',
      username,
      url: `https://x.com/${username}`,
    })),
  };
};

/**
 * A LinkedIn data export (Settings → Data privacy → Get a copy of your
 * data) as JSON Resume, column by column: no model, so the same export
 * always gives the same resume.
 */
export const fromLinkedIn = (files: ReadonlyMap<string, string>): RuleRead => {
  const read = (file: string, header: string) => {
    const text = files.get(file);
    return text ? csvRecords(text, header) : [];
  };
  const profile = read('Profile.csv', 'First Name')[0];
  const basics = basicsFrom(
    profile,
    read('Email Addresses.csv', 'Email Address'),
    read('PhoneNumbers.csv', 'Number')
  );
  const resume = {
    basics,
    work: read('Positions.csv', 'Company Name').map((r) => ({
      name: r['Company Name'],
      position: r['Title'],
      location: r['Location'],
      startDate: date(r['Started On']),
      endDate: date(r['Finished On']),
      ...described(r['Description']),
    })),
    volunteer: read('Volunteering.csv', 'Company Name').map((r) => ({
      organization: r['Company Name'],
      position: r['Role'],
      startDate: date(r['Started On']),
      endDate: date(r['Finished On']),
      ...described(r['Description']),
    })),
    education: read('Education.csv', 'School Name').map((r) => ({
      institution: r['School Name'],
      studyType: r['Degree Name'],
      startDate: date(r['Start Date']),
      endDate: date(r['End Date']),
    })),
    awards: read('Honors.csv', 'Title').map((r) => ({
      title: r['Title'],
      date: date(r['Issued On']),
      summary: r['Description'],
    })),
    certificates: read('Certifications.csv', 'Name').map((r) => ({
      name: r['Name'],
      issuer: r['Authority'],
      date: date(r['Started On']),
      url: r['Url'],
    })),
    publications: read('Publications.csv', 'Name').map((r) => ({
      name: r['Name'],
      publisher: r['Publisher'],
      releaseDate: date(r['Published On']),
      url: r['Url'],
      summary: r['Description'],
    })),
    skills: read('Skills.csv', 'Name').map((r) => ({ name: r['Name'] })),
    languages: read('Languages.csv', 'Name').map((r) => ({
      language: r['Name'],
      fluency: r['Proficiency'],
    })),
    projects: read('Projects.csv', 'Title').map((r) => ({
      name: r['Title'],
      description: r['Description'],
      url: r['Url'],
      startDate: date(r['Started On']),
      endDate: date(r['Finished On']),
    })),
  };
  // LinkedIn keeps one free-text place; which part is the city is a guess.
  const unsure: RuleRead['unsure'] = [
    { path: '/basics/location/city', confidence: 'medium' },
    { path: '/basics/location/region', confidence: 'medium' },
  ];
  return { resume, unsure };
};
