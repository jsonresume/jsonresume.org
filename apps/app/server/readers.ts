import { ApiKeys, RateLimiter } from '@repo/accounts';
import { Effect, Option } from 'effect';

/** Files programs read from /@username and its variants (pages are for people). */
const DATA = /^\/@[^/]+(?:\/[^/.]+)?\.(json|yaml|txt|rendercv|docx|pdf)$/;

/** Reads of those files an hour, from one address without an API key. */
export const ANONYMOUS_READS_PER_HOUR = 120;

const problem = (status: number, code: string, message: string) =>
  Response.json(
    { error: { code, message } },
    {
      status,
      headers: {
        'cache-control': 'no-store',
        'access-control-allow-origin': '*',
        ...(status === 429 ? { 'retry-after': '3600' } : {}),
      },
    }
  );

const HOW =
  'Make a free API key under Settings at https://jsonresume.org/dashboard/settings and send it as Authorization: Bearer jr_…';

/**
 * Who may read a resume's data files, and as whom. With an API key, any
 * number of reads, each counted under the key's name; without one, a limit
 * per address, so a bulk reader has to say who it is. Pages pass through.
 */
export const gateRead = (request: Request) =>
  Effect.gen(function* () {
    if (!DATA.test(new URL(request.url).pathname))
      return { _tag: 'Open' } as const;
    const auth = request.headers.get('authorization') ?? '';
    const key = /^Bearer (jr_\S+)$/.exec(auth)?.[1];
    if (key !== undefined) {
      const found = yield* (yield* ApiKeys).identify(key);
      if (!found)
        return {
          _tag: 'Refused',
          response: problem(
            401,
            'invalid_key',
            `That API key isn’t valid. ${HOW}`
          ),
        } as const;
      return { _tag: 'Keyed', reader: found.key.name } as const;
    }
    const address =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'local';
    const limited = yield* (yield* RateLimiter)
      .hit(`reads:${address}`, ANONYMOUS_READS_PER_HOUR, 3600)
      .pipe(Effect.option);
    return Option.isNone(limited)
      ? ({
          _tag: 'Refused',
          response: problem(
            429,
            'rate_limited',
            `More than ${ANONYMOUS_READS_PER_HOUR} resume files an hour from one address need an API key. ${HOW}`
          ),
        } as const)
      : ({ _tag: 'Open' } as const);
  });
