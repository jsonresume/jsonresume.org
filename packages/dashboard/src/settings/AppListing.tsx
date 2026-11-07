import { useAtomSet } from '@effect/atom-react';
import { Button, Field, Input, Stack, Switch, Text } from '@jsonresume/ui';
import type { OAuthApp } from '@repo/api';
import { errorTag, keys, setAppListingAtom } from '@repo/api-client';
import { useState } from 'react';

/** Whether one of your apps is in the directory (/apps), and its line there. */
export function AppListing({ app }: { app: OAuthApp }) {
  const set = useAtomSet(setAppListingAtom, { mode: 'promiseExit' });
  const [description, setDescription] = useState(app.description ?? '');
  const [error, setError] = useState<string>();
  const save = async (listed: boolean) => {
    setError(undefined);
    const exit = await set({
      params: { id: app.id },
      payload: { listed, description },
      reactivityKeys: keys.oauthApps,
    });
    if (errorTag(exit))
      setError(
        app.homepage
          ? 'Add a line saying what the app does.'
          : 'Give the app a homepage first (edit it below), then a line saying what it does.'
      );
  };
  return (
    <Stack gap={2} align="stretch">
      <Field
        label="In the apps directory"
        hint={
          <>
            Listed apps appear on <a href="/apps">jsonresume.org/apps</a> with
            your homepage and this line.
          </>
        }
        {...(error ? { error } : {})}
      >
        <Input
          value={description}
          maxLength={160}
          placeholder="What it does, in a line: e.g. Tailors your resume to each job"
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => app.listed && void save(true)}
        />
      </Field>
      <Stack direction="row" gap={3} align="center" wrap>
        <Switch
          label={`List ${app.name}`}
          checked={app.listed}
          onCheckedChange={(on) => void save(on)}
        />
        {app.listed ? (
          <Text size="sm" tone="muted">
            Listed.{' '}
            <Button asChild variant="link" size="sm">
              <a href="/apps">See it</a>
            </Button>
          </Text>
        ) : null}
      </Stack>
    </Stack>
  );
}
