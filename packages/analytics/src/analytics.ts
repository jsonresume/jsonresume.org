import { Clock, Config, Context, Effect, Layer } from 'effect';
import { AnalyticsStore } from './store';
import { browser, device, isBot, referrerHost, visitorId } from './visitor';

/** What the request says about the reader; nothing here is stored as is. */
export interface Client {
  userAgent: string;
  address: string;
  /** Cloudflare's two-letter country code, or null. */
  country: string | null;
}

/**
 * The reader, from request headers. The server only accepts traffic from
 * Cloudflare, so CF-Connecting-IP and CF-IPCountry can be trusted.
 */
export const clientFrom = (
  header: (name: string) => string | null | undefined
): Client => ({
  userAgent: header('user-agent') ?? '',
  address:
    header('cf-connecting-ip') ??
    header('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown',
  country: header('cf-ipcountry')?.toUpperCase() ?? null,
});

export interface ViewInput {
  id: string;
  username: string;
  kind: 'page' | 'json' | 'yaml' | 'txt';
  theme: string | null;
  referrer: string | null;
  width?: number;
}

/**
 * Records resume views. Bots are skipped; the reader becomes a daily hash
 * under AUTH_SECRET; the referrer becomes a host, unless it is this site.
 */
export class Analytics extends Context.Service<
  Analytics,
  {
    view(input: ViewInput, client: Client): Effect.Effect<void>;
    ping(id: string, seconds: number, depth: number): Effect.Effect<void>;
  }
>()('@repo/analytics/Analytics') {
  static readonly layer = Layer.effect(
    Analytics,
    Effect.gen(function* () {
      const store = yield* AnalyticsStore;
      const secret = yield* Config.Redacted('AUTH_SECRET');
      const site = new URL(
        yield* Config.String('SITE_URL').pipe(
          Config.withDefault('http://localhost:5173')
        )
      ).hostname;

      const view = Effect.fn('Analytics.view')(function* (
        input: ViewInput,
        client: Client
      ) {
        if (isBot(client.userAgent)) return;
        const day = new Date(yield* Clock.currentTimeMillis)
          .toISOString()
          .slice(0, 10);
        yield* store.recordView({
          id: input.id,
          username: input.username,
          kind: input.kind,
          theme: input.theme,
          referrer: referrerHost(input.referrer, site),
          country:
            client.country &&
            /^[A-Z]{2}$/.test(client.country) &&
            client.country !== 'XX'
              ? client.country
              : null,
          device: device(client.userAgent, input.width),
          browser: browser(client.userAgent),
          visitor: visitorId(secret, {
            day,
            address: client.address,
            userAgent: client.userAgent,
            username: input.username,
          }),
        });
      });

      return Analytics.of({ view, ping: store.recordPing });
    })
  );
}
