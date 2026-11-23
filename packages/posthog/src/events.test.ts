import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { ProductEvents, track } from './events';
import { browserOptions, countryOf } from './browser';

describe('track', () => {
  it('does nothing where ProductEvents is not provided', async () => {
    await expect(
      Effect.runPromise(track('u1', 'user_signed_in'))
    ).resolves.toBeUndefined();
  });

  it('reports the event under the account id', async () => {
    const seen: unknown[] = [];
    const layer = Layer.succeed(
      ProductEvents,
      ProductEvents.of({
        capture: (id, event, properties) =>
          Effect.sync(() => seen.push({ id, event, properties })),
      })
    );
    await Effect.runPromise(
      track('u1', 'user_signed_up', { method: 'github' }).pipe(
        Effect.provide(layer)
      )
    );
    expect(seen).toEqual([
      { id: 'u1', event: 'user_signed_up', properties: { method: 'github' } },
    ]);
  });
});

describe('browserOptions', () => {
  it('stores nothing on the device and goes through our domain', () => {
    const options = browserOptions('https://us.posthog.com');
    expect(options.cookieless_mode).toBe('always');
    expect(options.api_host).toBe('/ingest');
    expect(options.disable_session_recording).toBe(true);
  });

  it('adds the country to every event when it is known', () => {
    const send = browserOptions('https://us.posthog.com', 'CA').before_send;
    expect(typeof send).toBe('function');
    const sent =
      typeof send === 'function'
        ? send({ uuid: 'u', event: '$pageview', properties: { a: 1 } })
        : null;
    expect(sent?.properties).toEqual({
      a: 1,
      country: 'CA',
      $geoip_country_code: 'CA',
    });
    expect(countryOf('h=jsonresume.org\nloc=CA\ntls=TLSv1.3')).toBe('CA');
    expect(countryOf('')).toBeUndefined();
    const plain = browserOptions('https://us.posthog.com').before_send;
    const event = { uuid: 'u', event: '$pageview', properties: { a: 1 } };
    expect(typeof plain === 'function' ? plain(event) : null).toEqual(event);
  });

  it('drops exceptions nobody can act on, and keeps the rest', () => {
    const send = browserOptions('https://us.posthog.com', 'CA').before_send;
    const exception = (...list: Array<{ type: string; value: string }>) => ({
      uuid: 'u',
      event: '$exception',
      properties: { $exception_list: list },
    });
    const sent = (event: ReturnType<typeof exception>) =>
      typeof send === 'function' ? send(event) : undefined;
    const aborted = {
      type: 'DOMException',
      value: 'AbortError: signal is aborted without reason',
    };
    const real = { type: 'TypeError', value: 'x is undefined' };
    expect(sent(exception(aborted))).toBeNull();
    expect(
      sent(exception({ type: 'Error', value: 'Script error.' }))
    ).toBeNull();
    expect(
      sent(
        exception({
          type: 'UnhandledRejection',
          value: 'Object Not Found Matching Id:1, MethodName:update',
        })
      )
    ).toBeNull();
    expect(sent(exception(real))?.properties?.country).toBe('CA');
    expect(sent(exception(aborted, real))).not.toBeNull();
  });
});
