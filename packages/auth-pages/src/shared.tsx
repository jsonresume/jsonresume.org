import {
  Button,
  Callout,
  GithubIcon,
  Stack,
  Text,
  useSettledValue,
} from '@jsonresume/ui';
import { usernameCheckAtom, useIsClient } from '@repo/api-client';
import { useAtomValue } from '@effect/atom-react';
import { account } from '@repo/content/pages';
import { AsyncResult } from 'effect/reactivity';
import type { FormHTMLAttributes } from 'react';

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
        <GithubIcon />
        {label}
      </a>
    </Button>
  );
}

/** A form with its fields stacked. */
export const Form = (props: FormHTMLAttributes<HTMLFormElement>) => (
  <Stack asChild gap={4}>
    <form {...props} />
  </Stack>
);

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

const Status = ({
  tone,
  children,
}: {
  tone: 'muted' | 'success' | 'danger';
  children: string;
}) => (
  <Text as="span" size="xs" tone={tone}>
    {children}
  </Text>
);

function Check({ name }: { name: string }) {
  const result = useAtomValue(usernameCheckAtom(name));
  const copy = account.username;
  if (AsyncResult.isInitial(result) || AsyncResult.isWaiting(result)) {
    return <Status tone="muted">{copy.checking}</Status>;
  }
  if (AsyncResult.isFailure(result))
    return <Status tone="muted">{account.errors['GithubUnreachable']}</Status>;
  const check = result.value;
  if (check.available)
    return <Status tone="success">{copy.available(name)}</Status>;
  return <Status tone="danger">{refusals[check.reason ?? 'taken']}</Status>;
}

/**
 * Whether a username can be had, as the person types: format first, then
 * the server (taken, reserved, or a GitHub user's), once typing settles.
 */
export function UsernameStatus({ name }: { name: string }) {
  const settled = useSettledValue(name, 350);
  const isClient = useIsClient();
  if (name === '') return null;
  if (!isUsername(name))
    return <Status tone="danger">{account.username.invalid}</Status>;
  if (!isClient || settled !== name)
    return <Status tone="muted">{account.username.checking}</Status>;
  return <Check name={settled} />;
}
