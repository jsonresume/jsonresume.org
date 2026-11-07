import { useAtomSet } from '@effect/atom-react';
import {
  Button,
  Callout,
  FileDropzone,
  Heading,
  Text,
  Textarea,
} from '@jsonresume/ui';
import { IMPORT_MAX_BYTES } from '@repo/api';
import { errorTag, importResumeAtom } from '@repo/api-client';
import { Exit } from 'effect';
import { useState } from 'react';
import * as s from './start.css';
import { startImportAtom, startResumeAtom, startStepAtom } from './state';

const failed = (tag: string | undefined) =>
  tag === 'UnsupportedImport'
    ? 'That isn’t a file we can read. Try a PDF, a Word .docx, a LinkedIn export .zip, or paste the text.'
    : tag === 'ImportTooLarge'
    ? 'That file is over 5 MB. Try a smaller copy, or paste the text.'
    : tag === 'NothingToImport'
    ? 'We couldn’t find any text in it. A scanned PDF is a picture: paste the text instead.'
    : tag === 'TooManyAttempts'
    ? 'That’s a lot of imports in an hour. Wait a little, or start from scratch.'
    : 'Reading it didn’t work just now. Try again in a minute, or paste the text.';

/** Three ways in: a file, pasted text, or an empty form. */
export function Choose() {
  const run = useAtomSet(importResumeAtom, { mode: 'promiseExit' });
  const setResult = useAtomSet(startImportAtom);
  const setResume = useAtomSet(startResumeAtom);
  const setStep = useAtomSet(startStepAtom);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const read = async (send: () => ReturnType<typeof run>) => {
    setBusy(true);
    setError(undefined);
    const exit = await send();
    setBusy(false);
    if (Exit.isFailure(exit)) return setError(failed(errorTag(exit)));
    setResult(exit.value);
    setResume(exit.value.resume);
    setStep('review');
  };
  const upload = (files: File[]) => {
    const [file] = files;
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    void read(() => run({ payload: form }));
  };

  return (
    <>
      {error && <Callout tone="danger">{error}</Callout>}
      {busy && (
        <Callout tone="info" title="Reading your resume">
          This takes up to half a minute.
        </Callout>
      )}
      <div className={s.ways}>
        <section className={s.way} aria-labelledby="start-upload">
          <Heading level={2} size="group" id="start-upload">
            Upload your resume
          </Heading>
          <FileDropzone
            onFiles={upload}
            accept=".pdf,.docx,.zip,.txt"
            maxSize={IMPORT_MAX_BYTES}
            title="Drop it here"
            hint="PDF, Word, or a LinkedIn data export (.zip)"
            disabled={busy}
          />
        </section>
        <section className={s.way} aria-labelledby="start-paste">
          <Heading level={2} size="group" id="start-paste">
            Paste it
          </Heading>
          <Textarea
            className={s.paste}
            aria-labelledby="start-paste"
            placeholder="Paste your resume, or your LinkedIn profile’s text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={busy}
          />
          <Button
            variant="secondary"
            disabled={busy || text.trim().length < 40}
            onClick={() => void read(() => run({ payload: { text } }))}
          >
            Read it
          </Button>
        </section>
        <section className={s.way} aria-labelledby="start-scratch">
          <Heading level={2} size="group" id="start-scratch">
            Start from scratch
          </Heading>
          <Text size="sm" tone="muted">
            A few questions at a time: who you are, where you’ve worked, what
            you studied and what you’re good at.
          </Text>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => {
              setResult(null);
              setStep('guided');
            }}
          >
            Start writing
          </Button>
        </section>
      </div>
      <Text size="sm" tone="muted">
        Nothing is saved until you sign up. Your resume stays in this browser
        until then.
      </Text>
    </>
  );
}
