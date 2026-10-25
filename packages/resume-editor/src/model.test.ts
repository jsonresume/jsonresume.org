import schemaJson from '@jsonresume/schema/schema.json';
import resume from '@jsonresume/sample-data/complete-resume.json';
import { decodeJsonSchema } from '@repo/schema-explorer';
import { describe, expect, it } from 'vitest';
import { schemaDiagnostics } from './diagnostics';
import { formSections, humanize, itemTitle } from './model';
import { validate } from './validate';
import { getAt, setAt } from './values';

const schema = decodeJsonSchema(schemaJson);
const sections = formSections(schema);
const section = (key: string) => sections.find((s) => s.key === key);

describe('formSections', () => {
  it('has every section of the schema, in order, without meta', () => {
    expect(sections.map((s) => s.key)).toEqual([
      'basics',
      'objective',
      'work',
      'volunteer',
      'education',
      'awards',
      'certificates',
      'publications',
      'skills',
      'languages',
      'interests',
      'references',
      'projects',
    ]);
  });

  it('picks an editor for each field from its type and format', () => {
    const basics = section('basics')?.fields ?? [];
    const kind = (key: string) => basics.find((f) => f.key === key)?.kind;
    expect([
      kind('name'),
      kind('email'),
      kind('url'),
      kind('summary'),
      kind('location'),
      kind('profiles'),
    ]).toEqual(['text', 'email', 'url', 'longText', 'group', 'list']);
    const work = section('work')?.fields ?? [];
    const workKind = (key: string) => work.find((f) => f.key === key)?.kind;
    expect([
      workKind('startDate'),
      workKind('location'),
      workKind('highlights'),
      workKind('keywords'),
    ]).toEqual(['date', 'location', 'lines', 'tags']);
    expect(
      section('references')?.fields?.find((f) => f.key === 'availableOnRequest')
        ?.kind
    ).toBe('boolean');
  });

  it('labels fields for people and titles list items', () => {
    expect([
      humanize('studyType'),
      humanize('url'),
      humanize('credentialId'),
    ]).toEqual(['Study type', 'URL', 'Credential ID']);
    expect(itemTitle({ position: 'Engineer' }, 0)).toBe('Engineer');
    expect(itemTitle({}, 2)).toBe('Entry 3');
  });
});

describe('setAt', () => {
  it('sets deep values without touching the original, and drops cleared keys', () => {
    const before = { basics: { name: 'Ada', location: { city: 'London' } } };
    const after = setAt(before, ['basics', 'location', 'city'], '');
    expect(after).toEqual({ basics: { name: 'Ada' } });
    expect(before.basics.location.city).toBe('London');
    expect(
      getAt(setAt({}, ['work', 0, 'name'], 'Acme'), ['work', 0, 'name'])
    ).toBe('Acme');
  });
});

describe('validate', () => {
  it('passes the complete sample resume', () => {
    expect(validate(resume, schema)).toEqual([]);
  });

  it('finds wrong types, dates and emails, with where they are', () => {
    const issues = validate(
      {
        basics: { email: 'nope' },
        work: [{ startDate: '2020-13' }, { highlights: 'one' }],
        skills: {},
      },
      schema
    );
    expect(issues.map((i) => i.path.join('.'))).toEqual([
      'basics.email',
      'work.0.startDate',
      'work.1.highlights',
      'skills',
    ]);
    expect(issues[1]?.message).toContain('2024-06');
  });

  it('accepts a location as text or as an object', () => {
    expect(
      validate(
        { work: [{ location: 'Oslo' }, { location: { city: 'Oslo' } }] },
        schema
      )
    ).toEqual([]);
  });

  it('places problems on the JSON text', () => {
    const text = '{\n  "basics": { "email": "nope" }\n}';
    const [d] = schemaDiagnostics(text, schema);
    expect(text.slice(d?.from, d?.to)).toBe('"nope"');
    expect(schemaDiagnostics('{ broken', schema)).toEqual([]);
  });
});
