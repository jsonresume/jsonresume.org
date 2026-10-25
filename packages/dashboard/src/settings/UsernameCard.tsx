import { useAtomSet } from '@effect/atom-react';
import {
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Stack,
} from '@jsonresume/ui';
import type { Account } from '@repo/api';
import { errorTag, keys, renameAtom, usernameReason } from '@repo/api-client';
import { isUsername, UsernameStatus } from '@repo/auth-pages';
import { account as copy } from '@repo/content/pages';
import { useState, type FormEvent } from 'react';

const refusal = (reason: string | undefined, tag: string | undefined) => {
  const named: Record<string, string> = {
    invalid: copy.username.invalid,
    reserved: copy.username.reserved,
    taken: copy.username.taken,
    github: copy.username.github,
  };
  return (
    (reason && named[reason]) ||
    copy.errors[tag ?? 'default'] ||
    copy.errors['default']
  );
};

/** Change the username; the old one redirects for 90 days. */
export function UsernameCard({ account }: { account: Account }) {
  const rename = useAtomSet(renameAtom, { mode: 'promiseExit' });
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    tone: 'success' | 'danger';
    text: string;
  }>();
  const changed = name !== '' && name !== account.username;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const exit = await rename({
      payload: { username: name },
      reactivityKeys: [...keys.account, ...keys.session],
    });
    setBusy(false);
    const tag = errorTag(exit);
    if (tag === undefined) {
      setMessage({ tone: 'success', text: copy.settings.renamed(name) });
      setName('');
    } else
      setMessage({
        tone: 'danger',
        text: refusal(usernameReason(exit), tag) ?? '',
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>{copy.settings.usernameTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack asChild gap={4} align="start">
          <form onSubmit={submit}>
            {message ? (
              <Callout tone={message.tone}>{message.text}</Callout>
            ) : null}
            <Field
              label={`New username (now @${account.username})`}
              hint={
                <>
                  {copy.settings.usernameHint}{' '}
                  {changed ? <UsernameStatus name={name} /> : null}
                </>
              }
            >
              <Input
                name="username"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={39}
                value={name}
                onChange={(e) => setName(e.target.value.trim().toLowerCase())}
              />
            </Field>
            <Button
              type="submit"
              variant="secondary"
              disabled={busy || !changed || !isUsername(name)}
            >
              {copy.settings.rename}
            </Button>
          </form>
        </Stack>
      </CardContent>
    </Card>
  );
}
