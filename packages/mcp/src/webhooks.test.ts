import { afterEach, describe, expect, it } from 'vitest';
import { connect, disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

describe('webhook tool', () => {
  it('sets and clears an app’s webhook, and only on your own apps', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    const made = (
      await call('create_oauth_app', {
        name: 'Acme ATS',
        homepage: null,
        redirect_uris: ['https://ats.example/cb'],
      })
    ).value;
    const set = await call('set_app_webhook', {
      client_id: made.app.client_id,
      url: 'https://ats.example/hook',
    });
    expect(set.value.webhook).toMatchObject({
      url: 'https://ats.example/hook',
    });
    expect(set.value.webhook.secret).toMatch(/^whsec_/);
    expect(
      (
        await call('set_app_webhook', {
          client_id: made.app.client_id,
          url: null,
        })
      ).value
    ).toEqual({ webhook: null });
    const refused = await call('set_app_webhook', {
      client_id: 'jrc_nope',
      url: 'https://ats.example/hook',
    });
    expect(refused.isError).toBe(true);
  });
});
