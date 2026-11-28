import { afterEach, describe, expect, it } from 'vitest';
import { connect, disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

describe('privacy tools', () => {
  it('reads and sets the contact details kept off the page', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    expect((await call('get_hidden_fields')).value).toEqual({
      hidden: [],
      pagePrivate: false,
    });
    const set = await call('set_hidden_fields', { hidden: ['email'] });
    expect(set.value).toEqual({ hidden: ['email'], pagePrivate: false });
    expect((await call('get_hidden_fields')).value).toEqual({
      hidden: ['email'],
      pagePrivate: false,
    });
    expect((await call('set_hidden_fields', { hidden: [] })).value).toEqual({
      hidden: [],
      pagePrivate: false,
    });
  });

  it('makes the whole page private, and public again', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    expect((await call('set_page_private', { private: true })).value).toEqual({
      hidden: [],
      pagePrivate: true,
    });
    expect((await call('get_hidden_fields')).value).toMatchObject({
      pagePrivate: true,
    });
    expect(
      (await call('set_page_private', { private: false })).value
    ).toMatchObject({ pagePrivate: false });
  });
});
