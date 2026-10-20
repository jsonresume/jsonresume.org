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
});
