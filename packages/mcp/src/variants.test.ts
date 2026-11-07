import { afterEach, describe, expect, it } from 'vitest';
import { connect, disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

describe('variant tools', () => {
  it('copies the resume for a job, tailors it, and leaves the resume be', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    const made = (await call('create_variant', { name: 'Acme', job_id: 9 }))
      .value;
    expect(made).toMatchObject({
      slug: 'acme',
      job_id: 9,
      url: 'https://jsonresume.org/@ada/acme',
      resume: { basics: { name: 'Ada', label: 'Engineer' } },
    });
    await call('save_variant', {
      slug: 'acme',
      resume: { basics: { name: 'Ada', label: 'Platform Engineer' } },
    });
    expect((await call('get_variant', { slug: 'acme' })).value.resume).toEqual({
      basics: { name: 'Ada', label: 'Platform Engineer' },
    });
    expect((await call('get_resume')).value.resume).toMatchObject({
      basics: { label: 'Engineer' },
    });
    expect((await call('list_variants')).value.variants).toHaveLength(1);
    expect((await call('delete_variant', { slug: 'acme' })).value).toEqual({
      deleted: true,
    });
    expect((await call('get_variant', { slug: 'acme' })).isError).toBe(true);
  });
});
