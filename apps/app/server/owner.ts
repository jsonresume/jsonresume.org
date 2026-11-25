import { Accounts } from '@repo/accounts';
import { sessionCookie } from '@repo/api';
import { Effect, Option } from 'effect';

const cookieValue = (request: Request, name: string) => {
  for (const part of (request.headers.get('cookie') ?? '').split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return value.join('=');
  }
  return undefined;
};

/** Whether the request's session (looked up with `session`) is `username`. */
export const signedInAs = <E, R>(
  request: Request,
  username: string,
  session: (token: string) => Effect.Effect<{ username: string }, E, R>
) => {
  const token = cookieValue(request, sessionCookie.key);
  if (!token) return Effect.succeed(false);
  return session(token).pipe(
    Effect.map((user) => user.username === username.toLowerCase()),
    Effect.orElseSucceed(() => false)
  );
};

/**
 * Whether the request is signed in as `username`: the owner of a page that
 * isn't published yet (email unconfirmed), who may still see it and
 * download it from the dashboard. Asked only of those pages, so other
 * requests cost no session lookup.
 */
export const isOwner = (request: Request, username: string) =>
  // Without accounts (the handler's tests), nobody is signed in.
  Effect.flatMap(Effect.serviceOption(Accounts), (accounts) =>
    Option.isSome(accounts)
      ? signedInAs(request, username, accounts.value.session)
      : Effect.succeed(false)
  );
