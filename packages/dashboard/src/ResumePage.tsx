import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  AppPage,
  Badge,
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FileDropzone,
  Grid,
  Link,
  Stack,
  Text,
} from '@jsonresume/ui';
import type { Account } from '@repo/api';
import {
  accountAtom,
  errorTag,
  keys,
  saveResumeAtom,
  setSourceAtom,
} from '@repo/api-client';
import { account as copy } from '@repo/content/pages';
import { AsyncResult } from 'effect/reactivity';
import { useState } from 'react';

const formats = [
  { label: 'JSON', ext: 'json' },
  { label: 'YAML', ext: 'yaml' },
  { label: 'Text', ext: 'txt' },
];

const InUse = ({ when }: { when: boolean }) =>
  when ? <Badge tone="success">In use</Badge> : null;

function GistCard({ account, use }: { account: Account; use: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>
          GitHub gist <InUse when={account.source === 'gist'} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="start">
          {account.github ? (
            <>
              <Text size="sm" tone="muted">
                Reads resume.json from{' '}
                <Link href={`https://gist.github.com/${account.github.login}`}>
                  @{account.github.login}’s gists
                </Link>
                . Edits there show within a minute, and saving in the editor
                writes to it.
              </Text>
              {account.gistWrite ? null : (
                <Button asChild variant="secondary">
                  <a href="/api/auth/github?intent=link&next=/dashboard/resume">
                    Allow saving to your gist
                  </a>
                </Button>
              )}
              {account.source !== 'gist' ? (
                <Button variant="secondary" onClick={use}>
                  Use the gist
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <Text size="sm" tone="muted">
                Keep resume.json in a GitHub gist and your page follows it.
              </Text>
              <Button asChild variant="secondary">
                <a href="/api/auth/github?intent=link&next=/dashboard/resume">
                  Link GitHub
                </a>
              </Button>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function StoredCard({ account, use }: { account: Account; use: () => void }) {
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

/** Where /@username reads the resume, and whether it is live. */
export function ResumePage() {
  const result = useAtomValue(accountAtom);
  const setSource = useAtomSet(setSourceAtom, { mode: 'promiseExit' });
  if (!AsyncResult.isSuccess(result))
    return <AppPage title="Resume">{null}</AppPage>;
  const account = result.value;
  const use = (source: 'gist' | 'stored') => () =>
    void setSource({ payload: { source }, reactivityKeys: keys.account });
  return (
    <AppPage
      title="Resume"
      description={
        <Stack asChild direction="row" wrap align="center" gap={3}>
          <span>
            <Link href={account.path}>jsonresume.org{account.path}</Link>
            {account.public ? (
              <Badge tone="success">Live</Badge>
            ) : (
              <Badge tone="warning">Not live yet</Badge>
            )}
          </span>
        </Stack>
      }
      actions={
        <>
          {formats.map((f) => (
            <Button key={f.ext} asChild size="sm" variant="ghost">
              <a href={`${account.path}.${f.ext}`}>{f.label}</a>
            </Button>
          ))}
          <Button asChild size="sm" variant="primary">
            <a href="/dashboard/editor">Open the editor</a>
          </Button>
        </>
      }
    >
      <Grid gap={6} minColumnWidth="18rem" stretch>
        <GistCard account={account} use={use('gist')} />
        <StoredCard account={account} use={use('stored')} />
      </Grid>
    </AppPage>
  );
}
