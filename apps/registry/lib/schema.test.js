import { describe, it, expect } from 'vitest';
import { Validator } from 'jsonschema';
import schema from './schema';
import publishedSchema from '../../../packages/schema/schema.json';

const validate = (resume) => new Validator().validate(resume, schema);

describe('registry resume schema', () => {
  it('accepts extension properties at the top level, like @jsonresume/schema', () => {
    const resume = {
      $schema: 'https://unpkg.com/@jsonresume/schema@1.3.1/schema.json',
      basics: { name: 'Jane Doe' },
      'x-speaking': ['Talks at local .NET conferences'],
    };

    expect(validate(resume).valid).toBe(true);
  });

  it('still rejects known sections with the wrong type', () => {
    const result = validate({ basics: 'Jane Doe' });

    expect(result.valid).toBe(false);
  });

  it('keeps the top-level rule in sync with the published schema', () => {
    expect(schema.additionalProperties).toBe(
      publishedSchema.additionalProperties
    );
  });

  it('accepts custom objects and rejects non-object custom, like the published schema (#316)', () => {
    const resume = {
      custom: { myTool: { v: 1 } },
      basics: { name: 'Jane', custom: { pronouns: 'she/her' } },
      work: [{ name: 'Co', custom: { teamSize: 12 } }],
    };
    expect(validate(resume).valid).toBe(true);
    expect(validate({ work: [{ custom: 'text' }] }).valid).toBe(false);
  });

  it('declares custom wherever the published schema does', () => {
    for (const section of Object.keys(publishedSchema.properties)) {
      const published = publishedSchema.properties[section];
      const local = schema.properties[section];
      const pub = published.items?.properties ?? published.properties;
      const loc = local?.items?.properties ?? local?.properties;
      if (pub?.custom) expect(loc?.custom, section).toBeDefined();
    }
    expect(schema.properties.custom).toBeDefined();
  });

  it('declares every field the published schema declares per section', () => {
    for (const section of Object.keys(publishedSchema.properties)) {
      const pub =
        publishedSchema.properties[section].items?.properties ??
        publishedSchema.properties[section].properties;
      const local =
        schema.properties[section]?.items?.properties ??
        schema.properties[section]?.properties;
      for (const field of Object.keys(pub ?? {})) {
        expect(local?.[field], `${section}.${field}`).toBeDefined();
      }
    }
  });

  it('accepts string or structured locations on work, volunteer and education (#323)', () => {
    const location = { city: 'Oslo', countryCode: 'NO' };
    for (const section of ['work', 'volunteer', 'education']) {
      expect(validate({ [section]: [{ location }] }).valid, section).toBe(true);
      expect(validate({ [section]: [{ location: 'Oslo, NO' }] }).valid).toBe(
        true
      );
      expect(validate({ [section]: [{ location: 42 }] }).valid).toBe(false);
    }
  });
});
