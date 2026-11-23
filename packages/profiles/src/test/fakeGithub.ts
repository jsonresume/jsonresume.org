import { Effect, Layer, Option, Redacted } from 'effect';
import { HttpClient, HttpClientResponse } from 'effect/http';
import { GithubGists } from '../github';

interface FakeGist {
  id: string;
  files: Record<string, string>;
  /** When it was last updated, in ms (default 0), for `?since=`. */
  updated?: number;
  /** Secret: left out of listings, but readable by id, as on GitHub. */
  secret?: boolean;
}

/** GitHub in memory: users with gists, and a switch to make it fail. */
export function fakeGithub() {
  const state = {
    users: new Map<string, { id: number; gists: FakeGist[] }>(),
    /** When set, every API call answers with this status. */
    status: undefined as number | undefined,
    /** Tokens GitHub rejects with 401. */
    revoked: new Set<string>(),
    /** Auth schemes (Bearer, Basic, none) out of requests: 403, none left. */
    limited: new Set<string>(),
    /** Sent as x-ratelimit-remaining on every other API answer. */
    remaining: undefined as number | undefined,
    requests: [] as Array<{
      path: string;
      search: string;
      auth: string | undefined;
    }>,
  };

  const json = (body: unknown, status = 200, quota = state.remaining) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        'content-type': 'application/json',
        ...(quota === undefined
          ? {}
          : { 'x-ratelimit-remaining': String(quota) }),
      },
    });

  const gistBody = (
    login: string,
    ownerId: number,
    gist: FakeGist,
    inline: boolean
  ) => ({
    id: gist.id,
    public: gist.secret !== true,
    owner: { id: ownerId, login },
    files: Object.fromEntries(
      Object.entries(gist.files).map(([name, text]) => [
        name,
        {
          raw_url: `https://gist.githubusercontent.com/raw/${gist.id}/${name}`,
          ...(inline ? { content: text } : {}),
        },
      ])
    ),
  });

  const answer = (url: URL, auth: string | undefined): Response => {
    if (url.hostname === 'gist.githubusercontent.com') {
      const [, , id, name] = url.pathname.split('/');
      for (const user of state.users.values())
        for (const gist of user.gists)
          if (gist.id === id && name)
            return new Response(gist.files[name] ?? '');
      return new Response('', { status: 404 });
    }
    if (state.status !== undefined) return json({}, state.status);
    if (auth && state.revoked.has(auth.replace('Bearer ', '')))
      return json({}, 401);
    if (state.limited.has(auth?.split(' ')[0] ?? 'none'))
      return json({ message: 'API rate limit exceeded' }, 403, 0);
    const list = /^\/users\/([^/]+)\/gists$/.exec(url.pathname);
    if (list?.[1]) {
      const user = state.users.get(list[1]);
      if (!user) return json({}, 404);
      const page = Number(url.searchParams.get('page') ?? 1);
      const size = Number(url.searchParams.get('per_page') ?? 30);
      const since = url.searchParams.get('since');
      const after = since ? Date.parse(since) : -Infinity;
      return json(
        user.gists
          .filter((g) => g.secret !== true && (g.updated ?? 0) > after)
          .slice((page - 1) * size, page * size)
          .map((g) => gistBody(list[1] ?? '', user.id, g, false))
      );
    }
    const one = /^\/gists\/([^/]+)$/.exec(url.pathname);
    for (const [login, user] of state.users)
      for (const gist of user.gists)
        if (gist.id === one?.[1])
          return json(gistBody(login, user.id, gist, true));
    return json({}, 404);
  };

  const client = HttpClient.make((request, url) =>
    Effect.sync(() => {
      const auth = request.headers['authorization'];
      if (url.hostname === 'api.github.com')
        state.requests.push({ path: url.pathname, search: url.search, auth });
      return HttpClientResponse.fromWeb(request, answer(url, auth));
    })
  );

  const layer = (token?: string) =>
    Layer.effect(
      GithubGists,
      GithubGists.make({
        token: token ? Option.some(Redacted.make(token)) : Option.none(),
        app: Option.some({ id: 'app-id', secret: Redacted.make('app-secret') }),
      })
    ).pipe(Layer.provide(Layer.succeed(HttpClient.HttpClient, client)));

  return { state, layer };
}
