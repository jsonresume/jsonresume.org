import { afterEach, describe, expect, it } from 'vitest';
import { connect, disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

describe('privacy tools', () => {
  it('reads and sets the contact details kept off the page', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    expect((await call('get_hidden_fields')).value).toEqual({ hidden: [] });
    const set = await call('set_hidden_fields', { hidden: ['email'] });
    expect(set.value).toEqual({ hidden: ['email'] });
    expect((await call('get_hidden_fields')).value).toEqual({
      hidden: ['email'],
    });
    expect((await call('set_hidden_fields', { hidden: [] })).value).toEqual({
      hidden: [],
    });
  });
});
