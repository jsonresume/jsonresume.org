import schemaJson from '@jsonresume/schema/schema.json';
import jobSchemaJson from '@jsonresume/schema/job-schema.json';
import sample from '@jsonresume/schema/sample.resume.json';
import { describe, expect, it } from 'vitest';
import { exampleFor, schemaSections } from './flatten';
import { decodeJsonSchema } from './model';

const resume = decodeJsonSchema(schemaJson);
const sections = schemaSections(resume);
const byKey = (key: string) => sections.find((s) => s.key === key);

describe('schemaSections on the resume schema', () => {
  it('lists every top-level section except $schema', () => {
    expect(sections.map((s) => s.key)).toEqual(
      Object.keys(schemaJson.properties).filter((k) => k !== '$schema')
    );
  });

  it('labels types for people', () => {
    expect(byKey('basics')?.type).toBe('object');
    expect(byKey('work')?.type).toBe('list of objects');
    expect(byKey('objective')?.type).toBe('text');
    const work = byKey('work')?.fields ?? [];
    expect(work.find((f) => f.path === 'startDate')?.type).toBe('date');
    expect(work.find((f) => f.path === 'url')?.type).toBe('URL');
    expect(work.find((f) => f.path === 'highlights')?.type).toBe(
      'list of text'
    );
    expect(work.find((f) => f.path === 'location')?.type).toBe(
      'text or location'
    );
  });

  it('flattens nested objects and lists of objects with paths', () => {
    const basics = byKey('basics')?.fields ?? [];
    expect(basics.find((f) => f.path === 'email')?.type).toBe('email');
    expect(basics.find((f) => f.path === 'location.city')?.depth).toBe(1);
    expect(basics.find((f) => f.path === 'profiles[].url')?.type).toBe('URL');
    const skills = byKey('skills')?.fields ?? [];
    expect(skills.map((f) => f.path)).toContain('keywords');
  });

  it('reads the job schema too', () => {
    const job = schemaSections(decodeJsonSchema(jobSchemaJson));
    expect(job.map((s) => s.key)).toContain('responsibilities');
  });
});

describe('exampleFor', () => {
  it('shows a section from the sample, first entry only for lists', () => {
    const work = JSON.parse(exampleFor(sample, 'work') ?? '{}');
    expect(work.work).toHaveLength(1);
    expect(JSON.parse(exampleFor(sample, 'basics') ?? '{}').basics.name).toBe(
      sample.basics.name
    );
    expect(exampleFor(sample, 'nope')).toBeUndefined();
  });
});
