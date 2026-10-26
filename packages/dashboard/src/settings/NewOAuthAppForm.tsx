import { useAtomSet } from '@effect/atom-react';
import { Button, Callout, Field, Input, Stack, Textarea } from '@jsonresume/ui';
import { createOAuthAppAtom, keys } from '@repo/api-client';
import { Cause, Exit, Option } from 'effect';
import { useState, type FormEvent } from 'react';

/** A new app's credentials, shown once. */
export interface MadeApp {
  name: string;
  clientId: string;
  clientSecret: string;
}

/** The server's reason, when it gave one (a bad redirect URI, too many apps). */
const reason = (exit: Exit.Exit<unknown, unknown>) => {
  if (!Exit.isFailure(exit)) return undefined;
  const error = Option.getOrUndefined(Cause.findErrorOption(exit.cause));
  return typeof error === 'object' && error && 'error_description' in error
    ? String(error.error_description)
    : undefined;
};

/** Registering an app: its name, homepage and where users come back to. */
export function NewOAuthAppForm({
  onMade,
}: {
  onMade: (app: MadeApp) => void;
}) {
  const create = useAtomSet(createOAuthAppAtom, { mode: 'promiseExit' });
  const [name, setName] = useState('');
  const [homepage, setHomepage] = useState('');
  const [uris, setUris] = useState('');
  const [error, setError] = useState<string>();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const exit = await create({
      payload: {
        name,
        ...(homepage.trim() && { homepage: homepage.trim() }),
        redirectUris: uris.split(/\s+/).filter(Boolean),
      },
      reactivityKeys: keys.oauthApps,
    });
    if (Exit.isSuccess(exit)) {
      onMade({
        name: exit.value.app.name,
        clientId: exit.value.app.id,
        clientSecret: exit.value.clientSecret,
      });
      setName('');
      setHomepage('');
      setUris('');
      setError(undefined);
    } else {
      setError(reason(exit) ?? 'That didn’t work. Try again.');
    }
  };

  return (
    <Stack asChild gap={3} align="stretch">
      <form onSubmit={submit}>
        {error ? <Callout tone="danger">{error}</Callout> : null}
        <Field label="App name" hint="Shown to people when they connect it.">
          <Input
            value={name}
            required
            maxLength={80}
            placeholder="Acme ATS"
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Homepage (optional)">
          <Input
            type="url"
            value={homepage}
            placeholder="https://acme.example"
            onChange={(e) => setHomepage(e.target.value)}
          />
        </Field>
        <Field
          label="Redirect URIs"
          hint="One per line: https, http://localhost for development, or your app’s own scheme."
        >
          <Textarea
            value={uris}
            required
            rows={3}
            placeholder="https://acme.example/auth/jsonresume/callback"
            onChange={(e) => setUris(e.target.value)}
          />
        </Field>
        <div>
          <Button type="submit" variant="primary">
            Register app
          </Button>
        </div>
      </form>
    </Stack>
  );
}
