import validate from './validate';
import getSchema from './get-schema';

describe('validate', () => {
  let defaultSchema;
  beforeEach(async () => {
    defaultSchema = await getSchema();
  });
  it('should not throw an error for a valid resume object', async () => {
    await validate({ resume: { basics: {} }, schema: defaultSchema });
  });
  it('should throw a precise, path-pointed error for an invalid resume object', async () => {
    await expect(
      validate({ resume: { basics: { name: 123 } }, schema: defaultSchema }),
    ).rejects.toMatchInlineSnapshot(`
      [Error: Invalid resume: 1 problem found

        ✖ data/basics/name must be string
          at:    basics.name
          rule:  type (expected string)
          found: 123 (number)
          hint:  "basics.name" must be of type string.]
    `);
  });
  it('should report every distinct violation with its own JSON path', async () => {
    let thrown;
    try {
      await validate({
        resume: {
          basics: { name: 123, email: 'not-an-email' },
          work: [{ name: 'Acme', startDate: '13-2020' }],
        },
        schema: defaultSchema,
      });
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeDefined();
    expect(thrown.message).toContain('Invalid resume: 3 problems found');
    // Each error names the right JSON path in dot/bracket notation.
    expect(thrown.message).toContain('at:    basics.name');
    expect(thrown.message).toContain('at:    basics.email');
    expect(thrown.message).toContain('at:    work[0].startDate');
    // ...the failing rule...
    expect(thrown.message).toContain('rule:  type (expected string)');
    expect(thrown.message).toContain('rule:  format (expected email)');
    // ...the offending value...
    expect(thrown.message).toContain('found: 123 (number)');
    expect(thrown.message).toContain('found: "not-an-email" (string)');
    // ...and a human hint.
    expect(thrown.message).toContain('must be a valid email address');
    expect(thrown.message).toContain('must be an ISO-8601 date');
    // The classic `data/...` phrasing is preserved for greppability.
    expect(thrown.message).toContain('data/basics/name must be string');
    // Raw Ajv errors are exposed for machine-readable callers.
    expect(Array.isArray(thrown.validationErrors)).toBe(true);
    expect(thrown.validationErrors).toHaveLength(3);
  });
  it('should accept a schema override', async () => {
    await validate({
      resume: 123,
      schema: { type: 'number' },
    });
    await expect(
      validate({
        resume: 'thomas',
        schema: { type: 'number' },
      }),
    ).rejects.toMatchInlineSnapshot(`
      [Error: Invalid resume: 1 problem found

        ✖ data must be number
          at:    (root)
          rule:  type (expected number)
          found: "thomas" (string)
          hint:  the resume must be of type number.]
    `);
  });
});
