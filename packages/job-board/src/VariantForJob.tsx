import { RegistryProvider, useAtomSet } from '@effect/atom-react';
import { Button, Callout } from '@jsonresume/ui';
import type { Job } from '@repo/api';
import {
  createVariantAtom,
  errorTag,
  keys,
  useSignedInHint,
} from '@repo/api-client';
import { Exit } from 'effect';
import { useState } from 'react';
import { companyText } from './format';

type Made = { path: string; slug: string } | { error: string };

function Make({ job, ask }: Props) {
  const create = useAtomSet(createVariantAtom, { mode: 'promiseExit' });
  const [busy, setBusy] = useState(false);
  const [made, setMade] = useState<Made>();
  const make = async () => {
    setBusy(true);
    const exit = await create({
      payload: {
        name: `${companyText(job.company)} ${job.title}`,
        jobId: job.id,
      },
      reactivityKeys: keys.account,
    });
    setBusy(false);
    setMade(
      Exit.isSuccess(exit)
        ? { path: exit.value.path, slug: exit.value.slug }
        : {
            error:
              errorTag(exit) === 'NoResume'
                ? 'Save your resume first: a version starts as a copy of it.'
                : 'That didn’t work. Try again in a minute.',
          }
    );
  };
  if (made && 'path' in made)
    return (
      <Callout tone="success" title="Your version for this job">
        It starts as a copy of your resume, at its own link.{' '}
        <a href={made.path}>Open it</a>
        {ask ? (
          <>
            {' '}
            or{' '}
            <a
              href={ask(
                `Tailor my resume variant "${made.slug}" for job ${job.id}: reorder and reword my highlights and skills to fit it, keeping everything true.`
              )}
            >
              tailor it with Pathways
            </a>
          </>
        ) : null}
        .
      </Callout>
    );
  return (
    <>
      <Button variant="secondary" loading={busy} onClick={() => void make()}>
        Make a version for this job
      </Button>
      {made && 'error' in made ? (
        <Callout tone="danger">{made.error}</Callout>
      ) : null}
    </>
  );
}

interface Props {
  job: Job;
  ask?: ((question: string) => string) | undefined;
}

/** Signed in: a copy of your resume for this job, to tailor (a variant). */
export function VariantForJob(props: Props) {
  if (!useSignedInHint()) return null;
  return (
    <RegistryProvider>
      <Make {...props} />
    </RegistryProvider>
  );
}
