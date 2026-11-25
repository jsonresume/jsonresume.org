import { ProfileStore, reservedUsernames } from '@repo/profiles';
import { Effect, Option } from 'effect';

/** A GitHub-style login as the whole path: /kbsali. */
const BARE = /^\/([A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38})$/;

/**
 * /name, linked without the @ (people's sites, old READMEs): the profile's
 * page when we know a profile by that name, else the 404.
 * Runs only after every page and file has missed, so it costs nothing on
 * the site's own paths.
 */
export const bareName = (request: Request) =>
  Effect.gen(function* () {
    if (request.method !== 'GET' && request.method !== 'HEAD') return;
    const url = new URL(request.url);
    const name = BARE.exec(url.pathname)?.[1]?.toLowerCase();
    if (!name || reservedUsernames.has(name)) return;
    // A ghost, an account or a renamed account's old name: /@name answers.
    const store = yield* Effect.serviceOption(ProfileStore);
    if (Option.isNone(store) || !(yield* store.value.find(name))) return;
    return new Response(null, {
      status: 301,
      headers: { location: `/@${name}${url.search}` },
    });
  });
