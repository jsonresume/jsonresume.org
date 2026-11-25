import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Stack,
  Text,
} from '@jsonresume/ui';
import type { EmailSettingsChange } from '@repo/api';
import {
  emailSettingsAtom,
  keys,
  setEmailSettingsAtom,
} from '@repo/api-client';
import { EmailSwitches } from '@repo/auth-pages/emails';
import { AsyncResult } from 'effect/reactivity';

/** Which emails the account gets; every email links to the same switches. */
export function EmailsCard() {
  const result = useAtomValue(emailSettingsAtom);
  const set = useAtomSet(setEmailSettingsAtom, { mode: 'promiseExit' });
  const change = (payload: EmailSettingsChange) =>
    void set({ payload, reactivityKeys: keys.emails });
  return (
    <Card id="emails">
      <CardHeader>
        <CardTitle level={2}>Emails</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4}>
          <Text size="sm" tone="muted">
            Password resets and sign-in links you ask for always come. The rest
            is up to you, and every email has a link back to these switches.
          </Text>
          <EmailSwitches
            settings={AsyncResult.isSuccess(result) ? result.value : undefined}
            onChange={change}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
