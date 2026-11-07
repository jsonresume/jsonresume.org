import { useAtomSet, useAtomValue } from '@effect/atom-react';
import { Button, CodeBlock, Field, Input, Stack } from '@jsonresume/ui';
import type { OAuthApp } from '@repo/api';
import {
  appWebhookAtom,
  errorTag,
  keys,
  setAppWebhookAtom,
} from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { useState } from 'react';

/** Where one of your apps is told its readers' resumes changed. */
export function AppWebhook({ app }: { app: OAuthApp }) {
  const result = useAtomValue(appWebhookAtom(app.id));
  const set = useAtomSet(setAppWebhookAtom, { mode: 'promiseExit' });
  const current = AsyncResult.isSuccess(result) ? result.value : null;
  const [url, setUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const shown = url ?? current?.url ?? '';
  const save = async (next: string | null) => {
    setError(undefined);
    const exit = await set({
      params: { id: app.id },
      payload: { url: next },
      reactivityKeys: keys.oauthApps,
    });
    if (errorTag(exit)) setError('Use an https URL.');
    else setUrl(undefined);
  };
  return (
    <Stack gap={2} align="stretch">
      <Field
        label="Webhook"
        hint="We POST resume.updated here when someone who connected the app changes their resume, signed with the secret below."
        {...(error ? { error } : {})}
      >
        <Input
          type="url"
          value={shown}
          placeholder="https://your-app.example/jsonresume/webhook"
          onChange={(e) => setUrl(e.target.value)}
        />
      </Field>
      <Stack direction="row" gap={2} wrap>
        <Button
          size="sm"
          variant="secondary"
          disabled={!shown.trim() || shown === current?.url}
          onClick={() => void save(shown.trim())}
        >
          Save webhook
        </Button>
        {current ? (
          <Button size="sm" variant="ghost" onClick={() => void save(null)}>
            Remove
          </Button>
        ) : null}
      </Stack>
      {current ? (
        <CodeBlock
          label="Signing secret (JSONResume-Signature)"
          code={current.secret}
          copyable
        />
      ) : null}
    </Stack>
  );
}
