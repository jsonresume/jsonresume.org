import { useAtomSet, useAtomValue } from '@effect/atom-react';
import { AppPage, Badge, Button, Callout, FileDropzone } from '@jsonresume/ui';
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
import * as s from './dashboard.css';

const formats = [
  { label: 'JSON', ext: 'json' },
  { label: 'YAML', ext: 'yaml' },
  { label: 'Text', ext: 'txt' },
];

function Sources({ account }: { account: Account }) {
  const setSource = useAtomSet(setSourceAtom, { mode: 'promiseExit' });
  const save = useAtomSet(saveResumeAtom, { mode: 'promiseExit' });
  const [message, setMessage] = useState<{
    tone: 'success' | 'danger';
    text: string;
  }>();
  const use = (source: 'gist' | 'stored') =>
    void setSource({ payload: { source }, reactivityKeys: keys.account });

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
    const exit = await save({
      payload: { resume },
      reactivityKeys: keys.account,
    });
    const tag = errorTag(exit);
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
    <div className={s.breakdowns}>
      <section className={s.panel} aria-labelledby="gist-title">
        <h2 id="gist-title" className={s.panelTitle}>
          GitHub gist{' '}
          {account.source === 'gist' ? (
            <Badge tone="success">In use</Badge>
          ) : null}
        </h2>
        {account.github ? (
          <div className={s.stack}>
            <p className={s.muted}>
              Reads resume.json from{' '}
              <a href={`https://gist.github.com/${account.github.login}`}>
                @{account.github.login}’s gists
              </a>
              . Edits show within a minute.
            </p>
            {account.source !== 'gist' ? (
              <Button variant="secondary" onClick={() => use('gist')}>
                Use the gist
              </Button>
            ) : null}
          </div>
        ) : (
          <div className={s.stack}>
            <p className={s.muted}>
              Keep resume.json in a GitHub gist and your page follows it.
            </p>
            <Button asChild variant="secondary">
              <a href="/api/auth/github?intent=link&next=/dashboard/resume">
                Link GitHub
              </a>
            </Button>
          </div>
        )}
      </section>
      <section className={s.panel} aria-labelledby="stored-title">
        <h2 id="stored-title" className={s.panelTitle}>
          Saved here{' '}
          {account.source === 'stored' && account.hasStoredResume ? (
            <Badge tone="success">In use</Badge>
          ) : null}
        </h2>
        <div className={s.stack}>
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
            <Button variant="secondary" onClick={() => use('stored')}>
              Use the saved copy
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
}

/** Where /@username reads the resume, and whether it is live. */
export function ResumePage() {
  const result = useAtomValue(accountAtom);
  if (!AsyncResult.isSuccess(result))
    return <AppPage title="Resume">{null}</AppPage>;
  const account = result.value;
  return (
    <AppPage
      title="Resume"
      description={
        <span className={s.row}>
          <a href={account.path}>jsonresume.org{account.path}</a>
          {account.public ? (
            <Badge tone="success">Live</Badge>
          ) : (
            <Badge tone="warning">Not live yet</Badge>
          )}
        </span>
      }
      actions={
        <span className={s.row}>
          {formats.map((f) => (
            <Button key={f.ext} asChild size="sm" variant="ghost">
              <a href={`${account.path}.${f.ext}`}>{f.label}</a>
            </Button>
          ))}
        </span>
      }
    >
      <Sources account={account} />
    </AppPage>
  );
}
