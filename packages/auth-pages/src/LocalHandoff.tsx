import { AuthCard, Button, CodeBlock, Text } from '@jsonresume/ui';
import { useState } from 'react';

const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]']);

/** Whether an app waits on the user's own computer (a CLI or desktop agent). */
export const isLoopback = (uri: string) => {
  try {
    const url = new URL(uri);
    return url.protocol === 'http:' && LOOPBACK.has(url.hostname);
  } catch {
    return false;
  }
};

/**
 * Where to go after the user answers. An approved app on localhost gets a
 * handoff page first; everything else goes straight back.
 */
export function useHandoff() {
  const [handoff, setHandoff] = useState<string>();
  const go = (redirect: string, approved: boolean) =>
    approved && isLoopback(redirect)
      ? setHandoff(redirect)
      : window.location.assign(redirect);
  return [handoff, go] as const;
}

/**
 * After Allow, for an app waiting on localhost. When it runs on another
 * computer (over SSH, in a container), this browser can't reach it, so the
 * same link is offered to open there.
 */
export function LocalHandoff({
  name,
  redirect,
}: {
  name: string;
  redirect: string;
}) {
  return (
    <AuthCard
      title={`Finish in ${name}`}
      description={`You allowed ${name}. It’s waiting for this last step.`}
    >
      <Button asChild variant="primary" fullWidth>
        <a href={redirect}>Continue</a>
      </Button>
      <Text size="sm" tone="muted">
        If the next page says the site can’t be reached, {name} is running on
        another computer, for example over SSH. Run this on that computer within
        10 minutes instead:
      </Text>
      <CodeBlock
        label="On the computer running the app"
        code={`curl '${redirect}'`}
      />
    </AuthCard>
  );
}
