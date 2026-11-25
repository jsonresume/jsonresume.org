import { RegistryProvider, useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Button,
  Callout,
  Container,
  Heading,
  Section,
  Stack,
  Text,
} from '@jsonresume/ui';
import type { EmailSettings, EmailSettingsChange } from '@repo/api';
import {
  linkEmailSettingsAtom,
  setLinkEmailSettingsAtom,
} from '@repo/api-client';
import { Exit } from 'effect';
import { AsyncResult } from 'effect/reactivity';
import { useState } from 'react';
import { EmailSwitches } from './EmailSwitches';

interface Link {
  user: string;
  token: string;
  settingsHref: string;
}

function Settings({ user, token, settingsHref }: Link) {
  const result = useAtomValue(linkEmailSettingsAtom(`${user}\n${token}`));
  const set = useAtomSet(setLinkEmailSettingsAtom, { mode: 'promiseExit' });
  const [saved, setSaved] = useState<EmailSettings>();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const current =
    saved ?? (AsyncResult.isSuccess(result) ? result.value : undefined);
  const change = async (payload: EmailSettingsChange) => {
    setBusy(true);
    const exit = await set({ query: { user, token }, payload });
    setBusy(false);
    if (Exit.isSuccess(exit)) setSaved(exit.value);
    else setFailed(true);
  };
  if (AsyncResult.isFailure(result) || failed)
    return (
      <Callout tone="danger" title="This link didn’t work">
        Sign in and change your emails in{' '}
        <a href={settingsHref}>your settings</a> instead.
      </Callout>
    );
  const allOff =
    current !== undefined &&
    !current.accountEmails &&
    !current.weeklyJobs &&
    !current.monthlyReport;
  return (
    <Stack gap={6}>
      <EmailSwitches
        settings={current}
        disabled={busy}
        onChange={(c) => void change(c)}
      />
      {allOff ? (
        <Callout tone="success" title="You’re unsubscribed">
          No more emails from us, except the password resets and sign-in links
          you ask for. Switch any back on here whenever you like.
        </Callout>
      ) : (
        <div>
          <Button
            variant="secondary"
            loading={busy}
            disabled={current === undefined}
            onClick={() =>
              void change({
                accountEmails: false,
                weeklyJobs: false,
                monthlyReport: false,
              })
            }
          >
            Unsubscribe from all
          </Button>
        </div>
      )}
    </Stack>
  );
}

/**
 * /emails: every email links here with its token, so stopping or changing
 * them takes a click or two, signed in or not. Nothing changes on load, so
 * mail scanners following the link can't unsubscribe anyone.
 */
export function EmailSettingsPage(link: Link) {
  return (
    <Section spacing="lg">
      <Container>
        <Stack gap={4}>
          <Heading level={1} size="title">
            Email settings
          </Heading>
          <Text tone="muted">
            Choose what JSON Resume emails you. Each switch saves as you click
            it.
          </Text>
          <RegistryProvider>
            <Settings {...link} />
          </RegistryProvider>
        </Stack>
      </Container>
    </Section>
  );
}
