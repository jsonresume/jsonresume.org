import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CodeBlock,
  Field,
  Input,
  Stack,
  Table,
  Td,
  Text,
  Th,
  visuallyHidden,
} from '@jsonresume/ui';
import {
  apiKeysAtom,
  createApiKeyAtom,
  errorTag,
  keys,
  revokeApiKeyAtom,
} from '@repo/api-client';
import { Exit } from 'effect';
import { AsyncResult } from 'effect/reactivity';
import { useState, type FormEvent } from 'react';
import { date } from '../format';

/** API keys for the jobs CLI and scripts: made here, shown once. */
export function ApiKeysCard() {
  const result = useAtomValue(apiKeysAtom);
  const create = useAtomSet(createApiKeyAtom, { mode: 'promiseExit' });
  const revoke = useAtomSet(revokeApiKeyAtom, { mode: 'promiseExit' });
  const [name, setName] = useState('');
  const [made, setMade] = useState<string>();
  const [error, setError] = useState<string>();
  const list = AsyncResult.isSuccess(result) ? result.value : [];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const exit = await create({
      payload: { name: name || 'API key' },
      reactivityKeys: keys.apiKeys,
    });
    if (Exit.isSuccess(exit)) {
      setMade(exit.value.key);
      setName('');
      setError(undefined);
    } else {
      setError(
        errorTag(exit) === 'TooManyKeys'
          ? 'You have as many keys as allowed. Revoke one first.'
          : 'That didn’t work. Try again.'
      );
    }
  };

  return (
    <Card id="api-keys">
      <CardHeader>
        <CardTitle level={2}>API keys</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="stretch">
          <Text size="sm" tone="muted">
            For the jobs CLI (<code>npx @jsonresume/jobs</code>) and your own
            scripts, which call <code>/api/v1</code> with a key as a Bearer
            token.
          </Text>
          {made ? (
            <Callout tone="success" title="Your new key">
              <Stack gap={2} align="start">
                <Text size="sm">Copy it now: it won’t be shown again.</Text>
                <CodeBlock
                  label="Shell"
                  copyable
                  code={`export JSONRESUME_API_KEY=${made}`}
                />
              </Stack>
            </Callout>
          ) : null}
          {error ? <Callout tone="danger">{error}</Callout> : null}
          {list.length > 0 ? (
            <Table aria-label="Your API keys">
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Key</Th>
                  <Th>Last used</Th>
                  <Th>
                    <span className={visuallyHidden}>Revoke</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {list.map((k) => (
                  <tr key={k.id}>
                    <Td>{k.name}</Td>
                    <Td>
                      <code>{k.prefix}…</code>
                    </Td>
                    <Td>{k.lastUsedAt ? date(k.lastUsedAt) : 'Never'}</Td>
                    <Td>
                      <Button
                        size="sm"
                        variant="secondary"
                        aria-label={`Revoke ${k.name}`}
                        onClick={() =>
                          void revoke({
                            params: { id: k.id },
                            reactivityKeys: keys.apiKeys,
                          })
                        }
                      >
                        Revoke
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : null}
          <Stack asChild direction="row" gap={2} align="end" wrap>
            <form onSubmit={submit}>
              <Field label="Name">
                <Input
                  value={name}
                  maxLength={60}
                  placeholder="My laptop"
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Button type="submit" variant="primary">
                Create API key
              </Button>
            </form>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
