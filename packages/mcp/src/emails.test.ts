import { afterEach, describe, expect, it } from 'vitest';
import { connect, disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

describe('email tools', () => {
  it('reads and changes which emails the account gets', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    expect((await call('get_email_settings')).value).toEqual({
      accountEmails: true,
      weeklyJobs: false,
    });
    const set = await call('set_email_settings', { accountEmails: false });
    expect(set.value).toEqual({ accountEmails: false, weeklyJobs: false });
    const weekly = await call('set_email_settings', { weeklyJobs: true });
    expect(weekly.value).toEqual({ accountEmails: false, weeklyJobs: true });
  });
});
