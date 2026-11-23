import { useAtomSet } from '@effect/atom-react';
import { Button, Callout, Stack, Text } from '@jsonresume/ui';
import type { JobPreferences } from '@repo/api';
import { keys, saveJobPreferencesAtom } from '@repo/api-client';
import { Exit } from 'effect';
import { useState } from 'react';

const DISMISSED = 'jr:weekly-email-offer';

const dismissedHere = () => {
  try {
    return window.localStorage.getItem(DISMISSED) === '1';
  } catch {
    return false;
  }
};

/**
 * Offers the weekly jobs email (@repo/job-digest) to someone who has jobs
 * to apply for and hasn't turned it on: one click turns it on, "Not now"
 * hides the offer in this browser. The preferences sheet can change it
 * either way later.
 */
export function WeeklyEmailOffer({
  preferences,
  waiting,
}: {
  preferences: JobPreferences;
  /** Unmarked apply and stretch jobs: what an email would have carried. */
  waiting: number;
}) {
  const save = useAtomSet(saveJobPreferencesAtom, { mode: 'promiseExit' });
  const [state, setState] = useState<'offer' | 'busy' | 'on' | 'hidden'>(() =>
    dismissedHere() ? 'hidden' : 'offer'
  );
  if (preferences.weeklyEmail && state !== 'on') return null;
  if (state === 'hidden' || waiting === 0) return null;
  if (state === 'on')
    return (
      <Callout tone="success">
        On. New jobs to apply for will come on Mondays; every email can turn it
        off.
      </Callout>
    );
  const turnOn = async () => {
    setState('busy');
    const exit = await save({
      payload: { ...preferences, weeklyEmail: true },
      query: { source: 'you' },
      reactivityKeys: keys.jobs,
    });
    setState(Exit.isSuccess(exit) ? 'on' : 'offer');
  };
  const notNow = () => {
    try {
      window.localStorage.setItem(DISMISSED, '1');
    } catch {
      // Private mode: it just shows again next time.
    }
    setState('hidden');
  };
  return (
    <Callout tone="brand" title="New jobs, by email">
      <Stack gap={3}>
        <Text as="span">
          On Mondays, up to five new jobs to apply for, decided like these. No
          new ones that week, no email.
        </Text>
        <Stack direction="row" wrap gap={2}>
          <Button
            size="sm"
            variant="primary"
            loading={state === 'busy'}
            onClick={() => void turnOn()}
          >
            Email me on Mondays
          </Button>
          <Button size="sm" variant="ghost" onClick={notNow}>
            Not now
          </Button>
        </Stack>
      </Stack>
    </Callout>
  );
}
