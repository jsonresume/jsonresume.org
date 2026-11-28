import { useAtomSet } from '@effect/atom-react';
import { startEvent } from './events';
import {
  Button,
  Callout,
  FileDropzone,
  Heading,
  Text,
  Textarea,
} from '@jsonresume/ui';
import { IMPORT_MAX_BYTES } from '@repo/api';
import { errorTag, importResumeAtom, useSignedInHint } from '@repo/api-client';
import { Exit } from 'effect';
import { useEffect, useRef, useState } from 'react';
import * as s from './start.css';
import { extensionOf, fitImage } from './fitImage';
import { readResumeJson } from './jsonFile';
import { startImportAtom, startResumeAtom, startStepAtom } from './state';

const failed = (tag: string | undefined) =>
  tag === 'UnsupportedImport'
    ? 'That isn’t a file we can read. Try a PDF, a Word .docx, a LinkedIn export .zip, a resume.json, or paste the text.'
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
  // Uncontrolled, so text pasted before the page hydrates survives it.
  const pasted = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const early = pasted.current?.value;
    if (early) setText(early);
  }, []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const signedIn = useSignedInHint();

  const read = async (
    kind: 'file' | 'text',
    send: () => ReturnType<typeof run>,
    shrunk = false
  ) => {
    setBusy(true);
    setError(undefined);
    const exit = await send();
    setBusy(false);
    startEvent('start_import_result', {
      kind,
      ok: Exit.isSuccess(exit),
      reason: Exit.isFailure(exit) ? errorTag(exit) ?? 'unknown' : null,
      shrunk,
    });
    if (Exit.isFailure(exit)) return setError(failed(errorTag(exit)));
    setResult(exit.value);
    setResume(exit.value.resume);
    setStep('review');
  };
  const refused = (reason: 'type' | 'size', file: File) =>
    startEvent('start_file_refused', { reason, ext: extensionOf(file) });
  const upload = async (files: File[]) => {
    const [chosen] = files;
    if (!chosen) return;
    // A resume.json is already a resume: straight to checking it.
    const own = await readResumeJson(chosen);
    if (own) {
      startEvent('start_import_result', {
        kind: 'json',
        ok: true,
        reason: null,
        shrunk: false,
      });
      setResult(null);
      setResume(own);
      return setStep('review');
    }
    const file = await fitImage(chosen, IMPORT_MAX_BYTES);
    if (file.size > IMPORT_MAX_BYTES) {
      refused('size', chosen);
      return setError(failed('ImportTooLarge'));
    }
    const form = new FormData();
    form.append('file', file);
    void read('file', () => run({ payload: form }), file !== chosen);
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
            onFiles={(files) => void upload(files)}
            onReject={refused}
            onCancel={() => startEvent('start_file_cancelled', {})}
            accept=".pdf,.docx,.zip,.txt,.json,.png,.jpg,.jpeg,.webp"
            title="Drop it here"
            hint="PDF (scans too), Word, a photo or screenshot, a LinkedIn data export (.zip) or a resume.json"
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
            ref={pasted}
            onChange={(e) => setText(e.target.value)}
            disabled={busy}
          />
          <Button
            variant="secondary"
            disabled={busy || text.trim().length < 40}
            onClick={() => void read('text', () => run({ payload: { text } }))}
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
        {signedIn
          ? 'Nothing is saved until you choose Save it. Your resume stays in this browser until then.'
          : 'Nothing is saved until you sign up. Your resume stays in this browser until then.'}
      </Text>
    </>
  );
}
