import { afterEach, describe, expect, it } from 'vitest';
import { connect, disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

describe('apps directory tools', () => {
  it('lists an app of yours, then shows it in the directory', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    const made = (
      await call('create_oauth_app', {
        name: 'Acme ATS',
        homepage: 'https://ats.example',
        redirect_uris: ['https://ats.example/cb'],
      })
    ).value;
    expect((await call('list_app_directory')).value.apps).toEqual([]);
    const set = await call('set_app_listing', {
      client_id: made.app.client_id,
      listed: true,
      description: 'Tailors your resume to each job',
    });
    expect(set.value).toEqual({ listed: true });
    expect((await call('list_app_directory')).value.apps).toMatchObject([
      { name: 'Acme ATS', homepage: 'https://ats.example' },
    ]);
    const refused = await call('set_app_listing', {
      client_id: 'jrc_nope',
      listed: true,
      description: 'x',
    });
    expect(refused.isError).toBe(true);
  });
});
