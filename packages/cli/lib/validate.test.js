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
  it('should throw a per-field error for an invalid resume object', async () => {
    await expect(
      validate({ resume: { basics: { name: 123 } }, schema: defaultSchema }),
    ).rejects.toMatchInlineSnapshot(`
      [Error: Invalid resume:
        data/basics/name must be string]
    `);
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
      [Error: Invalid resume:
        data must be number]
    `);
  });
});
