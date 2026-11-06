import { describe, expect, it } from 'vitest';
import { posthogProxy, type Fetch } from './proxy';

const recorder = () => {
  const calls: Array<{ url: string; init: Parameters<Fetch>[1] }> = [];
  const fetch: Fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response('ok', {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'content-encoding': 'gzip',
        'set-cookie': 'ph=1',
      },
    });
  };
  return { calls, fetch };
};

describe('posthogProxy', () => {
  it('sends events to PostHog without cookies, with the visitor address', async () => {
    const { calls, fetch } = recorder();
    const proxy = posthogProxy({ fetch });
    const response = await proxy(
      new Request('https://jsonresume.org/ingest/e/?ip=0', {
        method: 'POST',
        body: '{"event":"$pageview"}',
        headers: {
          'content-type': 'application/json',
          cookie: 'session=secret',
          authorization: 'Bearer jr_secret',
          'cf-connecting-ip': '203.0.113.9',
        },
      })
    );
    const [call] = calls;
    expect(call?.url).toBe('https://us.i.posthog.com/e/?ip=0');
    const headers = new Headers(call?.init.headers);
    expect(headers.get('cookie')).toBeNull();
    expect(headers.get('authorization')).toBeNull();
    expect(headers.get('x-forwarded-for')).toBe('203.0.113.9');
    expect(new TextDecoder().decode(call?.init.body as ArrayBuffer)).toBe(
      '{"event":"$pageview"}'
    );
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(response.headers.get('content-encoding')).toBeNull();
    expect(await response.text()).toBe('ok');
  });

  it('fetches the SDK files from the assets host', async () => {
    const { calls, fetch } = recorder();
    const proxy = posthogProxy({ fetch });
    await proxy(new Request('https://jsonresume.org/ingest/static/array.js'));
    await proxy(
      new Request('https://jsonresume.org/ingest/array/phc_x/config.js')
    );
    expect(calls.map((c) => c.url)).toEqual([
      'https://us-assets.i.posthog.com/static/array.js',
      'https://us-assets.i.posthog.com/array/phc_x/config.js',
    ]);
    expect(calls[0]?.init.body).toBeUndefined();
  });
});
