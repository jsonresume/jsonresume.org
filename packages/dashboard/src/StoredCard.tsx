import { useAtomSet } from '@effect/atom-react';
import {
  Badge,
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FileDropzone,
  Stack,
} from '@jsonresume/ui';
import type { Account } from '@repo/api';
import { errorTag, keys, saveResumeAtom } from '@repo/api-client';
import { account as copy } from '@repo/content/pages';
import { useState } from 'react';

const InUse = ({ when }: { when: boolean }) =>
  when ? <Badge tone="success">In use</Badge> : null;

/** The copy saved on jsonresume.org: upload one, or switch the page to it. */
export function StoredCard({
  account,
  use,
}: {
  account: Account;
  use: () => void;
}) {
  const save = useAtomSet(saveResumeAtom, { mode: 'promiseExit' });
  const [message, setMessage] = useState<{
    tone: 'success' | 'danger';
    text: string;
  }>();

  const upload = async ([file]: File[]) => {
    if (!file) return;
    let resume: unknown;
    try {
      resume = JSON.parse(await file.text());
    } catch {
      return setMessage({
        tone: 'danger',
        text: `${file.name} isn’t valid JSON.`,
      });
    }
    const tag = errorTag(
      await save({ payload: { resume }, reactivityKeys: keys.account })
    );
    setMessage(
      tag === undefined
        ? {
            tone: 'success',
            text: `Saved ${file.name}. Your page now shows it.`,
          }
        : {
            tone: 'danger',
            text: copy.errors[tag] ?? copy.errors['default'] ?? '',
          }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>
          Saved here{' '}
          <InUse
            when={account.source === 'stored' && account.hasStoredResume}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="stretch">
          {message ? (
            <Callout tone={message.tone}>{message.text}</Callout>
          ) : null}
          <FileDropzone
            accept=".json,application/json"
            onFiles={(files) => void upload(files)}
            title="Upload resume.json"
            hint="Your page shows it straight away. Upload again to update."
          />
          {account.hasStoredResume && account.source !== 'stored' ? (
            <Button variant="secondary" onClick={use}>
              Use the saved copy
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
