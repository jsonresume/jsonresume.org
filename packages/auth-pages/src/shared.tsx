import { Button, Callout, GithubIcon } from '@jsonresume/ui';
import { usernameCheckAtom, useIsClient } from '@repo/api-client';
import { useAtomValue } from '@effect/atom-react';
import { account } from '@repo/content/pages';
import { AsyncResult } from 'effect/reactivity';
import { useEffect, useState } from 'react';
import * as s from './auth.css';

const USERNAME = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/;
export const isUsername = (name: string) => USERNAME.test(name);

/** Only paths on this site: ?next= must not send people elsewhere. */
export const safeNext = (next: string | undefined, fallback: string) =>
  next &&
  next.startsWith('/') &&
  !next.startsWith('//') &&
  !next.startsWith('/\\')
    ? next
    : fallback;

export function GithubButton({
  label,
  next,
  intent = 'signin',
}: {
  label: string;
  next?: string;
  intent?: 'signin' | 'link';
}) {
  const query = new URLSearchParams({ intent, ...(next ? { next } : {}) });
  return (
    <Button asChild variant="ink" fullWidth>
      <a href={`/api/auth/github?${query}`}>
        <GithubIcon className={s.icon} />
        {label}
      </a>
    </Button>
  );
}

export function ErrorNote({ message }: { message: string | undefined }) {
  return message ? (
    <Callout tone="danger" role="alert">
      {message}
    </Callout>
  ) : null;
}

/** The message for an error tag, from the account copy. */
export const errorMessage = (tag: string | undefined) =>
  tag === undefined
    ? undefined
    : account.errors[tag] ?? account.errors['default'];

const refusals: Record<string, string> = {
  invalid: account.username.invalid,
  reserved: account.username.reserved,
  taken: account.username.taken,
  github: account.username.github,
};

/** The message for a refused username, or for any other error tag. */
export const refusalMessage = (
  reason: string | undefined,
  tag: string | undefined
) => (reason && refusals[reason]) || errorMessage(tag);

/** A value that settles `ms` after it stops changing (for live checks). */
export function useSettled<T>(value: T, ms = 350): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return settled;
}

function Check({ name }: { name: string }) {
  const result = useAtomValue(usernameCheckAtom(name));
  const copy = account.username;
  if (AsyncResult.isInitial(result) || AsyncResult.isWaiting(result)) {
    return <span className={s.muted}>{copy.checking}</span>;
  }
  if (AsyncResult.isFailure(result))
    return (
      <span className={s.muted}>{account.errors['GithubUnreachable']}</span>
    );
  const check = result.value;
  if (check.available)
    return <span className={s.good}>{copy.available(name)}</span>;
  return <span className={s.bad}>{refusals[check.reason ?? 'taken']}</span>;
}

/**
 * Whether a username can be had, as the person types: format first, then
 * the server (taken, reserved, or a GitHub user's), once typing settles.
 */
export function UsernameStatus({ name }: { name: string }) {
  const settled = useSettled(name);
  const isClient = useIsClient();
  if (name === '') return null;
  if (!isUsername(name))
    return <span className={s.bad}>{account.username.invalid}</span>;
  if (!isClient || settled !== name)
    return <span className={s.muted}>{account.username.checking}</span>;
  return <Check name={settled} />;
}
