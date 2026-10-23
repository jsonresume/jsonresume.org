import resume from '@jsonresume/sample-data/complete-resume.json';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { formatResume } from './formats';
import { toText } from './text';

describe('formatResume', () => {
  it('serves JSON as given, indented', () => {
    const { body, contentType } = formatResume('json', resume);
    expect(JSON.parse(body)).toEqual(resume);
    expect(contentType).toBe('application/json; charset=utf-8');
  });

  it('serves YAML that reads back to the same resume', () => {
    expect(parse(formatResume('yaml', resume).body)).toEqual(resume);
  });
});

describe('toText', () => {
  const output = toText(resume);

  it('starts with the name and has every section with entries', () => {
    expect(output.startsWith(`${resume.basics.name}\n`)).toBe(true);
    for (const title of [
      'SUMMARY',
      'WORK',
      'EDUCATION',
      'SKILLS',
      'LANGUAGES',
    ]) {
      expect(output).toContain(`${title}\n${'='.repeat(title.length)}`);
    }
  });

  it('writes structured locations and dates as text', () => {
    expect(output).not.toContain('[object Object]');
    const job = resume.work[0];
    expect(output).toContain(
      `${job?.startDate} – ${job?.endDate ?? 'present'}`
    );
  });

  it('copes with a sparse or odd resume', () => {
    expect(
      toText({
        basics: {
          name: 'Ada',
          location: { city: 'London', countryCode: 'GB' },
        },
        work: [{ name: 'Engines', endDate: '1843' }, 'junk'],
        skills: 'not a list',
      })
    ).toBe('Ada\nLondon, GB\n\nWORK\n====\n\nEngines\nuntil 1843\n');
    expect(toText({})).toBe('\n');
  });
});
