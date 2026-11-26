import { describe, expect, it } from 'vitest';
import { lastModifiedOf, toEntry } from './listing';
import { popularSkills, search } from './search';

const person = (username: string, keywords: string[]) =>
  toEntry({
    username,
    resume: { basics: { name: username }, skills: [{ name: 'All', keywords }] },
    updatedAt: null,
  });

describe('popularSkills', () => {
  it('shows each skill as most people write it, without compounds', () => {
    const all = [
      person('a', ['python', 'Go']),
      person('b', ['Python', 'JavaScript / TypeScript']),
      person('c', ['Python', 'JavaScript / TypeScript']),
    ].flatMap((e) => e ?? []);
    expect(popularSkills(all)).toEqual(['Python', 'Go']);
  });
});

describe('lastModifiedOf', () => {
  const now = Date.parse('2026-10-26T00:00:00Z');
  it('trusts a real date and nothing else', () => {
    expect(lastModifiedOf('2025-03-04', now)?.toISOString()).toBe(
      '2025-03-04T00:00:00.000Z'
    );
    expect(lastModifiedOf('2017-12-24T15:53:00', now)).toBeNull();
    expect(lastModifiedOf('2030-01-01', now)).toBeNull();
    expect(lastModifiedOf('soon', now)).toBeNull();
    expect(lastModifiedOf(undefined, now)).toBeNull();
  });
});

describe('matching words', () => {
  const all = [
    person('ada', ['Java', 'Spring', 'AWS']),
    person('bo', ['JavaScript', 'React']),
    person('cy', ['C', 'C++', 'Embedded']),
    person('di', ['Golang', 'Kubernetes']),
    person('ed', ['Laws of motion', 'Google Docs', 'CSS']),
    person('gil', ['ReactJS', 'Python3']),
    person('fay', [
      'Excel',
      'Word',
      'Outlook',
      'Teams',
      'Jira',
      'Slack',
      'Zoom',
      'Figma',
      'Docker',
      'AWS',
    ]),
  ].flatMap((e) => e ?? []);
  const who = (q: string) =>
    search(all, [], q, 1).people.map((p) => p.username);

  it('matches whole words, not letters inside them', () => {
    expect(who('aws').sort()).toEqual(['ada', 'fay']);
    expect(who('c')).toEqual(['cy']);
    expect(who('go')).toEqual(['di']); // golang, not Google
  });

  it('finds other spellings of a skill, not other words', () => {
    expect(who('java')).toEqual(['ada']);
    expect(who('golang')).toEqual(['di']);
    expect(who('kube')).toEqual([]);
    expect(who('react')).toEqual(['bo', 'gil']);
  });

  it('keeps the symbols skills are spelled with', () => {
    expect(who('c++')).toEqual(['cy']);
  });

  it('shows the skills a search matched first', () => {
    const fay = search(all, [], 'aws', 1).people.find(
      (p) => p.username === 'fay'
    );
    expect(fay?.skills[0]).toBe('AWS');
    expect(fay?.skills).toHaveLength(8);
  });
});

describe('ranking', () => {
  const titled = (username: string, label: string, keywords: string[]) =>
    toEntry({
      username,
      resume: {
        basics: { name: username, label },
        skills: [{ name: 'All', keywords }],
      },
      updatedAt: null,
    });
  it('puts the headline and the first-listed skills before a passing mention', () => {
    const all = [
      titled('radio', 'Wireless Engineer', [
        'RF',
        'Matlab',
        'Linux',
        'C',
        'Python',
      ]),
      titled('lead', 'Data Engineer', ['Python', 'SQL', 'Spark']),
      titled('dev', 'Python Developer', [
        'Django',
        'Postgres',
        'Docker',
        'Python',
      ]),
    ].flatMap((e) => e ?? []);
    expect(search(all, [], 'python', 1).people.map((p) => p.username)).toEqual([
      'dev',
      'lead',
      'radio',
    ]);
  });
});
