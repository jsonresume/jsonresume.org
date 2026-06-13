const {
  formatErrors,
  formatOkSummary,
  toDotPath,
  previewValue,
} = require('./validate-errors');

// A representative slice of real Ajv (draft-07) error objects, as produced by
// `ajv.compile(schema)` against a resume with several distinct violations.
const sampleAjvErrors = [
  {
    instancePath: '/basics/name',
    schemaPath: '#/properties/basics/properties/name/type',
    keyword: 'type',
    params: { type: 'string' },
    message: 'must be string',
  },
  {
    instancePath: '/basics/email',
    schemaPath: '#/properties/basics/properties/email/format',
    keyword: 'format',
    params: { format: 'email' },
    message: 'must match format "email"',
  },
  {
    instancePath: '/work/2/startDate',
    schemaPath: '#/definitions/iso8601/pattern',
    keyword: 'pattern',
    params: { pattern: '^(...)$' },
    message: 'must match pattern "..."',
  },
];

const sampleResume = {
  basics: { name: 123, email: 'not-an-email' },
  work: [{}, {}, { startDate: '13-2020' }],
};

describe('toDotPath', () => {
  it('converts a JSON pointer to dot/bracket notation', () => {
    expect(toDotPath('/work/2/startDate')).toBe('work[2].startDate');
    expect(toDotPath('/basics/name')).toBe('basics.name');
  });
  it('labels the document root', () => {
    expect(toDotPath('')).toBe('(root)');
  });
});

describe('previewValue', () => {
  it('shows the value with its JS type', () => {
    expect(previewValue(123)).toBe('123 (number)');
    expect(previewValue('hi')).toBe('"hi" (string)');
    expect(previewValue([1, 2])).toBe('[1,2] (array)');
  });
  it('reports undefined for missing values', () => {
    expect(previewValue(undefined)).toBe('undefined');
  });
});

describe('formatErrors', () => {
  const output = formatErrors(sampleAjvErrors, sampleResume);

  it('counts the problems in the heading', () => {
    expect(output).toContain('Invalid resume: 3 problems found');
  });

  it('names the right JSON path for each error', () => {
    expect(output).toContain('at:    basics.name');
    expect(output).toContain('at:    basics.email');
    expect(output).toContain('at:    work[2].startDate');
  });

  it('reports the failing rule', () => {
    expect(output).toContain('rule:  type (expected string)');
    expect(output).toContain('rule:  format (expected email)');
    expect(output).toContain('rule:  pattern');
  });

  it('shows the offending value with its type', () => {
    expect(output).toContain('found: 123 (number)');
    expect(output).toContain('found: "not-an-email" (string)');
    expect(output).toContain('found: "13-2020" (string)');
  });

  it('gives a one-line human hint per error', () => {
    expect(output).toContain('"basics.name" must be of type string.');
    expect(output).toContain('must be a valid email address');
    expect(output).toContain('must be an ISO-8601 date');
  });

  it('preserves the classic data-path phrasing for greppability', () => {
    expect(output).toContain('data/basics/name must be string');
  });

  it('uses the singular "problem" for a single error', () => {
    const single = formatErrors([sampleAjvErrors[0]], sampleResume);
    expect(single).toContain('Invalid resume: 1 problem found');
  });

  it('handles required + additionalProperties without throwing', () => {
    const out = formatErrors(
      [
        {
          instancePath: '/work/0',
          schemaPath: '#/.../required',
          keyword: 'required',
          params: { missingProperty: 'name' },
          message: "must have required property 'name'",
        },
        {
          instancePath: '/basics',
          schemaPath: '#/.../additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: 'nme' },
          message: 'must NOT have additional properties',
        },
      ],
      { work: [{}], basics: { nme: 'x' } },
    );
    expect(out).toContain('rule:  required (name)');
    expect(out).toContain('add the missing "name" property');
    expect(out).toContain('rule:  additionalProperties (nme)');
    expect(out).toContain('remove the unknown property "nme"');
  });
});

describe('formatOkSummary', () => {
  it('summarises populated array sections and the candidate name', () => {
    const summary = formatOkSummary(
      {
        basics: { name: 'Thomas' },
        work: [{}, {}],
        education: [{}],
        skills: [{}, {}, {}],
      },
      'resume.json',
    );
    expect(summary).toContain('✓ resume.json is valid');
    expect(summary).toContain('Thomas');
    expect(summary).toContain('2 work');
    expect(summary).toContain('1 education');
    expect(summary).toContain('3 skills');
  });

  it('omits the detail block when there is nothing to count', () => {
    expect(formatOkSummary({ basics: {} }, 'resume.json')).toBe(
      '✓ resume.json is valid',
    );
  });

  it('handles a non-object resume (custom schema override)', () => {
    expect(formatOkSummary(123, 'only-number.json')).toBe(
      '✓ only-number.json is valid',
    );
  });
});
