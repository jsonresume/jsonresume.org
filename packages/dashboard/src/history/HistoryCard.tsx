import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Stack,
  Text,
} from '@jsonresume/ui';
import {
  errorTag,
  keys,
  restoreVersionAtom,
  resumeVersionsAtom,
} from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { useState } from 'react';
import { VersionList } from './VersionList';

const restoreError = (tag: string) =>
  tag === 'GistPermissionNeeded'
    ? 'Your page reads your gist, and GitHub hasn’t let JSON Resume update it yet. Allow it above, then restore again.'
    : tag === 'GithubUnreachable'
    ? 'GitHub isn’t answering, so your gist wasn’t updated. Try again in a minute.'
    : tag === 'VersionNotFound'
    ? 'That version isn’t in your history any more. Reload the page.'
    : 'That didn’t restore. Check your connection and try again.';

interface PageProps {
  before: number;
  /** The newest version, once the first page has loaded. */
  current: number | null;
  busy: boolean;
  now: Date;
  onRestore: (version: number) => Promise<boolean>;
}

/** One page of versions; older ones load below on request. */
function HistoryPage({ before, current, ...rest }: PageProps) {
  const result = useAtomValue(resumeVersionsAtom(before));
  const [older, setOlder] = useState(false);
  if (!AsyncResult.isSuccess(result))
    return before === 0 ? <Skeleton height="6rem" /> : null;
  const { versions, next } = result.value;
  const newest = before === 0 ? versions[0]?.version ?? null : current;
  if (before === 0 && versions.length === 0)
    return (
      <Text size="sm" tone="muted">
        Nothing yet. Every save from now on is kept here, with who made it.
      </Text>
    );
  return (
    <>
      <VersionList versions={versions} current={newest} {...rest} />
      {next === null ? null : older ? (
        <HistoryPage before={next} current={newest} {...rest} />
      ) : (
        <Button size="sm" variant="ghost" onClick={() => setOlder(true)}>
          Show older versions
        </Button>
      )}
    </>
  );
}

/** Every save of the resume, with who made it, and Restore. */
export function HistoryCard({ gist }: { gist: boolean }) {
  const restore = useAtomSet(restoreVersionAtom, { mode: 'promiseExit' });
  const [busy, setBusy] = useState(false);
  const [now] = useState(() => new Date());
  const [message, setMessage] = useState<{
    tone: 'success' | 'danger';
    text: string;
  }>();

  const onRestore = async (version: number) => {
    setBusy(true);
    const tag = errorTag(
      await restore({
        params: { version },
        reactivityKeys: [...keys.account, ...keys.versions],
      })
    );
    setBusy(false);
    setMessage(
      tag === undefined
        ? {
            tone: 'success',
            text: `Version ${version} is back on your page, saved as the newest version.`,
          }
        : { tone: 'danger', text: restoreError(tag) }
    );
    return tag === undefined;
  };

  return (
    <Card id="history">
      <CardHeader>
        <CardTitle level={2}>History</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="stretch">
          {gist ? (
            <Text size="sm" tone="muted">
              Saves made here, by apps and by assistants. Edits made on GitHub
              itself aren’t listed.
            </Text>
          ) : null}
          {message ? (
            <Callout tone={message.tone}>{message.text}</Callout>
          ) : null}
          <HistoryPage
            before={0}
            current={null}
            busy={busy}
            now={now}
            onRestore={onRestore}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
