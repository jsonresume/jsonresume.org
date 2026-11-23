import { RegistryProvider, useAtomSet } from '@effect/atom-react';
import {
  Button,
  Callout,
  Container,
  Heading,
  Section,
  Stack,
  Text,
} from '@jsonresume/ui';
import { stopJobDigestAtom } from '@repo/api-client';
import { Exit } from 'effect';
import { useState } from 'react';

type State = 'ready' | 'busy' | 'stopped' | 'failed';

function Stop({ user, token }: { user: string; token: string }) {
  const stop = useAtomSet(stopJobDigestAtom, { mode: 'promiseExit' });
  const [state, setState] = useState<State>('ready');
  const run = async () => {
    setState('busy');
    const exit = await stop({ query: { user, token } });
    setState(Exit.isSuccess(exit) && exit.value.stopped ? 'stopped' : 'failed');
  };
  if (state === 'stopped')
    return (
      <Callout tone="success" title="Done">
        You won’t get the weekly jobs email any more. Turn it back on in your
        job preferences whenever you like.
      </Callout>
    );
  return (
    <Stack gap={4}>
      {state === 'failed' && (
        <Callout tone="danger">
          That link didn’t work. Turn the email off in your job preferences
          instead.
        </Callout>
      )}
      <div>
        <Button
          variant="primary"
          loading={state === 'busy'}
          onClick={() => void run()}
        >
          Stop the weekly email
        </Button>
      </div>
    </Stack>
  );
}

/**
 * /jobs/email/stop: the weekly email's "stop" link. A button, not stopping
 * on load, so link scanners in mail systems can't turn it off.
 */
export function StopEmailPage({
  user,
  token,
  preferencesHref,
}: {
  user: string;
  token: string;
  preferencesHref: string;
}) {
  return (
    <Section spacing="lg">
      <Container>
        <Stack gap={4}>
          <Heading level={1} size="title">
            Stop the weekly jobs email
          </Heading>
          <Text tone="muted">
            One click and it stops. Your job preferences and marks stay as they
            are.
          </Text>
          <RegistryProvider>
            <Stop user={user} token={token} />
          </RegistryProvider>
          <Text size="sm" tone="muted">
            Or change it in <a href={preferencesHref}>your job preferences</a>.
          </Text>
        </Stack>
      </Container>
    </Section>
  );
}
