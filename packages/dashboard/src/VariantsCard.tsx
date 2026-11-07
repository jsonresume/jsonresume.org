import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Stack,
  Text,
} from '@jsonresume/ui';
import {
  createVariantAtom,
  deleteVariantAtom,
  errorTag,
  keys,
  variantsAtom,
} from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { useState } from 'react';
import { date } from './format';

/**
 * Versions of the resume for a job or an audience, each at its own link.
 * Made here or from a job; tailored by an assistant (MCP save_variant).
 */
export function VariantsCard() {
  const result = useAtomValue(variantsAtom);
  const create = useAtomSet(createVariantAtom, { mode: 'promiseExit' });
  const remove = useAtomSet(deleteVariantAtom, { mode: 'promiseExit' });
  const [name, setName] = useState('');
  const [error, setError] = useState<string>();
  const list = AsyncResult.isSuccess(result) ? result.value : [];
  const make = async () => {
    setError(undefined);
    const exit = await create({
      payload: { name },
      reactivityKeys: keys.account,
    });
    if (errorTag(exit) === 'NoResume')
      return setError('Save your resume first: a version starts as a copy.');
    if (errorTag(exit)) return setError('That didn’t work. Try another name.');
    setName('');
  };
  return (
    <Card id="variants">
      <CardHeader>
        <CardTitle level={2}>Versions for jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="stretch">
          <Text size="sm" tone="muted">
            Copies of your resume tailored to one job or audience, each at its
            own link with its own theme. Your main resume never changes. Make
            one from any job, or ask your assistant to tailor one.
          </Text>
          {list.length > 0 ? (
            <ul aria-label="Your versions">
              {list.map((v) => (
                <li key={v.slug}>
                  <Stack direction="row" gap={3} align="center" wrap>
                    <a href={v.path}>{v.name}</a>
                    <Text as="span" size="sm" tone="muted">
                      {v.path} · {date(v.updatedAt)}
                      {v.jobId ? (
                        <>
                          {' · '}
                          <a href={`/jobs/${v.jobId}`}>the job</a>
                        </>
                      ) : null}
                    </Text>
                    <Button asChild size="sm" variant="ghost">
                      <a href={`${v.path}.pdf`}>PDF</a>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Delete ${v.name}`}
                      onClick={() =>
                        window.confirm(`Delete “${v.name}” and its page?`) &&
                        void remove({
                          params: { slug: v.slug },
                          reactivityKeys: keys.account,
                        })
                      }
                    >
                      Delete
                    </Button>
                  </Stack>
                </li>
              ))}
            </ul>
          ) : null}
          <Stack direction="row" gap={2} align="end" wrap>
            <Field label="New version" {...(error ? { error } : {})}>
              <Input
                value={name}
                placeholder="e.g. Acme, Platform Engineer"
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Button
              variant="secondary"
              disabled={!name.trim()}
              onClick={() => void make()}
            >
              Make it
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
