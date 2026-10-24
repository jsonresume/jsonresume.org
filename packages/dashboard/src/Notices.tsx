import { useAtomSet, useAtomValue } from '@effect/atom-react';
import { Button, Callout, Stack, Text } from '@jsonresume/ui';
import { accountAtom, resendVerificationAtom } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { useState } from 'react';
import { searchParam } from './session';

/** Links back from email and sign-up land with ?verified= or ?welcome=. */
function Flash() {
  const verified = searchParam('verified');
  if (verified === '1')
    return <Callout tone="success">Email confirmed. Thanks!</Callout>;
  if (verified === 'expired') {
    return (
      <Callout tone="warning">
        That confirmation link has expired or was used. Send a new one below.
      </Callout>
    );
  }
  if (searchParam('welcome') === '1') {
    return (
      <Callout tone="brand" title="Welcome to JSON Resume">
        Views of your page show up here as people read it.
      </Callout>
    );
  }
  return null;
}

function Resend() {
  const resend = useAtomSet(resendVerificationAtom, { mode: 'promiseExit' });
  const [sent, setSent] = useState(false);
  return sent ? (
    <Text as="span" size="sm" tone="muted">
      Sent. Check your inbox.
    </Text>
  ) : (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => void resend({}).then(() => setSent(true))}
    >
      Send the link again
    </Button>
  );
}

/** What stands between the account and a live page, with what to do. */
export function Notices() {
  const result = useAtomValue(accountAtom);
  if (!AsyncResult.isSuccess(result)) return <Flash />;
  const account = result.value;
  const unverified =
    account.email !== null && !account.emailVerified && account.github === null;
  return (
    <>
      <Flash />
      {unverified ? (
        <Callout tone="warning" title="Confirm your email to go live">
          <Stack direction="row" wrap align="center" gap={3}>
            <span>
              We sent a link to {account.email}. {account.path} stays private
              until you open it.
              {account.emailDelivery
                ? ''
                : ' (Email delivery isn’t set up on this server yet.)'}
            </span>
            <Resend />
          </Stack>
        </Callout>
      ) : null}
      {!unverified && !account.public ? (
        <Callout tone="info" title="Your page isn’t live yet">
          Add a resume on the <a href="/dashboard/resume">Resume</a> page: link
          GitHub to use your gist, or upload resume.json.
        </Callout>
      ) : null}
    </>
  );
}
