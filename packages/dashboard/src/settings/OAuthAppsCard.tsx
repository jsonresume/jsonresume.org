import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CodeBlock,
  Link,
  Stack,
  Text,
} from '@jsonresume/ui';
import {
  deleteOAuthAppAtom,
  keys,
  newOAuthSecretAtom,
  oauthAppsAtom,
} from '@repo/api-client';
import { Exit } from 'effect';
import { AsyncResult } from 'effect/reactivity';
import { useState } from 'react';
import { NewOAuthAppForm, type MadeApp } from './NewOAuthAppForm';
import * as s from './settings.css';

/**
 * Apps people register to offer "Sign in with JSON Resume" in their own
 * product: client id and secret (shown once), new secrets, deleting.
 */
export function OAuthAppsCard() {
  const result = useAtomValue(oauthAppsAtom);
  const newSecret = useAtomSet(newOAuthSecretAtom, { mode: 'promiseExit' });
  const remove = useAtomSet(deleteOAuthAppAtom, { mode: 'promiseExit' });
  const [made, setMade] = useState<MadeApp>();
  const list = AsyncResult.isSuccess(result) ? result.value : [];

  const rotate = async (app: { id: string; name: string }) => {
    const exit = await newSecret({ params: { id: app.id } });
    if (Exit.isSuccess(exit)) {
      setMade({
        name: app.name,
        clientId: app.id,
        clientSecret: exit.value.clientSecret,
      });
    }
  };

  return (
    <Card id="oauth-apps">
      <CardHeader>
        <CardTitle level={2}>Your OAuth apps</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="stretch">
          <Text size="sm" tone="muted">
            Building an HR tool, job board or ATS? Register it to add “Sign in
            with JSON Resume”: people approve what it may see, and it reads
            their resume with a token. See the{' '}
            <Link href="/developers">developer guide</Link>.
          </Text>
          {made ? (
            <Callout tone="success" title={`${made.name}’s credentials`}>
              <Stack gap={2} align="stretch">
                <Text size="sm">
                  Copy the secret now: it won’t be shown again. Keep it on your
                  server.
                </Text>
                <CodeBlock
                  label="Environment"
                  copyable
                  code={`JSONRESUME_CLIENT_ID=${made.clientId}\nJSONRESUME_CLIENT_SECRET=${made.clientSecret}`}
                />
              </Stack>
            </Callout>
          ) : null}
          {list.length > 0 ? (
            <Stack asChild gap={3} align="stretch">
              <ul aria-label="Your OAuth apps" className={s.appList}>
                {list.map((app) => (
                  <li key={app.id} className={s.app}>
                    <Stack gap={1} align="start">
                      <Text weight="semibold">{app.name}</Text>
                      <code className={s.clientId}>{app.id}</code>
                      <Text size="sm" tone="muted">
                        {app.users === 1
                          ? '1 person connected'
                          : `${app.users} people connected`}
                      </Text>
                    </Stack>
                    <Stack direction="row" gap={2} wrap>
                      <Button
                        size="sm"
                        variant="secondary"
                        aria-label={`New secret for ${app.name}`}
                        onClick={() => void rotate(app)}
                      >
                        New secret
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        aria-label={`Delete ${app.name}`}
                        onClick={() =>
                          window.confirm(
                            `Delete ${app.name}? Everyone who connected it is disconnected.`
                          ) &&
                          void remove({
                            params: { id: app.id },
                            reactivityKeys: keys.oauthApps,
                          })
                        }
                      >
                        Delete
                      </Button>
                    </Stack>
                  </li>
                ))}
              </ul>
            </Stack>
          ) : null}
          <NewOAuthAppForm onMade={setMade} />
        </Stack>
      </CardContent>
    </Card>
  );
}
